/**
 * Phase 4 — TrainerDashboard.tsx
 * 신규 파일: src/app/components/TrainerDashboard.tsx
 *
 * App.tsx에 lazy 등록:
 *   const TrainerDashboard = lazy(() => import('./components/TrainerDashboard'))
 *
 * renderPage()에서 분기:
 *   if (currentPage === 'home' && user?.role === 'trainer') {
 *     return <TrainerDashboard />;
 *   }
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Copy, ChevronRight, UserPlus } from 'lucide-react';

interface ClientRow {
  client_id: string;
  sharing_on: boolean;
  users: { name: string; profile_picture?: string | undefined } | null | any;
}

interface WorkoutSummary {
  client_id: string;
  this_week: number;
  last_log_date: string | null;
}

export default function TrainerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [clients, setClients]             = useState<ClientRow[]>([]);
  const [summaries, setSummaries]         = useState<Record<string, WorkoutSummary>>({});
  const [selectedClientId, setSelected]   = useState<string | null>(null);
  const [inviteUrl, setInviteUrl]         = useState('');
  const [generating, setGenerating]       = useState(false);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchClients();
  }, [user?.id]);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trainer_clients')
      .select('client_id, sharing_on, users!trainer_clients_client_id_fkey(name, profile_picture)')
      .eq('trainer_id', user!.id)
      .eq('status', 'active');

    if (!error && data) {
      setClients(data as ClientRow[]);

      // 각 회원의 이번 주 운동 횟수
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const summaryMap: Record<string, WorkoutSummary> = {};
      await Promise.all(
        (data as ClientRow[]).map(async (c) => {
          const { count } = await supabase
            .from('workout_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', c.client_id)
            .gte('created_at', weekStart.toISOString());

          const { data: lastLog } = await supabase
            .from('workout_logs')
            .select('created_at')
            .eq('user_id', c.client_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          summaryMap[c.client_id] = {
            client_id: c.client_id,
            this_week: count || 0,
            last_log_date: lastLog?.created_at?.split('T')[0] || null,
          };
        })
      );
      setSummaries(summaryMap);
    }
    setLoading(false);
  };

  const generateInvite = async () => {
    if (!user?.id) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainer_id: user.id }),
      });
      const { inviteUrl: url, code } = await res.json();
      setInviteUrl(url);
      navigator.clipboard.writeText(url).catch(() => {});
      alert(`초대 링크가 복사되었습니다!\n코드: ${code}`);
    } catch (err) {
      alert('초대 링크 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  if (selectedClientId) {
    return (
      <TrainerClientDetail
        clientId={selectedClientId}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">내 회원 목록</h2>
        <Button
          onClick={generateInvite}
          disabled={generating}
          className="flex items-center gap-2 bg-primary"
        >
          <UserPlus className="w-4 h-4" />
          {generating ? '생성 중...' : '초대 링크 생성'}
        </Button>
      </div>

      {inviteUrl && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-600 font-medium mb-1">초대 링크 (클립보드에 복사됨)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-blue-800 truncate">{inviteUrl}</code>
            <button onClick={() => navigator.clipboard.writeText(inviteUrl)}>
              <Copy className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground space-y-2">
          <User className="w-12 h-12 mx-auto opacity-30" />
          <p className="font-medium">연결된 회원이 없습니다</p>
          <p className="text-sm">초대 링크를 생성해 회원을 연결해보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => {
            const summary = summaries[c.client_id];
            return (
              <Card
                key={c.client_id}
                className="p-4 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setSelected(c.client_id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.users?.profile_picture ? (
                      <img src={c.users.profile_picture} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{c.users?.name || '회원'}</p>
                    <p className="text-xs text-muted-foreground">
                      이번 주 {summary?.this_week || 0}회 운동
                      {summary?.last_log_date && ` · 최근 ${summary.last_log_date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!c.sharing_on && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        공유 OFF
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ── 회원 상세 뷰 ────────────────────────────────────────────────
function TrainerClientDetail({
  clientId,
  onBack,
}: {
  clientId: string;
  onBack: () => void;
}) {
  const [logs, setLogs]         = useState<any[]>([]);
  const [comment, setComment]   = useState('');
  const [clientName, setName]   = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      // 회원 이름
      const { data: u } = await supabase
        .from('users')
        .select('name')
        .eq('id', clientId)
        .single();
      if (u) setName(u.name);

      // 운동 기록 (RLS가 트레이너 읽기 허용 필요)
      const { data: wl } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', clientId)
        .order('created_at', { ascending: false })
        .limit(30);
      setLogs(wl || []);
      setLoading(false);
    };
    load();
  }, [clientId]);

  return (
    <div className="py-6 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← 목록으로
      </button>

      <h2 className="text-xl font-bold text-foreground">{clientName} 회원 기록</h2>

      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">아직 운동 기록이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{log.type || '운동'} · {log.muscle_group || '-'}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.minutes && `${log.minutes}분`}
                    {log.distance && ` · ${log.distance}km`}
                    {log.volume && ` · ${log.volume}kg`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {log.created_at?.split('T')[0]}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 코멘트 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">코멘트 남기기</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="회원에게 피드백을 남겨보세요..."
          rows={3}
          className="w-full p-3 rounded-lg border border-border bg-muted/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="w-full"
          disabled={!comment.trim()}
          onClick={() => {
            // TODO: trainer_comments 테이블 insert
            alert('코멘트 전송 기능은 곧 추가됩니다.');
          }}
        >
          코멘트 전송
        </Button>
      </div>
    </div>
  );
}