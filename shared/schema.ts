import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Template categories
export type TemplateCategory = "social" | "blog" | "email" | "presentation";

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().$type<TemplateCategory>(),
  thumbnail: text("thumbnail").notNull(),
  isPremium: boolean("is_premium").default(false),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Content items created by users
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  templateId: integer("template_id"),
  category: text("category").notNull().$type<TemplateCategory>(),
  status: text("status").notNull().$type<"draft" | "published">().default("draft"),
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
});

export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type ContentItem = typeof contentItems.$inferSelect;

// Conversations for AI chat
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Brand profile table
export const brandProfiles = pgTable("brand_profiles", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  industry: text("industry"),
  targetAudience: text("target_audience"),
  brandVoice: text("brand_voice"),
  keyMessages: text("key_messages"),
  brandColors: text("brand_colors"),
  logoUrl: text("logo_url"),
});

export const insertBrandProfileSchema = createInsertSchema(brandProfiles).omit({
  id: true,
});

export type InsertBrandProfile = z.infer<typeof insertBrandProfileSchema>;
export type BrandProfile = typeof brandProfiles.$inferSelect;

// Feature type for landing page
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Pricing plan type
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

// Testimonial type
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}
