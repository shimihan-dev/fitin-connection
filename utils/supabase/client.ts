import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Supabase URL 생성
const supabaseUrl = `https://${projectId}.supabase.co`;

// Supabase 클라이언트 생성 (싱글톤)
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
