// BMR(기초대사량) 및 칼로리 계산 유틸리티
// Mifflin-St Jeor 공식 사용

/**
 * BMR(기초대사량) 계산 - Mifflin-St Jeor 공식
 * 남성: BMR = 10 × 체중(kg) + 6.25 × 신장(cm) − 5 × 나이 + 5
 * 여성: BMR = 10 × 체중(kg) + 6.25 × 신장(cm) − 5 × 나이 − 161
 */
export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number {
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * 활동 수준에 따른 TDEE(총 일일 에너지 소비량) 계산
 */
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,      // 앉아서 생활 (운동 거의 안함)
    light: 1.375,        // 가벼운 활동 (주 1-3회 운동)
    moderate: 1.55,      // 보통 활동 (주 3-5회 운동)
    active: 1.725,       // 활발한 활동 (주 6-7회 운동)
    very_active: 1.9,    // 매우 활발 (하루 2회 이상 운동)
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return Math.round(bmr * activityMultipliers[activityLevel]);
}

/**
 * 목표에 따른 일일 섭취 칼로리 계산
 * - lose: 체중 감량 (TDEE - 500kcal)
 * - maintain: 체중 유지 (TDEE)
 * - gain: 체중 증가 (TDEE + 300kcal)
 */
export type WeightGoal = 'lose' | 'maintain' | 'gain';

export function calculateTargetCalories(
    tdee: number,
    goal: WeightGoal
): number {
    switch (goal) {
        case 'lose':
            return Math.max(1200, tdee - 500); // 최소 1200kcal 보장
        case 'gain':
            return tdee + 300;
        case 'maintain':
        default:
            return tdee;
    }
}

/**
 * 목표 체지방률 달성을 위한 일일 칼로리 가이드 제공
 * 현재 체중과 목표 체지방률을 기반으로 대략적인 칼로리 권장량 계산
 */
export function getCalorieRecommendation(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    targetBodyFat: number,
    activityLevel: ActivityLevel = 'moderate'
): {
    bmr: number;
    tdee: number;
    targetCalories: number;
    goal: WeightGoal;
    message: string;
} {
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);

    // 목표 체지방률에 따른 목표 설정
    // 남성: 10% 이하 = 감량, 15% 이상 = 증량 또는 유지
    // 여성: 20% 이하 = 감량, 25% 이상 = 증량 또는 유지
    let goal: WeightGoal;
    if (gender === 'male') {
        goal = targetBodyFat <= 10 ? 'lose' : targetBodyFat >= 20 ? 'gain' : 'maintain';
    } else {
        goal = targetBodyFat <= 18 ? 'lose' : targetBodyFat >= 28 ? 'gain' : 'maintain';
    }

    const targetCalories = calculateTargetCalories(tdee, goal);

    let message: string;
    switch (goal) {
        case 'lose':
            message = `목표 체지방 ${targetBodyFat}% 달성을 위해 하루 ${targetCalories}kcal를 섭취하세요.`;
            break;
        case 'gain':
            message = `근육량 증가와 함께 ${targetBodyFat}% 체지방 유지를 위해 하루 ${targetCalories}kcal를 섭취하세요.`;
            break;
        default:
            message = `현재 체형을 유지하면서 ${targetBodyFat}% 체지방을 위해 하루 ${targetCalories}kcal를 섭취하세요.`;
    }

    return { bmr: Math.round(bmr), tdee, targetCalories, goal, message };
}

/**
 * 활동 수준 레이블
 */
export const activityLevelLabels: Record<ActivityLevel, string> = {
    sedentary: '앉아서 생활 (운동 거의 안함)',
    light: '가벼운 활동 (주 1-3회 운동)',
    moderate: '보통 활동 (주 3-5회 운동)',
    active: '활발한 활동 (주 6-7회 운동)',
    very_active: '매우 활발 (하루 2회 이상 운동)',
};
