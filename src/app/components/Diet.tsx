import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Utensils, Plus, Trash2, Sun, CloudSun, Moon, Apple, Beef, Droplets, Brain, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DietProps {
    user: { name: string; email: string };
}

interface MealItem {
    id: string;
    name: string;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}

interface DailyMeals {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
}

const createEmptyMeal = (): MealItem => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: '',
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
});

// 라이프스타일 팁 데이터
const nutritionTips = [
    { title: '균형 잡힌 식단', icon: Apple, tips: ['탄수화물, 단백질, 지방을 골고루 섭취하세요', '과일과 채소를 매일 5가지 이상 먹기', '가공식품보다는 자연식품 위주로'], color: 'from-orange-500 to-orange-600' },
    { title: '단백질 섭취', icon: Beef, tips: ['체중 1kg당 1.2-1.6g의 단백질 권장', '닭가슴살, 계란, 두부 추천', '운동 후 30분 이내 단백질 섭취'], color: 'from-amber-600 to-amber-700' },
    { title: '수분 섭취', icon: Droplets, tips: ['하루 2L 이상의 물 마시기', '운동 전후 충분한 수분 보충', '아침에 일어나자마자 물 한 잔'], color: 'from-blue-500 to-blue-600' },
];

const sleepTips = [
    { title: '수면 시간', icon: Moon, tips: ['매일 7-9시간 수면 확보', '같은 시간에 자고 일어나기', '낮잠은 20분 이내로 제한'], color: 'from-indigo-500 to-indigo-600' },
    { title: '수면 환경', icon: Moon, tips: ['어둡고 시원한 환경 유지 (18-20°C)', '잠들기 1시간 전 전자기기 사용 중단', '카페인은 오후 2시 이후 피하기'], color: 'from-purple-500 to-purple-600' },
];

const mentalTips = [
    { title: '스트레스 관리', icon: Brain, tips: ['명상이나 호흡 운동 5-10분', '취미 활동 시간 갖기', '완벽보다는 진전에 집중하기'], color: 'from-pink-500 to-pink-600' },
    { title: '건강한 마음가짐', icon: Heart, tips: ['자신에게 관대하게 대하기', '작은 성취도 축하하기', '실패는 배움의 기회로 받아들이기'], color: 'from-red-500 to-red-600' },
];

export function Diet({ user }: DietProps) {
    const [meals, setMeals] = useState<DailyMeals>({
        breakfast: [],
        lunch: [],
        dinner: [],
    });

    const [schoolMenuImage, setSchoolMenuImage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.email) {
            try {
                const stored = localStorage.getItem(`school_menu_${user.email}`);
                if (stored) setSchoolMenuImage(stored);
            } catch (err) { console.error('Failed to parse school menu image:', err); }
        }
    }, [user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setSchoolMenuImage(result);
            if (user?.email) {
                localStorage.setItem(`school_menu_${user.email}`, result);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleDeleteImage = () => {
        setSchoolMenuImage(null);
        if (user?.email) localStorage.removeItem(`school_menu_${user.email}`);
    };

    const addMeal = (mealType: keyof DailyMeals) => {
        setMeals({
            ...meals,
            [mealType]: [...meals[mealType], createEmptyMeal()],
        });
    };

    const removeMeal = (mealType: keyof DailyMeals, id: string) => {
        setMeals({
            ...meals,
            [mealType]: meals[mealType].filter((meal) => meal.id !== id),
        });
    };

    const updateMeal = (
        mealType: keyof DailyMeals,
        id: string,
        field: keyof MealItem,
        value: string | number
    ) => {
        setMeals({
            ...meals,
            [mealType]: meals[mealType].map((meal) =>
                meal.id === id ? { ...meal, [field]: value } : meal
            ),
        });
    };

    const calculateTotal = (mealType: keyof DailyMeals) => {
        return meals[mealType].reduce(
            (acc, meal) => ({
                protein: acc.protein + (meal.protein || 0),
                carbs: acc.carbs + (meal.carbs || 0),
                fat: acc.fat + (meal.fat || 0),
                calories: acc.calories + (meal.calories || 0),
            }),
            { protein: 0, carbs: 0, fat: 0, calories: 0 }
        );
    };

    const dailyTotal = {
        protein: calculateTotal('breakfast').protein + calculateTotal('lunch').protein + calculateTotal('dinner').protein,
        carbs: calculateTotal('breakfast').carbs + calculateTotal('lunch').carbs + calculateTotal('dinner').carbs,
        fat: calculateTotal('breakfast').fat + calculateTotal('lunch').fat + calculateTotal('dinner').fat,
        calories: calculateTotal('breakfast').calories + calculateTotal('lunch').calories + calculateTotal('dinner').calories,
    };

    const mealSections = [
        { key: 'breakfast' as keyof DailyMeals, label: '아침', icon: Sun, color: 'from-amber-500 to-orange-500' },
        { key: 'lunch' as keyof DailyMeals, label: '점심', icon: CloudSun, color: 'from-blue-500 to-cyan-500' },
        { key: 'dinner' as keyof DailyMeals, label: '저녁', icon: Moon, color: 'from-violet-500 to-purple-500' },
    ];

    // 팁 카드 렌더링 함수
    const renderTipCards = (tips: typeof nutritionTips, checkColor: string) => (
        <div className="space-y-4">
            {tips.map((category, index) => {
                const Icon = category.icon;
                return (
                    <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="p-4 bg-card/50 border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {category.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className={`${checkColor} flex-shrink-0 mt-0.5`}>✓</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            {/* 헤더 */}
            <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
                    <Utensils className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">식단 & 라이프스타일</h1>
                <p className="text-muted-foreground text-sm mt-1">건강한 식단과 생활 습관을 관리하세요</p>
            </div>

            {/* 탭 메뉴 */}
            <Tabs defaultValue="diet" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/50">
                    <TabsTrigger value="diet">식단 기록</TabsTrigger>
                    <TabsTrigger value="nutrition">영양</TabsTrigger>
                    <TabsTrigger value="sleep">수면</TabsTrigger>
                    <TabsTrigger value="mental">멘탈</TabsTrigger>
                </TabsList>

                {/* 식단 기록 탭 */}
                <TabsContent value="diet" className="space-y-6">
                    {/* 이번 주 학식 식단표 */}
                    <Card className="p-4 bg-card/50 border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                📅 이번 주 학식 식단표
                            </h3>
                            {schoolMenuImage && (
                                <Button variant="ghost" size="sm" onClick={handleDeleteImage} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        {schoolMenuImage ? (
                            <div className="relative">
                                <img src={schoolMenuImage} alt="School Menu" className="w-full rounded-lg border border-border" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg bg-card/30">
                                <p className="text-sm text-muted-foreground mb-3">식단표 이미지를 업로드하세요</p>
                                <Label htmlFor="menu-upload" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                                        <Plus className="w-4 h-4" /> 이미지 선택
                                    </div>
                                </Label>
                                <Input
                                    id="menu-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        )}
                    </Card>
                    {/* 일일 총합 카드 */}
                    <Card className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30">
                        <h3 className="font-semibold text-emerald-400 mb-3 text-center">📊 오늘 총 섭취량</h3>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-card/50 rounded-lg p-2 border border-border">
                                <p className="text-xs text-muted-foreground">칼로리</p>
                                <p className="font-bold text-lg text-orange-400">{dailyTotal.calories}</p>
                                <p className="text-xs text-muted-foreground">kcal</p>
                            </div>
                            <div className="bg-card/50 rounded-lg p-2 border border-border">
                                <p className="text-xs text-muted-foreground">단백질</p>
                                <p className="font-bold text-lg text-red-400">{dailyTotal.protein}</p>
                                <p className="text-xs text-muted-foreground">g</p>
                            </div>
                            <div className="bg-card/50 rounded-lg p-2 border border-border">
                                <p className="text-xs text-muted-foreground">탄수화물</p>
                                <p className="font-bold text-lg text-primary">{dailyTotal.carbs}</p>
                                <p className="text-xs text-muted-foreground">g</p>
                            </div>
                            <div className="bg-card/50 rounded-lg p-2 border border-border">
                                <p className="text-xs text-muted-foreground">지방</p>
                                <p className="font-bold text-lg text-amber-400">{dailyTotal.fat}</p>
                                <p className="text-xs text-muted-foreground">g</p>
                            </div>
                        </div>
                    </Card>

                    {/* 식사별 섹션 */}
                    {mealSections.map((section) => {
                        const total = calculateTotal(section.key);
                        const Icon = section.icon;

                        return (
                            <Card key={section.key} className="p-4 bg-card/50 border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-foreground">{section.label}</h2>
                                    </div>
                                    <Button size="sm" onClick={() => addMeal(section.key)} className="flex items-center gap-1">
                                        <Plus className="w-4 h-4" />
                                        추가
                                    </Button>
                                </div>

                                {meals[section.key].length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4 text-sm">
                                        아직 등록된 음식이 없습니다. "추가" 버튼을 눌러주세요.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {meals[section.key].map((meal) => (
                                            <div key={meal.id} className="bg-background/50 rounded-lg p-3 border border-border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Input
                                                        placeholder="음식 이름"
                                                        value={meal.name}
                                                        onChange={(e) => updateMeal(section.key, meal.id, 'name', e.target.value)}
                                                        className="flex-1 mr-2 font-medium bg-card/50 border-border"
                                                    />
                                                    <Button variant="ghost" size="sm" onClick={() => removeMeal(section.key, meal.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">칼로리</Label>
                                                        <Input type="number" placeholder="0" value={meal.calories || ''} onChange={(e) => updateMeal(section.key, meal.id, 'calories', Number(e.target.value))} className="text-sm bg-card/50 border-border" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">단백질(g)</Label>
                                                        <Input type="number" placeholder="0" value={meal.protein || ''} onChange={(e) => updateMeal(section.key, meal.id, 'protein', Number(e.target.value))} className="text-sm bg-card/50 border-border" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">탄수화물(g)</Label>
                                                        <Input type="number" placeholder="0" value={meal.carbs || ''} onChange={(e) => updateMeal(section.key, meal.id, 'carbs', Number(e.target.value))} className="text-sm bg-card/50 border-border" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">지방(g)</Label>
                                                        <Input type="number" placeholder="0" value={meal.fat || ''} onChange={(e) => updateMeal(section.key, meal.id, 'fat', Number(e.target.value))} className="text-sm bg-card/50 border-border" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-end gap-4 text-sm pt-2 border-t border-border">
                                            <span className="text-muted-foreground">소계: <span className="font-medium text-orange-400">{total.calories}kcal</span></span>
                                            <span className="text-muted-foreground">P: <span className="font-medium text-red-400">{total.protein}g</span></span>
                                            <span className="text-muted-foreground">C: <span className="font-medium text-primary">{total.carbs}g</span></span>
                                            <span className="text-muted-foreground">F: <span className="font-medium text-amber-400">{total.fat}g</span></span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}

                    <Card className="p-4 bg-card/30 border-border/50">
                        <p className="text-xs text-muted-foreground text-center">
                            💡 팁: 각 음식의 영양정보는 식품 포장지나 영양정보 앱에서 확인할 수 있습니다.
                        </p>
                    </Card>
                </TabsContent>

                {/* 영양 팁 탭 */}
                <TabsContent value="nutrition">
                    {renderTipCards(nutritionTips, 'text-emerald-400')}
                </TabsContent>

                {/* 수면 팁 탭 */}
                <TabsContent value="sleep">
                    {renderTipCards(sleepTips, 'text-primary')}
                </TabsContent>

                {/* 멘탈 팁 탭 */}
                <TabsContent value="mental">
                    {renderTipCards(mentalTips, 'text-pink-400')}
                </TabsContent>
            </Tabs>
        </div>
    );
}
