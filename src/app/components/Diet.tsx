import { Utensils } from 'lucide-react';
import { Card } from './ui/card';

interface DietProps {
    user: { name: string; email: string };
}

export function Diet({ user }: DietProps) {
    return (
        <div className="p-4 space-y-6">
            {/* 헤더 */}
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">식단 관리</h1>
                <p className="text-gray-600 mt-2">
                    건강한 식단으로 목표를 달성하세요
                </p>
            </div>

            {/* 준비 중 안내 */}
            <Card className="p-8 text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    식단 기능 준비 중
                </h2>
                <p className="text-gray-600">
                    맞춤형 식단 추천 및 칼로리 계산 기능이<br />
                    곧 추가될 예정입니다!
                </p>
            </Card>

            {/* 예정 기능 미리보기 */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center opacity-60">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-medium text-gray-700">칼로리 계산</h3>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </Card>
                <Card className="p-4 text-center opacity-60">
                    <div className="text-3xl mb-2">🥗</div>
                    <h3 className="font-medium text-gray-700">식단 추천</h3>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </Card>
                <Card className="p-4 text-center opacity-60">
                    <div className="text-3xl mb-2">📝</div>
                    <h3 className="font-medium text-gray-700">식단 기록</h3>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </Card>
                <Card className="p-4 text-center opacity-60">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="font-medium text-gray-700">영양 분석</h3>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                </Card>
            </div>
        </div>
    );
}
