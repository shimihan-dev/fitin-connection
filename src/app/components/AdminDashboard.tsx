import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { getGlobalSetting, setGlobalSetting } from '../../../utils/globalSettings';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronLeft, Upload, Settings } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { user } = useAuth();
  const [weeklyDietImage, setWeeklyDietImage] = useState<string | null>(null);
  const [sbdStatusText, setSbdStatusText] = useState<string>('');
  const [sbdStatusImage, setSbdStatusImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const diet = await getGlobalSetting('weekly_diet_image');
      const sbdText = await getGlobalSetting('sbd_status_text');
      const sbdImg = await getGlobalSetting('sbd_status_image');
      
      if (diet) setWeeklyDietImage(diet);
      if (sbdText) setSbdStatusText(sbdText);
      if (sbdImg) setSbdStatusImage(sbdImg);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'diet' | 'sbd') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'diet') setWeeklyDietImage(result);
      else setSbdStatusImage(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (weeklyDietImage) await setGlobalSetting('weekly_diet_image', weeklyDietImage);
      if (sbdStatusText !== undefined) await setGlobalSetting('sbd_status_text', sbdStatusText);
      if (sbdStatusImage !== undefined) await setGlobalSetting('sbd_status_image', sbdStatusImage);
      setMessage({ type: 'success', text: '설정이 성공적으로 저장되었습니다.' });
    } catch (e) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
    setSaving(false);
  };

  if (user?.role !== 'admin' && user?.email !== 'yunsok.shim@gmail.com') {
    return (
      <div className="py-12 text-center text-red-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">권한이 없습니다.</h2>
        <Button className="mt-4" onClick={onBack}>돌아가기</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-in fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> 관리자 대시보드
        </h1>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="font-medium text-sm">{message.text}</p>
        </motion.div>
      )}

      {/* 이번 주의 식단 설정 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">이번 주의 식단 등록</h2>
        <div className="space-y-4">
          {weeklyDietImage ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={weeklyDietImage} alt="Weekly Diet" className="w-full max-h-64 object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => setWeeklyDietImage(null)}>초기화</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-card/50">
              <Upload className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">학식 식단표 이미지를 업로드하세요</p>
              <label>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium cursor-pointer text-sm">
                  이미지 선택
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'diet')} />
              </label>
            </div>
          )}
        </div>
      </Card>

      {/* SBD 대회 현황 설정 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">SBD 대회 현황 업데이트</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">현황 요약 문구</label>
            <Input 
              placeholder="예: 한국대학교가 총합 1위를 달리고 있습니다!" 
              value={sbdStatusText} 
              onChange={(e) => setSbdStatusText(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">상세 현황표 파일 첨부 (선택)</label>
            {sbdStatusImage ? (
              <div className="relative rounded-lg overflow-hidden border border-border w-48">
                <img src={sbdStatusImage} alt="SBD Status" className="w-full object-cover" />
                <Button variant="destructive" size="sm" className="absolute top-2 right-2 h-7 px-2 text-xs" onClick={() => setSbdStatusImage(null)}>삭제</Button>
              </div>
            ) : (
                <label className="flex">
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium cursor-pointer text-sm border border-border flex items-center gap-2">
                    <Upload className="w-4 h-4" /> 리더보드 이미지 첨부
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'sbd')} />
                </label>
            )}
          </div>
        </div>
      </Card>

      <Button size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? '저장 중...' : '모든 변경사항 저장'}
      </Button>
    </div>
  );
}
