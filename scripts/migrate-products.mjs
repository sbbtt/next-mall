// Supabase에 기존 더미 데이터 50개 마이그레이션하는 스크립트
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// products.ts 내용을 읽어서 파싱 (간단한 방법)
const productsPath = join(__dirname, '../lib/data/products.ts')
const productsContent = readFileSync(productsPath, 'utf-8')

// export const products: Product[] = [ ... ] 부분 추출
const productsMatch = productsContent.match(/export const products.*?=\s*(\[[\s\S]*?\n\])/m)
if (!productsMatch) {
  console.error('❌ Could not parse products data')
  process.exit(1)
}

// JSON으로 변환 (주석 제거 등)
const productsJsonString = productsMatch[1]
  .replace(/\/\/.*$/gm, '') // 주석 제거
  .replace(/,(\s*[}\]])/g, '$1') // trailing comma 제거

const products = JSON.parse(productsJsonString)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found')
  console.error('Run: source .env.local && node scripts/migrate-products.mjs')
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
          in_stock: product.inStock !== false,
        })
        .select()

      if (error) {
        console.error(`❌ Failed: ${product.name} - ${error.message}`)
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
