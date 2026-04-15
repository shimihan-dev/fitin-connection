import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Footprints,
  ShieldCheck,
  Target,
  User,
  UserPlus,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { signUp, isValidEmail, User as AuthUser, updateUserProfile } from '../../../utils/auth';
import { getCalorieRecommendation, ActivityLevel } from '../../../utils/bmrCalculator';
import { useLanguage } from '../contexts/LanguageContext';

type OnboardingStep =
  | 'welcome'
  | 'gender'
  | 'bodyFatGoal'
  | 'calorieInfo'
  | 'signup'
  | 'exercisePreference';

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

const steps: OnboardingStep[] = [
  'welcome',
  'gender',
  'bodyFatGoal',
  'calorieInfo',
  'signup',
  'exercisePreference',
];

const universityOptions = [
  { value: 'utah', label: 'University of Utah' },
  { value: 'stonybrook', label: 'Stony Brook University' },
  { value: 'fit', label: 'Fashion Institute of Technology (FIT)' },
  { value: 'ghent', label: 'Ghent University' },
  { value: 'gmu', label: 'George Mason University' },
];

const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

function StepContainer({
  children,
  step,
  title,
  description,
  onBack,
  currentIndex,
}: {
  children: React.ReactNode;
  step: OnboardingStep;
  title: string;
  description: string;
  onBack?: () => void;
  currentIndex: number;
}) {
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={transition}
      className="w-full"
    >
      <div className="mx-auto max-w-5xl">
        <div className="apple-shell p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(20,99,255,0.20),transparent_60%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_52%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/70 text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <span className="apple-chip">Step {currentIndex + 1}</span>
              </div>

              <div className="w-full max-w-[220px] rounded-full bg-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#1463ff,#5ab6ff)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 max-w-2xl">
              <p className="apple-kicker">Fitin Auth</p>
              <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.8rem)] font-black leading-[0.96] tracking-[-0.07em] text-foreground">
                {title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function OnboardingFlow({ onComplete, onLoginClick }: OnboardingFlowProps) {
  const { t, language } = useLanguage();
  const isKorean = language === 'ko';
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

  const currentIndex = steps.indexOf(step);
  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const goNext = () => {
    const nextStep = steps[currentIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const goBack = () => {
    const prevStep = steps[currentIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const bodyFatOptions = data.gender === 'male' ? [10, 15, 20, 25, 30] : [15, 20, 25, 30, 35];
  const bodyFatLabels = isKorean
    ? {
        lean: '컷팅',
        fit: '피트니스',
        balanced: '밸런스',
        build: '벌크업',
      }
    : {
        lean: 'Lean',
        fit: 'Fit',
        balanced: 'Balanced',
        build: 'Build',
      };

  const welcomeContent = useMemo(
    () =>
      isKorean
        ? {
            hero: '당신의 루틴을\n더 부드럽고 선명하게.',
            signUp: 'Sign Up',
            login: '이미 계정이 있어요',
            points: [
              { title: '맞춤 루틴' },
              { title: '빠른 체크인' },
            ],
          }
        : {
            hero: 'Your routine,\nsmoother and clearer.',
            signUp: 'Sign Up',
            login: 'Already have an account?',
            points: [
              { title: 'Tailored plans' },
              { title: 'Fast check-ins' },
            ],
          },
    [isKorean],
  );

  const handleSignup = async () => {
    if (data.password !== data.passwordConfirm) {
      alert(t('auth.passwords_dont_match'));
      return;
    }
    if (data.password.length < 8) {
      alert(isKorean ? '비밀번호는 최소 8자 이상이어야 합니다.' : 'Password must be at least 8 characters.');
      return;
    }
    if (!isValidEmail(data.email)) {
      alert(isKorean ? '올바른 이메일 형식이 아닙니다.' : 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        university: data.university,
        gender: data.gender || undefined,
      });

      if (error) {
        alert(error);
        return;
      }

      if (data.height && data.weight && data.age && data.gender && data.bodyFatGoal) {
        const result = getCalorieRecommendation(
          data.weight,
          data.height,
          data.age,
          data.gender,
          data.bodyFatGoal,
          'moderate' as ActivityLevel,
        );
        setCalorieResult(result);
      }

      setStep('exercisePreference');
    } catch (error) {
      console.error('Signup error:', error);
      alert(isKorean ? '회원가입 중 오류가 발생했습니다.' : 'Something went wrong during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const storedUser = localStorage.getItem('igc_fitness_user');

    let user = null;
    try {
      if (storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to parse stored user', error);
    }

    if (!user || !user.email) {
      user = {
        name: data.name,
        email: data.email,
        university: data.university,
        gender: data.gender,
      };
    }

    const updatedUser = {
      ...user,
      height: data.height,
      weight: data.weight,
      age: data.age,
      bodyFatGoal: data.bodyFatGoal,
      preferredExercise: data.preferredExercise,
    };

    if (updatedUser.id) {
      await updateUserProfile(updatedUser.id, {
        height: data.height || undefined,
        weight: data.weight || undefined,
        age: data.age || undefined,
        body_fat_goal: data.bodyFatGoal || undefined,
        preferred_exercise: data.preferredExercise || undefined,
      });
    }

    localStorage.setItem('igc_fitness_user', JSON.stringify(updatedUser));
    onComplete(updatedUser);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute left-[-8%] top-[-3%] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-6%] h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 apple-grid-pattern opacity-35" />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={transition}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="apple-shell flex min-h-[640px] flex-col justify-between p-7 sm:p-9 lg:p-10">
                <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(20,99,255,0.24),transparent_56%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_50%)]" />
                <div className="relative">
                  <span className="apple-chip">
                    <Dumbbell className="h-3.5 w-3.5" />
                    Premium Fitness Experience
                  </span>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#1a6bff,#0f58e8)] text-white shadow-[0_18px_36px_rgba(20,99,255,0.28)]">
                      <Dumbbell className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Fitin</p>
                    </div>
                  </div>

                  <h1 className="mt-12 whitespace-pre-line text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.09em] text-foreground">
                    {welcomeContent.hero}
                  </h1>
                </div>

                <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
                  {welcomeContent.points.map((point, index) => (
                    <div key={point.title} className="apple-soft-card px-5 py-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                        {index === 0 ? <Target className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </span>
                      <h3 className="mt-4 text-base font-bold tracking-[-0.04em] text-foreground sm:text-[1.05rem]">{point.title}</h3>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:self-start">
                <div className="apple-shell p-7 sm:p-9">
                  <p className="apple-kicker">Start</p>
                  <h2 className="mt-3 text-[2.15rem] font-black leading-[0.92] tracking-[-0.07em] text-foreground sm:text-[2.3rem]">
                    {isKorean ? '지금 바로 당신의 루틴을 시작해요.' : 'Start building your routine now.'}
                  </h2>

                  <div className="mt-8 space-y-3">
                    <Button
                      onClick={() => setStep('gender')}
                      className="apple-button h-14 w-full border-0 text-[0.95rem]"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {welcomeContent.signUp}
                    </Button>
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className="apple-ghost-button h-14 w-full"
                    >
                      {welcomeContent.login}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'gender' && (
          <StepContainer
            step="gender"
            title={t('onboarding.select_gender')}
            description={t('onboarding.select_gender_sub')}
            onBack={goBack}
            currentIndex={currentIndex}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { value: 'male' as const, label: t('onboarding.gender_male'), accent: 'from-blue-600 to-blue-500' },
                { value: 'female' as const, label: t('onboarding.gender_female'), accent: 'from-rose-500 to-orange-400' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateData('gender', option.value);
                    goNext();
                  }}
                  className="apple-soft-card group flex min-h-[220px] flex-col justify-between p-6 text-left transition-transform hover:-translate-y-1"
                >
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${option.accent} text-white shadow-[0_16px_32px_rgba(15,23,42,0.12)]`}>
                    <User className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-2xl font-black tracking-[-0.05em] text-foreground">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {option.value === 'male'
                        ? isKorean ? '근력과 체성분 밸런스 기준 추천' : 'Recommendations tuned for strength and body composition'
                        : isKorean ? '체지방률과 루틴 밸런스 기준 추천' : 'Recommendations tuned for body fat goals and flow'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </StepContainer>
        )}

        {step === 'bodyFatGoal' && (
          <StepContainer
            step="bodyFatGoal"
            title={t('onboarding.select_goal')}
            description={t('onboarding.select_goal_sub')}
            onBack={goBack}
            currentIndex={currentIndex}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {bodyFatOptions.map((fat) => {
                const tag =
                  data.gender === 'male'
                    ? fat <= 12
                      ? bodyFatLabels.lean
                      : fat <= 18
                        ? bodyFatLabels.fit
                        : fat <= 22
                          ? bodyFatLabels.balanced
                          : bodyFatLabels.build
                    : fat <= 20
                      ? bodyFatLabels.lean
                      : fat <= 25
                        ? bodyFatLabels.fit
                        : fat <= 28
                          ? bodyFatLabels.balanced
                          : bodyFatLabels.build;

                return (
                  <button
                    key={fat}
                    type="button"
                    onClick={() => {
                      updateData('bodyFatGoal', fat);
                      goNext();
                    }}
                    className="apple-soft-card flex min-h-[180px] flex-col justify-between p-5 text-left transition-transform hover:-translate-y-1"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                      <Target className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-4xl font-black tracking-[-0.08em] text-foreground">{fat}%</p>
                      <p className="mt-2 text-sm font-semibold text-primary">{tag}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {step === 'calorieInfo' && (
          <StepContainer
            step="calorieInfo"
            title={t('onboarding.calorie_guide')}
            description={t('onboarding.calorie_guide_sub').replace('{fat}', data.bodyFatGoal?.toString() || '')}
            onBack={goBack}
            currentIndex={currentIndex}
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
              <div className="apple-soft-card p-6 sm:p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ff925a,#ff6d3d)] text-white shadow-[0_18px_34px_rgba(255,131,79,0.22)]">
                  <Flame className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-3xl font-black tracking-[-0.06em] text-foreground">
                  {isKorean ? '맞춤 칼로리 가이드를 준비할게요.' : 'We will prepare a tailored calorie guide.'}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {isKorean
                    ? '키, 몸무게, 나이를 바탕으로 BMR과 일일 권장 섭취량을 계산해 운동 선호도와 함께 마무리합니다.'
                    : 'We use your height, weight, and age to estimate your BMR and daily intake before your final training preference step.'}
                </p>
              </div>

              <div className="apple-soft-card p-6 sm:p-7">
                <p className="apple-kicker">Needed for BMR</p>
                <div className="mt-6 space-y-4">
                  {[
                    { label: t('onboarding.height'), desc: isKorean ? '센티미터 기준' : 'In centimeters' },
                    { label: t('onboarding.weight'), desc: isKorean ? '킬로그램 기준' : 'In kilograms' },
                    { label: t('onboarding.age'), desc: isKorean ? '만 나이 기준' : 'Your current age' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-[20px] bg-slate-50 px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
                <Button onClick={goNext} className="apple-button mt-8 h-14 w-full border-0 text-base">
                  {t('common.signup')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </StepContainer>
        )}

        {step === 'signup' && (
          <StepContainer
            step="signup"
            title={isKorean ? '기본 정보를 입력해 주세요.' : 'Tell us the essentials.'}
            description={isKorean ? '계정 생성을 위해 필요한 기본 정보를 입력해 주세요.' : 'Enter the basic information needed to create your account.'}
            onBack={goBack}
            currentIndex={currentIndex}
          >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <div className="apple-soft-card p-6">
                  <p className="apple-kicker">Profile setup</p>
                  <h3 className="mt-4 text-3xl font-black tracking-[-0.06em] text-foreground">
                    {isKorean ? '당신에게 맞는 루틴을 만드는 중이에요.' : 'We are shaping a plan around you.'}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {isKorean
                      ? '회원가입 후에는 목표와 선호 운동을 기준으로 다음 단계를 진행합니다.'
                      : 'After sign-up, the next step uses your goal and preferred exercise.'}
                  </p>
                </div>

                <div className="apple-soft-card p-6">
                  <p className="apple-kicker">Selected target</p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-5xl font-black tracking-[-0.08em] text-foreground">{data.bodyFatGoal || '--'}%</span>
                    <span className="pb-2 text-lg text-muted-foreground">{isKorean ? 'body fat goal' : 'body fat goal'}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {isKorean ? '입력한 목표를 기준으로 다음 단계가 설정됩니다.' : 'The next step is set from this target.'}
                  </p>
                </div>
              </div>

              <div className="apple-soft-card p-6 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.name')}</Label>
                    <Input
                      value={data.name}
                      onChange={(event) => updateData('name', event.target.value)}
                      placeholder="Sejin Kim"
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.email')}</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(event) => updateData('email', event.target.value)}
                      placeholder="name@example.com"
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.password')}</Label>
                    <Input
                      type="password"
                      value={data.password}
                      onChange={(event) => updateData('password', event.target.value)}
                      placeholder="Min. 8 characters"
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.password_confirm')}</Label>
                    <Input
                      type="password"
                      value={data.passwordConfirm}
                      onChange={(event) => updateData('passwordConfirm', event.target.value)}
                      placeholder={t('auth.password_confirm')}
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.university')}</Label>
                    <select
                      value={data.university}
                      onChange={(event) => updateData('university', event.target.value)}
                      className="apple-input w-full border-0 text-foreground"
                    >
                      <option value="">{isKorean ? '선택하세요' : 'Select your campus'}</option>
                      {universityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('onboarding.height')}</Label>
                    <Input
                      type="number"
                      value={data.height || ''}
                      onChange={(event) => updateData('height', event.target.value ? Number(event.target.value) : null)}
                      placeholder="170"
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('onboarding.weight')}</Label>
                    <Input
                      type="number"
                      value={data.weight || ''}
                      onChange={(event) => updateData('weight', event.target.value ? Number(event.target.value) : null)}
                      placeholder="65"
                      className="apple-input border-0"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('onboarding.age')}</Label>
                    <Input
                      type="number"
                      value={data.age || ''}
                      onChange={(event) => updateData('age', event.target.value ? Number(event.target.value) : null)}
                      placeholder="22"
                      className="apple-input border-0"
                    />
                  </div>
                </div>

                <label className="mt-6 flex items-start gap-3 rounded-[22px] bg-slate-50 px-4 py-4 text-sm leading-6 text-muted-foreground">
                  <input type="checkbox" required className="mt-1 h-4 w-4 rounded" />
                  <span>{t('onboarding.terms_agree')}</span>
                </label>

                <Button
                  onClick={handleSignup}
                  disabled={
                    loading ||
                    !data.name ||
                    !data.email ||
                    !data.password ||
                    !data.passwordConfirm ||
                    !data.university ||
                    !data.height ||
                    !data.weight ||
                    !data.age
                  }
                  className="apple-button mt-6 h-14 w-full border-0 text-base disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? t('common.loading') : t('common.signup')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </StepContainer>
        )}

        {step === 'exercisePreference' && (
          <StepContainer
            step="exercisePreference"
            title={t('onboarding.select_exercise')}
            description={t('onboarding.select_exercise_sub')}
            onBack={goBack}
            currentIndex={currentIndex}
          >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                {calorieResult && (
                  <div className="apple-soft-card p-6 sm:p-7">
                    <p className="apple-kicker">Calorie Guide</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[22px] bg-slate-50 px-4 py-4">
                        <p className="text-sm text-muted-foreground">BMR</p>
                        <p className="mt-2 text-4xl font-black tracking-[-0.08em] text-foreground">{calorieResult.bmr}</p>
                      </div>
                      <div className="rounded-[22px] bg-blue-50 px-4 py-4">
                        <p className="text-sm text-primary">Target kcal</p>
                        <p className="mt-2 text-4xl font-black tracking-[-0.08em] text-primary">{calorieResult.targetCalories}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{calorieResult.message}</p>
                  </div>
                )}

                <div className="apple-soft-card p-6">
                  <p className="apple-kicker">Summary</p>
                  <p className="mt-4 text-3xl font-black tracking-[-0.06em] text-foreground">
                    {isKorean ? '이제 어떤 방식으로 움직일지 선택해 주세요.' : 'Choose how you want to move next.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    value: 'running' as const,
                    label: t('onboarding.exercise_running'),
                    desc: t('onboarding.exercise_running_desc'),
                    icon: Footprints,
                    accent: 'from-emerald-500 to-teal-500',
                  },
                  {
                    value: 'gym' as const,
                    label: t('onboarding.exercise_gym'),
                    desc: t('onboarding.exercise_gym_desc'),
                    icon: Dumbbell,
                    accent: 'from-blue-600 to-indigo-500',
                  },
                  {
                    value: 'crossfit' as const,
                    label: t('onboarding.exercise_crossfit'),
                    desc: t('onboarding.exercise_crossfit_desc'),
                    icon: Flame,
                    accent: 'from-orange-500 to-rose-500',
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const active = data.preferredExercise === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateData('preferredExercise', option.value)}
                      className={`apple-soft-card flex w-full items-center gap-4 p-5 text-left transition-all ${
                        active ? 'ring-2 ring-primary/20 shadow-[0_18px_44px_rgba(20,99,255,0.12)]' : ''
                      }`}
                    >
                      <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${option.accent} text-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="flex-1">
                        <p className="text-xl font-bold tracking-[-0.04em] text-foreground">{option.label}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{option.desc}</p>
                      </div>
                      {active && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-primary">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}

                <Button
                  onClick={handleComplete}
                  disabled={!data.preferredExercise}
                  className="apple-button h-14 w-full border-0 text-base disabled:translate-y-0 disabled:opacity-60"
                >
                  {isKorean ? '시작하기' : 'Start Fitin'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </StepContainer>
        )}
      </AnimatePresence>
    </div>
  );
}
