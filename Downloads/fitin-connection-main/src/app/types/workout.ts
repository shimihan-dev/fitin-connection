export type MuscleScope = '상체' | '하체' | '전신';
export type Equipment = '바벨' | '덤벨' | '케이블' | '머신' | '맨몸' | '기타';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// 운동 사전 (Dictionary) 아이템
export interface Exercise {
    id: string;
    name: string;      // 한글명
    nameEn?: string;   // 영문명
    scope: MuscleScope;  // 상체/하체/전신
    groups: string[];    // 타겟 부위 (예: "가슴", "등", "삼두") - id 기반매칭을 위해 가급적 muscleId 사용 권장
    equipment: Equipment;
    difficulty: Difficulty;
    tips?: string[];
}

// 루틴에 추가된 운동
export interface RoutineExercise {
    id: string; // unique instance id
    exerciseId: string; // reference to Exercise.id
    sectionId: string; // routine section identifier (e.g., 'chest', 'back')
    order: number;
    createdAt: number;
}

// 세트 기록
export interface SetEntry {
    setNo: number;
    reps: number;
    weight?: number; // kg
    rpe?: number;    // 1-10
    note?: string;
}

// 운동 수행 로그 (하루 단위)
export interface WorkoutLog {
    id: string;
    date: string; // ISO Date String (YYYY-MM-DD)
    routineExerciseId: string; // Which routine item was this for?
    exerciseId: string; // Denormalized for easier query
    sets: SetEntry[];
}
