# Modern E-Commerce Platform
기획의도: 학습으로의 재미에 치우친 사이드 프로젝트에서 벗어나, 비즈니스 관점에서의 밸류를 가진 포트폴리오를 위해 제작하였습니다.

## Tech Stack

### Core
- Next.js (App Router): 초기 로딩 성능과 SEO 향상을 위해 리액트 서버 컴포넌트(React Server Components)를 활용했습니다.
- TypeScript: 더 나은 유지보수성과 오류 방지를 위해 정적 타이핑을 적용했습니다.
- Vercel: CI/CD 파이프라인 구축 및 호스팅 환경으로 사용됩니다.

### State Management & Data Fetching
- TanStack Query (React Query): 비동기 서버 상태, 캐싱, 그리고 백그라운드 업데이트를 관리합니다.
- Zustand: UI 상호작용(예: 장바구니, 모달 등)을 위한 가벼운 클라이언트 측 전역 상태 관리 라이브러리입니다.

### Backend & Database
- Supabase: 관리형 Postgres 데이터베이스 및 인증 서비스를 제공합니다.

## Design & UI Implementation

- v0 & shadcn/ui: v0를 활용하여 초기 디자인과 퍼블리싱을 진행하였으며, 프로젝트 요구사항에 맞춰 컴포넌트 구조를 재설계 및 최적화하였습니다. 재사용 가능한 컴포넌트 시스템 구축을 위해 shadcn/ui를 적극 활용했습니다.

### Security
- React Flight 보안 이슈 대응: React Server Components의 직렬화 과정에서 발생할 수 있는 보안 취약점을 인지하고 있습니다.
- React Server Components 직렬화 보안 이슈에 대응하여 최신 버전 업데이트를 적용했습니다. 추가적으로 DB 데이터를 클라이언트로 전달할 때 엔티티 전체를 넘기지 않고 필요한 데이터만 선별하여 전달하는 방식으로 잠재적인 데이터 노출 위험을 최소화했습니다.


## Key Features & Technical Challenges

### Core Features
- 상품 목록 및 상세 페이지를 위한 서버 사이드 렌더링(SSR).
- 장바구니 기능을 위한 클라이언트 측 상태 관리.
- 더 나은 사용자 경험을 위한 낙관적 UI(Optimistic UI) 업데이트.
- Tailwind CSS를 활용한 반응형 디자인.

### Authentication & Social Login
- Supabase Auth를 활용한 사용자 인증 시스템.
- 소셜 로그인 (Google, GitHub 등) 통합 및 세션 관리.
- JWT 기반 토큰 인증 및 보안 처리.

### Advanced UI/UX Implementation
- 무한 스크롤 (Infinite Scroll):
  - 상품 리스트 로딩 시 Intersection Observer API를 활용한 데이터 페칭 최적화.
- 자동 완성 검색 (Auto-complete):
  - 검색 API 호출 최적화를 위한 Debounce 처리 및 사용자 친화적인 드롭다운 UI 구현.
- 커스텀 캐러셀 (Carousel):
  - 외부 라이브러리 의존성을 줄이기 위해 CSS transform과 JavaScript로 직접 구현한 배너/상품 슬라이더.
- 다크 모드 (Dark Mode):
  - CSS 변수와 Context API를 활용한 시스템 테마 감지 및 테마 전환 기능.

## Deployed URL

- 개발 진행 단계로, 배포 전입니다.
