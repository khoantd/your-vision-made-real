import { supabase } from '@/integrations/supabase/client';
import { ModelConfig } from '@/types';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model_config: ModelConfig;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: any;
  created_at: string;
}

export const conversationService = {
  // Create a new conversation
  async createConversation(title: string, modelConfig: ModelConfig): Promise<Conversation | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
        model_config: modelConfig as any
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }

    return {
      ...data,
      model_config: data.model_config as unknown as ModelConfig
    } as Conversation;
  },

  // Get all conversations for the current user
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages:messages(
          id,
          role,
          content,
          metadata,
          created_at
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }

    return (data || []).map(conv => ({
      ...conv,
      model_config: conv.model_config as unknown as ModelConfig,
      messages: conv.messages?.map((msg: any) => ({
        ...msg,
        role: msg.role as 'user' | 'assistant' | 'system'
      }))
    })) as Conversation[];
  },

  // Get a specific conversation with messages
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages:messages(
          id,
          role,
          content,
          metadata,
          created_at
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Failed to fetch conversation:', error);
      throw error;
    }

    return {
      ...data,
      model_config: data.model_config as unknown as ModelConfig,
      messages: data.messages?.map((msg: any) => ({
        ...msg,
        role: msg.role as 'user' | 'assistant' | 'system'
      }))
    } as Conversation;
  },

  // Add a message to a conversation
  async addMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string, metadata: any = {}): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add message:', error);
      throw error;
    }

    return {
      ...data,
      role: data.role as 'user' | 'assistant' | 'system'
    } as Message;
  },

  // Update conversation title
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);

    if (error) {
      console.error('Failed to update conversation title:', error);
      throw error;
    }
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  },

  // Generate a title for a conversation based on the first few messages
  generateConversationTitle(messages: Message[]): string {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) return 'New Conversation';
    
    const firstMessage = userMessages[0].content;
    // Take first 50 characters and add ellipsis if longer
    return firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + '...'
      : firstMessage;
  }
};