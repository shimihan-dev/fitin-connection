# 🚀 빠른 배포 가이드

## 가장 쉬운 방법: Vercel 자동 배포 (5분 안에 완료!)

### 1️⃣ GitHub에 코드 업로드

```bash
# 1. GitHub에서 새 저장소 만들기 (예: igc-fitness-app)

# 2. 터미널에서 다음 명령어 실행:
git init
git add .
git commit -m "🎉 IGC 피트니스 앱 초기 커밋"
git branch -M main
git remote add origin https://github.com/당신의아이디/저장소이름.git
git push -u origin main
```

### 2️⃣ Vercel에 배포

1. **Vercel 가입**
   - https://vercel.com 접속
   - "Sign Up with GitHub" 클릭
   - GitHub 계정으로 로그인

2. **프로젝트 import**
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 목록에서 방금 만든 저장소 선택
   - "Import" 클릭

3. **자동 설정**
   - Vercel이 자동으로 Vite 프로젝트를 감지합니다
   - Framework Preset: **Vite** (자동 선택됨)
   - Build Command: `npm run build` (자동 입력됨)
   - Output Directory: `dist` (자동 입력됨)

4. **환경 변수 설정 (선택사항)**
   - "Environment Variables" 섹션 펼치기
   - 아래 변수 추가:
   ```
   Name: VITE_SUPABASE_URL
   Value: https://wkmmsowovsukqunkpybx.supabase.co

   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbW1zb3dvdnN1a3F1bmtweWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczOTEzMTcsImV4cCI6MjA4Mjk2NzMxN30.vnlmIs3rgt-euh-aomU0EyGH3zm_z5LXvi8QNuYLs8o
   ```

5. **배포 시작**
   - "Deploy" 버튼 클릭!
   - 2-3분 기다리면 완료! 🎉

6. **배포 완료!**
   - Vercel이 자동으로 URL을 생성합니다
   - 예: `https://igc-fitness-app.vercel.app`
   - 이 URL을 친구들과 공유하세요!

---

## 중요: Supabase 설정 업데이트 ⚠️

배포 후 **반드시** 다음을 수행하세요:

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택: `wkmmsowovsukqunkpybx`

2. **인증 URL 업데이트**
   - 왼쪽 메뉴: **Authentication** → **URL Configuration**
   - **Site URL**: Vercel에서 받은 URL 입력 (예: `https://igc-fitness-app.vercel.app`)
   - **Redirect URLs**: 아래 두 URL 추가:
     ```
     https://igc-fitness-app.vercel.app
     https://igc-fitness-app.vercel.app/**
     ```
   - "Save" 클릭

이제 회원가입/로그인이 정상적으로 작동합니다! ✅

---

## 대안: Netlify로 배포 (Vercel과 비슷)

1. **Netlify 가입**: https://netlify.com
2. **New site from Git** 클릭
3. **GitHub 연결** 및 저장소 선택
4. **빌드 설정**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **환경 변수**: Vercel과 동일하게 설정
6. **Deploy site** 클릭!

---

## 커스텀 도메인 연결 (선택사항)

### 도메인이 있다면:

**Vercel에서:**
1. 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `igc-fitness.com`)
3. Vercel이 제공하는 DNS 레코드를 도메인 관리 사이트에 추가
4. 완료!

**Netlify에서:**
1. Site settings → Domain management
2. "Add custom domain" 클릭
3. DNS 설정 업데이트
4. 완료!

---

## 자동 배포 설정 완료! 🎊

이제 GitHub에 코드를 푸시할 때마다 자동으로 배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "새로운 기능 추가"
git push

# 자동으로 Vercel/Netlify가 새 버전을 배포합니다!
```

---

## 문제 해결 🔧

### 1. 빌드 오류가 나는 경우
```bash
# 로컬에서 먼저 테스트
npm install
npm run build
```
- 오류가 없어야 배포 성공!

### 2. 로그인이 작동하지 않는 경우
- ✅ Supabase URL Configuration 확인
- ✅ 환경 변수가 올바르게 설정되었는지 확인

### 3. 페이지 새로고침 시 404 오류
- ✅ `vercel.json` 또는 `netlify.toml` 파일이 있는지 확인
- ✅ 이미 프로젝트에 포함되어 있으므로 문제없습니다!

---

## 배포 URL 예시

- Vercel: `https://프로젝트명.vercel.app`
- Netlify: `https://프로젝트명.netlify.app`

**축하합니다! 🎉 이제 전 세계 어디서든 앱에 접속할 수 있습니다!**
