import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Clock, Zap, ChevronRight, Play, CheckCircle2, Star, BookmarkPlus } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { supabase } from '../../../utils/supabase/client';

interface Exercise {
  name: string;
  duration: string;
  sets: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tips: string[];
}

interface WorkoutCategory {
  category: string;
  icon: string;
  exercises: Exercise[];
}

interface WorkoutGuideProps {
  user: { name: string; email: string } | null;
}

export function WorkoutGuide({ user }: WorkoutGuideProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load user's favorites and completed exercises from localStorage
      const storedFavorites = localStorage.getItem(`workout_favorites_${user.email}`);
      const storedCompleted = localStorage.getItem(`workout_completed_${user.email}`);
      
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      if (storedCompleted) {
        setCompleted(JSON.parse(storedCompleted));
      }
    }
    setLoading(false);
  }, [user]);

  const workoutData: WorkoutCategory[] = [
    {
      category: '상체 운동',
      icon: '💪',
      exercises: [
        {
          name: '푸쉬업 (무릎 대고)',
          duration: '10-15회',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '무릎을 바닥에 대고 시작하세요',
            '팔꿈치는 45도 각도로 구부립니다',
            '코어에 힘을 주고 허리가 꺾이지 않도록 주의',
          ],
        },
        {
          name: '플랭크',
          duration: '20-30초',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '팔꿈치는 어깨 바로 아래에 위치',
            '몸이 일직선이 되도록 유지',
            '엉덩이가 처지거나 올라가지 않도록 주의',
          ],
        },
        {
          name: '덤벨 숄더 프레스',
          duration: '12-15회',
          sets: '3세트',
          difficulty: 'intermediate',
          tips: [
            '가벼운 무게로 시작하세요',
            '코어를 단단히 유지',
            '천천히 올리고 천천히 내리기',
          ],
        },
      ],
    },
    {
      category: '하체 운동',
      icon: '🦵',
      exercises: [
        {
          name: '스쿼트',
          duration: '15-20회',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '발은 어깨 너비로 벌립니다',
            '무릎이 발끝을 넘어가지 않도록',
            '엉덩이를 뒤로 빼며 앉는 느낌',
          ],
        },
        {
          name: '런지',
          duration: '각 다리 10회',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '앞 무릎은 90도 유지',
            '균형을 잡기 어려우면 벽을 잡고 시작',
            '상체는 곧게 유지',
          ],
        },
        {
          name: '레그 레이즈',
          duration: '12-15회',
          sets: '3세트',
          difficulty: 'intermediate',
          tips: [
            '등을 바닥에 붙이고 누워서 시작',
            '복부에 힘을 주고 다리를 천천히 올립니다',
            '허리가 아프면 손을 엉덩이 밑에 두세요',
          ],
        },
      ],
    },
    {
      category: '코어 운동',
      icon: '🔥',
      exercises: [
        {
          name: '크런치',
          duration: '15-20회',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '손은 머리 뒤에 가볍게',
            '목을 당기지 말고 복부 힘으로만',
            '천천히 올라갔다 천천히 내려오기',
          ],
        },
        {
          name: '바이시클 크런치',
          duration: '각 측면 12회',
          sets: '3세트',
          difficulty: 'intermediate',
          tips: [
            '반대쪽 팔꿈치와 무릎을 맞닿게',
            '리듬감 있게 번갈아가며',
            '복부에 지속적으로 힘을 유지',
          ],
        },
        {
          name: '마운틴 클라이머',
          duration: '30초',
          sets: '3세트',
          difficulty: 'intermediate',
          tips: [
            '플랭크 자세에서 시작',
            '무릎을 가슴 쪽으로 빠르게',
            '엉덩이가 올라가지 않도록 주의',
          ],
        },
      ],
    },
    {
      category: '유산소 운동',
      icon: '🏃',
      exercises: [
        {
          name: '제자리 걷기',
          duration: '5-10분',
          sets: '1세트',
          difficulty: 'beginner',
          tips: [
            '가볍게 몸을 풀기에 좋습니다',
            '팔을 자연스럽게 흔들며',
            '호흡을 편안하게 유지',
          ],
        },
        {
          name: '점핑잭',
          duration: '30초',
          sets: '3세트',
          difficulty: 'beginner',
          tips: [
            '발을 벌리며 손을 위로',
            '리듬감 있게 반복',
            '무릎에 무리가 가지 않도록',
          ],
        },
        {
          name: '버피',
          duration: '10-15회',
          sets: '3세트',
          difficulty: 'advanced',
          tips: [
            '스쿼트-플랭크-점프 순서로',
            '자신의 페이스에 맞춰 진행',
            '전신 운동으로 효과적',
          ],
        },
      ],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return difficulty;
    }
  };

  const toggleFavorite = (exerciseName: string) => {
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }

    const isFavorite = favorites.includes(exerciseName);
    let newFavorites: string[];

    if (isFavorite) {
      newFavorites = favorites.filter((name) => name !== exerciseName);
    } else {
      newFavorites = [...favorites, exerciseName];
    }

    setFavorites(newFavorites);
    localStorage.setItem(`workout_favorites_${user.email}`, JSON.stringify(newFavorites));
  };

  const toggleCompleted = (exerciseName: string) => {
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }

    const isCompleted = completed.includes(exerciseName);
    let newCompleted: string[];

    if (isCompleted) {
      newCompleted = completed.filter((name) => name !== exerciseName);
    } else {
      newCompleted = [...completed, exerciseName];
    }

    setCompleted(newCompleted);
    localStorage.setItem(`workout_completed_${user.email}`, JSON.stringify(newCompleted));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">운동 가이드</h1>
            <p className="text-sm text-gray-600">
              {user ? `${user.name}님의 운동 가이드` : '초보자도 쉽게 따라할 수 있어요'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* User Status Message */}
      {user && favorites.length === 0 && completed.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="mb-2">운동을 시작해보세요! 🎯</h3>
                <p className="text-sm text-gray-600 mb-3">
                  마음에 드는 운동을 ⭐ 즐겨찾기하고, 완료한 운동은 📝 체크해보세요.
                  당신만의 운동 기록을 만들어가세요!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {user && (favorites.length > 0 || completed.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>즐겨찾기: {favorites.length}개</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>완료: {completed.length}개</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <strong>운동 시작 전 팁:</strong> 5-10분 가볍게 스트레칭으로 몸을 풀고, 
                물을 준비해두세요. 각 동작은 정확한 자세가 가장 중요합니다!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Workout Categories */}
      <Tabs defaultValue="upper" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="upper">상체</TabsTrigger>
          <TabsTrigger value="lower">하체</TabsTrigger>
          <TabsTrigger value="core">코어</TabsTrigger>
          <TabsTrigger value="cardio">유산소</TabsTrigger>
        </TabsList>

        {workoutData.map((category, catIndex) => (
          <TabsContent
            key={category.category}
            value={['upper', 'lower', 'core', 'cardio'][catIndex]}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-xl">{category.category}</h2>
            </div>

            {category.exercises.map((exercise, index) => {
              const isExpanded = expandedExercise === `${catIndex}-${index}`;
              
              return (
                <motion.div
                  key={exercise.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setExpandedExercise(isExpanded ? null : `${catIndex}-${index}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg">{exercise.name}</h3>
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {getDifficultyLabel(exercise.difficulty)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{exercise.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span>{exercise.sets}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <p className="text-sm mb-3">
                            <strong>운동 팁:</strong>
                          </p>
                          <ul className="space-y-2">
                            {exercise.tips.map((tip, tipIndex) => (
                              <li
                                key={tipIndex}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Star
                          className={`w-5 h-5 ${
                            favorites.includes(exercise.name) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                          onClick={() => toggleFavorite(exercise.name)}
                        />
                        <BookmarkPlus
                          className={`w-5 h-5 ${
                            completed.includes(exercise.name) ? 'text-green-500' : 'text-gray-400'
                          }`}
                          onClick={() => toggleCompleted(exercise.name)}
                        />
                      </div>
                      <Button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => setExpandedExercise(isExpanded ? null : `${catIndex}-${index}`)}
                      >
                        {isExpanded ? '닫기' : '자세히 보기'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}