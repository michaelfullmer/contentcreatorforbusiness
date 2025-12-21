import { db } from "./db";
import { 
  users, 
  templates, 
  contentItems, 
  conversations, 
  messages,
  brandProfiles,
  type User, 
  type InsertUser,
  type Template,
  type InsertTemplate,
  type ContentItem,
  type InsertContentItem,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type BrandProfile,
  type InsertBrandProfile
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Content Items
  getContentItems(): Promise<ContentItem[]>;
  getContentItem(id: number): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, item: Partial<InsertContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: number): Promise<void>;
  
  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  
  // Messages
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
  
  // Brand Profiles
  getBrandProfile(): Promise<BrandProfile | undefined>;
  saveBrandProfile(profile: InsertBrandProfile): Promise<BrandProfile>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [created] = await db.insert(templates).values(template).returning();
    return created;
  }

  // Content Items
  async getContentItems(): Promise<ContentItem[]> {
    return db.select().from(contentItems).orderBy(desc(contentItems.id));
  }

  async getContentItem(id: number): Promise<ContentItem | undefined> {
    const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id));
    return item;
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const [created] = await db.insert(contentItems).values(item).returning();
    return created;
  }

  async updateContentItem(id: number, item: Partial<InsertContentItem>): Promise<ContentItem | undefined> {
    const [updated] = await db.update(contentItems).set(item).where(eq(contentItems.id, id)).returning();
    return updated;
  }

  async deleteContentItem(id: number): Promise<void> {
    await db.delete(contentItems).where(eq(contentItems.id, id));
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  // Messages
  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(conversationId: number, role: string, content: string): Promise<Message> {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  }

  // Brand Profiles
  async getBrandProfile(): Promise<BrandProfile | undefined> {
    const [profile] = await db.select().from(brandProfiles).limit(1);
    return profile;
  }

  async saveBrandProfile(profile: InsertBrandProfile): Promise<BrandProfile> {
    const existing = await this.getBrandProfile();
    if (existing) {
      const [updated] = await db.update(brandProfiles).set(profile).where(eq(brandProfiles.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(brandProfiles).values(profile).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
