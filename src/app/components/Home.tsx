import { motion } from 'motion/react';
import { Dumbbell, Calendar, Heart, TrendingUp, Sparkles, Users, Utensils, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet';

interface HomeProps {
  onNavigate: (page: Page) => void;
  user: { name: string; email: string } | null;
}

export function Home({ onNavigate, user }: HomeProps) {
  const features = [
    {
      icon: Dumbbell,
      title: '초보자 운동 가이드',
      description: '진입장벽 낮은 운동부터 시작하세요',
      page: 'workout' as Page,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/20',
    },
    {
      icon: Calendar,
      title: '맞춤 루틴',
      description: '나만의 운동 스케줄 만들기',
      page: 'routine' as Page,
      color: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/20',
    },
    {
      icon: TrendingUp,
      title: '진척도 추적',
      description: '내 성장을 한눈에 확인하기',
      page: 'progress' as Page,
      color: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-500/20',
    },
    {
      icon: Utensils,
      title: '식단 & 라이프',
      description: '식단 기록, 영양, 수면, 멘탈 케어',
      page: 'diet' as Page,
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Welcome Message for Logged In Users */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">환영합니다, {user.name}님!</h2>
              <p className="text-sm text-muted-foreground">오늘도 건강한 하루를 만들어가세요 💪</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Landing Page Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 py-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase">
            IGC<br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary"> Fitin_Connection</span>
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          건강한 대학생활을 위한 모든 것<br />
          <span className="text-foreground/80">운동 초보자도 쉽게 시작할 수 있는 맞춤형 가이드</span>
        </p>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">IGC 글로벌캠퍼스 5개 대학 전용</span>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1612073584622-335da5fadd8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHdvcmtvdXQlMjBneW18ZW58MXx8fHwxNzY2NTU3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="College students working out"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">당신의 건강한 변화, 지금 시작하세요</h2>
            <p className="text-sm text-muted-foreground">2030세대를 위한 피트니스 라이프스타일 플랫폼</p>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards - Dark Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card
                className="p-5 cursor-pointer bg-card/50 border-white/10 hover:border-primary/50 hover:bg-card/80 transition-all group backdrop-blur-sm"
                onClick={() => onNavigate(feature.page)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats - Dark Theme */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gradient-to-r from-primary/20 via-blue-600/10 to-primary/20 border border-primary/30 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-center text-foreground font-semibold mb-6">시작하기 전에 알아두세요</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary mb-1">20분</p>
            <p className="text-sm text-muted-foreground">하루 최소 운동</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">3회</p>
            <p className="text-sm text-muted-foreground">주당 권장 횟수</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary mb-1">100%</p>
            <p className="text-sm text-muted-foreground">초보자 친화적</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}