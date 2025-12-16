import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

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

    // 최신 사용자 메시지 추출
    const userMessage = messages[messages.length - 1]?.text || ''

    // 쇼핑 관련 키워드 체크 (간단한 필터)
    const shoppingKeywords = [
      '가구', '소파', '의자', '테이블', '침대', '수납', '책상', '식탁',
      '조명', '램프', '전등', '스탠드',
      '데코', '인테리어', '장식', '거울', '화병', '쿠션',
      '아웃도어', '정원', '야외',
      'furniture', 'sofa', 'chair', 'table', 'bed', 'desk',
      'light', 'lamp', 'lighting',
      'decor', 'mirror', 'vase',
      '추천', '찾', '보여', '구매', '가격', '얼마', '저렴', '비싼'
    ]
    
    const hasShoppingKeyword = shoppingKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )
    
    // 명백히 쇼핑과 무관한 질문 (날씨, 수학, 일반 지식 등)
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

    // 제품 카탈로그 (카테고리별)
    const productsByCategory = {
      furniture: products.filter(p => p.category === 'furniture'),
      lighting: products.filter(p => p.category === 'lighting'),
      decor: products.filter(p => p.category === 'decor'),
      outdoor: products.filter(p => p.category === 'outdoor'),
    }

    const catalogText = Object.entries(productsByCategory).map(([category, items]) => {
      const label = { furniture: '가구', lighting: '조명', decor: '데코', outdoor: '아웃도어' }[category]
      return `[${label}]\\n` + items.map(p => `ID:${p.id} ${p.name} $${Math.floor(p.price)}`).join('\\n')
    }).join('\\n\\n')

    // 쇼핑 어시스턴트 프롬프트
    const systemPrompt = `너는 STORE 쇼핑몰의 AI 어시스턴트야.

중요: 너는 오직 가구, 조명, 데코, 아웃도어 제품 추천만 할 수 있어.
쇼핑과 관련 없는 질문(날씨, 수학, 일반 상식 등)에는 답변하지 마.

제품 목록:
${catalogText}

응답 형식 (다른 텍스트 없이 JSON만 출력):
{"text": "한국어 짧은 메시지", "products": [{"id": 숫자, "description": "한국어 설명 15자 이내"}]}

규칙:
1. 위 목록의 정확한 ID만 사용
2. description은 한국어로 15자 이내
3. 최대 3개 제품 추천
4. 식탁=Dining Table, 커피테이블=Coffee Table, 소파=Sofa, 조명=Lamp/Light
5. 쇼핑 관련 없는 질문이면 products를 빈 배열로 하고 text에 안내 메시지

예시:
고객: "식탁"
응답: {"text": "식탁 추천이에요!", "products": [{"id": 20, "description": "야외용 다이닝 테이블"}]}

고객: "날씨 알려줘" (쇼핑 무관)
응답: {"text": "죄송합니다. 저는 가구/조명/인테리어 제품 추천만 도와드릴 수 있어요.", "products": []}

고객: "10만원대 의자"
응답: {"text": "예산에 맞는 의자 찾았어요!", "products": [{"id": 5, "description": "편안한 식탁 의자"}]}
`

    // 대화 컨텍스트 구성
    const conversationHistory = messages
      .slice(0, -1)
      .map((msg: { role: string; text: string }) => 
        `${msg.role === 'user' ? '고객' : 'AI'}: ${msg.text}`
      )
      .join('\\n')

    const fullPrompt = `${systemPrompt}

${conversationHistory ? `이전 대화:\\n${conversationHistory}\\n` : ''}고객: ${userMessage}
AI:`

    // Gemini REST API 호출
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

    // JSON 응답 파싱 시도
    try {
      // JSON 코드 블록 제거 (```json ... ```)
      const jsonMatch = rawReply.match(/```json\s*([\s\S]*?)\s*```/) || rawReply.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawReply
      
      const parsed = JSON.parse(jsonString)
      
      // products 배열 검증 (실제 존재하는 제품인지 확인)
      const validProducts = (parsed.products || [])
        .filter((item: any) => {
          const productId = typeof item === 'number' ? item : item.id
          return products.find(p => p.id === productId)
        })
        .map((item: any) => {
          if (typeof item === 'number') {
            // 구버전 호환: 숫자만 있는 경우
            return { id: item, description: products.find(p => p.id === item)?.description || '' }
          }
          // 새 버전: {id, description} 객체
          return {
            id: item.id,
            description: item.description || products.find(p => p.id === item.id)?.description || ''
          }
        })
        .slice(0, 3) // 최대 3개

      console.log('✅ Parsed products:', validProducts)

      return NextResponse.json({
        message: parsed.text || '추천 제품입니다:',
        products: validProducts
      })
    } catch (e) {
      console.log('❌ JSON parsing failed:', e)
      console.log('Returning text only')
      
      // JSON 파싱 실패 시 텍스트만 반환
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
