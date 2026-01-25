import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    const { messages } = await req.json()

    const userMessage = messages[messages.length - 1]?.text || ''

    const shoppingKeywords = [
      '가구', '소파', '의자', '테이블', '침대', '수납', '책상', '식탁',
      '조명', '램프', '전등', '스탠드',
      '데코', '인테리어', '장식', '거울', '화병', '쿠션',
      '아웃도어', '정원', '야외',
      'furniture', 'sofa', 'chair', 'table', 'bed', 'desk',
      'light', 'lamp', 'lighting',
      'decor', 'mirror', 'vase',
      '추천', '찾', '보여', '구매', '가격', '얼마', '저렴', '비싼',
      '아무거나', '아무', '알아서', '마음대로', '좋은', '예쁜', '멋진', '괜찮'
    ]
    
    const hasShoppingKeyword = shoppingKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )
    
    if (!hasShoppingKeyword && userMessage.length > 0) {
      const offTopicKeywords = ['날씨', '시간', '계산', '수학', '뉴스', '정치', 'weather', 'time', 'news']
      const isOffTopic = offTopicKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      )
      
      if (isOffTopic) {
        return NextResponse.json({
          message: '죄송합니다. 저는 가구, 조명, 인테리어 제품 추천만 도와드릴 수 있어요. 어떤 제품을 찾고 계신가요?',
          products: []
        })
      }
    }

    // Supabase에서 상품 가져오기
    const supabase = await createClient()
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)

    if (dbError || !products) {
      return NextResponse.json(
        { error: '상품 데이터를 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    const productsByCategory = {
      furniture: products.filter(p => p.category === 'furniture'),
      lighting: products.filter(p => p.category === 'lighting'),
      decor: products.filter(p => p.category === 'decor'),
      outdoor: products.filter(p => p.category === 'outdoor'),
    }

    const catalogText = Object.entries(productsByCategory).map(([category, items]) => {
      const label = { furniture: '가구', lighting: '조명', decor: '데코', outdoor: '아웃도어' }[category]
      return `[${label}]\\n` + items.map(p => `ID:${p.id} ${p.name} ${Math.floor(p.price).toLocaleString()}원`).join('\\n')
    }).join('\\n\\n')

    const systemPrompt = `너는 STORE 쇼핑몰의 AI 어시스턴트야.

중요 원칙:
1. 오직 가구, 조명, 데코, 아웃도어 제품 추천만 할 수 있어
2. 쇼핑과 관련 없는 질문(날씨, 수학, 일반 상식 등)에는 답변하지 마
3. 불필요한 질문을 하지 말고 바로 제품을 추천해! (리소스 낭비 방지)
4. 카테고리나 제품명이 명확하면 바로 추천, 추가 질문 금지!

제품 목록:
${catalogText}

응답 형식 (다른 텍스트 없이 JSON만 출력):
{"text": "한국어 짧은 메시지", "products": [숫자ID1, 숫자ID2, 숫자ID3]}

규칙:
1. 위 목록의 정확한 ID만 사용
2. products는 숫자 배열 (최대 3개, ID만!)
3. 카테고리 매칭: 의자=Chair, 소파=Sofa, 테이블/식탁=Table, 조명/램프=Lamp/Light, 침대=Bed, 책상=Desk
4. 명확한 요청은 바로 추천! "의자", "소파", "조명" 등 → 즉시 해당 제품 3개 추천
5. "아무거나", "알아서", "추천" 같은 일반 요청 → 인기 제품 3개 추천
6. 정말 애매한 경우만 간단한 질문 1번 (예: "어떤 스타일?"만)

예시 (바로 추천):
고객: "의자 추천해줘"
응답: {"text": "인기 있는 의자 추천해드릴게요!", "products": [2, 13, 18]}

고객: "소파"
응답: {"text": "멋진 소파들이에요!", "products": [1, 41]}

고객: "식탁"
응답: {"text": "식탁 추천이에요!", "products": [20]}

고객: "10만원대 의자"
응답: {"text": "예산에 맞는 의자 찾았어요!", "products": [2, 18]}

고객: "아무거나"
응답: {"text": "인기 제품 추천해드릴게요!", "products": [1, 4, 5]}

잘못된 예시 (질문 금지):
고객: "의자 추천해줘"
❌ 응답: {"text": "어떤 스타일의 의자를 찾으시나요?", "products": []}  <- 이렇게 하지 마!
✅ 응답: {"text": "인기 의자 추천해드릴게요!", "products": [2, 13, 18]}  <- 바로 추천!`

    const conversationHistory = messages
      .slice(0, -1)
      .map((msg: { role: string; text: string }) => 
        `${msg.role === 'user' ? '고객' : 'AI'}: ${msg.text}`
      )
      .join('\\n')

    const fullPrompt = `${systemPrompt}

${conversationHistory ? `이전 대화:\\n${conversationHistory}\\n` : ''}고객: ${userMessage}
AI:`

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    })

    if (!response.ok) {
      console.error('Gemini API error:', await response.text())
      return NextResponse.json(
        { error: '죄송합니다. AI 응답에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '응답을 생성할 수 없습니다.'

    console.log('🤖 AI Raw Response:', rawReply)

    try {
      const jsonMatch = rawReply.match(/```json\s*([\s\S]*?)\s*```/) || rawReply.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawReply
      
      const parsed = JSON.parse(jsonString)
      
      const validProducts = (parsed.products || [])
        .filter((item: any) => {
          const productId = typeof item === 'number' ? item : (typeof item === 'object' ? item.id : null)
          return productId && products.find(p => p.id === productId)
        })
        .map((item: any) => {
          const productId = typeof item === 'number' ? item : item.id
          const product = products.find(p => p.id === productId)
          return {
            id: productId,
            name: product?.name || '',
            image: product?.image || '',
            price: product?.price || 0,
            category: product?.category || '',
            description: product?.description.slice(0, 100) || ''
          }
        })
        .slice(0, 3)

      console.log('✅ Parsed products:', validProducts)

      return NextResponse.json({
        message: parsed.text || '추천 제품입니다:',
        products: validProducts
      })
    } catch (e) {
      console.log('❌ JSON parsing failed:', e)
      console.log('Returning text only')
      
      return NextResponse.json({
        message: rawReply,
        products: []
      })
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: '오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
