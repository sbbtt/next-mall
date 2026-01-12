import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - 사용자의 장바구니 목록 조회
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('carts')
      .select('product_id, quantity')
      .eq('user_id', user.id)

    if (error) {
      console.error('Cart fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // { productId: number, quantity: number }[] 형태로 반환
    const cartItems = data?.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    })) || []
    
    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST - 장바구니 추가 (또는 수량 증가)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ error: 'productId가 필요합니다' }, { status: 400 })
    }

    // 이미 존재하는지 확인
    const { data: existing } = await supabase
      .from('carts')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      // 수량 증가
      const { error } = await supabase
        .from('carts')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)

      if (error) {
        console.error('Cart update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ message: '수량 증가 완료', quantity: existing.quantity + quantity })
    }

    // 새로 추가
    const { error } = await supabase
      .from('carts')
      .insert({ user_id: user.id, product_id: productId, quantity })

    if (error) {
      console.error('Cart insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '장바구니 추가 완료', quantity })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// PATCH - 장바구니 수량 변경
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId || typeof productId !== 'number' || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'productId와 quantity가 필요합니다' }, { status: 400 })
    }

    const { error } = await supabase
      .from('carts')
      .update({ quantity: Math.max(1, quantity) })
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      console.error('Cart update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '수량 변경 완료' })
  } catch (error) {
    console.error('Cart PATCH error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// DELETE - 장바구니 제거
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    
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
      .from('carts')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', parseInt(productId))

    if (error) {
      console.error('Cart delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '장바구니 제거 완료' })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

