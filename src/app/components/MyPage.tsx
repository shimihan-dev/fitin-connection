import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Save, Calendar, Target, Link, Ruler, Scale, Camera, Cake, Percent, Dumbbell, Settings, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getUserProfile, updateUserProfile, uploadProfilePicture, User, ProfileUpdateData } from '../../../utils/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { Switch } from './ui/switch';
import { supabase } from '../../../utils/supabase/client';

interface MyPageProps {
    user: { name: string; email: string; id?: string; profile_picture?: string; role?: string };
    onBack: () => void;
    onAdminClick?: () => void;
}

export function MyPage({ user, onBack, onAdminClick }: MyPageProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        height: '',
        weight: '',
        age: '',
        fitness_goal: '',
        body_fat_goal: '',
        preferred_exercise: '',
        sns_link: '',
    });
    const { t } = useLanguage();
    const [showWelcomeSlides, setShowWelcomeSlides] = useState(true);

    useEffect(() => {
        loadProfile();
        const savedSetting = localStorage.getItem(`igc_show_welcome_slides_${user.id}`);
        if (savedSetting !== null) {
            setShowWelcomeSlides(savedSetting === 'true');
        }
    }, [user.id]);

    const handleToggleWelcomeSlides = (checked: boolean) => {
        setShowWelcomeSlides(checked);
        localStorage.setItem(`igc_show_welcome_slides_${user.id}`, checked.toString());
    };

    const loadProfile = async () => {
        if (!user.id) {
            setLoading(false);
            return;
        }
        const { profile: fetchedProfile } = await getUserProfile(user.id);
        if (fetchedProfile) {
            setProfile(fetchedProfile);
            setFormData({
                name: fetchedProfile.name || '',
                height: fetchedProfile.height?.toString() || '',
                weight: fetchedProfile.weight?.toString() || '',
                age: fetchedProfile.age?.toString() || '',
                fitness_goal: fetchedProfile.fitness_goal || '',
                body_fat_goal: fetchedProfile.body_fat_goal?.toString() || '',
                preferred_exercise: fetchedProfile.preferred_exercise || '',
                sns_link: fetchedProfile.sns_link || '',
            });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user.id) {
            alert('사용자 정보를 찾을 수 없습니다.');
            return;
        }
        setSaving(true);
        const updateData: ProfileUpdateData = {
            name: formData.name,
            height: formData.height ? parseFloat(formData.height) : undefined,
            weight: formData.weight ? parseFloat(formData.weight) : undefined,
            age: formData.age ? parseInt(formData.age) : undefined,
            fitness_goal: formData.fitness_goal || undefined,
            body_fat_goal: formData.body_fat_goal ? parseInt(formData.body_fat_goal) : undefined,
            preferred_exercise: formData.preferred_exercise as 'running' | 'gym' | 'crossfit' | undefined,
            sns_link: formData.sns_link || undefined,
        };
        const { success, error } = await updateUserProfile(user.id, updateData);
        if (success) {
            alert('프로필이 저장되었습니다!');
            loadProfile();
        } else {
            alert(error || '저장 중 오류가 발생했습니다.');
        }
        setSaving(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const formatUniversity = (code?: string) => {
        if (!code) return '-';
        const map: Record<string, string> = {
            utah: 'University of Utah (유타대학교)',
            gmu: 'George Mason University (조지메이슨대학교)',
            stony: 'Stony Brook University (스토니브룩대학교)',
            ghent: 'Ghent University (겐트대학교)',
            fit: 'Fashion Institute of Technology (패션공과대학교)',
        };
        return map[code.toLowerCase()] || code;
    };

    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user.id) return;
        if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하여야 합니다.'); return; }
        if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }
        setUploadingPicture(true);
        const { error } = await uploadProfilePicture(user.id, file);
        if (error) { alert(error); } else { alert('프로필 사진이 변경되었습니다!'); loadProfile(); }
        setUploadingPicture(false);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* 뒤로가기 */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={onBack} className="border-border">
                    뒤로가기
                </Button>
            </div>

            {/* Profile Hero */}
            <div className="flex flex-col items-center text-center py-6">
                <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/30 ring-4 ring-primary/20">
                        {profile?.profile_picture ? (
                            <img src={profile.profile_picture} alt="프로필" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-14 h-14 text-white" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPicture}
                        className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50 ring-2 ring-background"
                    >
                        {uploadingPicture
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Camera className="w-4 h-4" />
                        }
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{profile?.name || user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                {profile?.university && (
                    <p className="text-sm text-muted-foreground mt-1">{formatUniversity(profile.university)}</p>
                )}
                {profile?.created_at && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        가입일: {formatDate(profile.created_at)}
                    </p>
                )}
            </div>

            {/* 기본 정보 */}
            <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    기본 정보
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="이름" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sns_link">SNS 링크</Label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="sns_link" name="sns_link" value={formData.sns_link}
                                onChange={handleChange} placeholder="https://instagram.com/username"
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* 신체 정보 */}
            <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    신체 정보
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="height" className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" /> 키 (cm)
                        </Label>
                        <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} placeholder="170" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight" className="flex items-center gap-1">
                            <Scale className="w-3 h-3" /> 몸무게 (kg)
                        </Label>
                        <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="65" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age" className="flex items-center gap-1">
                            <Cake className="w-3 h-3" /> 나이
                        </Label>
                        <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="22" />
                    </div>
                </div>
            </Card>

            {/* 운동 목표 */}
            <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    운동 목표
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fitness_goal" className="flex items-center gap-1">
                            <Target className="w-3 h-3" /> 피트니스 목표
                        </Label>
                        <Input id="fitness_goal" name="fitness_goal" value={formData.fitness_goal} onChange={handleChange} placeholder="예: 체중 감량, 근육 증가..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="body_fat_goal" className="flex items-center gap-1">
                            <Percent className="w-3 h-3" /> 목표 체지방률 (%)
                        </Label>
                        <Input id="body_fat_goal" name="body_fat_goal" type="number" value={formData.body_fat_goal} onChange={handleChange} placeholder="15" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preferred_exercise" className="flex items-center gap-1">
                            <Dumbbell className="w-3 h-3" /> 선호 운동
                        </Label>
                        <select
                            id="preferred_exercise" name="preferred_exercise"
                            value={formData.preferred_exercise} onChange={(e) => setFormData({ ...formData, preferred_exercise: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            <option value="">선택하세요</option>
                            <option value="running">러닝</option>
                            <option value="gym">웨이트</option>
                            <option value="crossfit">크로스핏</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* 시스템 설정 */}
            <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    {t('common.system_settings')}
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground">{t('common.show_welcome_slides')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">로그인 후 소개 슬라이드 표시 여부</p>
                    </div>
                    <Switch checked={showWelcomeSlides} onCheckedChange={handleToggleWelcomeSlides} />
                </div>
            </Card>

            {/* ── Phase 4: 트레이너 연결 공유 토글 ── */}
            {user.id && <TrainerSharingSection userId={user.id} />}

            {/* 관리자 도구 */}
            {(user.role === 'admin' || user.email === 'yunsok.shim@gmail.com') && onAdminClick && (
                <Card className="p-5 border-primary/50 bg-primary/5">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-primary">
                        <Settings className="w-4 h-4" />
                        관리자 설정
                    </h3>
                    <Button onClick={onAdminClick} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                        관리자 대시보드 열기
                    </Button>
                </Card>
            )}

            {/* 저장 버튼 */}
            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-6 text-base font-semibold"
            >
                {saving
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />저장 중...</>
                    : <><Save className="w-4 h-4 mr-2" />프로필 저장</>
                }
            </Button>
        </div>
    );
}


// ── Phase 4: 트레이너 공유 ON/OFF 섹션 ────────────────────────

interface TrainerConnection {
    id: string;
    sharing_on: boolean;
    users: { name: string } | null;
}

function TrainerSharingSection({ userId }: { userId: string }) {
    const [connections, setConnections] = useState<TrainerConnection[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        supabase
            .from('trainer_clients')
            .select('id, sharing_on, users!trainer_clients_trainer_id_fkey(name)')
            .eq('client_id', userId)
            .eq('status', 'active')
            .then(({ data }) => {
                setConnections((data as any[]) || []);
                setLoaded(true);
            });
    }, [userId]);

    const toggle = async (connectionId: string, current: boolean) => {
        const { error } = await supabase
            .from('trainer_clients')
            .update({ sharing_on: !current })
            .eq('id', connectionId);

        if (!error) {
            setConnections((prev) =>
                prev.map((c) => c.id === connectionId ? { ...c, sharing_on: !current } : c)
            );
        }
    };

    if (!loaded || connections.length === 0) return null;

    return (
        <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                연결된 트레이너
            </h3>
            <div className="space-y-3">
                {connections.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {(c.users as any)?.name || '트레이너'} 트레이너
                            </p>
                            <p className="text-xs text-muted-foreground">
                                기록 공유 {c.sharing_on ? '켜짐' : '꺼짐'}
                            </p>
                        </div>
                        <Switch
                            checked={c.sharing_on}
                            onCheckedChange={() => toggle(c.id, c.sharing_on)}
                        />
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
                공유를 끄면 트레이너가 내 운동 기록을 볼 수 없습니다.
            </p>
        </Card>
    );
}