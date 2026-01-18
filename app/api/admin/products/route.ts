import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Unsplash API로 이미지 검색
async function searchUnsplashImage(query: string): Promise<string | null> {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured')
    return null
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash')
    }

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      // regular 크기 이미지 URL 반환 (적당한 해상도)
      return data.results[0].urls.regular
    }

    return null
  } catch (error) {
    console.error('Unsplash API error:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== Product Creation Started ===')
    
    const supabase = await createClient()

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('User:', user?.id, user?.email)
    console.log('Auth Error:', authError)
    
    if (!user) {
      console.error('Unauthorized: No user found')
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request Body:', body)
    
    const { name, description, price, category, image } = body

    // 유효성 검사
    if (!name || !price || !category) {
      console.error('Validation failed:', { name: !!name, price: !!price, category: !!category })
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // 이미지가 없으면 Unsplash에서 자동 검색
    let finalImage = image
    
    if (!finalImage) {
      // 카테고리와 상품명을 조합해서 검색
      const searchQuery = `${category} ${name}`.trim()
      console.log(`Searching Unsplash for: ${searchQuery}`)
      
      finalImage = await searchUnsplashImage(searchQuery)
      
      // Unsplash에서도 못 찾으면 카테고리만으로 재시도
      if (!finalImage) {
        console.log(`Retrying with category only: ${category}`)
        finalImage = await searchUnsplashImage(category)
      }
      
      // 그래도 없으면 placeholder
      if (!finalImage) {
        finalImage = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80'
      }
    }

    // Supabase에 상품 등록
    console.log('Attempting to insert product:', {
      name,
      description: description?.substring(0, 50),
      price: parseInt(price),
      category: category.toLowerCase(),
      image: finalImage?.substring(0, 50),
    })
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseInt(price),
        category: category.toLowerCase(),
        image: finalImage,
        in_stock: true,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Product created successfully:', data.id)
    return NextResponse.json({ 
      success: true,
      product: data 
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
