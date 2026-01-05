import { useState } from 'react';
import { Leaderboard } from './Leaderboard';
import { RecordSubmission } from './RecordSubmission';
import { SBDRecord, INITIAL_RECORDS } from '../../types/competition';

interface CompetitionPageProps {
    user: { name: string; email: string } | null;
}

export function CompetitionPage({ user }: CompetitionPageProps) {
    const [records, setRecords] = useState<SBDRecord[]>(INITIAL_RECORDS);

    const handleRecordSubmit = (newRecord: Omit<SBDRecord, 'id' | 'date'>) => {
        const record: SBDRecord = {
            ...newRecord,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
        };

        // Update if user already has a record, otherwise add new
        setRecords(prev => {
            const existingFilter = prev.filter(r => r.userId !== newRecord.userId);
            return [...existingFilter, record];
        });
    };

    return (
        <div className="space-y-8 px-4 md:px-0">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    <span className="text-blue-600">IGC</span> SBD 챔피언십
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    5개 대학 대표들의 뜨거운 경쟁! 당신의 한계를 도전하고 학교의 명예를 드높이세요.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Leaderboard records={records} />
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        {user ? (
                            <RecordSubmission
                                onSubmit={handleRecordSubmit}
                                userEmail={user.email}
                                userName={user.name}
                            />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                                <p className="text-gray-500 mb-4">기록을 제출하려면 로그인이 필요합니다.</p>
                            </div>
                        )}

                        <div className="mt-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="font-bold text-lg mb-2">🔥 동기부여 명언</h3>
                            <p className="italic opacity-90">"운동은 끝나고 나서야 비로소 시작된다. 그 전까진 그저 몸풀기일 뿐이다."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
