# Modern E-Commerce Platform
기획의도: 학습으로의 재미에 치우친 사이드 프로젝트에서 벗어나, 비즈니스 관점에서의 밸류를 가진 포트폴리오를 위해 제작하였습니다.

## Tech Stack

### Core
- Next.js 16 (App Router): 초기 로딩 성능과 SEO 향상을 위해 리액트 서버 컴포넌트(React Server Components)를 활용했습니다.
- TypeScript: 더 나은 유지보수성과 오류 방지를 위해 정적 타이핑을 적용했습니다.
- Vercel: CI/CD 파이프라인 구축 및 호스팅 환경으로 사용됩니다.

### State Management & Data Fetching
- Zustand: 장바구니 상태 관리를 위한 가벼운 전역 상태 관리 라이브러리입니다. persist 미들웨어를 활용해 localStorage에 상태를 저장합니다.

### Backend & AI
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

#### 3. 장바구니 시스템
- Zustand persist 미들웨어로 localStorage 동기화
- 수량 조절, 개별 삭제, 전체 삭제 기능
- 실시간 총액 계산 및 상품 개수 표시
- Toast 알림으로 사용자 피드백 제공

#### 4. 제품 상세 페이지
- SSR로 SEO 최적화
- 이미지 로딩 Skeleton UI
- Fallback 이미지 처리 (404 대응)
- 반응형 2단 레이아웃

#### 5. 페이지네이션
- 페이지당 8개 상품 표시
- URL 파라미터 기반 페이지 상태 관리

### 기술적 도전과제 및 해결

#### 1. Hydration Mismatch 해결
**문제**: Radix UI의 Sheet 컴포넌트에서 서버/클라이언트 간 ID 불일치로 hydration 에러 발생

**해결**: Dynamic Import with `ssr: false` 적용
```typescript
const MobileMenu = dynamic(() => import('./mobile-menu'), { ssr: false })
```
클라이언트에서만 렌더링하여 SSR 관련 hydration 문제를 원천 차단했습니다.

#### 2. 템플릿 리터럴 파싱 이슈
**문제**: AI 프롬프트 작성 시 템플릿 리터럴 내부에 특수문자(화살표 `→`, 불릿 등)를 사용하면 TypeScript 파서 오류 발생

**해결**: 특수문자를 단순 기호로 대체
```typescript
// ❌ 파싱 에러 발생
`- 식탁 → Dining Table`

// ✅ 정상 작동
`- 식탁 = Dining Table`
```
템플릿 리터럴 내에서는 ASCII 기호만 사용하여 안정성을 확보했습니다.

#### 3. 이미지 로딩 최적화
**문제**: Unsplash API 이미지 일부가 404 에러 발생

**해결**: 
- `onError` 핸들러로 fallback 이미지 처리
- Skeleton UI로 로딩 상태 시각화
- `ProductImage` 컴포넌트로 재사용성 향상

#### 4. URL 파라미터 검증
**문제**: 사용자가 임의로 URL을 조작하여 잘못된 값 입력 가능

**해결**: 서버 측 검증 로직 구현
```typescript
const validCategories = ['furniture', 'lighting', 'decor', 'outdoor']
const validatedCategory = category && validCategories.includes(category) ? category : ''
```
화이트리스트 방식으로 허용된 값만 처리하여 보안을 강화했습니다.
