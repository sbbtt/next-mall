# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 후 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: next-mall
   - **Database Password**: 강력한 비밀번호 생성 (복사해두기)
   - **Region**: Northeast Asia (Seoul)
4. **Create new project** 클릭 (2-3분 소요)

---

## 2. 환경 변수 설정

프로젝트 대시보드에서:

1. **Settings** → **API** 메뉴 이동
2. 아래 정보 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. `.env.local` 파일에 추가:

```bash
# Gemini API (기존)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (새로 추가)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3. 데이터베이스 스키마 생성

1. Supabase 대시보드 → **SQL Editor** 메뉴
2. **New query** 클릭
3. `supabase/schema.sql` 파일 내용 전체 복사/붙여넣기
4. **Run** 버튼 클릭

**생성되는 테이블:**
- `wishlists` - 찜한 상품 목록
- `carts` - 장바구니 데이터

**RLS (Row Level Security):**
- 사용자는 자신의 데이터만 읽기/쓰기 가능

---

## 4. Google OAuth 설정

### 4-1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. **APIs & Services** → **Credentials** 메뉴
4. **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. 이름: `Next Mall - Supabase Auth`
7. **Authorized redirect URIs** 추가:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
   (Supabase 대시보드 → Authentication → Providers → Google에서 확인 가능)
8. **Create** 클릭 후 **Client ID**와 **Client Secret** 복사

### 4-2. Supabase에 Google OAuth 연결

1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Google** 클릭
3. **Enable Sign in with Google** 활성화
4. 복사한 **Client ID**와 **Client Secret** 입력
5. **Save** 클릭

---

## 5. 개발 서버 재시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 접속 후:
1. Header의 **로그인** 버튼 클릭
2. Google 계정으로 로그인
3. 로그인 성공 시 Header에 사용자 아이콘 표시

---

## 6. 데이터베이스 확인

Supabase 대시보드 → **Table Editor**에서:
- `wishlists` 테이블: 로그인 후 상품 찜하면 데이터 추가됨
- `carts` 테이블: Phase 3에서 사용 예정

---

## 트러블슈팅

### 로그인 리다이렉트 오류
- `http://localhost:3001/auth/callback` 경로가 제대로 작동하는지 확인
- Google OAuth redirect URI에 현재 도메인이 등록되어 있는지 확인

### RLS 권한 오류
- SQL Editor에서 `schema.sql` 파일을 다시 실행
- Policy가 제대로 생성되었는지 확인

### 환경 변수 미적용
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작 (`npm run dev`)

---

## 다음 단계 (Phase 3)

Phase 3에서는:
- 로컬 찜하기/장바구니 → Supabase 동기화
- TanStack Query로 서버 상태 관리
- Optimistic Update 구현

Phase 2 완료! 🎉

