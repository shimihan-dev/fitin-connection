# IGC 피트니스 가이드 앱 🏋️‍♂️

IGC 글로벌캠퍼스 5개 해외대학교(유타대학교, 스토니브룩, FIT, 겐트대학교, 조지메이슨) 학생들을 위한 피트니스 앱입니다.

## 주요 기능

- ✅ 초보자 친화적인 운동 가이드
- ✅ 맞춤형 루틴 플래너 (달력 기능)
- ✅ 건강한 라이프스타일 팁
- ✅ 진척도 추적 및 통계
- ✅ 회원가입 및 로그인 (Supabase Auth)
- ✅ 개인화된 운동 기록 관리
- ✅ 모바일 반응형 디자인

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth, Edge Functions)
- **Animation**: Motion (Framer Motion)
- **Charts**: Recharts
- **UI Components**: Radix UI

## 🚀 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📦 배포 가이드

### Vercel로 배포하기 (추천)

#### 방법 1: GitHub을 통한 배포

1. **GitHub 저장소 생성**
   - GitHub에 새 저장소를 만듭니다
   - 프로젝트를 GitHub에 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Vercel에 배포**
   - [Vercel](https://vercel.com)에 가입합니다
   - "New Project" 클릭
   - GitHub 저장소를 연결합니다
   - 프로젝트를 선택합니다
   - 환경 변수 설정 (아래 참조)
   - "Deploy" 클릭!

3. **환경 변수 설정**
   
   Vercel 프로젝트 설정에서 다음 환경 변수를 추가하세요:
   ```
   # Supabase 설정 (이미 코드에 포함되어 있지만, 보안을 위해 환경 변수로 이동 권장)
   VITE_SUPABASE_URL=https://wkmmsowovsukqunkpybx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbW1zb3dvdnN1a3F1bmtweWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczOTEzMTcsImV4cCI6MjA4Mjk2NzMxN30.vnlmIs3rgt-euh-aomU0EyGH3zm_z5LXvi8QNuYLs8o
   ```

#### 방법 2: Vercel CLI를 통한 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### Netlify로 배포하기

1. **Netlify에 가입**: [Netlify](https://netlify.com)
2. **사이트 생성**: "New site from Git" 클릭
3. **저장소 연결**: GitHub 저장소 선택
4. **빌드 설정**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **환경 변수 설정**: Vercel과 동일하게 설정
6. **Deploy** 클릭!

### GitHub Pages로 배포하기

GitHub Pages는 무료지만 정적 사이트만 지원하므로, Supabase Edge Functions를 사용하는 경우 Vercel이나 Netlify를 권장합니다.

## 🔐 보안 설정 (중요!)

현재 Supabase 키가 코드에 하드코딩되어 있습니다. 보안을 강화하려면:

1. **환경 변수 사용**:
   - `/utils/supabase/client.ts` 파일을 수정하여 환경 변수를 사용하도록 변경
   - Vercel/Netlify 대시보드에서 환경 변수 설정

2. **Row Level Security (RLS) 활성화**:
   - Supabase 대시보드에서 테이블의 RLS를 활성화하세요

## 📱 Supabase 설정

현재 앱은 다음 Supabase 기능을 사용합니다:

- **Authentication**: 이메일/패스워드 로그인
- **Edge Functions**: 서버 로직 (선택사항)
- **Storage**: 파일 저장 (필요시)

Supabase 프로젝트: `wkmmsowovsukqunkpybx`

## 🌐 커스텀 도메인 연결

### Vercel에서:
1. 프로젝트 설정 → Domains
2. 도메인 입력 (예: igc-fitness.com)
3. DNS 레코드 업데이트 (Vercel이 안내)
4. 완료!

### Netlify에서:
1. Site settings → Domain management
2. "Add custom domain" 클릭
3. DNS 설정 업데이트
4. 완료!

## 📝 배포 후 체크리스트

- [ ] 회원가입/로그인 기능이 정상 작동하는지 확인
- [ ] 모바일 반응형이 잘 작동하는지 확인
- [ ] Supabase Auth 리다이렉트 URL 업데이트
  - Supabase 대시보드 → Authentication → URL Configuration
  - Site URL과 Redirect URLs에 배포된 도메인 추가
- [ ] 모든 페이지가 정상적으로 로드되는지 확인
- [ ] 네비게이션이 잘 작동하는지 확인
- [ ] localStorage 기능이 작동하는지 확인

## 🐛 문제 해결

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build
```

### Supabase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성 상태인지 확인

### 라우팅 오류 (404)
- `vercel.json`의 rewrites 설정 확인
- SPA 리다이렉트 설정이 올바른지 확인

## 📞 문의

IGC 글로벌캠퍼스 학생 전용 앱입니다.

---

**Made with ❤️ for IGC Global Campus Students**
