import React from 'react';
import { motion } from 'framer-motion';
import { SBDRecord, UNIVERSITIES } from '../../types/competition';

interface LeaderboardProps {
    records: SBDRecord[];
}

export function Leaderboard({ records }: LeaderboardProps) {
    // Sort records by total score
    const sortedRecords = [...records].sort((a, b) => b.total - a.total);
    const top3 = sortedRecords.slice(0, 3);

    // Calculate University Rankings (Average Total Score)
    const universityStats = UNIVERSITIES.map(uni => {
        const uniRecords = records.filter(r => r.universityId === uni.id);
        const totalScore = uniRecords.reduce((sum, r) => sum + r.total, 0);
        const avgScore = uniRecords.length > 0 ? totalScore / uniRecords.length : 0;
        return { ...uni, avgScore, memberCount: uniRecords.length };
    }).sort((a, b) => b.avgScore - a.avgScore);

    return (
        <div className="space-y-8">
            {/* Top 3 Podium */}
            <div className="bg-card/50 rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-foreground">
                    <span>🏆</span> 명예의 전당
                </h2>
                <div className="flex justify-center items-end gap-4 md:gap-8 mb-8">
                    {/* 2nd Place */}
                    {top3[1] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-zinc-700/50 border-4 border-zinc-600 flex items-center justify-center text-3xl mb-2 relative">
                                🥈
                                <span className="absolute -bottom-2 bg-zinc-600 text-white text-xs px-2 py-0.5 rounded-full">2위</span>
                            </div>
                            <p className="font-bold text-foreground">{top3[1].userName}</p>
                            <p className="text-sm text-muted-foreground">{UNIVERSITIES.find(u => u.id === top3[1].universityId)?.name}</p>
                            <p className="text-lg font-bold text-primary">{top3[1].total}kg</p>
                        </motion.div>
                    )}

                    {/* 1st Place */}
                    {top3[0] && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center -mt-8"
                        >
                            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center text-4xl mb-2 relative shadow-lg shadow-amber-500/20">
                                🥇
                                <span className="absolute -bottom-2 bg-amber-500 text-black text-xs px-3 py-0.5 rounded-full font-bold">1위</span>
                            </div>
                            <p className="font-bold text-xl text-foreground">{top3[0].userName}</p>
                            <p className="text-sm text-muted-foreground font-medium">{UNIVERSITIES.find(u => u.id === top3[0].universityId)?.name}</p>
                            <p className="text-2xl font-bold text-amber-400">{top3[0].total}kg</p>
                        </motion.div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-orange-500/20 border-4 border-orange-400 flex items-center justify-center text-3xl mb-2 relative">
                                🥉
                                <span className="absolute -bottom-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">3위</span>
                            </div>
                            <p className="font-bold text-foreground">{top3[2].userName}</p>
                            <p className="text-sm text-muted-foreground">{UNIVERSITIES.find(u => u.id === top3[2].universityId)?.name}</p>
                            <p className="text-lg font-bold text-primary">{top3[2].total}kg</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* University Ranking */}
            <div className="bg-card/50 rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                    <span>🏛️</span> 대학교 대항전 (평균 기록)
                </h2>
                <div className="space-y-4">
                    {universityStats.map((uni, index) => (
                        <div key={uni.id} className="flex items-center gap-4 p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-colors border border-white/5">
                            <div className="font-bold text-muted-foreground w-6 text-center">{index + 1}</div>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${uni.color} flex items-center justify-center text-xl shadow-sm text-white`}>
                                {uni.logo}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground">{uni.name}</h3>
                                <p className="text-xs text-muted-foreground">{uni.memberCount}명의 대표 선수</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">{Math.round(uni.avgScore)}kg</p>
                                <p className="text-xs text-muted-foreground">평균</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
