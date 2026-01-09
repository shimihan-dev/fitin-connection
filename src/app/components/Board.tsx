import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Utensils, Dumbbell, Users, ChevronRight, ArrowLeft, PenSquare, Clock, Eye, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface BoardProps {
    user: { name: string; email: string } | null;
}

// 게시판 카테고리 정의
const boardCategories = [
    {
        id: 'free',
        name: '자유 게시판',
        description: '자유롭게 이야기해요',
        icon: MessageSquare,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/20',
    },
    {
        id: 'diet',
        name: '식단 공유',
        description: '오늘의 식단을 공유해요',
        icon: Utensils,
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-500/20',
    },
    {
        id: 'solo',
        name: '솔렉 게시판',
        description: '본교 생활/운동 팁과 경험',
        icon: Dumbbell,
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-500/20',
    },
    {
        id: 'crew',
        name: '크루 모집',
        description: '함께 운동할 크루 찾기',
        icon: Users,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-500/20',
    },
];

// 더미 게시글 데이터
const dummyPosts: Record<string, { id: string; title: string; author: string; date: string; views: number; likes: number }[]> = {
    free: [
        { id: '1', title: '오늘 처음 헬스장 갔는데 너무 떨리네요', author: '헬린이', date: '2026-01-10', views: 42, likes: 5 },
        { id: '2', title: '3개월 운동 후기입니다!', author: '근성장중', date: '2026-01-09', views: 128, likes: 23 },
        { id: '3', title: '운동 전 커피 vs 운동 후 커피?', author: '커피러버', date: '2026-01-08', views: 87, likes: 12 },
    ],
    diet: [
        { id: '1', title: '벌크업 식단 3000kcal 공유합니다', author: '벌크업장인', date: '2026-01-10', views: 156, likes: 34 },
        { id: '2', title: '닭가슴살 질리지 않게 먹는 법', author: '요리왕', date: '2026-01-09', views: 243, likes: 45 },
    ],
    solo: [
        { id: '1', title: '홈트레이닝 루틴 추천해주세요', author: '홈트러', date: '2026-01-10', views: 67, likes: 8 },
        { id: '2', title: '새벽 운동 하시는 분들 계신가요?', author: '새벽형인간', date: '2026-01-09', views: 92, likes: 15 },
    ],
    crew: [
        { id: '1', title: '주말 러닝 크루 모집합니다', author: '러닝맨', date: '2026-01-10', views: 78, likes: 11 },
        { id: '2', title: '같이 웨이트 하실 분!', author: '부산청년', date: '2026-01-09', views: 45, likes: 6 },
    ],
};

export function Board({ user }: BoardProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);

    // 게시판 카테고리 목록 뷰
    const renderCategoryList = () => (
        <div className="p-4 space-y-6">
            {/* 헤더 */}
            <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
                    <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">게시판</h1>
                <p className="text-muted-foreground text-sm mt-1">운동 이야기를 나눠보세요</p>
            </div>

            {/* 카테고리 목록 */}
            <div className="space-y-3">
                {boardCategories.map((category, index) => {
                    const Icon = category.icon;
                    const postCount = dummyPosts[category.id]?.length || 0;

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className="p-4 bg-card/50 border-white/10 cursor-pointer hover:bg-card/70 transition-colors"
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground">{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="text-sm">{postCount}개</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );

    // 게시판 목록 뷰
    const renderBoardList = () => {
        const category = boardCategories.find(c => c.id === selectedCategory);
        const posts = dummyPosts[selectedCategory || ''] || [];
        const Icon = category?.icon || MessageSquare;

        return (
            <div className="p-4 space-y-4">
                {/* 헤더 */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category?.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-foreground">{category?.name}</h2>
                        <p className="text-xs text-muted-foreground">{posts.length}개의 게시글</p>
                    </div>
                    <Button size="sm" className="flex items-center gap-1">
                        <PenSquare className="w-4 h-4" />
                        글쓰기
                    </Button>
                </div>

                {/* 게시글 목록 */}
                <div className="space-y-2">
                    {posts.length === 0 ? (
                        <Card className="p-8 bg-card/50 border-white/10 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                            <p className="text-muted-foreground">아직 게시글이 없습니다</p>
                            <p className="text-sm text-muted-foreground mt-1">첫 번째 글을 작성해보세요!</p>
                        </Card>
                    ) : (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="p-4 bg-card/50 border-white/10 cursor-pointer hover:bg-card/70 transition-colors"
                                    onClick={() => setSelectedPost(post.id)}
                                >
                                    <h3 className="font-medium text-foreground mb-2">{post.title}</h3>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{post.author}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.views}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {post.likes}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    // 게시글 상세 뷰 (더미)
    const renderPostDetail = () => {
        const category = boardCategories.find(c => c.id === selectedCategory);
        const posts = dummyPosts[selectedCategory || ''] || [];
        const post = posts.find(p => p.id === selectedPost);

        if (!post) return null;

        return (
            <div className="p-4 space-y-4">
                {/* 헤더 */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-muted-foreground">{category?.name}</span>
                </div>

                {/* 게시글 내용 */}
                <Card className="p-6 bg-card/50 border-white/10">
                    <h1 className="text-xl font-bold text-foreground mb-4">{post.title}</h1>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pb-4 border-b border-white/10">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-3">
                            <span>{post.date}</span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                            </span>
                        </div>
                    </div>
                    <div className="text-foreground leading-relaxed">
                        <p>이것은 더미 게시글 내용입니다.</p>
                        <p className="mt-4">실제 구현 시 이 부분에 게시글 본문이 표시됩니다.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            좋아요 {post.likes}
                        </Button>
                    </div>
                </Card>

                {/* 댓글 영역 (더미) */}
                <Card className="p-4 bg-card/50 border-white/10">
                    <h3 className="font-semibold text-foreground mb-4">댓글</h3>
                    <p className="text-muted-foreground text-sm text-center py-4">
                        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                    </p>
                </Card>
            </div>
        );
    };

    // 조건부 렌더링
    if (selectedPost) {
        return renderPostDetail();
    }
    if (selectedCategory) {
        return renderBoardList();
    }
    return renderCategoryList();
}
