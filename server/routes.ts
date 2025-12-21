import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentItemSchema, insertBrandProfileSchema, type InsertTemplate } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Default templates to seed
const defaultTemplates: InsertTemplate[] = [
  { name: "Instagram Caption", description: "Engaging captions for Instagram posts with hashtags", category: "social", thumbnail: "instagram", isPremium: false },
  { name: "LinkedIn Post", description: "Professional posts for LinkedIn networking", category: "social", thumbnail: "linkedin", isPremium: false },
  { name: "Twitter Thread", description: "Compelling Twitter/X threads that drive engagement", category: "social", thumbnail: "twitter", isPremium: false },
  { name: "Facebook Ad", description: "High-converting Facebook advertisement copy", category: "social", thumbnail: "facebook", isPremium: true },
  { name: "Welcome Email", description: "Warm welcome emails for new subscribers", category: "email", thumbnail: "welcome", isPremium: false },
  { name: "Newsletter", description: "Engaging weekly or monthly newsletters", category: "email", thumbnail: "newsletter", isPremium: false },
  { name: "Promotional Email", description: "Sales and promotional email campaigns", category: "email", thumbnail: "promo", isPremium: false },
  { name: "Re-engagement Email", description: "Win back inactive subscribers", category: "email", thumbnail: "reengagement", isPremium: true },
  { name: "How-To Guide", description: "Step-by-step tutorial blog posts", category: "blog", thumbnail: "howto", isPremium: false },
  { name: "Listicle", description: "Numbered list articles that are easy to read", category: "blog", thumbnail: "listicle", isPremium: false },
  { name: "Product Review", description: "Detailed product review articles", category: "blog", thumbnail: "review", isPremium: false },
  { name: "Industry News", description: "Commentary on industry trends and news", category: "blog", thumbnail: "news", isPremium: true },
  { name: "Pitch Deck", description: "Investor pitch presentation content", category: "presentation", thumbnail: "pitch", isPremium: true },
  { name: "Sales Presentation", description: "Product or service sales slides", category: "presentation", thumbnail: "sales", isPremium: false },
  { name: "Company Overview", description: "About us presentation content", category: "presentation", thumbnail: "company", isPremium: false },
];

async function seedTemplates() {
  const existing = await storage.getTemplates();
  if (existing.length === 0) {
    for (const template of defaultTemplates) {
      await storage.createTemplate(template);
    }
    console.log("Seeded default templates");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed templates on startup
  await seedTemplates();
  
  // Content generation endpoint with streaming
  app.post("/api/generate-content", async (req: Request, res: Response) => {
    try {
      const { prompt, contentType, tone } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const systemPrompt = `You are a professional content creator for small businesses. Generate ${contentType} content with a ${tone} tone. 
      
Guidelines:
- Keep the content engaging and suitable for the target platform
- For social media: Keep it concise, use appropriate hashtags
- For email: Include a compelling subject line and clear call-to-action
- For blog: Create well-structured content with headings
- For presentations: Create slide-by-slide content with bullet points

Generate professional, high-quality content that resonates with small business audiences.`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: true,
        max_completion_tokens: 2048,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error generating content:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to generate content" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to generate content" });
      }
    }
  });

  // Content CRUD endpoints
  app.get("/api/content", async (req: Request, res: Response) => {
    try {
      const items = await storage.getContentItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getContentItem(id);
      if (!item) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req: Request, res: Response) => {
    try {
      const parsed = insertContentItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid content data", details: parsed.error });
      }
      const item = await storage.createContentItem(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.patch("/api/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const partialSchema = insertContentItemSchema.partial();
      const parsed = partialSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid content data", details: parsed.error });
      }
      const item = await storage.updateContentItem(id, parsed.data);
      if (!item) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContentItem(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Templates endpoints
  app.get("/api/templates", async (req: Request, res: Response) => {
    try {
      const items = await storage.getTemplates();
      res.json(items);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Brand profile endpoints
  app.get("/api/brand-profile", async (req: Request, res: Response) => {
    try {
      const profile = await storage.getBrandProfile();
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching brand profile:", error);
      res.status(500).json({ error: "Failed to fetch brand profile" });
    }
  });

  app.post("/api/brand-profile", async (req: Request, res: Response) => {
    try {
      const parsed = insertBrandProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid brand profile data", details: parsed.error });
      }
      const profile = await storage.saveBrandProfile(parsed.data);
      res.json(profile);
    } catch (error) {
      console.error("Error saving brand profile:", error);
      res.status(500).json({ error: "Failed to save brand profile" });
    }
  });

  return httpServer;
}
