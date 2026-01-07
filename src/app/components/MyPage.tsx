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

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        // 이미지 타입 확인
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header with Profile Picture */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* 프로필 사진 */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                            {profile?.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt="프로필"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPicture}
                            className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
                        >
                            {uploadingPicture ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Camera className="w-3.5 h-3.5" />
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
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">마이페이지</h1>
                        <p className="text-sm text-gray-600">내 정보를 관리하세요</p>
                    </div>
                </div>
                <Button variant="outline" onClick={onBack}>
                    뒤로가기
                </Button>
            </div>

            {/* 가입 정보 카드 */}
            <Card className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">가입 정보</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">이메일</p>
                        <p className="font-medium text-gray-800">{profile?.email || user.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">가입일</p>
                        <p className="font-medium text-gray-800">{formatDate(profile?.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">대학교</p>
                        <p className="font-medium text-gray-800">{formatUniversity(profile?.university)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">성별</p>
                        <p className="font-medium text-gray-800">
                            {profile?.gender === 'male' ? '남성' : profile?.gender === 'female' ? '여성' : profile?.gender || '-'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* 프로필 수정 폼 */}
            <Card className="p-5">
                <h3 className="font-semibold text-gray-800 mb-4">프로필 수정</h3>

                <div className="space-y-4">
                    {/* 이름 */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
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
                        />
                    </div>

                    {/* 키/체중 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center gap-2">
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
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center gap-2">
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
                            />
                        </div>
                    </div>

                    {/* 운동 목표 */}
                    <div className="space-y-2">
                        <Label htmlFor="fitness_goal" className="flex items-center gap-2">
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
                        />
                    </div>

                    {/* SNS 링크 */}
                    <div className="space-y-2">
                        <Label htmlFor="sns_link" className="flex items-center gap-2">
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
                        />
                    </div>

                    {/* 저장 버튼 */}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? '저장 중...' : '프로필 저장'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
