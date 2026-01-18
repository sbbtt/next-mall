import { ProductCard } from '@/components/product-card';
import { ShopFilters } from '@/components/shop-filters';
import { ShopHeader } from '@/components/shop-header';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const ITEMS_PER_PAGE = 12;

type SearchParams = {
  search?: string;
  page?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

const validCategories = ['furniture', 'lighting', 'decor', 'outdoor'];
const validSorts = ['default', 'price-asc', 'price-desc', 'name-asc', 'name-desc'];

export default async function page({searchParams}:{searchParams: Promise<SearchParams>}) {
  const params = await searchParams;
  const {
    search = '',
    page = '1',
    category = '',
    minPrice = '0',
    maxPrice = '700000',
    sort = 'default'
  } = params;
  
  // 보안: 입력 검증
  const validatedSearch = search.slice(0, 100); // 최대 100자
  const validatedCategory = category && validCategories.includes(category) ? category : '';
  const validatedMinPrice = Math.max(0, Math.min(Number(minPrice) || 0, 700000));
  const validatedMaxPrice = Math.max(0, Math.min(Number(maxPrice) || 700000, 700000));
  const validatedSort = sort && validSorts.includes(sort) ? sort : 'default';
  
  const currentPage = Number(page);
  
  // Supabase에서 상품 가져오기
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true);

  if (error) {
    console.error('Failed to fetch products:', error);
  }

  const allProducts = products || [];
  
  // 필터링
  let filteredProducts = allProducts.filter((product) => {
    // 검색어 필터
    const searchLower = validatedSearch.toLowerCase();
    const matchesSearch = !validatedSearch || 
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower));
    
    // 카테고리 필터
    const matchesCategory = !validatedCategory || product.category.toLowerCase() === validatedCategory;
    
    // 가격 필터
    const matchesPrice = product.price >= validatedMinPrice && product.price <= validatedMaxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // 정렬
  switch (validatedSort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  
  // 페이징 계산
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  // URL params 생성 헬퍼
  const buildUrl = (newParams: Partial<SearchParams>) => {
    const updatedParams = new URLSearchParams();
    const merged = { ...params, ...newParams };
    
    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== 'default' && value !== '0' && value !== '1000000') {
        updatedParams.set(key, String(value));
      }
    });
    
    return `/shop${updatedParams.toString() ? `?${updatedParams.toString()}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">
            Discover our curated collection of modern furniture and home decor
          </p>
        </div>

        {/* Header with Search and Sort */}
        <ShopHeader 
          currentSort={validatedSort}
          totalProducts={totalProducts}
          currentSearch={validatedSearch}
          currentCategory={validatedCategory}
          currentMinPrice={validatedMinPrice}
          currentMaxPrice={validatedMaxPrice}
        />

        <div className="flex gap-6 mt-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ShopFilters
              currentCategory={validatedCategory}
              currentMinPrice={validatedMinPrice}
              currentMaxPrice={validatedMaxPrice}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  검색 결과가 없습니다
                </p>
                <Button asChild variant="outline">
                  <Link href="/shop">필터 초기화</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      disabled={currentPage === 1}
                    >
                      <Link 
                        href={buildUrl({ page: String(currentPage - 1) })} 
                        aria-disabled={currentPage === 1} 
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="icon"
                            asChild
                          >
                            <Link href={buildUrl({ page: String(pageNum) })}>
                              {pageNum}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      disabled={currentPage === totalPages}
                    >
                      <Link 
                        href={buildUrl({ page: String(currentPage + 1) })} 
                        aria-disabled={currentPage === totalPages} 
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


