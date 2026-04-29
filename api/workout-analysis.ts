import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { summary, goals, userName } = req.body
  // summary: WorkoutSummary, goals: GoalProgress[], userName: string

  // ── Devils player-analysis.ts의 prompt 구조 그대로 유지, 내용만 교체 ──
  const muscleList = summary.muscleBreakdown
    .slice(0, 4)
    .map((m: any) => `${m.muscle} ${(m.share * 100).toFixed(0)}%`)
    .join(', ')

  const goalLines = goals
    .map((g: any) => `${g.label}: ${g.pct}% (${g.status})`)
    .join('\n')

  const prompt = `
운동 데이터 분석을 해줘 (한국어, 전문적이지만 친근하게):

회원: ${userName}
기간 총 세션: ${summary.totalSessions}회
총 볼륨: ${(summary.totalVolume / 1000).toFixed(1)}톤
평균 세션 볼륨: ${(summary.avgVolumePerSession / 1000).toFixed(1)}톤
주요 근육군: ${muscleList}
출석률: ${(summary.adherenceRate * 100).toFixed(0)}%

목표 달성률:
${goalLines}

다음 3가지로 분석해줘:
1. Strengths (현재 잘하고 있는 점, 2~3가지 구체적으로)
2. Areas to Improve (개선이 필요한 점, 2가지)
3. Training Plan (다음 주 구체적인 액션 2~3가지)

각 섹션은 bullet point로, 각 항목은 1~2문장으로.
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = completion.choices[0].message.content ?? ''

  // Devils와 동일한 파싱 로직
  const sections = { strengths: [] as string[], improvements: [] as string[], plan: [] as string[] }
  let current: keyof typeof sections | null = null
  text.split('\n').forEach((line: string) => {
    const l = line.trim()
    if (!l) return
    if (/strength/i.test(l))     current = 'strengths'
    else if (/improve/i.test(l)) current = 'improvements'
    else if (/plan/i.test(l))    current = 'plan'
    else if (l.startsWith('-') && current) {
      sections[current].push(l.replace(/^-\s*/, ''))
    }
  })

  return res.status(200).json({
    raw: text,
    sections,
    analyzedAt: new Date().toISOString(),
  })
}
