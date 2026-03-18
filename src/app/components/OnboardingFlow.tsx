import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, ArrowRight, ArrowLeft, User, Footprints, Target, Flame, UserPlus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { signUp, isValidEmail, User as AuthUser } from '../../../utils/auth';
import { getCalorieRecommendation, ActivityLevel } from '../../../utils/bmrCalculator';
import { useLanguage } from '../contexts/LanguageContext';

type OnboardingStep = 'welcome' | 'gender' | 'bodyFatGoal' | 'calorieInfo' | 'signup' | 'exercisePreference' | 'complete';

interface OnboardingData {
    gender: 'male' | 'female' | null;
    bodyFatGoal: number | null;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    university: string;
    height: number | null;
    weight: number | null;
    age: number | null;
    preferredExercise: 'running' | 'gym' | 'crossfit' | null;
}

interface OnboardingFlowProps {
    onComplete: (user: AuthUser) => void;
    onLoginClick: () => void;
}

export function OnboardingFlow({ onComplete, onLoginClick }: OnboardingFlowProps) {
    const { t, language } = useLanguage();
    const [step, setStep] = useState<OnboardingStep>('welcome');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        gender: null,
        bodyFatGoal: null,
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        university: '',
        height: null,
        weight: null,
        age: null,
        preferredExercise: null,
    });
    const [calorieResult, setCalorieResult] = useState<{
        bmr: number;
        tdee: number;
        targetCalories: number;
        message: string;
    } | null>(null);

    const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const goNext = () => {
        const steps: OnboardingStep[] = ['welcome', 'gender', 'bodyFatGoal', 'calorieInfo', 'signup', 'exercisePreference', 'complete'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1]);
        }
    };

    const goBack = () => {
        const steps: OnboardingStep[] = ['welcome', 'gender', 'bodyFatGoal', 'calorieInfo', 'signup', 'exercisePreference', 'complete'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) {
            setStep(steps[currentIndex - 1]);
        }
    };

    const handleSignup = async () => {
        if (data.password !== data.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (data.password.length < 8) {
            alert('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }
        if (!isValidEmail(data.email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }

        setLoading(true);
        try {
            const { user, error } = await signUp({
                email: data.email,
                password: data.password,
                name: data.name,
                university: data.university,
                gender: data.gender || undefined,
                // 추가 필드는 프로필 업데이트로 저장
            });

            if (error) {
                alert(error);
                setLoading(false);
                return;
            }

            // BMR 계산
            if (data.height && data.weight && data.age && data.gender && data.bodyFatGoal) {
                const result = getCalorieRecommendation(
                    data.weight,
                    data.height,
                    data.age,
                    data.gender,
                    data.bodyFatGoal,
                    'moderate' as ActivityLevel
                );
                setCalorieResult(result);
            }

            goNext(); // exercisePreference로 이동
        } catch (err) {
            console.error('Signup error:', err);
            alert('회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        // TODO: 운동 선호도와 추가 정보를 Supabase에 저장
        // 현재는 로컬 스토리지의 사용자 정보 업데이트
        const storedUser = localStorage.getItem('igc_fitness_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const updatedUser = {
                ...user,
                height: data.height,
                weight: data.weight,
                age: data.age,
                bodyFatGoal: data.bodyFatGoal,
                preferredExercise: data.preferredExercise,
            };
            localStorage.setItem('igc_fitness_user', JSON.stringify(updatedUser));
            onComplete(updatedUser);
        }
    };

    // 애니메이션 variants
    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {/* Welcome Screen */}
                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md"
                    >
                        <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-border">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                                <Dumbbell className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2 text-foreground whitespace-pre-line">
                                {t('onboarding.welcome_title')}
                            </h1>
                            <p className="text-muted-foreground mb-8">
                                {t('onboarding.welcome_sub')}
                            </p>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setStep('gender')}
                                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                                >
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    {t('common.signup')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onLoginClick}
                                    className="w-full py-6 text-lg border-border hover:bg-muted/50"
                                >
                                    {t('auth.already_have_account')}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Gender Selection */}
                {step === 'gender' && (
                    <motion.div
                        key="gender"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border">
                            <button onClick={goBack} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('common.back')}
                            </button>
                            <h2 className="text-2xl font-bold text-center mb-2">{t('onboarding.select_gender')}</h2>
                            <p className="text-muted-foreground text-center mb-8">{t('onboarding.select_gender_sub')}</p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'male' as const, label: t('onboarding.gender_male'), icon: '👨', color: 'from-blue-500 to-blue-600' },
                                    { value: 'female' as const, label: t('onboarding.gender_female'), icon: '👩', color: 'from-pink-500 to-rose-500' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateData('gender', option.value);
                                            goNext();
                                        }}
                                        className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 hover:scale-105 ${data.gender === option.value
                                            ? `border-primary bg-gradient-to-br ${option.color} text-white`
                                            : 'border-border hover:border-white/30 bg-card/50'
                                            }`}
                                    >
                                        <span className="text-5xl">{option.icon}</span>
                                        <span className="font-semibold text-lg">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Body Fat Goal Selection */}
                {step === 'bodyFatGoal' && (
                    <motion.div
                        key="bodyFatGoal"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border">
                            <button onClick={goBack} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('common.back')}
                            </button>
                            <h2 className="text-2xl font-bold text-center mb-2">{t('onboarding.select_goal')}</h2>
                            <p className="text-muted-foreground text-center mb-8">{t('onboarding.select_goal_sub')}</p>

                            <div className="grid grid-cols-2 gap-3">
                                {(data.gender === 'male'
                                    ? [10, 15, 20, 25, 30]
                                    : [15, 20, 25, 30, 35]
                                ).map((fat) => (
                                    <button
                                        key={fat}
                                        onClick={() => {
                                            updateData('bodyFatGoal', fat);
                                            goNext();
                                        }}
                                        className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${data.bodyFatGoal === fat
                                            ? 'border-primary bg-primary/20 text-primary'
                                            : 'border-border hover:border-white/30 bg-card/50'
                                            }`}
                                    >
                                        <Target className="w-8 h-8" />
                                        <span className="text-2xl font-bold">{fat}%</span>
                                        <span className="text-xs text-muted-foreground">
                                            {data.gender === 'male'
                                                ? fat <= 12 ? '컷팅' : fat <= 18 ? '피트니스' : fat <= 22 ? '일반' : '벌크업'
                                                : fat <= 20 ? '컷팅' : fat <= 25 ? '피트니스' : fat <= 28 ? '일반' : '벌크업'
                                            }
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Calorie Info */}
                {step === 'calorieInfo' && (
                    <motion.div
                        key="calorieInfo"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md"
                    >
                        <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-border">
                            <button onClick={goBack} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('common.back')}
                            </button>

                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6">
                                <Flame className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-xl font-bold mb-4">{t('onboarding.calorie_guide')}</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                                {t('onboarding.calorie_guide_sub').replace('{fat}', data.bodyFatGoal?.toString() || '')}
                            </p>

                            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-2">BMR 계산에 다음 정보가 필요해요:</p>
                                <ul className="space-y-1 text-left">
                                    <li>• 키 (cm)</li>
                                    <li>• 몸무게 (kg)</li>
                                    <li>• 나이</li>
                                </ul>
                            </div>

                            <Button
                                onClick={goNext}
                                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                                {t('common.signup')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Card>
                    </motion.div>
                )}

                {/* Signup Form */}
                {step === 'signup' && (
                    <motion.div
                        key="signup"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border max-h-[85vh] overflow-y-auto">
                            <button onClick={goBack} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('common.back')}
                            </button>

                            <h2 className="text-2xl font-bold text-center mb-6">{t('common.signup')}</h2>

                            <div className="space-y-4">
                                {/* 기본 정보 */}
                                <div className="space-y-2">
                                    <Label>{t('auth.name')} <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="John Doe"
                                        value={data.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        className="bg-muted/50 border-border"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>이메일 <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={data.email}
                                        onChange={(e) => updateData('email', e.target.value)}
                                        className="bg-muted/50 border-border"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('auth.university')} <span className="text-red-500">*</span></Label>
                                    <select
                                        value={data.university}
                                        onChange={(e) => updateData('university', e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        required
                                    >
                                        <option value="" className="bg-background">{language === 'ko' ? '선택하세요' : 'Select'}</option>
                                        <option value="utah" className="bg-background">University of Utah</option>
                                        <option value="stonybrook" className="bg-background">Stony Brook University</option>
                                        <option value="fit" className="bg-background">Fashion Institute of Technology (FIT)</option>
                                        <option value="ghent" className="bg-background">Ghent University</option>
                                        <option value="gmu" className="bg-background">George Mason University</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('auth.password')} <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="password"
                                            placeholder="Min. 8 chars"
                                            value={data.password}
                                            onChange={(e) => updateData('password', e.target.value)}
                                            className="bg-muted/50 border-border"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('auth.password_confirm')} <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="password"
                                            placeholder={t('auth.password_confirm')}
                                            value={data.passwordConfirm}
                                            onChange={(e) => updateData('passwordConfirm', e.target.value)}
                                            className="bg-muted/50 border-border"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* 신체 정보 */}
                                <div className="pt-4 border-t border-border">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {t('onboarding.body_info')}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-2">
                                            <Label>{t('onboarding.height')} <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                placeholder="170"
                                                value={data.height || ''}
                                                onChange={(e) => updateData('height', e.target.value ? Number(e.target.value) : null)}
                                                className="bg-muted/50 border-border"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('onboarding.weight')} <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                placeholder="70"
                                                value={data.weight || ''}
                                                onChange={(e) => updateData('weight', e.target.value ? Number(e.target.value) : null)}
                                                className="bg-muted/50 border-border"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('onboarding.age')} <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                placeholder="22"
                                                value={data.age || ''}
                                                onChange={(e) => updateData('age', e.target.value ? Number(e.target.value) : null)}
                                                className="bg-muted/50 border-border"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 약관 동의 */}
                                <div className="pt-4 border-t border-border">
                                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <input type="checkbox" required className="mt-1" />
                                        <span><span className="text-red-500">*</span> {t('onboarding.terms_agree')}</span>
                                    </label>
                                </div>

                                <Button
                                    onClick={handleSignup}
                                    disabled={loading || !data.name || !data.email || !data.password || !data.university || !data.height || !data.weight || !data.age}
                                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                                >
                                    {loading ? t('common.loading') : t('common.signup')}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Exercise Preference */}
                {step === 'exercisePreference' && (
                    <motion.div
                        key="exercisePreference"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border">
                            {/* 칼로리 결과 표시 */}
                            {calorieResult && (
                                <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl p-4 mb-6 border border-primary/30">
                                    <h3 className="font-bold text-lg text-center mb-3">🎉 맞춤 칼로리 가이드</h3>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-3xl font-bold text-primary">{calorieResult.bmr}</p>
                                            <p className="text-xs text-muted-foreground">기초대사량 (kcal)</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-emerald-400">{calorieResult.targetCalories}</p>
                                            <p className="text-xs text-muted-foreground">일일 권장 섭취량 (kcal)</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-center mt-3 text-muted-foreground">{calorieResult.message}</p>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-center mb-2">{t('onboarding.select_exercise')}</h2>
                            <p className="text-muted-foreground text-center mb-8">{t('onboarding.select_exercise_sub')}</p>

                            <div className="space-y-3">
                                {[
                                    { value: 'running' as const, label: t('onboarding.exercise_running'), icon: <Footprints className="w-8 h-8" />, desc: t('onboarding.exercise_running_desc'), color: 'from-emerald-500 to-teal-500' },
                                    { value: 'gym' as const, label: t('onboarding.exercise_gym'), icon: <Dumbbell className="w-8 h-8" />, desc: t('onboarding.exercise_gym_desc'), color: 'from-blue-500 to-indigo-500' },
                                    { value: 'crossfit' as const, label: t('onboarding.exercise_crossfit'), icon: <Flame className="w-8 h-8" />, desc: t('onboarding.exercise_crossfit_desc'), color: 'from-orange-500 to-red-500' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateData('preferredExercise', option.value);
                                        }}
                                        className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 hover:scale-[1.02] ${data.preferredExercise === option.value
                                            ? `border-primary bg-gradient-to-r ${option.color} text-white`
                                            : 'border-border hover:border-white/30 bg-card/50'
                                            }`}
                                    >
                                        {option.icon}
                                        <div className="text-left">
                                            <p className="font-bold text-lg">{option.label}</p>
                                            <p className={`text-sm ${data.preferredExercise === option.value ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                                {option.desc}
                                            </p>
                                        </div>
                                        {data.preferredExercise === option.value && (
                                            <Check className="w-6 h-6 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={handleComplete}
                                disabled={!data.preferredExercise}
                                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 mt-6"
                            >
                                시작하기
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
