-- Users 테이블 (Supabase Auth가 자동 생성, 확장용)
-- auth.users 테이블에 이미 존재

-- Wishlist 테이블
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Cart 테이블
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Wishlist RLS 정책
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- Cart RLS 정책
CREATE POLICY "Users can view their own cart"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart"
  ON public.carts FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);

-- Updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cart updated_at 트리거
CREATE TRIGGER set_carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Products 테이블 (어드민에서 등록한 상품)
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  in_stock BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products RLS 활성화
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products RLS 정책
-- 포트폴리오 환경: 마이그레이션 및 데모를 위해 완화된 정책 사용
-- 프로덕션 환경에서는 authenticated만 허용으로 변경 필요
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete products"
  ON public.products FOR DELETE
  USING (true);

-- Products updated_at 트리거
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);