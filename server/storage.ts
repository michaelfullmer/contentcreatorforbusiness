import { db } from "./db";
import { 
  templates, 
  contentItems, 
  conversations, 
  messages,
  brandProfiles,
  userSubscriptions,
  type User,
  type Template,
  type InsertTemplate,
  type ContentItem,
  type InsertContentItem,
  type Conversation,
  type Message,
  type BrandProfile,
  type InsertBrandProfile,
  type UserSubscription,
  type PlanType
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  
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
  
  // Subscriptions
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createOrUpdateSubscription(userId: string, plan: PlanType, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<UserSubscription>;
  incrementUsage(userId: string, type: 'content' | 'image'): Promise<void>;
  resetMonthlyUsage(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Templates
  async getTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [created] = await db.insert(templates).values(template as any).returning();
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
    const [created] = await db.insert(contentItems).values(item as any).returning();
    return created;
  }

  async updateContentItem(id: number, item: Partial<InsertContentItem>): Promise<ContentItem | undefined> {
    const [updated] = await db.update(contentItems).set(item as any).where(eq(contentItems.id, id)).returning();
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

  // Subscriptions
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [sub] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
    return sub;
  }

  async createOrUpdateSubscription(
    userId: string, 
    plan: PlanType, 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string
  ): Promise<UserSubscription> {
    const existing = await this.getUserSubscription(userId);
    if (existing) {
      const [updated] = await db.update(userSubscriptions)
        .set({ 
          plan, 
          stripeCustomerId: stripeCustomerId ?? existing.stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId ?? existing.stripeSubscriptionId 
        })
        .where(eq(userSubscriptions.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userSubscriptions)
      .values({ userId, plan, stripeCustomerId, stripeSubscriptionId })
      .returning();
    return created;
  }

  async incrementUsage(userId: string, type: 'content' | 'image'): Promise<void> {
    const sub = await this.getUserSubscription(userId);
    if (!sub) {
      await this.createOrUpdateSubscription(userId, 'free');
    }
    
    if (type === 'content') {
      await db.update(userSubscriptions)
        .set({ contentGenerationsUsed: (sub?.contentGenerationsUsed ?? 0) + 1 })
        .where(eq(userSubscriptions.userId, userId));
    } else {
      await db.update(userSubscriptions)
        .set({ imageGenerationsUsed: (sub?.imageGenerationsUsed ?? 0) + 1 })
        .where(eq(userSubscriptions.userId, userId));
    }
  }

  async resetMonthlyUsage(userId: string): Promise<void> {
    await db.update(userSubscriptions)
      .set({ contentGenerationsUsed: 0, imageGenerationsUsed: 0, currentPeriodStart: new Date() })
      .where(eq(userSubscriptions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
