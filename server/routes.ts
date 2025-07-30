import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerUploadRoutes } from "./routes/upload";
import { setupChatWebSocket } from "./routes/chat";
import { insertProductSchema, insertGalleryImageSchema, insertProductImageSchema, insertOrderSchema } from "@shared/schema";
import { dpdService, type ShippingCalculationRequest } from "./dpd-service";
import { sendChatNotificationToAdmin } from "./services/brevo";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Please set it in environment variables.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Register upload routes
  registerUploadRoutes(app);
  
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

  // Product Images API
  app.get("/api/products/:id/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const images = await storage.getProductImages(productId);
      res.json(images);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product images: " + error.message });
    }
  });

  app.post("/api/products/:id/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const validatedData = insertProductImageSchema.parse({
        ...req.body,
        productId
      });
      const image = await storage.createProductImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product image: " + error.message });
    }
  });

  app.delete("/api/products/:productId/images/:imageId", async (req, res) => {
    try {
      const success = await storage.deleteProductImage(parseInt(req.params.imageId));
      if (!success) {
        return res.status(404).json({ message: "Product image not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting product image: " + error.message });
    }
  });

  app.put("/api/products/:productId/images/:imageId/main", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const imageId = parseInt(req.params.imageId);
      const success = await storage.setMainProductImage(productId, imageId);
      if (!success) {
        return res.status(404).json({ message: "Product image not found" });
      }
      res.json({ message: "Main image updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating main image: " + error.message });
    }
  });

  // Image Download API
  app.get("/api/images/download/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const path = require('path');
      const fs = require('fs');
      const imagePath = path.join(__dirname, '..', 'public', 'images', filename);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Set headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Send file
      res.sendFile(imagePath);
    } catch (error: any) {
      res.status(500).json({ message: "Error downloading image: " + error.message });
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
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      console.error("[StripeFix] Stripe not configured - missing STRIPE_SECRET_KEY");
      return res.status(500).json({ message: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable." });
    }

    try {
      const { amount, currency = "eur" } = req.body;
      
      // FIX: Stripe 402 - Enhanced validation
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        console.warn("[StripeFix] Invalid amount received:", amount);
        return res.status(400).json({ message: "Valid amount is required" });
      }

      if (amount > 999999) { // Prevent extremely large amounts
        console.warn("[StripeFix] Amount too large:", amount);
        return res.status(400).json({ message: "Amount too large" });
      }

      console.warn("[StripeFix] Creating payment intent for amount:", amount, "currency:", currency);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        // FIX: Stripe 402 - Add metadata for tracking
        metadata: {
          created_at: new Date().toISOString(),
          source: 'equi_saddles_checkout'
        }
      });

      // FIX: Stripe 402 - Validate client_secret before sending
      if (!paymentIntent.client_secret) {
        console.error("[StripeFix] No client_secret in payment intent:", paymentIntent.id);
        return res.status(500).json({ message: "Failed to create payment intent" });
      }

      console.warn("[StripeFix] Payment intent created successfully:", paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      // FIX: Stripe 429 - Enhanced error handling with specific status codes
      console.error("[StripeFix] Error creating payment intent:", error.type, error.code, error.message);
      
      let statusCode = 500;
      let message = "Error creating payment intent";

      if (error.type === 'StripeCardError') {
        statusCode = 402;
        message = "Card error: " + error.message;
      } else if (error.type === 'StripeRateLimitError') {
        statusCode = 429;
        message = "Too many requests. Please try again later.";
      } else if (error.type === 'StripeInvalidRequestError') {
        statusCode = 400;
        message = "Invalid request: " + error.message;
      } else if (error.type === 'StripeAPIError') {
        statusCode = 502;
        message = "Stripe API error. Please try again.";
      }

      res.status(statusCode).json({ 
        message: message,
        type: error.type,
        code: error.code 
      });
    }
  });

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

  // DPD Shipping API - Real-time shipping calculation with API key authentication
  app.post("/api/shipping/calculate", async (req, res) => {
    try {
      // DPD: Validate request parameters
      const { weight, country, postalCode, city, value } = req.body;
      
      if (!weight || !country || !postalCode || value === undefined) {
        return res.status(400).json({ 
          message: "Missing required parameters: weight, country, postalCode, value" 
        });
      }

      console.log(`[DPD API] Shipping calculation request: ${country} ${postalCode}, ${weight}kg, ${value}€`);

      const shippingRequest: ShippingCalculationRequest = {
        weight: parseFloat(weight),
        country: country.toString().toUpperCase(),
        postalCode: postalCode.toString(),
        city: city?.toString() || "",
        value: parseFloat(value)
      };

      // DPD: Call service with real API integration
      const options = await dpdService.calculateShipping(shippingRequest);
      
      console.log(`[DPD API] Returning ${options.length} shipping options`);
      res.json(options);
    } catch (error: any) {
      console.error(`[DPD API] Error calculating shipping:`, error.message);
      res.status(500).json({ 
        message: "Error calculating shipping rates", 
        error: error.message 
      });
    }
  });

  // Route de test temporaire pour vérifier l'envoi d'emails Brevo
  app.post("/api/test-email", async (req, res) => {
    try {
      const { customerName, customerEmail, message, sessionId } = req.body;
      
      const result = await sendChatNotificationToAdmin(
        customerName || "Test Client",
        customerEmail || "test@example.com", 
        message || "Message de test pour vérifier les notifications email",
        sessionId || "test-session-123"
      );
      
      res.json({ 
        success: result,
        message: result ? "Email envoyé avec succès" : "Échec de l'envoi d'email"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors du test d'email: " + error.message });
    }
  });

  app.get("/api/shipping/rates", async (req, res) => {
    try {
      const { zone } = req.query;
      let rates;
      
      if (zone) {
        rates = await storage.getShippingRatesByZone(zone as string);
      } else {
        rates = await storage.getShippingRates();
      }
      
      res.json(rates);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching shipping rates: " + error.message });
    }
  });

  // DPD Label Generation API - Real API integration for admin use
  app.post("/api/shipping/generate-label", async (req, res) => {
    try {
      const { orderId, shippingData } = req.body;
      
      // DPD: Validate required parameters for label generation
      if (!orderId || !shippingData) {
        return res.status(400).json({ 
          message: "Missing required parameters: orderId, shippingData" 
        });
      }

      console.log(`[DPD API] Generating label for order ${orderId}`);
      
      // DPD: Call service with real DPD API integration
      const label = await dpdService.generateShippingLabel(orderId, shippingData);
      
      console.log(`[DPD API] Label generated: ${label.trackingNumber}`);
      res.json(label);
    } catch (error: any) {
      console.error(`[DPD API] Error generating label:`, error.message);
      res.status(500).json({ 
        message: "Error generating shipping label", 
        error: error.message 
      });
    }
  });

  // DPD Package Tracking API - Real-time tracking integration
  app.get("/api/shipping/track/:trackingNumber", async (req, res) => {
    try {
      const trackingNumber = req.params.trackingNumber;
      
      if (!trackingNumber || !trackingNumber.startsWith('DPD')) {
        return res.status(400).json({ 
          message: "Invalid DPD tracking number format" 
        });
      }

      console.log(`[DPD API] Tracking package: ${trackingNumber}`);
      
      // DPD: Call service with real tracking API integration
      const tracking = await dpdService.trackPackage(trackingNumber);
      
      console.log(`[DPD API] Tracking status: ${tracking.status}`);
      res.json(tracking);
    } catch (error: any) {
      console.error(`[DPD API] Error tracking package:`, error.message);
      res.status(500).json({ 
        message: "Error tracking package", 
        error: error.message 
      });
    }
  });

  // Legacy endpoint for backward compatibility
  app.post("/api/calculate-shipping", async (req, res) => {
    try {
      const { postalCode, country, items } = req.body;
      
      // Calculate weight based on items
      const totalWeight = items.reduce((weight: number, item: any) => {
        const itemWeight = 4.0; // Default weight per saddle
        return weight + (itemWeight * item.quantity);
      }, 0);

      // Calculate total value
      const totalValue = items.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price) * item.quantity), 0);

      const shippingRequest: ShippingCalculationRequest = {
        weight: totalWeight,
        country: country,
        postalCode: postalCode,
        city: "",
        value: totalValue
      };

      const options = await dpdService.calculateShipping(shippingRequest);
      const cheapestOption = options.length > 0 ? options[0] : null;

      if (cheapestOption) {
        res.json({ 
          shippingCost: cheapestOption.price.toFixed(2),
          estimatedDelivery: cheapestOption.deliveryTime,
          carrier: "DPD",
          service: cheapestOption.serviceName
        });
      } else {
        res.status(400).json({ message: "No shipping options available" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error calculating shipping: " + error.message });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket for chat
  setupChatWebSocket(httpServer, app);

  return httpServer;
}
