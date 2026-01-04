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
<<<<<<< HEAD
    referrer?: string;
=======
    referralId?: string;
>>>>>>> 4d68bfcdedbe1ceb03d0e4d44a44dd240645fcd6
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
<<<<<<< HEAD
                referrer: data.referrer || null,
=======
                referral_id: data.referralId || null,
>>>>>>> 4d68bfcdedbe1ceb03d0e4d44a44dd240645fcd6
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
            .select('id, email, name, university, gender, created_at, password_hash, is_deleted')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return { user: null, error: '등록되지 않은 이메일입니다.' };
        }

        // 삭제된 계정 체크
        if (user.is_deleted) {
            return { user: null, error: '탈퇴한 계정입니다.' };
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

// 회원 탈퇴 (Soft Delete)
export async function deleteAccount(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
    try {
        // 비밀번호 확인을 위해 사용자 조회
        const { data: user, error } = await supabase
            .from('users')
            .select('id, password_hash')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return { success: false, error: '사용자를 찾을 수 없습니다.' };
        }

        // 비밀번호 검증
        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
            return { success: false, error: '비밀번호가 올바르지 않습니다.' };
        }

        // 소프트 삭제 처리
        const { error: updateError } = await supabase
            .from('users')
            .update({
                is_deleted: true,
                deleted_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('회원 탈퇴 에러:', updateError);
            return { success: false, error: '회원 탈퇴 중 오류가 발생했습니다.' };
        }

        // 로컬 스토리지에서 세션 삭제
        signOut();

        return { success: true, error: null };
    } catch (err) {
        console.error('회원 탈퇴 에러:', err);
        return { success: false, error: '회원 탈퇴 중 오류가 발생했습니다.' };
    }
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

// ============================================
// 비밀번호 재설정 관련 함수
// ============================================

// 6자리 인증 코드 생성
function generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// 비밀번호 재설정 요청 (인증 코드 발송)
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            return { success: false, error: '올바른 이메일 형식이 아닙니다.' };
        }

        // 사용자 존재 여부 확인
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (!user) {
            return { success: false, error: '등록되지 않은 이메일입니다.' };
        }

        // 기존 미사용 코드 삭제
        await supabase
            .from('password_reset_codes')
            .delete()
            .eq('email', email.toLowerCase())
            .eq('used', false);

        // 새 인증 코드 생성
        const code = generateResetCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

        // 인증 코드 저장
        const { error } = await supabase
            .from('password_reset_codes')
            .insert({
                email: email.toLowerCase(),
                code,
                expires_at: expiresAt.toISOString(),
            });

        if (error) {
            console.error('인증 코드 저장 에러:', error);
            return { success: false, error: '인증 코드 발송에 실패했습니다.' };
        }

        // Vercel API Route를 통해 이메일 발송
        try {
            const response = await fetch('/api/send-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase(), code }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('이메일 발송 에러:', errorData);
                // 이메일 발송 실패해도 코드는 저장되었으므로 콘솔에 출력 (개발용)
                console.log('=================================');
                console.log(`비밀번호 재설정 인증 코드: ${code}`);
                console.log(`이메일: ${email}`);
                console.log('=================================');
            }
        } catch (emailError) {
            // 이메일 발송 실패해도 코드는 저장되었으므로 콘솔에 출력 (개발용)
            console.error('이메일 API 호출 에러:', emailError);
            console.log('=================================');
            console.log(`비밀번호 재설정 인증 코드: ${code}`);
            console.log(`이메일: ${email}`);
            console.log('=================================');
        }

        return { success: true, error: null };
    } catch (err) {
        console.error('비밀번호 재설정 요청 에러:', err);
        return { success: false, error: '인증 코드 발송 중 오류가 발생했습니다.' };
    }
}

// 인증 코드 확인
export async function verifyResetCode(email: string, code: string): Promise<{ valid: boolean; error: string | null }> {
    try {
        const { data: resetCode, error } = await supabase
            .from('password_reset_codes')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('code', code)
            .eq('used', false)
            .single();

        if (error || !resetCode) {
            return { valid: false, error: '인증 코드가 올바르지 않습니다.' };
        }

        // 만료 확인
        if (new Date(resetCode.expires_at) < new Date()) {
            return { valid: false, error: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
        }

        return { valid: true, error: null };
    } catch (err) {
        console.error('인증 코드 확인 에러:', err);
        return { valid: false, error: '인증 코드 확인 중 오류가 발생했습니다.' };
    }
}

// 비밀번호 재설정
export async function resetPassword(
    email: string,
    code: string,
    newPassword: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        // 비밀번호 길이 검증
        if (newPassword.length < 8) {
            return { success: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
        }

        // 인증 코드 다시 확인
        const { valid, error: verifyError } = await verifyResetCode(email, code);
        if (!valid) {
            return { success: false, error: verifyError };
        }

        // 새 비밀번호 해싱
        const passwordHash = await hashPassword(newPassword);

        // 비밀번호 업데이트
        const { error: updateError } = await supabase
            .from('users')
            .update({
                password_hash: passwordHash,
                updated_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase());

        if (updateError) {
            console.error('비밀번호 업데이트 에러:', updateError);
            return { success: false, error: '비밀번호 변경에 실패했습니다.' };
        }

        // 인증 코드 사용 처리
        await supabase
            .from('password_reset_codes')
            .update({ used: true })
            .eq('email', email.toLowerCase())
            .eq('code', code);

        return { success: true, error: null };
    } catch (err) {
        console.error('비밀번호 재설정 에러:', err);
        return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
    }
}
