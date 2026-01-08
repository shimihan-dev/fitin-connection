import { motion } from 'motion/react';
import { Heart, Apple, Moon, Brain, Droplets, Beef } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LifestyleTipsProps {
  user: { name: string; email: string } | null;
}

export function LifestyleTips({ user }: LifestyleTipsProps) {
  const nutritionTips = [
    {
      title: '균형 잡힌 식단',
      icon: Apple,
      tips: ['탄수화물, 단백질, 지방을 골고루 섭취하세요', '과일과 채소를 매일 5가지 이상 먹기', '가공식품보다는 자연식품 위주로', '끼니를 거르지 말고 규칙적으로'],
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: '단백질 섭취',
      icon: Beef,
      tips: ['체중 1kg당 1.2-1.6g의 단백질 권장', '닭가슴살, 계란, 두부, 그릭요거트 추천', '운동 후 30분 이내 단백질 섭취', '식물성 단백질도 함께 섭취하기'],
      color: 'from-amber-600 to-amber-700',
    },
    {
      title: '수분 섭취',
      icon: Droplets,
      tips: ['하루 2L 이상의 물 마시기', '운동 전후 충분한 수분 보충', '카페인 음료는 하루 1-2잔으로 제한', '아침에 일어나자마자 물 한 잔'],
      color: 'from-blue-500 to-blue-600',
    },
  ];

  const sleepTips = [
    {
      title: '수면 시간',
      icon: Moon,
      tips: ['매일 7-9시간 수면 확보', '같은 시간에 자고 일어나기', '주말에도 수면 패턴 유지', '낮잠은 20분 이내로 제한'],
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: '수면 환경',
      icon: Moon,
      tips: ['어둡고 시원한 환경 유지 (18-20°C)', '잠들기 1시간 전 전자기기 사용 중단', '편안한 침구와 베개 사용', '카페인은 오후 2시 이후 피하기'],
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const mentalTips = [
    {
      title: '스트레스 관리',
      icon: Brain,
      tips: ['명상이나 호흡 운동 5-10분', '취미 활동 시간 갖기', '친구들과 대화하며 감정 공유', '완벽보다는 진전에 집중하기'],
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: '건강한 마음가짐',
      icon: Heart,
      tips: ['자신에게 관대하게 대하기', '작은 성취도 축하하기', '비교하지 말고 자신의 페이스 유지', '실패는 배움의 기회로 받아들이기'],
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">건강한 라이프스타일</h1>
            <p className="text-sm text-muted-foreground">운동만큼 중요한 생활 습관</p>
          </div>
        </div>
      </motion.div>

      {/* Hero Images */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative rounded-xl overflow-hidden shadow-lg border border-white/10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1635545999375-057ee4013deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2RhJTIwbWVkaXRhdGlvbiUyMHdlbGxuZXNzfGVufDF8fHx8MTc2NjQ1NjYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Wellness"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-3">
            <p className="text-foreground text-sm font-medium">마음의 평화</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative rounded-xl overflow-hidden shadow-lg border border-white/10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606858274001-dd10efc5ce7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NjY1Mzg2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Healthy nutrition"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-3">
            <p className="text-foreground text-sm font-medium">건강한 식단</p>
          </div>
        </motion.div>
      </div>

      {/* Tips Tabs */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50">
          <TabsTrigger value="nutrition">영양</TabsTrigger>
          <TabsTrigger value="sleep">수면</TabsTrigger>
          <TabsTrigger value="mental">멘탈</TabsTrigger>
        </TabsList>

        {/* Nutrition Tips */}
        <TabsContent value="nutrition" className="space-y-4">
          {nutritionTips.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="p-5 bg-card/50 border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-emerald-400 flex-shrink-0 mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Sleep Tips */}
        <TabsContent value="sleep" className="space-y-4">
          {sleepTips.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="p-5 bg-card/50 border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary flex-shrink-0 mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Mental Tips */}
        <TabsContent value="mental" className="space-y-4">
          {mentalTips.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="p-5 bg-card/50 border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-pink-400 flex-shrink-0 mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Daily Routine Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Card className="p-6 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border-violet-500/30">
          <h3 className="mb-4 text-center font-semibold text-foreground">이상적인 하루 루틴</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">7:00</span><span className="text-foreground">기상, 물 한 잔</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">7:30</span><span className="text-foreground">아침 식사 + 단백질</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">12:00</span><span className="text-foreground">점심 식사 + 가벼운 산책</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">17:00</span><span className="text-foreground">운동 30-60분</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">19:00</span><span className="text-foreground">저녁 식사</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">22:00</span><span className="text-foreground">스트레칭 + 명상</span></div>
            <div className="flex items-center gap-3"><span className="w-16 text-muted-foreground">23:00</span><span className="text-foreground">취침</span></div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}