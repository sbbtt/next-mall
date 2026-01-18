import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { productName, category, price } = await request.json()

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `
당신은 전문 마케팅 카피라이터입니다.
다음 상품에 대한 매력적인 상세 설명을 작성해주세요.

상품명: ${productName}
${category ? `카테고리: ${category}` : ''}
${price ? `가격: ${price}원` : ''}

요구사항:
1. 3-4문장으로 구성된 상품 설명 작성
2. 고급스럽고 세련된 톤앤매너 사용
3. 제품의 특징, 디자인, 용도를 자연스럽게 연결
4. 구매 욕구를 자극하는 감성적인 표현 사용
5. 한국어로 작성

오직 상품 설명만 출력하고, 다른 말은 하지 마세요.
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 500,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to generate description')
    }

    const data = await response.json()
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 
      '상품 설명을 생성할 수 없습니다. 다시 시도해주세요.'

    return NextResponse.json({ 
      description: generatedText.trim() 
    })

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate product description' },
      { status: 500 }
    )
  }
}
