import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "Obstacle", "Dressage", "Cross", "Mixte", "Poney"
  size: text("size").notNull(), // "16", "16.5", "17", "17.5", "18", "18.5"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  image: text("image").notNull(),
  images: text("images").array().default([]),
  featured: boolean("featured").default(false),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  isMain: boolean("is_main").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address").notNull(),
  customerCity: text("customer_city").notNull(),
  customerPostalCode: text("customer_postal_code").notNull(),
  customerCountry: text("customer_country").notNull(),
  items: text("items").notNull(), // JSON string
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0"),
  shippingService: text("shipping_service").notNull().default("DPD_CLASSIC"),
  shippingZone: text("shipping_zone").notNull().default("domestic"),
  trackingNumber: text("tracking_number"),
  shippingLabelUrl: text("shipping_label_url"),
  estimatedDelivery: text("estimated_delivery"),
  dpdReference: text("dpd_reference"),
  status: text("status").notNull().default("pending"), // "pending", "paid", "shipped", "delivered"
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shippingRates = pgTable("shipping_rates", {
  id: serial("id").primaryKey(),
  zone: text("zone").notNull(),
  service: text("service").notNull(),
  minWeight: decimal("min_weight", { precision: 5, scale: 2 }).notNull().default("0"),
  maxWeight: decimal("max_weight", { precision: 5, scale: 2 }).notNull().default("30"),
  baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
  perKgRate: decimal("per_kg_rate", { precision: 10, scale: 2 }).notNull().default("0"),
  deliveryTime: text("delivery_time").notNull(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertShippingRateSchema = createInsertSchema(shippingRates).omit({
  id: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type ShippingRate = typeof shippingRates.$inferSelect;
export type InsertShippingRate = z.infer<typeof insertShippingRateSchema>;
