import { products, galleryImages, orders, type Product, type InsertProduct, type GalleryImage, type InsertGalleryImage, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

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
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private galleryImages: Map<number, GalleryImage>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentGalleryId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.galleryImages = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentGalleryId = 1;
    this.currentOrderId = 1;

    // Initialize with sample products
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
    return this.products.delete(id);
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
      id,
      createdAt: new Date(),
      status: insertOrder.status ?? "pending",
      customerPhone: insertOrder.customerPhone ?? null,
      stripeSessionId: insertOrder.stripeSessionId ?? null,
      shippingCost: insertOrder.shippingCost ?? null,
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
    };
    this.orders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
