import { ArrowRight, Dumbbell, Calendar, Heart, TrendingUp, Users, Utensils, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background Texture (Grid & Noise) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(to bottom, transparent 1px, transparent 1px)`,
          backgroundSize: '4rem 100%'
        }}>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center text-center z-10 min-h-[90vh] justify-center">
        {/* Decorative Blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6">
            <span className="text-xs font-medium tracking-wider text-primary uppercase">
              IGC Fitness Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
            Athflow<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Performance</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            건강한 대학생활의 새로운 기준.<br className="hidden md:block" />
            체계적인 데이터 분석으로 당신의 성장을 증명하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={onStart}
              className="text-base px-8 py-6 rounded-full font-semibold shadow-[0_0_20px_rgba(94,234,212,0.3)] hover:shadow-[0_0_30px_rgba(94,234,212,0.5)] transition-all"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 rounded-full border-white/10 hover:bg-white/5 hover:text-white transition-all"
            >
              기능 둘러보기
            </Button>
          </div>
        </div>

        {/* Hero Image / Preview Card */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl overflow-hidden aspect-video shadow-2xl">
            {/* Placeholder for Dashboard UI Screenshot */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-background">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                  <Smartphone className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm font-light tracking-widest uppercase">Dashboard Preview</p>
              </div>
            </div>

            {/* Mock UI Elements (Abstract) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative z-10 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              ALL-IN-ONE <span className="text-primary">SOLUTION</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              완벽한 퍼포먼스를 위한 5가지 핵심 기능
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Dumbbell className="w-8 h-8" />,
                title: "WORKOUT PLAN",
                desc: "목표와 체력 수준에 맞춘 AI 기반 맞춤형 트레이닝 루틴을 제공합니다."
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "SMART SCHEDULE",
                desc: "강의 시간표와 연동 가능한 지능형 운동 스케줄링 시스템."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "DATA ANALYTICS",
                desc: "1RM 추이, 볼륨량 등 운동 데이터를 시각화하여 성장을 분석합니다."
              },
              {
                icon: <Utensils className="w-8 h-8" />,
                title: "NUTRITION",
                desc: "탄단지 비율과 칼로리를 계산하여 완벽한 식단 가이드를 제시합니다."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "LIFESTYLE",
                desc: "수면 패턴과 스트레스 지수를 관리하여 최상의 컨디션을 유지하세요."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "COMMUNITY",
                desc: "IGC 학생들과 함께 경쟁하고 동기부여를 얻는 소셜 피트니스."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-32 border-t border-white/5 relative bg-[#080a0f]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-muted-foreground mb-12">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Trusted by IGC Students</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { num: "1,000+", label: "Active Users" },
              { num: "500+", label: "Shared Routines" },
              { num: "98%", label: "Goal Achievement" },
              { num: "UNI", label: "5 Universities" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-white">{stat.num}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Utah', 'SUNY', 'FIT', 'Ghent', 'GMU'].map((uni) => (
              <div key={uni} className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white/40 font-bold">
                {uni}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background text-center">
        <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
          <Dumbbell className="w-6 h-6" />
          <span className="font-bold tracking-tight">IGC FITNESS</span>
        </div>
        <p className="text-muted-foreground/40 text-sm">
          © 2026 Fitin Connection. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
