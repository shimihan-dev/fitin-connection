import bcrypt from 'bcryptjs';
import { supabase } from './supabase/client';

// 사용자 타입 정의
export interface User {
    id: string;
    email: string;
    name: string;
    university?: string;
    gender?: string;
    created_at?: string;
}

// 회원가입 데이터 타입
export interface SignUpData {
    email: string;
    password: string;
    name: string;
    university?: string;
    gender?: string;
}

// 로컬 스토리지 키
const USER_STORAGE_KEY = 'igc_fitness_user';

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// 이메일 형식 검증
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 회원가입
export async function signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
        // 이메일 형식 검증
        if (!isValidEmail(data.email)) {
            return { user: null, error: '올바른 이메일 형식이 아닙니다.' };
        }

        // 비밀번호 길이 검증
        if (data.password.length < 8) {
            return { user: null, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
        }

        // 이메일 중복 확인
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', data.email.toLowerCase())
            .single();

        if (existingUser) {
            return { user: null, error: '이미 가입된 이메일입니다.' };
        }

        // 비밀번호 해싱
        const passwordHash = await hashPassword(data.password);

        // 사용자 저장
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email: data.email.toLowerCase(),
                password_hash: passwordHash,
                name: data.name,
                university: data.university || null,
                gender: data.gender || null,
            })
            .select('id, email, name, university, gender, created_at')
            .single();

        if (error) {
            console.error('회원가입 DB 에러:', error);
            return { user: null, error: '회원가입 중 오류가 발생했습니다.' };
        }

        return { user: newUser as User, error: null };
    } catch (err) {
        console.error('회원가입 에러:', err);
        return { user: null, error: '회원가입 중 오류가 발생했습니다.' };
    }
}

// 로그인
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
        // 이메일로 사용자 조회
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, university, gender, created_at, password_hash')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return { user: null, error: '등록되지 않은 이메일입니다.' };
        }

        // 비밀번호 검증
        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
            return { user: null, error: '비밀번호가 올바르지 않습니다.' };
        }

        // password_hash 제외한 사용자 정보
        const { password_hash, ...userWithoutPassword } = user;

        // 로컬 스토리지에 세션 저장
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));

        return { user: userWithoutPassword as User, error: null };
    } catch (err) {
        console.error('로그인 에러:', err);
        return { user: null, error: '로그인 중 오류가 발생했습니다.' };
    }
}

// 로그아웃
export function signOut(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
}

// 현재 로그인된 사용자 가져오기
export function getCurrentUser(): User | null {
    try {
        const userJson = localStorage.getItem(USER_STORAGE_KEY);
        if (!userJson) return null;
        return JSON.parse(userJson) as User;
    } catch {
        return null;
    }
}

// 로그인 상태 확인
export function isLoggedIn(): boolean {
    return getCurrentUser() !== null;
}
