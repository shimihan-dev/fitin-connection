import { Exercise } from '../types/workout';

export const EXERCISE_DICTIONARY: Exercise[] = [
    // ═══════════════════════════════════════
    // 가슴 (Chest)
    // ═══════════════════════════════════════
    { id: 'bench_press_barbell', name: '벤치 프레스', nameEn: 'Bench Press', scope: '상체', groups: ['chest', 'tricep'], equipment: '바벨', difficulty: 'intermediate', tips: ['바벨을 가슴 중앙으로 내리세요', '팔꿈치가 너무 벌어지지 않게 주의'] },
    { id: 'bench_press_dumbbell', name: '덤벨 벤치 프레스', nameEn: 'Dumbbell Bench Press', scope: '상체', groups: ['chest', 'tricep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'incline_bench_press', name: '인클라인 벤치 프레스', nameEn: 'Incline Bench Press', scope: '상체', groups: ['chest', 'shoulder'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'incline_press_dumbbell', name: '덤벨 인클라인 벤치 프레스', nameEn: 'Incline Dumbbell Bench Press', scope: '상체', groups: ['chest', 'shoulder'], equipment: '덤벨', difficulty: 'beginner', tips: ['벤치 각도를 30-45도로 설정', '가슴 상부에 집중'] },
    { id: 'decline_bench_press', name: '디클라인 벤치 프레스', nameEn: 'Decline Bench Press', scope: '상체', groups: ['chest', 'tricep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'decline_bench_press_dumbbell', name: '덤벨 디클라인 벤치 프레스', nameEn: 'Dumbbell Decline Bench Press', scope: '상체', groups: ['chest', 'tricep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'chest_press_machine', name: '체스트 프레스 머신', nameEn: 'Chest Press Machine', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'bench_press_machine', name: '벤치 프레스 머신', nameEn: 'Bench Press Machine', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'wide_chest_press', name: '와이드 체스트 프레스', nameEn: 'Wide Chest Press', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'decline_press_machine', name: '디클라인 프레스 머신', nameEn: 'Decline Press Machine', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'decline_chest_press_machine', name: '디클라인 체스트 프레스 머신', nameEn: 'Decline Chest Press Machine', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'incline_hammer_press', name: '인클라인 해머 프레스', nameEn: 'Incline Hammer Press', scope: '상체', groups: ['chest', 'shoulder'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'sports_press', name: '스포츠 프레스', nameEn: 'Sports Press', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'fitup_bench_press', name: '핏업 벤치 프레스', nameEn: 'Fit-Up Bench Press', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'dips', name: '딥스', nameEn: 'Dips', scope: '상체', groups: ['chest', 'tricep'], equipment: '맨몸', difficulty: 'intermediate' },
    { id: 'tricep_dips', name: '트라이셉스 딥스', nameEn: 'Tricep Dips', scope: '상체', groups: ['tricep', 'chest'], equipment: '맨몸', difficulty: 'intermediate' },
    { id: 'pushup', name: '푸시업(팔굽혀펴기)', nameEn: 'Push-Up', scope: '상체', groups: ['chest', 'tricep'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'diamond_pushup', name: '다이아몬드 푸시업', nameEn: 'Diamond Push-Up', scope: '상체', groups: ['tricep', 'chest'], equipment: '맨몸', difficulty: 'advanced' },
    { id: 'incline_pushup', name: '인클라인 푸시업', nameEn: 'Incline Push-Up', scope: '상체', groups: ['chest'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'decline_pushup', name: '디클라인 푸시업', nameEn: 'Decline Push-Up', scope: '상체', groups: ['chest', 'shoulder'], equipment: '맨몸', difficulty: 'intermediate' },
    { id: 'weighted_pushup', name: '중량 푸시업', nameEn: 'Weighted Push-Up', scope: '상체', groups: ['chest', 'tricep'], equipment: '맨몸', difficulty: 'advanced' },
    { id: 'incline_dumbbell_fly', name: '인클라인 덤벨 플라이', nameEn: 'Incline Dumbbell Fly', scope: '상체', groups: ['chest'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'cable_upper_fly', name: '케이블 어퍼 플라이', nameEn: 'Cable Upper Fly', scope: '상체', groups: ['chest'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'cable_reverse_fly', name: '케이블 리버스 플라이', nameEn: 'Cable Reverse Fly', scope: '상체', groups: ['chest', 'shoulder'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'chest_fly_machine', name: '펙 덱 플라이', nameEn: 'Pec Deck Fly', scope: '상체', groups: ['chest'], equipment: '머신', difficulty: 'beginner', tips: ['팔을 안아주는 느낌으로', '반동을 쓰지 마세요'] },
    { id: 'dumbbell_pullover', name: '덤벨 풀오버', nameEn: 'Dumbbell Pullover', scope: '상체', groups: ['chest', 'back'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'cable_pullover', name: '케이블 풀오버', nameEn: 'Cable Pullover', scope: '상체', groups: ['chest', 'back'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'foam_roller_chest', name: '폼롤러 가슴', nameEn: 'Foam Roller Chest', scope: '상체', groups: ['chest'], equipment: '기타', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 등 (Back)
    // ═══════════════════════════════════════
    { id: 'lat_pulldown', name: '랫 풀다운', nameEn: 'Lat Pulldown', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner', tips: ['상체를 살짝 뒤로 젖히세요', '바를 쇄골 쪽으로 당기기'] },
    { id: 'wide_grip_lat_pulldown', name: '와이드 그립 랫 풀다운', nameEn: 'Wide Grip Lat Pulldown', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'wide_pulldown', name: '와이드 풀다운', nameEn: 'Wide Pulldown', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'wide_pulldown_front', name: '와이드 풀다운 프론트', nameEn: 'Wide Pulldown Front', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'mag_grip_lat_pulldown', name: '맥 그립 랫 풀다운', nameEn: 'Mag Grip Lat Pulldown', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'cable_pulldown', name: '케이블 풀다운', nameEn: 'Cable Pulldown', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'underhand_pulldown', name: '언더 그립 풀다운', nameEn: 'Underhand Pulldown', scope: '상체', groups: ['back', 'bicep'], equipment: '머신', difficulty: 'beginner' },
    { id: 'close_grip_pulldown', name: '클로즈 그립 풀다운', nameEn: 'Close Grip Pulldown', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'straight_arm_pulldown', name: '스트레이트 암 풀다운', nameEn: 'Straight Arm Pulldown', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'pull_up', name: '풀업(턱걸이)', nameEn: 'Pull Up', scope: '상체', groups: ['back', 'bicep'], equipment: '맨몸', difficulty: 'advanced', tips: ['가슴을 바에 닿게 당기세요', '내려올 때 천천히'] },
    { id: 'weighted_chin_up', name: '중량 친업', nameEn: 'Weighted Chin-Up', scope: '상체', groups: ['back', 'bicep'], equipment: '맨몸', difficulty: 'advanced' },
    { id: 'neutral_grip_pullup', name: '뉴트럴 그립 풀업', nameEn: 'Neutral Grip Pull-Up', scope: '상체', groups: ['back', 'bicep'], equipment: '맨몸', difficulty: 'advanced' },
    { id: 'assisted_pullup_machine', name: '어시스트 풀업 머신', nameEn: 'Assisted Pull-Up Machine', scope: '상체', groups: ['back', 'bicep'], equipment: '머신', difficulty: 'beginner' },
    { id: 'vertical_traction', name: '버티컬 트랙션', nameEn: 'Vertical Traction', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'cable_row', name: '케이블 로우', nameEn: 'Cable Row', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'seated_cable_row', name: '시티드 케이블 로우(롱 풀)', nameEn: 'Seated Cable Row', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'intermediate', tips: ['허리를 곧게 펴세요', '날개뼈를 접는 느낌으로'] },
    { id: 'one_arm_seated_cable_row', name: '원 암 시티드 케이블 로우(롱 풀)', nameEn: 'One Arm Seated Cable Row', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'underhand_seated_row', name: '언더 그립 시티드 로우', nameEn: 'Underhand Seated Row', scope: '상체', groups: ['back', 'bicep'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'low_row', name: '로우 로우(Low Row)', nameEn: 'Low Row', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'high_row_machine', name: '하이 로우 머신', nameEn: 'High Row Machine', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'beginner' },
    { id: 'cable_high_row', name: '케이블 하이 로우', nameEn: 'Cable High Row', scope: '상체', groups: ['back'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'lateral_row', name: '레터럴 로우', nameEn: 'Lateral Row', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'barbell_row', name: '바벨 로우', nameEn: 'Barbell Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'underhand_barbell_row', name: '언더 그립 바벨 로우', nameEn: 'Underhand Barbell Row', scope: '상체', groups: ['back', 'bicep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'smith_barbell_row', name: '스미스 머신 바벨 로우', nameEn: 'Smith Machine Barbell Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 't_bar_row', name: '티 바 로우', nameEn: 'T-Bar Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'chest_supported_t_bar_row', name: '체스트 서포티드 티 바 로우', nameEn: 'Chest Supported T-Bar Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'seal_row', name: '씰 로우', nameEn: 'Seal Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'hammer_row', name: '해머 로우', nameEn: 'Hammer Row', scope: '상체', groups: ['back'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'one_arm_dumbbell_row', name: '원 암 덤벨 로우', nameEn: 'One Arm Dumbbell Row', scope: '상체', groups: ['back'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'bent_over_barbell_row', name: '벤드 오버 바벨 로우', nameEn: 'Bent Over Barbell Row', scope: '상체', groups: ['back'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'bent_over_dumbbell_row', name: '벤드 오버 덤벨 로우', nameEn: 'Bent Over Dumbbell Row', scope: '상체', groups: ['back'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'dumbbell_upright_row', name: '덤벨 업라이트 로우', nameEn: 'Dumbbell Upright Row', scope: '상체', groups: ['back', 'shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'inverted_row', name: '인버티드 로우', nameEn: 'Inverted Row', scope: '상체', groups: ['back'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'pullover_machine', name: '풀오버 머신', nameEn: 'Pullover Machine', scope: '상체', groups: ['back', 'chest'], equipment: '머신', difficulty: 'beginner' },
    { id: 'face_pull', name: '페이스 풀', nameEn: 'Face Pull', scope: '상체', groups: ['back', 'shoulder'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'chest_supported_rear_delt_row', name: '체스트 서포티드 덤벨 리어 델트 로우', nameEn: 'Chest Supported Rear Delt Row', scope: '상체', groups: ['back', 'shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'foam_roller_back', name: '폼롤러 등', nameEn: 'Foam Roller Back', scope: '상체', groups: ['back'], equipment: '기타', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 어깨·승모 (Shoulder & Traps)
    // ═══════════════════════════════════════
    { id: 'ohp_barbell', name: '오버헤드 프레스', nameEn: 'Overhead Press', scope: '상체', groups: ['shoulder', 'tricep'], equipment: '바벨', difficulty: 'advanced', tips: ['코어에 힘을 주세요', '바가 얼굴을 스치듯 올리기'] },
    { id: 'military_press', name: '밀리터리 프레스', nameEn: 'Military Press', scope: '상체', groups: ['shoulder', 'tricep'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'dumbbell_shoulder_press', name: '덤벨 숄더 프레스', nameEn: 'Dumbbell Shoulder Press', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'shoulder_press_machine', name: '숄더 프레스 머신', nameEn: 'Shoulder Press Machine', scope: '상체', groups: ['shoulder'], equipment: '머신', difficulty: 'beginner' },
    { id: 'seated_ohp', name: '시티드 오버헤드 프레스', nameEn: 'Seated Overhead Press', scope: '상체', groups: ['shoulder'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'smith_ohp', name: '스미스 머신 오버헤드 프레스', nameEn: 'Smith Machine OHP', scope: '상체', groups: ['shoulder'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'smith_military_press', name: '스미스 머신 밀리터리 프레스', nameEn: 'Smith Machine Military Press', scope: '상체', groups: ['shoulder'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'arnold_press', name: '아놀드 프레스', nameEn: 'Arnold Press', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'one_arm_db_shoulder_press', name: '원 암 덤벨 숄더 프레스', nameEn: 'One Arm Dumbbell Shoulder Press', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'lateral_shoulder_press', name: '레터럴 숄더 프레스', nameEn: 'Lateral Shoulder Press', scope: '상체', groups: ['shoulder'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'lateral_raise', name: '덤벨 사이드 레터럴 레이즈', nameEn: 'Dumbbell Side Lateral Raise', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'beginner', tips: ['어깨 높이까지만 올리기', '승모근 개입 최소화'] },
    { id: 'one_arm_cable_lateral_raise', name: '원 암 케이블 레터럴 레이즈', nameEn: 'One Arm Cable Lateral Raise', scope: '상체', groups: ['shoulder'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'cable_side_lateral_raise', name: '케이블 사이드 레터럴 레이즈', nameEn: 'Cable Side Lateral Raise', scope: '상체', groups: ['shoulder'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'standing_lateral_raise', name: '스탠딩 레터럴 레이즈', nameEn: 'Standing Lateral Raise', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'lateral_raise_machine', name: '레터럴 레이즈 머신', nameEn: 'Lateral Raise Machine', scope: '상체', groups: ['shoulder'], equipment: '머신', difficulty: 'beginner' },
    { id: 'dumbbell_front_raise', name: '덤벨 프론트 프레스', nameEn: 'Dumbbell Front Raise', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'cable_front_raise', name: '케이블 프론트 레이즈', nameEn: 'Cable Front Raise', scope: '상체', groups: ['shoulder'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'bent_over_lateral_raise', name: '덤벨 벤트 오버 레터럴 레이즈', nameEn: 'Dumbbell Bent Over Lateral Raise', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'bent_over_lateral_raise_machine', name: '벤트 오버 레터럴 레이즈 머신', nameEn: 'Bent Over Lateral Raise Machine', scope: '상체', groups: ['shoulder'], equipment: '머신', difficulty: 'beginner' },
    { id: 'cable_y_raise', name: '케이블 와이(Y) 레이즈', nameEn: 'Cable Y-Raise', scope: '상체', groups: ['shoulder'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'dumbbell_y_raise', name: '덤벨 와이(Y) 레이즈', nameEn: 'Dumbbell Y-Raise', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'y_raise_machine', name: '와이(Y) 레이즈(머신/케이블)', nameEn: 'Y-Raise Machine', scope: '상체', groups: ['shoulder'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'band_rear_shoulder', name: '밴드 후면 어깨', nameEn: 'Band Rear Shoulder', scope: '상체', groups: ['shoulder'], equipment: '기타', difficulty: 'beginner' },
    { id: 'rear_delt', name: '어깨 후면', nameEn: 'Rear Delt', scope: '상체', groups: ['shoulder'], equipment: '기타', difficulty: 'beginner' },
    { id: 'barbell_shrug', name: '바벨 슈러그', nameEn: 'Barbell Shrug', scope: '상체', groups: ['shoulder'], equipment: '바벨', difficulty: 'beginner' },
    { id: 'dumbbell_shrug', name: '덤벨 슈러그', nameEn: 'Dumbbell Shrug', scope: '상체', groups: ['shoulder'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'shrug', name: '슈러그', nameEn: 'Shrug', scope: '상체', groups: ['shoulder'], equipment: '기타', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 팔·전완 (Arms & Forearms)
    // ═══════════════════════════════════════
    { id: 'bicep_curl_barbell', name: '바벨 컬', nameEn: 'Barbell Curl', scope: '상체', groups: ['bicep'], equipment: '바벨', difficulty: 'beginner', tips: ['팔꿈치를 옆구리에 고정', '몸의 반동 금지'] },
    { id: 'dumbbell_curl', name: '덤벨 컬', nameEn: 'Dumbbell Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'seated_dumbbell_curl', name: '시티드 덤벨 컬', nameEn: 'Seated Dumbbell Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'preacher_curl', name: '프리처 컬', nameEn: 'Preacher Curl', scope: '상체', groups: ['bicep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'preacher_curl_machine', name: '프리처 컬 머신', nameEn: 'Preacher Curl Machine', scope: '상체', groups: ['bicep'], equipment: '머신', difficulty: 'beginner' },
    { id: 'spider_curl', name: '스파이더 컬', nameEn: 'Spider Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'drag_curl', name: '드래그 컬', nameEn: 'Drag Curl', scope: '상체', groups: ['bicep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'cable_curl', name: '케이블 컬', nameEn: 'Cable Curl', scope: '상체', groups: ['bicep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'one_arm_cable_curl', name: '원 암 케이블 컬', nameEn: 'One Arm Cable Curl', scope: '상체', groups: ['bicep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'cable_rope_curl', name: '케이블 로프 컬', nameEn: 'Cable Rope Curl', scope: '상체', groups: ['bicep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'dumbbell_hammer_curl', name: '덤벨 해머 컬', nameEn: 'Dumbbell Hammer Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'incline_hammer_curl', name: '덤벨 해머 컬(인클라인)', nameEn: 'Incline Hammer Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'rope_hammer_curl', name: '로프 해머 컬', nameEn: 'Rope Hammer Curl', scope: '상체', groups: ['bicep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'plate_curl', name: '플레이트 컬', nameEn: 'Plate Curl', scope: '상체', groups: ['bicep'], equipment: '기타', difficulty: 'beginner' },
    { id: 'ez_bar_reverse_curl', name: '이지바(EZ바) 리버스 컬', nameEn: 'EZ Bar Reverse Curl', scope: '상체', groups: ['bicep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'reverse_wrist_curl', name: '리버스 리스트 컬', nameEn: 'Reverse Wrist Curl', scope: '상체', groups: ['bicep'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'skull_crusher', name: '라잉 트라이셉스 익스텐션(스컬 크러셔)', nameEn: 'Skull Crusher', scope: '상체', groups: ['tricep'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'cable_tricep_extension', name: '케이블 트라이셉스 익스텐션', nameEn: 'Cable Tricep Extension', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'cable_rope_pushdown', name: '케이블 로프 푸시다운', nameEn: 'Cable Rope Pushdown', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner', tips: ['팔꿈치 고정', '삼두근 수축에 집중'] },
    { id: 'one_arm_cable_pushdown', name: '원 암 케이블 푸시다운', nameEn: 'One Arm Cable Pushdown', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'cable_press_down', name: '케이블 프레스 다운', nameEn: 'Cable Press Down', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'tricep_pulldown', name: '트라이셉스 풀다운', nameEn: 'Tricep Pulldown', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'tricep_press_machine', name: '트라이셉스 프레스 머신', nameEn: 'Tricep Press Machine', scope: '상체', groups: ['tricep'], equipment: '머신', difficulty: 'beginner' },
    { id: 'cable_kickback', name: '케이블 킥백', nameEn: 'Cable Kickback', scope: '상체', groups: ['tricep'], equipment: '케이블', difficulty: 'beginner' },
    { id: 'dumbbell_back_extension_tricep', name: '덤벨 백 익스텐션(삼두/보조)', nameEn: 'Dumbbell Back Extension (Tricep)', scope: '상체', groups: ['tricep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'one_arm_overhead_extension', name: '원 암 덤벨 오버헤드 익스텐션', nameEn: 'One Arm Overhead Extension', scope: '상체', groups: ['tricep'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'overhead_tricep_stretch', name: '오버헤드 트라이셉스 스트레칭', nameEn: 'Overhead Tricep Stretch', scope: '상체', groups: ['tricep'], equipment: '기타', difficulty: 'beginner' },
    { id: 'forearm_exercise', name: '전완근', nameEn: 'Forearm Exercise', scope: '상체', groups: ['bicep'], equipment: '기타', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 하체 - 스쿼트·프레스 (Squats & Presses)
    // ═══════════════════════════════════════
    { id: 'squat_barbell', name: '스쿼트', nameEn: 'Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '바벨', difficulty: 'intermediate', tips: ['무릎 방향과 발끝 방향 일치', '복압 유지'] },
    { id: 'low_bar_squat', name: '로우바 스쿼트', nameEn: 'Low Bar Squat', scope: '하체', groups: ['quadriceps', 'glutes', 'hamstring'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'high_bar_squat', name: '하이바 스쿼트', nameEn: 'High Bar Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'front_squat', name: '프론트 스쿼트', nameEn: 'Front Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'hack_squat', name: '핵 스쿼트', nameEn: 'Hack Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'hack_press', name: '핵 프레스', nameEn: 'Hack Press', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'leg_press', name: '레그 프레스', nameEn: 'Leg Press', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '머신', difficulty: 'beginner', tips: ['무릎을 완전히 펴지 마세요', '발 뒤꿈치로 밀기'] },
    { id: 'box_squat', name: '박스 스쿼트', nameEn: 'Box Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'goblet_squat', name: '고블릿 스쿼트', nameEn: 'Goblet Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'kettlebell_squat', name: '케틀벨 스쿼트', nameEn: 'Kettlebell Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '기타', difficulty: 'beginner' },
    { id: 'dumbbell_wide_squat', name: '덤벨 와이드 스쿼트', nameEn: 'Dumbbell Wide Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'reverse_v_squat', name: '리버스 브이 스쿼트', nameEn: 'Reverse V Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '머신', difficulty: 'intermediate' },
    { id: 'overhead_squat', name: '오버헤드 스쿼트', nameEn: 'Overhead Squat', scope: '하체', groups: ['quadriceps', 'glutes', 'shoulder'], equipment: '바벨', difficulty: 'advanced' },

    // ═══════════════════════════════════════
    // 하체 - 런지·스플릿 (Lunges & Splits)
    // ═══════════════════════════════════════
    { id: 'lunge_dumbbell', name: '덤벨 런지', nameEn: 'Dumbbell Lunge', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '덤벨', difficulty: 'beginner', tips: ['상체를 세우세요', '무릎이 바닥에 닿기 직전까지'] },
    { id: 'barbell_lunge', name: '바벨 런지', nameEn: 'Barbell Lunge', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'walking_lunge', name: '워킹 런지', nameEn: 'Walking Lunge', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'dumbbell_walking_lunge', name: '덤벨 워킹 런지', nameEn: 'Dumbbell Walking Lunge', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'bulgarian_split_squat', name: '불가리안 스플릿 스쿼트', nameEn: 'Bulgarian Split Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '덤벨', difficulty: 'advanced' },
    { id: 'shrimp_squat', name: '쉬림프 스쿼트', nameEn: 'Shrimp Squat', scope: '하체', groups: ['quadriceps', 'glutes'], equipment: '맨몸', difficulty: 'advanced' },

    // ═══════════════════════════════════════
    // 하체 - 머신·보조 (Machines & Accessories)
    // ═══════════════════════════════════════
    { id: 'leg_curl', name: '레그 컬', nameEn: 'Leg Curl', scope: '하체', groups: ['hamstring'], equipment: '머신', difficulty: 'beginner' },
    { id: 'seated_leg_curl', name: '시티드 레그 컬', nameEn: 'Seated Leg Curl', scope: '하체', groups: ['hamstring'], equipment: '머신', difficulty: 'beginner' },
    { id: 'leg_extension', name: '레그 익스텐션', nameEn: 'Leg Extension', scope: '하체', groups: ['quadriceps'], equipment: '머신', difficulty: 'beginner' },
    { id: 'one_leg_extension', name: '원 레그 익스텐션', nameEn: 'One Leg Extension', scope: '하체', groups: ['quadriceps'], equipment: '머신', difficulty: 'beginner' },
    { id: 'hip_abduction', name: '힙 어브덕션(아웃 타이)', nameEn: 'Hip Abduction', scope: '하체', groups: ['glutes'], equipment: '머신', difficulty: 'beginner' },
    { id: 'monster_glute', name: '몬스터 글루트(링크 아웃타이)', nameEn: 'Monster Glute', scope: '하체', groups: ['glutes'], equipment: '머신', difficulty: 'beginner' },
    { id: 'hip_adduction', name: '힙 어덕션(이너 타이)', nameEn: 'Hip Adduction', scope: '하체', groups: ['quadriceps'], equipment: '머신', difficulty: 'beginner' },
    { id: 'glute_machine', name: '글루트', nameEn: 'Glute Machine', scope: '하체', groups: ['glutes'], equipment: '머신', difficulty: 'beginner' },
    { id: 'calf_press', name: '카프 프레스', nameEn: 'Calf Press', scope: '하체', groups: ['calves'], equipment: '머신', difficulty: 'beginner' },
    { id: 'seated_calf_raise', name: '시티드 카프 레이즈', nameEn: 'Seated Calf Raise', scope: '하체', groups: ['calves'], equipment: '머신', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 하체 - 햄스트링 특화
    // ═══════════════════════════════════════
    { id: 'nordic_curl', name: '노르딕 컬', nameEn: 'Nordic Curl', scope: '하체', groups: ['hamstring'], equipment: '맨몸', difficulty: 'advanced' },

    // ═══════════════════════════════════════
    // 전신 - 힌지·데드리프트 (Hinge & Deadlifts)
    // ═══════════════════════════════════════
    { id: 'deadlift', name: '데드리프트', nameEn: 'Deadlift', scope: '전신', groups: ['back', 'hamstring', 'glutes'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'beltless_deadlift', name: '벨트리스 데드리프트', nameEn: 'Beltless Deadlift', scope: '전신', groups: ['back', 'hamstring', 'glutes'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'dumbbell_deadlift', name: '덤벨 데드리프트', nameEn: 'Dumbbell Deadlift', scope: '전신', groups: ['back', 'hamstring', 'glutes'], equipment: '덤벨', difficulty: 'beginner' },
    { id: 'dumbbell_stiff_leg_deadlift', name: '덤벨 스티프레그 데드리프트', nameEn: 'Dumbbell Stiff Leg Deadlift', scope: '전신', groups: ['hamstring', 'glutes'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'one_leg_deadlift', name: '원 레그 데드리프트', nameEn: 'One Leg Deadlift', scope: '전신', groups: ['hamstring', 'glutes'], equipment: '덤벨', difficulty: 'intermediate' },
    { id: 'sumo_deadlift', name: '스모 데드리프트', nameEn: 'Sumo Deadlift', scope: '전신', groups: ['back', 'hamstring', 'glutes', 'quadriceps'], equipment: '바벨', difficulty: 'intermediate' },
    { id: 'snatch_deadlift', name: '스내치 데드리프트', nameEn: 'Snatch Deadlift', scope: '전신', groups: ['back', 'hamstring', 'glutes'], equipment: '바벨', difficulty: 'advanced' },

    // ═══════════════════════════════════════
    // 전신 - 파워·컨디셔닝 (Power & Conditioning)
    // ═══════════════════════════════════════
    { id: 'power_clean', name: '파워 클린', nameEn: 'Power Clean', scope: '전신', groups: ['back', 'shoulder', 'quadriceps'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'snatch', name: '스내치', nameEn: 'Snatch', scope: '전신', groups: ['back', 'shoulder', 'quadriceps'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'thruster', name: '쓰러스터', nameEn: 'Thruster', scope: '전신', groups: ['quadriceps', 'shoulder'], equipment: '바벨', difficulty: 'advanced' },
    { id: 'burpee', name: '버피 테스트', nameEn: 'Burpee', scope: '전신', groups: ['chest', 'quadriceps'], equipment: '맨몸', difficulty: 'intermediate' },

    // ═══════════════════════════════════════
    // 전신 - 코어 (Core)
    // ═══════════════════════════════════════
    { id: 'situp', name: '싯업(윗몸 일으키기)', nameEn: 'Sit-Up', scope: '전신', groups: ['abs'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'bent_knee_situp', name: '벤트 니 싯업', nameEn: 'Bent Knee Sit-Up', scope: '전신', groups: ['abs'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'plank', name: '플랭크', nameEn: 'Plank', scope: '전신', groups: ['abs'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'cable_crunch', name: '케이블 크런치', nameEn: 'Cable Crunch', scope: '전신', groups: ['abs'], equipment: '케이블', difficulty: 'intermediate' },
    { id: 'ab_slide', name: 'AB 슬라이드', nameEn: 'Ab Slide', scope: '전신', groups: ['abs'], equipment: '기타', difficulty: 'intermediate' },
    { id: 'hollow_body_hold', name: '할로우 바디 홀드', nameEn: 'Hollow Body Hold', scope: '전신', groups: ['abs'], equipment: '맨몸', difficulty: 'intermediate' },
    { id: 'seated_twist', name: '시티드 트위스트', nameEn: 'Seated Twist', scope: '전신', groups: ['abs', 'obliques'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'bicycle_crunch', name: '바이시클 크런치', nameEn: 'Bicycle Crunch', scope: '전신', groups: ['abs', 'obliques'], equipment: '맨몸', difficulty: 'intermediate' },
    { id: 'superman', name: '슈퍼맨', nameEn: 'Superman', scope: '전신', groups: ['lowerback'], equipment: '맨몸', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 전신 - 유산소 (Cardio)
    // ═══════════════════════════════════════
    { id: 'cycle', name: '사이클', nameEn: 'Cycle', scope: '전신', groups: ['quadriceps', 'calves'], equipment: '머신', difficulty: 'beginner' },
    { id: 'stepper', name: '스텝퍼', nameEn: 'Stepper', scope: '전신', groups: ['quadriceps', 'glutes'], equipment: '머신', difficulty: 'beginner' },
    { id: 'rowing_machine', name: '로잉 머신', nameEn: 'Rowing Machine', scope: '전신', groups: ['back', 'quadriceps'], equipment: '머신', difficulty: 'beginner' },
    { id: 'jump_rope', name: '줄넘기', nameEn: 'Jump Rope', scope: '전신', groups: ['calves', 'quadriceps'], equipment: '기타', difficulty: 'beginner' },
    { id: 'walking', name: '걷기', nameEn: 'Walking', scope: '전신', groups: ['quadriceps', 'calves'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'my_mountain', name: '마이 마운틴', nameEn: 'My Mountain', scope: '전신', groups: ['quadriceps', 'calves'], equipment: '머신', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 전신 - 스트레칭·회복 (Stretching & Recovery)
    // ═══════════════════════════════════════
    { id: 'stretching', name: '스트레칭', nameEn: 'Stretching', scope: '전신', groups: ['abs'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'arm_circle_stretch', name: '팔 돌리기 스트레칭', nameEn: 'Arm Circle Stretch', scope: '전신', groups: ['shoulder'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'quad_stretch', name: '허벅지(대퇴사두) 스트레칭', nameEn: 'Quad Stretch', scope: '전신', groups: ['quadriceps'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'hamstring_stretch', name: '햄스트링 스트레칭', nameEn: 'Hamstring Stretch', scope: '전신', groups: ['hamstring'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'hip_flexor_stretch', name: '장요근 스트레칭', nameEn: 'Hip Flexor Stretch', scope: '전신', groups: ['quadriceps', 'glutes'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'lower_back_stretch', name: '허리 스트레칭', nameEn: 'Lower Back Stretch', scope: '전신', groups: ['lowerback'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'hip_stretch', name: '고관절 스트레칭', nameEn: 'Hip Stretch', scope: '전신', groups: ['glutes'], equipment: '맨몸', difficulty: 'beginner' },
    { id: 'foam_roller_calves', name: '폼롤러 종아리', nameEn: 'Foam Roller Calves', scope: '전신', groups: ['calves'], equipment: '기타', difficulty: 'beginner' },

    // ═══════════════════════════════════════
    // 전신 - 보조·재활
    // ═══════════════════════════════════════
    { id: 'wrist_roller', name: '추감기', nameEn: 'Wrist Roller', scope: '전신', groups: ['bicep'], equipment: '기타', difficulty: 'beginner' },
];
