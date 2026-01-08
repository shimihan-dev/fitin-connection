import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Save, Calendar, Target, Link, Ruler, Scale, Camera } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getUserProfile, updateUserProfile, uploadProfilePicture, User, ProfileUpdateData } from '../../../utils/auth';

interface MyPageProps {
    user: { name: string; email: string; id?: string };
    onBack: () => void;
}

export function MyPage({ user, onBack }: MyPageProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        height: '',
        weight: '',
        fitness_goal: '',
        sns_link: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (!user.id) {
            setLoading(false);
            return;
        }

        const { profile: fetchedProfile, error } = await getUserProfile(user.id);
        if (fetchedProfile) {
            setProfile(fetchedProfile);
            setFormData({
                name: fetchedProfile.name || '',
                height: fetchedProfile.height?.toString() || '',
                weight: fetchedProfile.weight?.toString() || '',
                fitness_goal: fetchedProfile.fitness_goal || '',
                sns_link: fetchedProfile.sns_link || '',
            });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
            fitness_goal: formData.fitness_goal || undefined,
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
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatUniversity = (code?: string) => {
        if (!code) return '-';
        const universityMap: Record<string, string> = {
            'utah': 'University of Utah (유타대학교)',
            'gmu': 'George Mason University (조지메이슨대학교)',
            'stony': 'Stony Brook University (스토니브룩대학교)',
            'ghent': 'Ghent University (겐트대학교)',
            'fit': 'Fashion Institute of Technology (패션공과대학교)',
        };
        return universityMap[code.toLowerCase()] || code;
    };

    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user.id) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setUploadingPicture(true);
        const { url, error } = await uploadProfilePicture(user.id, file);

        if (error) {
            alert(error);
        } else {
            alert('프로필 사진이 변경되었습니다!');
            loadProfile();
        }
        setUploadingPicture(false);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* 뒤로가기 버튼 */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={onBack} className="border-white/10">
                    뒤로가기
                </Button>
            </div>

            {/* Profile Hero Section */}
            <div className="flex flex-col items-center text-center py-6">
                <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/30 ring-4 ring-primary/20">
                        {profile?.profile_picture ? (
                            <img
                                src={profile.profile_picture}
                                alt="프로필"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon className="w-14 h-14 text-white" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPicture}
                        className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50 ring-2 ring-background"
                    >
                        {uploadingPicture ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4" />
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="hidden"
                    />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                    {profile?.name || user.name}
                </h1>
                <p className="text-muted-foreground">{profile?.email || user.email}</p>
                {profile?.fitness_goal && (
                    <p className="text-sm text-primary mt-2 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {profile.fitness_goal}
                    </p>
                )}
            </div>

            {/* 가입 정보 카드 */}
            <Card className="p-5 bg-gradient-to-r from-primary/10 to-violet-600/10 border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">가입 정보</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">이메일</p>
                        <p className="font-medium text-foreground">{profile?.email || user.email}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">가입일</p>
                        <p className="font-medium text-foreground">{formatDate(profile?.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">대학교</p>
                        <p className="font-medium text-foreground">{formatUniversity(profile?.university)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">성별</p>
                        <p className="font-medium text-foreground">
                            {profile?.gender === 'male' ? '남성' : profile?.gender === 'female' ? '여성' : profile?.gender || '-'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* 프로필 수정 폼 */}
            <Card className="p-5 bg-card/50 border-white/10">
                <h3 className="font-semibold text-foreground mb-4">프로필 수정</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                            <UserIcon className="w-4 h-4" />
                            이름
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="이름을 입력하세요"
                            disabled={saving}
                            className="bg-background/50 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center gap-2 text-foreground">
                                <Ruler className="w-4 h-4" />
                                키 (cm)
                            </Label>
                            <Input
                                id="height"
                                name="height"
                                type="number"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="170"
                                disabled={saving}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center gap-2 text-foreground">
                                <Scale className="w-4 h-4" />
                                체중 (kg)
                            </Label>
                            <Input
                                id="weight"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="70"
                                disabled={saving}
                                className="bg-background/50 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fitness_goal" className="flex items-center gap-2 text-foreground">
                            <Target className="w-4 h-4" />
                            운동 목표
                        </Label>
                        <Input
                            id="fitness_goal"
                            name="fitness_goal"
                            value={formData.fitness_goal}
                            onChange={handleChange}
                            placeholder="예: 체중 10kg 감량, 근육량 증가, 마라톤 완주..."
                            disabled={saving}
                            className="bg-background/50 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sns_link" className="flex items-center gap-2 text-foreground">
                            <Link className="w-4 h-4" />
                            SNS 링크
                        </Label>
                        <Input
                            id="sns_link"
                            name="sns_link"
                            value={formData.sns_link}
                            onChange={handleChange}
                            placeholder="https://instagram.com/username"
                            disabled={saving}
                            className="bg-background/50 border-white/10"
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-primary/70 to-violet-600/70 hover:from-primary/80 hover:to-violet-700/80"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? '저장 중...' : '프로필 저장'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
