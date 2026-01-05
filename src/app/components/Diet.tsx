import { useState } from 'react';
import { Utensils, Plus, Trash2, Sun, CloudSun, Moon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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

export function Diet({ user }: DietProps) {
    const [meals, setMeals] = useState<DailyMeals>({
        breakfast: [],
        lunch: [],
        dinner: [],
    });

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

    // 총 영양소 계산
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

    // 하루 전체 총합
    const dailyTotal = {
        protein:
            calculateTotal('breakfast').protein +
            calculateTotal('lunch').protein +
            calculateTotal('dinner').protein,
        carbs:
            calculateTotal('breakfast').carbs +
            calculateTotal('lunch').carbs +
            calculateTotal('dinner').carbs,
        fat:
            calculateTotal('breakfast').fat +
            calculateTotal('lunch').fat +
            calculateTotal('dinner').fat,
        calories:
            calculateTotal('breakfast').calories +
            calculateTotal('lunch').calories +
            calculateTotal('dinner').calories,
    };

    const mealSections = [
        {
            key: 'breakfast' as keyof DailyMeals,
            label: '아침',
            icon: Sun,
            color: 'from-yellow-400 to-orange-400',
            bgColor: 'bg-yellow-50',
        },
        {
            key: 'lunch' as keyof DailyMeals,
            label: '점심',
            icon: CloudSun,
            color: 'from-blue-400 to-cyan-400',
            bgColor: 'bg-blue-50',
        },
        {
            key: 'dinner' as keyof DailyMeals,
            label: '저녁',
            icon: Moon,
            color: 'from-indigo-400 to-purple-400',
            bgColor: 'bg-indigo-50',
        },
    ];

    return (
        <div className="p-4 space-y-6">
            {/* 헤더 */}
            <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mx-auto mb-3">
                    <Utensils className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">오늘의 식단</h1>
                <p className="text-gray-600 text-sm mt-1">
                    건강한 식단을 기록하세요
                </p>
            </div>

            {/* 일일 총합 카드 */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 text-center">📊 오늘 총 섭취량</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-xs text-gray-500">칼로리</p>
                        <p className="font-bold text-lg text-orange-600">{dailyTotal.calories}</p>
                        <p className="text-xs text-gray-400">kcal</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-xs text-gray-500">단백질</p>
                        <p className="font-bold text-lg text-red-600">{dailyTotal.protein}</p>
                        <p className="text-xs text-gray-400">g</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-xs text-gray-500">탄수화물</p>
                        <p className="font-bold text-lg text-blue-600">{dailyTotal.carbs}</p>
                        <p className="text-xs text-gray-400">g</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-xs text-gray-500">지방</p>
                        <p className="font-bold text-lg text-yellow-600">{dailyTotal.fat}</p>
                        <p className="text-xs text-gray-400">g</p>
                    </div>
                </div>
            </Card>

            {/* 식사별 섹션 */}
            {mealSections.map((section) => {
                const total = calculateTotal(section.key);
                const Icon = section.icon;

                return (
                    <Card key={section.key} className={`p-4 ${section.bgColor}`}>
                        {/* 섹션 헤더 */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">{section.label}</h2>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => addMeal(section.key)}
                                className="flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                추가
                            </Button>
                        </div>

                        {/* 음식 리스트 */}
                        {meals[section.key].length === 0 ? (
                            <p className="text-gray-500 text-center py-4 text-sm">
                                아직 등록된 음식이 없습니다. "추가" 버튼을 눌러주세요.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {meals[section.key].map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="bg-white rounded-lg p-3 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <Input
                                                placeholder="음식 이름"
                                                value={meal.name}
                                                onChange={(e) =>
                                                    updateMeal(section.key, meal.id, 'name', e.target.value)
                                                }
                                                className="flex-1 mr-2 font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeMeal(section.key, meal.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            <div>
                                                <Label className="text-xs text-gray-500">칼로리</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={meal.calories || ''}
                                                    onChange={(e) =>
                                                        updateMeal(
                                                            section.key,
                                                            meal.id,
                                                            'calories',
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500">단백질(g)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={meal.protein || ''}
                                                    onChange={(e) =>
                                                        updateMeal(
                                                            section.key,
                                                            meal.id,
                                                            'protein',
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500">탄수화물(g)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={meal.carbs || ''}
                                                    onChange={(e) =>
                                                        updateMeal(
                                                            section.key,
                                                            meal.id,
                                                            'carbs',
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500">지방(g)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={meal.fat || ''}
                                                    onChange={(e) =>
                                                        updateMeal(
                                                            section.key,
                                                            meal.id,
                                                            'fat',
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* 섹션 소계 */}
                                <div className="flex justify-end gap-4 text-sm pt-2 border-t border-gray-200">
                                    <span className="text-gray-500">
                                        소계: <span className="font-medium text-orange-600">{total.calories}kcal</span>
                                    </span>
                                    <span className="text-gray-500">
                                        P: <span className="font-medium text-red-600">{total.protein}g</span>
                                    </span>
                                    <span className="text-gray-500">
                                        C: <span className="font-medium text-blue-600">{total.carbs}g</span>
                                    </span>
                                    <span className="text-gray-500">
                                        F: <span className="font-medium text-yellow-600">{total.fat}g</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}

            {/* 참고 안내 */}
            <Card className="p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                    💡 팁: 각 음식의 영양정보는 식품 포장지나 영양정보 앱에서 확인할 수 있습니다.
                </p>
            </Card>
        </div>
    );
}
