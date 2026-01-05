import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UNIVERSITIES, SBDRecord } from '../../types/competition';

interface RecordSubmissionProps {
    onSubmit: (record: Omit<SBDRecord, 'id' | 'date'>) => void;
    userEmail: string;
    userName: string;
}

export function RecordSubmission({ onSubmit, userEmail, userName }: RecordSubmissionProps) {
    const [universityId, setUniversityId] = useState('');
    const [squat, setSquat] = useState('');
    const [bench, setBench] = useState('');
    const [deadlift, setDeadlift] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!universityId || !squat || !bench || !deadlift) return;

        const s = Number(squat);
        const b = Number(bench);
        const d = Number(deadlift);

        onSubmit({
            userId: userEmail,
            userName: userName,
            universityId,
            squat: s,
            bench: b,
            deadlift: d,
            total: s + b + d,
        });

        // Reset form
        setSquat('');
        setBench('');
        setDeadlift('');
        alert('기록이 등록되었습니다! 🏋️‍♂️');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
        >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>💪</span> 기록 측정/등록
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소속 대학교</label>
                    <div className="grid grid-cols-5 gap-2">
                        {UNIVERSITIES.map((uni) => (
                            <button
                                key={uni.id}
                                type="button"
                                onClick={() => setUniversityId(uni.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${universityId === uni.id
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                                title={uni.name}
                            >
                                <span className="text-2xl mb-1">{uni.logo}</span>
                                <span className="text-[10px] text-center leading-tight line-clamp-2 w-full">
                                    {uni.name.replace('University', '').replace('Korea', '')}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Squat</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={squat}
                                onChange={(e) => setSquat(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="0"
                                required
                            />
                            <span className="absolute right-3 top-2 text-gray-400 text-sm">kg</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bench</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={bench}
                                onChange={(e) => setBench(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="0"
                                required
                            />
                            <span className="absolute right-3 top-2 text-gray-400 text-sm">kg</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadlift</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={deadlift}
                                onChange={(e) => setDeadlift(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="0"
                                required
                            />
                            <span className="absolute right-3 top-2 text-gray-400 text-sm">kg</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 font-medium">총점 (Total)</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {(Number(squat) || 0) + (Number(bench) || 0) + (Number(deadlift) || 0)}
                            <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        기록 제출하기
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
