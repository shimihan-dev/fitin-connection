export interface University {
    id: string;
    name: string;
    logo: string;
    color: string;
}

export interface SBDRecord {
    id: string;
    userId: string;
    userName: string;
    universityId: string;
    squat: number;
    bench: number;
    deadlift: number;
    total: number;
    date: string;
}

export const UNIVERSITIES: University[] = [
    { id: 'utah', name: 'University of Utah', logo: '🔴', color: 'from-red-600 to-red-800' },
    { id: 'stony', name: 'Stony Brook University', logo: '🔴', color: 'from-[#990000] to-[#660000]' },
    { id: 'gmu', name: 'George Mason University', logo: '🟢', color: 'from-green-600 to-green-800' },
    { id: 'ghent', name: 'Ghent University', logo: '🟡', color: 'from-yellow-500 to-blue-600' },
    { id: 'fit', name: 'FIT', logo: '🔵', color: 'from-blue-400 to-blue-800' },
];

// Mock Data
export const INITIAL_RECORDS: SBDRecord[] = [
    {
        id: '1',
        userId: 'u1',
        userName: '김철수',
        universityId: 'utah',
        squat: 150,
        bench: 100,
        deadlift: 180,
        total: 430,
        date: '2024-03-15',
    },
    {
        id: '2',
        userId: 'u2',
        userName: '이영희',
        universityId: 'stony',
        squat: 120,
        bench: 60,
        deadlift: 140,
        total: 320,
        date: '2024-03-16',
    },
    {
        id: '3',
        userId: 'u3',
        userName: '박지성',
        universityId: 'gmu',
        squat: 180,
        bench: 120,
        deadlift: 200,
        total: 500,
        date: '2024-03-17',
    },
];
