import { storage } from "../../storage";
import type { Conversation, Message } from "@shared/schema";

export interface IChatStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    return storage.getConversation(id);
  },

  async getAllConversations() {
    return storage.getConversations();
  },

  async createConversation(title: string) {
    return storage.createConversation(title);
  },

  async deleteConversation(id: number) {
    return storage.deleteConversation(id);
  },

  async getMessagesByConversation(conversationId: number) {
    return storage.getMessagesByConversation(conversationId);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    return storage.createMessage(conversationId, role, content);
  },
};
