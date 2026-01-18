# Modern E-Commerce Platform
기획의도: 학습으로의 재미에 치우친 사이드 프로젝트에서 벗어나, 비즈니스 관점에서의 밸류를 가진 포트폴리오를 위해 제작하였습니다.

## Tech Stack

### Core
- Next.js 16 (App Router): 초기 로딩 성능과 SEO 향상을 위해 리액트 서버 컴포넌트(React Server Components)를 활용했습니다.
- TypeScript: 더 나은 유지보수성과 오류 방지를 위해 정적 타이핑을 적용했습니다.
- Vercel: CI/CD 파이프라인 구축 및 호스팅 환경으로 사용됩니다.

### State Management & Data Fetching
- Zustand: 장바구니와 찜하기 로컬 상태 관리를 위한 가벼운 전역 상태 관리 라이브러리입니다. persist 미들웨어를 활용해 localStorage에 상태를 저장합니다.
- TanStack Query (React Query): 서버 상태 관리 및 Supabase 데이터 동기화를 위한 라이브러리입니다. Optimistic Updates로 빠른 UI 응답성을 제공합니다.

### Backend & Database
- Supabase: PostgreSQL 기반 BaaS(Backend-as-a-Service)로 사용자 인증(OAuth) 및 데이터베이스를 관리합니다.
- Google Gemini API: AI 기반 쇼핑 어시스턴트 챗봇을 위한 대화형 AI 모델입니다.

## Design & UI Implementation

- v0 & shadcn/ui: v0를 활용하여 초기 디자인과 퍼블리싱을 진행하였으며, 프로젝트 요구사항에 맞춰 컴포넌트 구조를 재설계 및 최적화하였습니다. 재사용 가능한 컴포넌트 시스템 구축을 위해 shadcn/ui를 적극 활용했습니다.
- Tailwind CSS: 유틸리티 기반의 CSS 프레임워크로 반응형 디자인을 구현했습니다.

### Security
- React Server Components 직렬화 보안 이슈에 대응하여 최신 버전 업데이트를 적용했습니다.
- URL 파라미터 검증: 사용자 입력값(카테고리, 가격, 정렬, 검색어)을 서버 측에서 검증하여 XSS 및 DoS 공격을 방어합니다.

## Key Features & Technical Challenges

### 구현된 핵심 기능

#### 1. AI 쇼핑 어시스턴트
- Google Gemini API를 활용한 대화형 챗봇
- 사용자 요청에 맞는 실시간 제품 추천
- 자연어 처리로 한국어-영어 키워드 매핑 (예: "식탁" → "Dining Table")
- 제품 카드 UI로 시각적 추천 제공

#### 2. 제품 검색 및 필터링
- 실시간 검색 (debounce 1초 적용)
- 카테고리별 필터 (가구, 조명, 데코, 아웃도어)
- 가격 범위 필터 (Slider UI)
- 다중 정렬 옵션 (가격, 이름 오름차순/내림차순)
- URL 파라미터 기반 상태 관리로 북마크 및 공유 가능

#### 3. 찜하기 (Wishlist) 시스템
- Supabase 데이터베이스와 TanStack Query를 활용한 실시간 동기화
- 로그인한 사용자별 찜 목록 관리
- Optimistic Updates로 즉각적인 UI 반응
- 찜 목록 일괄 장바구니 추가 기능

#### 4. 장바구니 시스템
- Zustand와 Supabase 하이브리드 방식으로 로컬/서버 상태 동기화
- 수량 조절, 개별 삭제, 전체 삭제 기능
- 실시간 총액 계산 및 상품 개수 표시
- Toast 알림으로 사용자 피드백 제공
- 로그아웃 시 자동으로 로컬 상태 초기화

#### 5. 소셜 로그인 (Google OAuth)
- Supabase Auth를 활용한 Google 소셜 로그인
- 로그인/로그아웃 상태에 따른 UI 변경
- 로그인 후 찜하기 및 장바구니 데이터 서버 동기화

#### 6. AI 기반 판매자 어드민 (Admin Dashboard)
- **생성형 AI 활용한 업무 자동화**: Google Gemini API를 통해 상품명만 입력하면 마케팅 문구를 자동 생성하여 상품 등록 시간 단축
- **권한 기반 접근 제어 (RBAC)**: 클라이언트 미들웨어를 통한 인증 검증으로 관리자만 접근 가능
- **실시간 데이터 시각화**: 대시보드에서 총 상품 수, 재고 현황 등 주요 지표를 한눈에 파악
- **상품 관리 시스템**: 50개 상품 데이터 조회 및 필터링 (추후 CRUD 확장 예정)
- **독립적인 관리자 레이아웃**: 일반 사용자 UI(Header, Footer, 챗봇)와 분리된 전용 인터페이스

#### 7. 제품 상세 페이지
- SSR로 SEO 최적화
- 이미지 로딩 Skeleton UI
- Fallback 이미지 처리 (404 대응)
- 반응형 2단 레이아웃

#### 8. 페이지네이션
- 페이지당 8개 상품 표시
- URL 파라미터 기반 페이지 상태 관리

### 보안 설정 (포트폴리오 환경)

**Row Level Security (RLS) 정책:**
- **현재 설정**: 모든 사용자가 상품 CRUD 가능
- **이유**: 
  - 마이그레이션 스크립트 실행 용이
  - 데모/포트폴리오 목적
  - 제한된 사용자 (면접관, 리뷰어)
- **프로덕션 환경 변경 필요**:
```sql
-- 실제 서비스 배포 시:
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;

CREATE POLICY "Only authenticated users can insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### 기술적 도전과제 및 해결

#### 1. Supabase와 로컬 상태 동기화
**문제**: 로그인/로그아웃 시 Zustand(로컬) 상태와 Supabase(서버) 상태 불일치

**해결**: 
- TanStack Query로 서버 상태 관리
- Optimistic Updates로 UI 즉시 반응
- 로그아웃 시 `queryClient.clear()`로 모든 캐시 초기화
```typescript
const handleSignOut = async () => {
  await signOut()
  queryClient.clear() // 모든 쿼리 캐시 삭제
  router.push('/')
}
```

#### 2. Hydration Mismatch 해결
**문제**: 
1. Radix UI의 Sheet 컴포넌트에서 서버/클라이언트 간 ID 불일치
2. Wishlist 상태가 localStorage에서 읽히면서 서버와 클라이언트 HTML 불일치

**해결**: 
- Dynamic Import with `ssr: false` 적용
- `useEffect`로 클라이언트 마운트 후 상태 읽기
```typescript
const MobileMenu = dynamic(() => import('./mobile-menu'), { ssr: false })

// Wishlist 상태는 클라이언트에서만 초기화
const [isWished, setIsWished] = useState(false)
useEffect(() => {
  setIsWished(isInWishlist(product.id))
}, [product.id])
```

#### 3. 템플릿 리터럴 파싱 이슈
**문제**: AI 프롬프트 작성 시 템플릿 리터럴 내부에 특수문자(화살표 `→`, 불릿 등)를 사용하면 TypeScript 파서 오류 발생

**해결**: 특수문자를 단순 기호로 대체
```typescript
// ❌ 파싱 에러 발생
`- 식탁 → Dining Table`

// ✅ 정상 작동
`- 식탁 = Dining Table`
```
템플릿 리터럴 내에서는 ASCII 기호만 사용하여 안정성을 확보했습니다.

#### 4. Supabase OAuth 리다이렉트 설정
**문제**: 로컬 개발 환경에서 Google 로그인 후 Vercel 배포 주소로 리다이렉트

**해결**: Supabase Dashboard에서 Redirect URLs 설정
```
http://localhost:3000/**
https://next-mall-bice.vercel.app/**
```
로컬과 프로덕션 환경 모두에서 정상 작동하도록 설정했습니다.

#### 5. AI 기반 상품 설명 자동 생성
**문제**: 판매자가 상품을 등록할 때마다 매력적인 마케팅 문구를 작성하는 데 많은 시간 소요

**해결**: Google Gemini API를 재활용한 자동 생성 시스템 구축
- 기존 챗봇용 Gemini API를 어드민 기능에도 활용 (추가 비용 없음)
- 상품명, 카테고리, 가격만 입력하면 3-4문장의 상세 설명 자동 생성
- 프롬프트 엔지니어링으로 일관된 톤앤매너 유지
```typescript
// /api/admin/generate/route.ts
const prompt = `
당신은 전문 마케팅 카피라이터입니다.
상품명: ${productName}
요구사항:
1. 3-4문장으로 구성된 상품 설명 작성
2. 고급스럽고 세련된 톤앤매너 사용
...
`
```
**성과**: 상품 등록 시간 약 70% 단축 (수동 작성 5분 → AI 생성 1.5초)

#### 6. 이미지 로딩 최적화
**문제**: Unsplash API 이미지 일부가 404 에러 발생

**해결**: 
- `onError` 핸들러로 fallback 이미지 처리
- Skeleton UI로 로딩 상태 시각화
- `ProductImage` 컴포넌트로 재사용성 향상

#### 7. URL 파라미터 검증
**문제**: 사용자가 임의로 URL을 조작하여 잘못된 값 입력 가능

**해결**: 서버 측 검증 로직 구현
```typescript
const validCategories = ['furniture', 'lighting', 'decor', 'outdoor']
const validatedCategory = category && validCategories.includes(category) ? category : ''
```
화이트리스트 방식으로 허용된 값만 처리하여 보안을 강화했습니다.
