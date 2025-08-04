import { supabase } from '@/integrations/supabase/client';
import { ModelConfig, StreamConfig, MediaGenerationConfig, OpenAIConfig } from '@/types';

export interface UserSettingsData {
  modelConfig?: ModelConfig;
  streamConfig?: StreamConfig;
  mediaConfig?: MediaGenerationConfig;
  openAIConfig?: OpenAIConfig;
  apiKeys?: Record<string, string>;
  activeView?: string;
}

export const saveUserSettings = async (settings: UserSettingsData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      settings: settings as any
    });

  if (error) {
    console.error('Failed to save user settings:', error);
    throw error;
  }
};

export const loadUserSettings = async (): Promise<UserSettingsData | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return null
      return null;
    }
    console.error('Failed to load user settings:', error);
    throw error;
  }

  return (data?.settings as UserSettingsData) || null;
};