import { eq } from 'drizzle-orm';
// @ts-ignore
import { products, galleryImages, productImages, orders, shippingRates, type Product, type InsertProduct, type ProductImage, type InsertProductImage, type GalleryImage, type InsertGalleryImage, type Order, type InsertOrder, type ShippingRate, type InsertShippingRate } from "../../shared/schema.js";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Product Images
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  deleteProductImage(id: number): Promise<boolean>;
  setMainProductImage(productId: number, imageId: number): Promise<boolean>;

  // Gallery
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;

  // Shipping rates
  getShippingRates(): Promise<ShippingRate[]>;
  getShippingRatesByZone(zone: string): Promise<ShippingRate[]>;
  createShippingRate(rate: InsertShippingRate): Promise<ShippingRate>;
  updateShippingRate(id: number, rate: Partial<InsertShippingRate>): Promise<ShippingRate | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private galleryImages: Map<number, GalleryImage>;
  private orders: Map<number, Order>;
  private shippingRates: Map<number, ShippingRate>;
  private currentProductId: number;
  private currentProductImageId: number;
  private currentGalleryId: number;
  private currentOrderId: number;
  private currentShippingRateId: number;

  constructor() {
    this.products = new Map();
    this.productImages = new Map();
    this.galleryImages = new Map();
    this.orders = new Map();
    this.shippingRates = new Map();
    this.currentProductId = 1;
    this.currentProductImageId = 1;
    this.currentGalleryId = 1;
    this.currentOrderId = 1;
    this.currentShippingRateId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Selle Dressage Pro",
        category: "Dressage",
        size: "17.5",
        price: "1290.00",
        originalPrice: null,
        description: "Selle de dressage haute qualité en cuir italien, siège profond pour un contact optimal.",
        image: "/images/selle1.jpg",
        images: [
          "/images/selle1.jpg",
          "/images/selle2.jpg"
        ],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Selle Obstacle X-Jump",
        category: "Obstacle",
        size: "17",
        price: "1251.00",
        originalPrice: "1390.00",
        description: "Selle d'obstacle moderne avec quartiers avancés pour une position parfaite à l'abord.",
        image: "/images/selle2.jpg",
        images: [
          "/images/selle2.jpg",
          "/images/selle1.jpg"
        ],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Selle Mixte Confort",
        category: "Mixte",
        size: "16.5",
        price: "890.00",
        originalPrice: null,
        description: "Selle polyvalente idéale pour la randonnée et l'équitation de loisir, très confortable.",
        image: "/images/selle1.jpg",
        images: [
          "/images/selle1.jpg",
          "/images/selle2.jpg"
        ],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Selle Cross Country",
        category: "Cross",
        size: "17",
        price: "1150.00",
        originalPrice: null,
        description: "Selle robuste spécialement conçue pour le cross-country et les longues randonnées.",
        image: "/images/selle2.jpg",
        images: [
          "/images/selle2.jpg",
          "/images/selle1.jpg"
        ],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Selle Poney Junior",
        category: "Poney",
        size: "16",
        price: "650.00",
        originalPrice: null,
        description: "Selle adaptée aux poneys et jeunes cavaliers, sécurisée et confortable.",
        image: "/images/selle1.jpg",
        images: [
          "/images/selle1.jpg",
          "/images/selle2.jpg"
        ],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
    this.currentProductId = sampleProducts.length + 1;

    // Initialize gallery images
    const sampleGalleryImages: GalleryImage[] = [
      {
        id: 1,
        url: "/images/selle1.jpg",
        alt: "Selle de dressage professionnelle Equi Saddles",
        category: "Dressage",
        createdAt: new Date(),
      },
      {
        id: 2,
        url: "/images/selle2.jpg",
        alt: "Selle d'obstacle en cuir Equi Saddles",
        category: "Obstacle",
        createdAt: new Date(),
      },
      {
        id: 3,
        url: "/images/selle1.jpg",
        alt: "Selle mixte confortable Equi Saddles",
        category: "Mixte",
        createdAt: new Date(),
      },
      {
        id: 4,
        url: "/images/selle2.jpg",
        alt: "Selle de cross-country Equi Saddles",
        category: "Cross",
        createdAt: new Date(),
      },
      {
        id: 5,
        url: "/images/selle1.jpg",
        alt: "Selle pour poney Equi Saddles",
        category: "Poney",
        createdAt: new Date(),
      },
      {
        id: 6,
        url: "/images/selle2.jpg",
        alt: "Collection de selles Equi Saddles",
        category: "Dressage",
        createdAt: new Date(),
      }
    ];

    sampleGalleryImages.forEach(image => {
      this.galleryImages.set(image.id, image);
    });
    this.currentGalleryId = sampleGalleryImages.length + 1;

    // Initialize shipping rates
    this.initializeShippingRates();
    
    // Initialize sample product images
    this.initializeProductImages();
  }

  private initializeShippingRates() {
    const shippingRates: ShippingRate[] = [
      // Domestic rates (France)
      {
        id: 1,
        zone: "domestic",
        service: "DPD_CLASSIC",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "8.50",
        perKgRate: "2.50",
        deliveryTime: "2-3 jours",
        description: "Livraison standard à domicile",
        active: true
      },
      {
        id: 2,
        zone: "domestic",
        service: "DPD_RELAIS",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "5.90",
        perKgRate: "2.50",
        deliveryTime: "2-3 jours",
        description: "Livraison en point relais",
        active: true
      },
      {
        id: 3,
        zone: "domestic",
        service: "DPD_PREDICT",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "10.90",
        perKgRate: "2.50",
        deliveryTime: "1-2 jours",
        description: "Livraison avec créneau horaire",
        active: true
      },
      {
        id: 4,
        zone: "domestic",
        service: "DPD_EXPRESS",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "18.90",
        perKgRate: "2.50",
        deliveryTime: "1 jour",
        description: "Livraison express avant 12h",
        active: true
      },
      // European rates
      {
        id: 5,
        zone: "europe",
        service: "DPD_CLASSIC",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "15.90",
        perKgRate: "2.50",
        deliveryTime: "3-5 jours",
        description: "Livraison standard à domicile",
        active: true
      },
      {
        id: 6,
        zone: "europe",
        service: "DPD_RELAIS",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "12.90",
        perKgRate: "2.50",
        deliveryTime: "3-5 jours",
        description: "Livraison en point relais",
        active: true
      },
      {
        id: 7,
        zone: "europe",
        service: "DPD_PREDICT",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "18.90",
        perKgRate: "2.50",
        deliveryTime: "2-4 jours",
        description: "Livraison avec créneau horaire",
        active: true
      },
      {
        id: 8,
        zone: "europe",
        service: "DPD_EXPRESS",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "28.90",
        perKgRate: "2.50",
        deliveryTime: "1-2 jours",
        description: "Livraison express avant 12h",
        active: true
      },
      // International rates
      {
        id: 9,
        zone: "international",
        service: "DPD_CLASSIC",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "35.00",
        perKgRate: "2.50",
        deliveryTime: "5-10 jours",
        description: "Livraison standard à domicile",
        active: true
      },
      {
        id: 10,
        zone: "international",
        service: "DPD_EXPRESS",
        minWeight: "0",
        maxWeight: "30",
        baseRate: "55.00",
        perKgRate: "2.50",
        deliveryTime: "2-5 jours",
        description: "Livraison express avant 12h",
        active: true
      }
    ];

    shippingRates.forEach(rate => {
      this.shippingRates.set(rate.id, rate);
    });
    this.currentShippingRateId = shippingRates.length + 1;
  }

  private initializeProductImages() {
    const sampleProductImages = [
      {
        id: 1,
        productId: 1,
        url: "/images/selle1.jpg",
        alt: "Selle Dressage Pro - Vue principale",
        filename: "selle1.jpg",
        originalName: "selle-dressage-pro-main.jpg",
        mimeType: "image/jpeg",
        size: 245760,
        isMain: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        productId: 1,
        url: "/images/selle2.jpg",
        alt: "Selle Dressage Pro - Vue de côté",
        filename: "selle2.jpg",
        originalName: "selle-dressage-pro-side.jpg",
        mimeType: "image/jpeg",
        size: 198432,
        isMain: false,
        createdAt: new Date(),
      },
      {
        id: 3,
        productId: 2,
        url: "/images/cross.jpg",
        alt: "Selle Cross Country - Vue principale",
        filename: "cross.jpg",
        originalName: "selle-cross-country-main.jpg",
        mimeType: "image/jpeg",
        size: 312544,
        isMain: true,
        createdAt: new Date(),
      },
      {
        id: 4,
        productId: 3,
        url: "/images/obstacle.webp",
        alt: "Selle Obstacle Elite - Vue principale",
        filename: "obstacle.webp",
        originalName: "selle-obstacle-elite-main.webp",
        mimeType: "image/webp",
        size: 156789,
        isMain: true,
        createdAt: new Date(),
      },
      {
        id: 5,
        productId: 4,
        url: "/images/mixte.jpg",
        alt: "Selle Mixte Confort - Vue principale",
        filename: "mixte.jpg",
        originalName: "selle-mixte-confort-main.jpg",
        mimeType: "image/jpeg",
        size: 287654,
        isMain: true,
        createdAt: new Date(),
      },
      {
        id: 6,
        productId: 5,
        url: "/images/poney.jpg",
        alt: "Selle Poney Junior - Vue principale",
        filename: "poney.jpg",
        originalName: "selle-poney-junior-main.jpg",
        mimeType: "image/jpeg",
        size: 234567,
        isMain: true,
        createdAt: new Date(),
      }
    ];

    sampleProductImages.forEach(image => {
      this.productImages.set(image.id, image);
    });
    this.currentProductImageId = sampleProductImages.length + 1;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      featured: insertProduct.featured ?? null,
      originalPrice: insertProduct.originalPrice ?? null,
      images: insertProduct.images ?? null,
      inStock: insertProduct.inStock ?? null,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateProduct,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    // Also delete all images associated with this product
    const productImages = Array.from(this.productImages.values()).filter(img => img.productId === id);
    productImages.forEach(img => this.productImages.delete(img.id));
    
    return this.products.delete(id);
  }

  // Product Images
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(img => img.productId === productId);
  }

  async createProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    const id = this.currentProductImageId++;
    const image: ProductImage = {
      ...insertImage,
      id,
      createdAt: new Date(),
      isMain: typeof insertImage.isMain === "undefined" ? false : insertImage.isMain,
    };
    this.productImages.set(id, image);
    return image;
  }

  async deleteProductImage(id: number): Promise<boolean> {
    return this.productImages.delete(id);
  }

  async setMainProductImage(productId: number, imageId: number): Promise<boolean> {
    // First, remove main flag from all images of this product
    const productImages = Array.from(this.productImages.values()).filter(img => img.productId === productId);
    productImages.forEach(img => {
      if (img.isMain) {
        this.productImages.set(img.id, { ...img, isMain: false });
      }
    });

    // Then set the new main image
    const targetImage = this.productImages.get(imageId);
    if (targetImage && targetImage.productId === productId) {
      this.productImages.set(imageId, { ...targetImage, isMain: true });
      return true;
    }
    return false;
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(img => img.category === category);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.currentGalleryId++;
    const image: GalleryImage = {
      ...insertImage,
      id,
      createdAt: new Date(),
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
}

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      shippingZone: insertOrder.shippingZone ?? "domestic",
      id,
      createdAt: new Date(),
      status: insertOrder.status ?? "pending",
      customerPhone: insertOrder.customerPhone ?? null,
      customerAddress: insertOrder.customerAddress ?? "",
      customerCity: insertOrder.customerCity ?? "",
      customerPostalCode: insertOrder.customerPostalCode ?? "",
      customerCountry: insertOrder.customerCountry ?? "",
      items: insertOrder.items ?? "[]",
      totalAmount: insertOrder.totalAmount ?? "0",
      shippingCost: insertOrder.shippingCost ?? null,
      shippingService: insertOrder.shippingService ?? "DPD_CLASSIC",
      trackingNumber: insertOrder.trackingNumber ?? null,
      shippingLabelUrl: insertOrder.shippingLabelUrl ?? null,
      estimatedDelivery: insertOrder.estimatedDelivery ?? null,
      dpdReference: insertOrder.dpdReference ?? null,
      stripeSessionId: insertOrder.stripeSessionId ?? null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updateOrder: Partial<InsertOrder>): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    const updated: Order = {
      ...existing,
      ...updateOrder,
      shippingZone: updateOrder.shippingZone ?? existing.shippingZone ?? "domestic",
    };
    this.orders.set(id, updated);
    return updated;
  }

  // Shipping rates
  async getShippingRates(): Promise<ShippingRate[]> {
    return Array.from(this.shippingRates.values());
  }

  async getShippingRatesByZone(zone: string): Promise<ShippingRate[]> {
    return Array.from(this.shippingRates.values()).filter(rate => rate.zone === zone && rate.active);
  }

  async createShippingRate(insertRate: InsertShippingRate): Promise<ShippingRate> {
    const id = this.currentShippingRateId++;
    const rate: ShippingRate = {
      ...insertRate,
      id,
      description: insertRate.description ?? null,
      minWeight: insertRate.minWeight ?? "0",
      maxWeight: insertRate.maxWeight ?? "30",
      baseRate: insertRate.baseRate,
      perKgRate: insertRate.perKgRate ?? "2.50",
      deliveryTime: insertRate.deliveryTime ?? "",
      active: insertRate.active ?? true,
    };
    this.shippingRates.set(id, rate);
    return rate;
  }

  async updateShippingRate(id: number, updateRate: Partial<InsertShippingRate>): Promise<ShippingRate | undefined> {
    const existing = this.shippingRates.get(id);
    if (!existing) return undefined;

    const updated: ShippingRate = {
      ...existing,
      ...updateRate,
      description: updateRate.description ?? existing.description ?? null,
      minWeight: updateRate.minWeight ?? existing.minWeight ?? "0",
      maxWeight: updateRate.maxWeight ?? existing.maxWeight ?? "30",
      baseRate: updateRate.baseRate ?? existing.baseRate,
      perKgRate: updateRate.perKgRate ?? existing.perKgRate ?? "2.50",
      deliveryTime: updateRate.deliveryTime ?? existing.deliveryTime ?? "",
      active: updateRate.active ?? existing.active ?? true,
    };
    this.shippingRates.set(id, updated);
    return updated;
  }
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

class DrizzleStorage implements IStorage {
  private db;
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }
  // --- PRODUITS ---
  async getProducts(): Promise<Product[]> {
    return await this.db.select().from(products);
  }
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await this.db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  async getFeaturedProducts(): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.featured, true));
  }
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.category, category));
  }
  async createProduct(product: InsertProduct): Promise<Product> {
    const [inserted] = await this.db.insert(products).values(product).returning();
    return inserted;
  }
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await this.db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }
  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.db.delete(products).where(eq(products.id, id)).returning();
    return !!result.length;
  }
  // --- PRODUCT IMAGES ---
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await this.db.select().from(productImages).where(eq(productImages.productId, productId));
  }
  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const [inserted] = await this.db.insert(productImages).values(image).returning();
    return inserted;
  }
  async deleteProductImage(id: number): Promise<boolean> {
    const result = await this.db.delete(productImages).where(eq(productImages.id, id)).returning();
    return !!result.length;
  }
  async setMainProductImage(productId: number, imageId: number): Promise<boolean> {
    await this.db.update(productImages).set({ isMain: false }).where(eq(productImages.productId, productId));
    const [updated] = await this.db.update(productImages).set({ isMain: true }).where(eq(productImages.id, imageId)).returning();
    return !!updated;
  }
  // --- GALLERY ---
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await this.db.select().from(galleryImages);
  }
  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return await this.db.select().from(galleryImages).where(eq(galleryImages.category, category));
  }
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [inserted] = await this.db.insert(galleryImages).values(image).returning();
    return inserted;
  }
  async deleteGalleryImage(id: number): Promise<boolean> {
    const result = await this.db.delete(galleryImages).where(eq(galleryImages.id, id)).returning();
    return !!result.length;
  }
  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    return await this.db.select().from(orders);
  }
  async getOrder(id: number): Promise<Order | undefined> {
    const result = await this.db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
  async createOrder(order: InsertOrder): Promise<Order> {
    const [inserted] = await this.db.insert(orders).values(order).returning();
    return inserted;
  }
  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await this.db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return updated;
  }
  // --- SHIPPING RATES ---
  async getShippingRates(): Promise<ShippingRate[]> {
    return await this.db.select().from(shippingRates);
  }
  async getShippingRatesByZone(zone: string): Promise<ShippingRate[]> {
    return await this.db.select().from(shippingRates).where(eq(shippingRates.zone, zone));
  }
  async createShippingRate(rate: InsertShippingRate): Promise<ShippingRate> {
    const [inserted] = await this.db.insert(shippingRates).values(rate).returning();
    return inserted;
  }
  async updateShippingRate(id: number, rate: Partial<InsertShippingRate>): Promise<ShippingRate | undefined> {
    const [updated] = await this.db.update(shippingRates).set(rate).where(eq(shippingRates.id, id)).returning();
    return updated;
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new DrizzleStorage() : new MemStorage();
