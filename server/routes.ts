import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertProductSchema, insertGalleryImageSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Please set it in environment variables.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured } = req.query;
      let products;
      
      if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(parseInt(req.params.id), validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating product: " + error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting product: " + error.message });
    }
  });

  // Gallery API
  app.get("/api/gallery", async (req, res) => {
    try {
      const { category } = req.query;
      let images;
      
      if (category) {
        images = await storage.getGalleryImagesByCategory(category as string);
      } else {
        images = await storage.getGalleryImages();
      }
      
      res.json(images);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching gallery images: " + error.message });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating gallery image: " + error.message });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const success = await storage.deleteGalleryImage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting gallery image: " + error.message });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // Stripe payment integration
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable." });
    }

    try {
      const { items, customerInfo } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description || "",
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
        customer_email: customerInfo?.email,
        metadata: {
          customerInfo: JSON.stringify(customerInfo),
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Webhook for Stripe events
  app.post("/api/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const event = req.body;

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Create order record
        const customerInfo = session.metadata?.customerInfo ? JSON.parse(session.metadata.customerInfo) : {};
        
        const orderData = {
          customerName: customerInfo.name || "Unknown",
          customerEmail: session.customer_email || customerInfo.email || "",
          customerPhone: customerInfo.phone || "",
          customerAddress: customerInfo.address || "",
          customerCity: customerInfo.city || "",
          customerPostalCode: customerInfo.postalCode || "",
          customerCountry: customerInfo.country || "",
          items: JSON.stringify(customerInfo.items || []),
          totalAmount: (session.amount_total / 100).toString(),
          shippingCost: "0",
          status: "paid",
          stripeSessionId: session.id,
        };

        await storage.createOrder(orderData);
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // Shipping calculation (DPD placeholder)
  app.post("/api/calculate-shipping", async (req, res) => {
    try {
      const { postalCode, country, items } = req.body;
      
      // Placeholder shipping calculation
      // In a real implementation, this would call DPD API
      let shippingCost = 0;
      
      if (country === "FR") {
        shippingCost = 12.90;
      } else if (["BE", "NL", "DE", "ES"].includes(country)) {
        shippingCost = 19.90;
      } else {
        shippingCost = 29.90;
      }

      // Free shipping over 100€
      const totalAmount = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price) * item.quantity), 0);
      
      if (totalAmount >= 100) {
        shippingCost = 0;
      }

      res.json({ 
        shippingCost: shippingCost.toFixed(2),
        estimatedDelivery: "2-3 jours ouvrés",
        carrier: "DPD"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error calculating shipping: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
