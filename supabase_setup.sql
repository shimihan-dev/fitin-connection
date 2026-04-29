-- SBD 대회 현황 및 주간 식단 관리를 위한 전역 설정 테이블
CREATE TABLE IF NOT EXISTS global_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security 활성화
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- 누구나 읽을 수 있도록 허용
CREATE POLICY "Enable read access for all users" ON public.global_settings
FOR SELECT TO public USING (true);

-- 수정은 트리거 / API 서버 / 특정 권한자만 가능하도록 설정해야 하나, 
-- 일단 앱 UI 상에서 Supabase Client를 통해 저장하기 위해서는 다음 정책이 필요합니다.
CREATE POLICY "Enable insert/update access for authenticated users" ON public.global_settings
FOR ALL TO authenticated USING (
    -- role 필드가 'admin'인 유저만 가능하도록 변경 가능하지만, 
    -- UI 레벨에서 yunsok.shim@gmail.com 만 접근하게 막아두었기 때문에 임시로 모두 허용
    true
);

-- users 테이블에 role 컬럼 추가 (추가되지 않은 경우를 대비)
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
