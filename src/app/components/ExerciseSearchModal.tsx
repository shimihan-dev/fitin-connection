import { useState, useMemo } from 'react';
import { Search, Filter, Plus, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { EXERCISE_DICTIONARY } from '../data/exercises';
import { Exercise, MuscleScope, Equipment } from '../types/workout';

interface ExerciseSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExercise: (exercise: Exercise) => void;
    targetSection: string; // e.g., "가슴" or "chest" (used for context if needed)
    existingExerciseIds: string[]; // To show "Added" state
}

export function ExerciseSearchModal({
    isOpen,
    onClose,
    onAddExercise,
    targetSection,
    existingExerciseIds,
}: ExerciseSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScope, setSelectedScope] = useState<MuscleScope | 'ALL'>('ALL');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'ALL'>('ALL');

    const filteredExercises = useMemo(() => {
        return EXERCISE_DICTIONARY.filter((ex) => {
            // 1. Text Search
            const matchesSearch =
                ex.name.includes(searchTerm) ||
                (ex.nameEn && ex.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ex.groups.some(g => g.includes(searchTerm));

            if (!matchesSearch) return false;

            // 2. Scope Filter
            if (selectedScope !== 'ALL' && ex.scope !== selectedScope) return false;

            // 3. Equipment Filter
            if (selectedEquipment !== 'ALL' && ex.equipment !== selectedEquipment) return false;

            return true;
        });
    }, [searchTerm, selectedScope, selectedEquipment]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] h-[80vh] flex flex-col p-0 gap-0 bg-[#0f172a] border-white/10 text-slate-200">
                <DialogHeader className="p-4 border-b border-white/5">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-500" />
                        운동 추가
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                            to {targetSection}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {/* Search & Filters */}
                <div className="p-4 space-y-3 bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="운동명, 부위 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-slate-800 border-slate-700 text-sm"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {/* Scope Filter */}
                        <select
                            className="bg-slate-800 text-xs border border-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={selectedScope}
                            onChange={(e) => setSelectedScope(e.target.value as any)}
                        >
                            <option value="ALL">전체 부위</option>
                            <option value="상체">상체</option>
                            <option value="하체">하체</option>
                            <option value="전신">전신</option>
                        </select>

                        {/* Equipment Filter */}
                        <select
                            className="bg-slate-800 text-xs border border-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={selectedEquipment}
                            onChange={(e) => setSelectedEquipment(e.target.value as any)}
                        >
                            <option value="ALL">모든 장비</option>
                            <option value="바벨">바벨</option>
                            <option value="덤벨">덤벨</option>
                            <option value="머신">머신</option>
                            <option value="케이블">케이블</option>
                            <option value="맨몸">맨몸</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-2">
                        {filteredExercises.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground text-sm">
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            filteredExercises.map((exercise) => {
                                const isAdded = existingExerciseIds.includes(exercise.id);
                                return (
                                    <div
                                        key={exercise.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-sm text-slate-200">{exercise.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-slate-600 text-slate-400">
                                                    {exercise.groups[0]}
                                                </Badge>
                                                <span className="text-[10px] text-slate-500">{exercise.equipment}</span>
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            disabled={isAdded}
                                            onClick={() => onAddExercise(exercise)}
                                            className={`h-8 px-3 text-xs ${isAdded
                                                    ? 'bg-slate-700 text-slate-400'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="w-3 h-3 mr-1" /> 추가됨
                                                </>
                                            ) : (
                                                '추가'
                                            )}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
