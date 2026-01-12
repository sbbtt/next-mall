import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// GET - 사용자의 찜하기 목록 조회
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Wishlist fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // product_id 배열로 반환
    const productIds = data?.map((item) => item.product_id) || []
    
    return NextResponse.json({ productIds })
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST - 찜하기 추가
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { productId } = await req.json()

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ error: 'productId가 필요합니다' }, { status: 400 })
    }

    // 이미 존재하는지 확인
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      return NextResponse.json({ message: '이미 찜한 상품입니다' })
    }

    // 추가
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, product_id: productId })

    if (error) {
      console.error('Wishlist insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '찜하기 추가 완료' })
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// DELETE - 찜하기 제거
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'productId가 필요합니다' }, { status: 400 })
    }

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', parseInt(productId))

    if (error) {
      console.error('Wishlist delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '찜하기 제거 완료' })
  } catch (error) {
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

