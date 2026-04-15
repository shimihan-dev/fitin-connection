import { supabase } from './supabase/client';

export interface GlobalSetting {
  key: string;
  value: any;
}

export async function getGlobalSetting(key: string): Promise<any> {
  const { data, error } = await supabase
    .from('global_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return null;
  }
  return data.value;
}

export async function setGlobalSetting(key: string, value: any): Promise<boolean> {
  const { error } = await supabase
    .from('global_settings')
    .upsert({ key, value });

  if (error) {
    console.error('설정 저장 오류:', error);
    return false;
  }
  return true;
}
