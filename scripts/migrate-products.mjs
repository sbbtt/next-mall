// Supabase에 기존 더미 데이터 50개 마이그레이션하는 스크립트
import { createClient } from '@supabase/supabase-js'

// 더미 데이터 직접 정의 (간단한 방법)
const products = [
  { name: "Modern Velvet Sofa", price: 489000, category: "furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", description: "깊은 좌석과 현대적인 디자인의 고급 벨벳 소파입니다. 견고한 원목 프레임과 프리미엄 원단으로 모던한 거실에 완벽합니다." },
  { name: "Scandinavian Dining Chair", price: 89000, category: "furniture", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80", description: "미드센추리 모던 디자인의 식탁 의자입니다. 인체공학적 곡선과 견고한 목재 다리로 편안함과 스타일을 제공합니다." },
  { name: "Industrial Coffee Table", price: 159000, category: "furniture", image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80", description: "금속과 나무의 조화로운 인더스트리얼 커피 테이블입니다. 수납공간이 있어 실용적이며 모던한 거실에 완벽합니다." },
  { name: "Pendant Light Fixture", price: 125000, category: "lighting", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80", description: "기하학적 디자인의 현대적인 펜던트 조명입니다. 식탁이나 거실 공간에 우아한 분위기를 연출합니다." },
  { name: "Ceramic Vase Collection", price: 62000, category: "decor", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80", description: "수제 도자기 꽃병 세트로 모던한 인테리어 포인트가 됩니다. 신선한 꽃이나 단독으로도 멋진 장식품입니다." },
  { name: "Wooden Bookshelf", price: 275000, category: "furniture", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80", description: "오픈형 원목 책장으로 책과 소품을 디스플레이할 수 있습니다. 견고한 구조와 깔끔한 디자인이 특징입니다." },
  { name: "Outdoor Lounge Set", price: 425000, category: "outdoor", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", description: "날씨에 강한 소재의 야외용 라운지 세트입니다. 편안한 쿠션과 세련된 디자인으로 테라스를 완성합니다." },
  { name: "Marble Side Table", price: 198000, category: "furniture", image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80", description: "천연 대리석 상판의 사이드 테이블입니다. 고급스러운 소재와 미니멀한 디자인이 공간에 우아함을 더합니다." }
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found')
  console.error('Make sure .env.local is loaded')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateProducts() {
  console.log('🚀 Starting product migration...')
  console.log(`📦 Total products to migrate: ${products.length}`)

  let successCount = 0
  let errorCount = 0

  for (const product of products) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category.toLowerCase(),
          image: product.image,
          in_stock: true,
        })
        .select()

      if (error) {
        console.error(`❌ ${product.name} - ${error.message}`)
        errorCount++
      } else {
        console.log(`✅ ${product.name} (ID: ${data[0].id})`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Error: ${product.name}`, err.message)
      errorCount++
    }
  }

  console.log('\n📊 Migration Summary:')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${errorCount}`)
  console.log(`📦 Total: ${products.length}`)
}

migrateProducts()
