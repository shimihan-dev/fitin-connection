import { ArrowRight, Dumbbell, Calendar, Heart, TrendingUp, Users } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-4 animate-bounce">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              IGC 학생들을 위한 특별한 혜택
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
            건강한 대학생활의<br />
            <span className="text-blue-600">새로운 시작</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fitin Connection과 함께 체계적인 운동, 건강한 식단, 
            그리고 함께 성장하는 커뮤니티를 경험해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              size="lg" 
              onClick={onStart}
              className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              지금 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            모든 서비스가 <span className="text-green-600">준비되어 있습니다</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
                title: "맞춤형 루틴",
                desc: "나의 목표와 체력에 딱 맞는 운동 계획을 제공합니다."
              },
              {
                icon: <Calendar className="w-8 h-8 text-green-500" />,
                title: "스마트 플래너",
                desc: "운동 일정과 컨디션을 체계적으로 관리하세요."
              },
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: "라이프스타일",
                desc: "건강한 식단부터 수면 관리까지 케어해드립니다."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                title: "성장 기록",
                desc: "눈뒈 보이는 변화를 그래프로 확인해보세요."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-4 p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-20 bg-gray-900 text-white px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            이미 많은 학생들이 함께하고 있어요
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            혼자 하는 운동이 힘들다면, IGC Fitness 커뮤니티와 함께하세요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "1,000+", label: "가입 회원" },
              { num: "500+", label: "공유된 루틴" },
              { num: "98%", label: "목표 달성률" },
              { num: "4.9/5", label: "사용자 평점" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-blue-400 mb-1">{stat.num}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
