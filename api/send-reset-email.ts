import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: '이메일과 인증 코드가 필요합니다.' });
        }

        const { data, error } = await resend.emails.send({
            from: 'IGC Fitness <onboarding@resend.dev>',
            to: email,
            subject: '[IGC Fitness] 비밀번호 재설정 인증 코드',
            html: `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563EB; margin: 0;">IGC Fitness</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px;">
            <p style="color: #fff; font-size: 16px; margin: 0 0 16px 0;">비밀번호 재설정 인증 코드</p>
            <div style="background: #fff; border-radius: 12px; padding: 20px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1F2937;">${code}</span>
            </div>
          </div>
          
          <div style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            <p>이 인증 코드는 <strong>10분 후에 만료</strong>됩니다.</p>
            <p>본인이 요청하지 않은 경우 이 이메일을 무시해주세요.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            © 2024 IGC Fitness. All rights reserved.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend 에러:', error);
            return res.status(500).json({ error: '이메일 발송에 실패했습니다.' });
        }

        return res.status(200).json({ success: true, messageId: data?.id });
    } catch (error) {
        console.error('서버 에러:', error);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
