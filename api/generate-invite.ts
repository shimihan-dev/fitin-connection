import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// service role key 사용 (Vercel 환경변수에 설정)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { trainer_id } = req.body;
  if (!trainer_id) return res.status(400).json({ error: 'trainer_id 필요' });

  // 6자리 대문자 영숫자 코드 생성
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();

  const { error } = await supabase
    .from('trainer_invites')
    .insert({ trainer_id, code });

  if (error) {
    console.error('invite 생성 에러:', error);
    return res.status(500).json({ error: '초대 링크 생성 실패' });
  }

  const appUrl = process.env.APP_URL || 'https://your-app.vercel.app';
  const inviteUrl = `${appUrl}/?invite=${code}`;

  return res.status(200).json({ code, inviteUrl });
}