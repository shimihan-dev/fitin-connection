import { useState } from 'react';
import { Search } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from './ui/sheet';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface WorkoutDictionaryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const workoutData = {
    upper: [
        {
            section: '가슴',
            exercises: [
                '벤치 프레스', '덤벨 벤치 프레스', '인클라인 벤치 프레스', '덤벨 인클라인 벤치 프레스',
                '디클라인 벤치 프레스', '덤벨 디클라인 벤치 프레스', '체스트 프레스 머신', '벤치 프레스 머신',
                '와이드 체스트 프레스', '디클라인 프레스 머신', '디클라인 체스트 프레스 머신', '인클라인 해머 프레스',
                '스포츠 프레스', '핏업 벤치 프레스', '딥스', '트라이셉스 딥스', '푸시업(팔굽혀펴기)',
                '다이아몬드 푸시업', '인클라인 푸시업', '디클라인 푸시업', '중량 푸시업', '인클라인 덤벨 플라이',
                '케이블 어퍼 플라이', '케이블 리버스 플라이', '덤벨 풀오버', '케이블 풀오버', '폼롤러 가슴'
            ]
        },
        {
            section: '등',
            exercises: [
                '랫 풀다운', '와이드 그립 랫 풀다운', '와이드 풀다운', '와이드 풀다운 프론트',
                '맥 그립 랫 풀다운', '케이블 풀다운', '언더 그립 풀다운', '클로즈 그립 풀다운',
                '스트레이트 암 풀다운', '풀업(턱걸이)', '중량 친업', '뉴트럴 그립 풀업',
                '어시스트 풀업 머신', '버티컬 트랙션', '케이블 로우', '시티드 케이블 로우(롱 풀)',
                '원 암 시티드 케이블 로우(롱 풀)', '언더 그립 시티드 로우', '로우 로우(Low Row)',
                '하이 로우 머신', '케이블 하이 로우', '레터럴 로우', '바벨 로우', '언더 그립 바벨 로우',
                '스미스 머신 바벨 로우', '티 바 로우', '체스트 서포티드 티 바 로우', '씰 로우',
                '해머 로우', '원 암 덤벨 로우', '벤드 오버 바벨 로우', '벤드 오버 덤벨 로우',
                '덤벨 업라이트 로우', '인버티드 로우', '풀오버 머신', '페이스 풀',
                '체스트 서포티드 덤벨 리어 델트 로우', '폼롤러 등'
            ]
        },
        {
            section: '어깨·승모',
            exercises: [
                '오버헤드 프레스', '밀리터리 프레스', '덤벨 숄더 프레스', '숄더 프레스 머신',
                '시티드 오버헤드 프레스', '스미스 머신 오버헤드 프레스', '스미스 머신 밀리터리 프레스',
                '아놀드 프레스', '원 암 덤벨 숄더 프레스', '레터럴 숄더 프레스', '덤벨 사이드 레터럴 레이즈',
                '원 암 케이블 레터럴 레이즈', '케이블 사이드 레터럴 레이즈', '스탠딩 레터럴 레이즈',
                '레터럴 레이즈 머신', '덤벨 프론트 프레스', '케이블 프론트 레이즈', '덤벨 벤트 오버 레터럴 레이즈',
                '벤트 오버 레터럴 레이즈 머신', '케이블 와이(Y) 레이즈', '덤벨 와이(Y) 레이즈',
                '와이(Y) 레이즈(머신/케이블)', '밴드 후면 어깨', '어깨 후면', '바벨 슈러그', '덤벨 슈러그', '슈러그'
            ]
        },
        {
            section: '팔·전완',
            exercises: [
                '바벨 컬', '덤벨 컬', '시티드 덤벨 컬', '프리처 컬', '프리처 컬 머신', '스파이더 컬',
                '드래그 컬', '케이블 컬', '원 암 케이블 컬', '케이블 로프 컬', '덤벨 해머 컬',
                '덤벨 해머 컬(인클라인)', '로프 해머 컬', '플레이트 컬', '이지바(EZ바) 리버스 컬',
                '리버스 리스트 컬', '라잉 트라이셉스 익스텐션(스컬 크러셔)', '케이블 트라이셉스 익스텐션',
                '케이블 로프 푸시다운', '원 암 케이블 푸시다운', '케이블 프레스 다운', '트라이셉스 풀다운',
                '트라이셉스 프레스 머신', '케이블 킥백', '덤벨 백 익스텐션(삼두/보조)', '원 암 덤벨 오버헤드 익스텐션',
                '오버헤드 트라이셉스 스트레칭', '전완근'
            ]
        }
    ],
    lower: [
        {
            section: '스쿼트·프레스',
            exercises: [
                '스쿼트', '로우바 스쿼트', '하이바 스쿼트', '프론트 스쿼트', '핵 스쿼트', '핵 프레스',
                '레그 프레스', '박스 스쿼트', '고블릿 스쿼트', '케틀벨 스쿼트', '덤벨 와이드 스쿼트',
                '리버스 브이 스쿼트', '오버헤드 스쿼트'
            ]
        },
        {
            section: '런지·스플릿',
            exercises: [
                '덤벨 런지', '바벨 런지', '워킹 런지', '덤벨 워킹 런지', '불가리안 스플릿 스쿼트', '쉬림프 스쿼트'
            ]
        },
        {
            section: '머신·보조',
            exercises: [
                '레그 컬', '시티드 레그 컬', '레그 익스텐션', '원 레그 익스텐션', '힙 어브덕션(아웃 타이)',
                '몬스터 글루트(링크 아웃타이)', '힙 어덕션(이너 타이)', '글루트', '카프 프레스', '시티드 카프 레이즈'
            ]
        },
        {
            section: '햄스트링 특화',
            exercises: ['노르딕 컬']
        }
    ],
    fullBody: [
        {
            section: '힌지·데드리프트',
            exercises: [
                '데드리프트', '벨트리스 데드리프트', '덤벨 데드리프트', '덤벨 스티프레그 데드리프트',
                '원 레그 데드리프트', '스모 데드리프트', '스내치 데드리프트'
            ]
        },
        {
            section: '파워·컨디셔닝',
            exercises: ['파워 클린', '스내치', '쓰러스터', '버피 테스트']
        },
        {
            section: '코어',
            exercises: [
                '싯업(윗몸 일으키기)', '벤트 니 싯업', '플랭크', '케이블 크런치', 'AB 슬라이드',
                '할로우 바디 홀드', '시티드 트위스트', '바이시클 크런치', '슈퍼맨'
            ]
        },
        {
            section: '유산소',
            exercises: ['사이클', '스텝퍼', '로잉 머신', '줄넘기', '걷기', '마이 마운틴']
        },
        {
            section: '스트레칭·회복',
            exercises: [
                '스트레칭', '팔 돌리기 스트레칭', '허벅지(대퇴사두) 스트레칭', '햄스트링 스트레칭',
                '장요근 스트레칭', '허리 스트레칭', '고관절 스트레칭', '폼롤러 종아리', '폼롤러 가슴', '폼롤러 등'
            ]
        },
        {
            section: '보조·재활',
            exercises: ['추감기']
        }
    ]
};

export function WorkoutDictionary({ open, onOpenChange }: WorkoutDictionaryProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filterExercises = (exercises: string[]) => {
        return exercises.filter(exercise =>
            exercise.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const renderWorkoutList = (categories: { section: string, exercises: string[] }[]) => {
        let hasResults = false;
        const content = categories.map((cat, idx) => {
            const filtered = filterExercises(cat.exercises);
            if (filtered.length > 0) {
                hasResults = true;
                return (
                    <div key={idx} className="mb-6">
                        <h3 className="text-sm font-bold text-blue-500 mb-3 ml-1">{cat.section}</h3>
                        <div className="space-y-1">
                            {filtered.map((ex, exIdx) => (
                                <div
                                    key={exIdx}
                                    className="px-4 py-3 bg-muted/30 hover:bg-muted/50 rounded-xl text-sm transition-colors border border-white/5"
                                >
                                    {ex}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return null;
        });

        if (!hasResults) {
            return (
                <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground">
                    <p>등록된 운동이 없습니다.</p>
                </div>
            );
        }

        return content;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[85vh] sm:h-[90vh] rounded-t-[2rem] p-0 overflow-hidden border-t-white/10">
                <div className="flex flex-col h-full bg-background">
                    <SheetHeader className="px-6 py-4 border-b border-border/50">
                        <SheetTitle className="text-lg font-bold text-center">운동 사전</SheetTitle>
                    </SheetHeader>

                    <div className="px-6 pt-6 pb-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="운동 검색"
                                className="pl-10 h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Tabs defaultValue="upper" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger value="upper" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">상체</TabsTrigger>
                                <TabsTrigger value="lower" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">하체</TabsTrigger>
                                <TabsTrigger value="fullBody" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">전신</TabsTrigger>
                            </TabsList>

                            <ScrollArea className="h-[calc(85vh-200px)] mt-4 pr-4">
                                <TabsContent value="upper" className="mt-0 pb-10">
                                    {renderWorkoutList(workoutData.upper)}
                                </TabsContent>
                                <TabsContent value="lower" className="mt-0 pb-10">
                                    {renderWorkoutList(workoutData.lower)}
                                </TabsContent>
                                <TabsContent value="fullBody" className="mt-0 pb-10">
                                    {renderWorkoutList(workoutData.fullBody)}
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
