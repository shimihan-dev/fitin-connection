# ✅ 배포 체크리스트

배포하기 전에 다음 항목들을 확인하세요:

## 로컬 테스트
- [ ] `npm install` 실행 완료
- [ ] `npm run build` 빌드 성공
- [ ] 로컬에서 모든 기능 정상 작동 확인

## GitHub 준비
- [ ] GitHub 계정 있음
- [ ] 새 저장소 생성 완료
- [ ] Git 설치됨

## Vercel/Netlify 준비
- [ ] Vercel 또는 Netlify 계정 생성
- [ ] GitHub 연동 완료

## 배포 후 필수 작업
- [ ] Supabase Authentication URL 업데이트
  - Site URL 설정
  - Redirect URLs 추가
- [ ] 배포된 사이트에서 회원가입/로그인 테스트
- [ ] 모든 페이지 정상 작동 확인
- [ ] 모바일 반응형 확인

## 선택 사항
- [ ] 커스텀 도메인 연결
- [ ] 환경 변수로 Supabase 키 이전
- [ ] Google Analytics 추가
- [ ] SEO 최적화

---

## 빠른 배포 명령어

### Git 초기화 및 GitHub 푸시
```bash
git init
git add .
git commit -m "🚀 IGC 피트니스 앱 배포 준비"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Vercel CLI로 배포 (선택사항)
```bash
npm i -g vercel
vercel login
vercel
```

---

## 자주 묻는 질문 (FAQ)

**Q: 무료로 배포할 수 있나요?**
A: 네! Vercel과 Netlify 모두 무료 플랜을 제공합니다.

**Q: 커스텀 도메인을 사용해야 하나요?**
A: 아니요, Vercel/Netlify가 제공하는 무료 도메인을 사용할 수 있습니다.

**Q: 배포 후 코드를 수정하면 어떻게 되나요?**
A: GitHub에 푸시하면 자동으로 재배포됩니다!

**Q: Supabase 비용이 드나요?**
A: 무료 플랜으로도 충분히 사용 가능합니다.

---

## 도움이 필요하신가요?

1. README.md - 전체 문서
2. DEPLOYMENT.md - 상세한 배포 가이드
3. Vercel 문서: https://vercel.com/docs
4. Netlify 문서: https://docs.netlify.com
