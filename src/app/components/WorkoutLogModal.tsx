import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { SetEntry } from '../types/workout';

interface WorkoutLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    initialSets: SetEntry[]; // If editing, pass existing sets. If new, pass empty or meaningful defaults.
    onSave: (sets: SetEntry[]) => void;
}

export function WorkoutLogModal({
    isOpen,
    onClose,
    exerciseName,
    initialSets,
    onSave,
}: WorkoutLogModalProps) {
    const [sets, setSets] = useState<SetEntry[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (initialSets && initialSets.length > 0) {
                setSets(initialSets);
            } else {
                // Default: 1 empty set
                setSets([{ setNo: 1, reps: 0, weight: 0 }]);
            }
        }
    }, [isOpen, initialSets]);

    const addSet = () => {
        setSets([
            ...sets,
            {
                setNo: sets.length + 1,
                reps: sets.length > 0 ? sets[sets.length - 1].reps : 10,
                weight: sets.length > 0 ? sets[sets.length - 1].weight : 0,
            },
        ]);
    };

    const removeSet = (index: number) => {
        const newSets = sets.filter((_, i) => i !== index).map((s, i) => ({ ...s, setNo: i + 1 }));
        setSets(newSets);
    };

    const updateSet = (index: number, field: keyof SetEntry, value: any) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSave = () => {
        // Validation: Filter out sets with 0 reps if desired, or require at least one valid set
        const validSets = sets.filter(s => s.reps > 0);
        // If user deleted all sets, maybe allow saving as empty (delete log)? 
        // For now, assume we just save what is there.
        onSave(validSets);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-white/10 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-100">{exerciseName} 기록</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-2 text-xs font-medium text-slate-400 text-center px-1">
                        <div>SET</div>
                        <div>WEIGHT (kg)</div>
                        <div>REPS</div>
                        <div></div>
                    </div>

                    <div className="space-y-2 max-h-[50vh] overflow-y-auto px-1">
                        {sets.map((set, index) => (
                            <div key={index} className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-2 items-center">
                                <div className="text-center font-bold text-slate-500 text-sm">{set.setNo}</div>
                                <Input
                                    type="number"
                                    className="h-9 text-center bg-slate-800 border-slate-700 focus:bg-slate-700"
                                    placeholder="kg"
                                    value={set.weight || ''}
                                    onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                                />
                                <Input
                                    type="number"
                                    className="h-9 text-center bg-slate-800 border-slate-700 focus:bg-slate-700"
                                    placeholder="reps"
                                    value={set.reps || ''}
                                    onChange={(e) => updateSet(index, 'reps', parseFloat(e.target.value) || 0)}
                                />
                                <div className="flex justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30"
                                        onClick={() => removeSet(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-dashed border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        onClick={addSet}
                    >
                        <Plus className="w-4 h-4 mr-2" /> 세트 추가
                    </Button>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        취소
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> 저장 완료
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
