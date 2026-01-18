// Supabase에 기존 더미 데이터 50개 마이그레이션하는 스크립트
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// JSON 파일에서 상품 데이터 읽기
const productsPath = join(__dirname, 'products-data.json')
const products = JSON.parse(readFileSync(productsPath, 'utf-8'))

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
  let skippedCount = 0
  let errorCount = 0

  for (const product of products) {
    try {
      // 중복 체크 (이름으로)
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('name', product.name)
        .single()

      if (existing) {
        console.log(`⚠️  Skipped: "${product.name}" (already exists)`)
        skippedCount++
        continue
      }

      // 새 상품 등록
      const { data, error } = await supabase
        .from('products')
        .insert(product)
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
  console.log(`⚠️  Skipped: ${skippedCount}`)
  console.log(`❌ Failed: ${errorCount}`)
  console.log(`📦 Total: ${products.length}`)
}

migrateProducts()
