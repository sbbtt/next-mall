"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { ScrollArea } from "@/components/ui/scroll-area" // 사용 안 함
import { MessageCircle, X, Send } from "lucide-react"
import { products } from "@/lib/data/products"
import Image from "next/image"
import Link from "next/link"

type ProductRecommendation = {
  id: number
  description: string
}

type Message = {
  role: "user" | "bot"
  text: string
  products?: ProductRecommendation[]
}

export function ShoppingAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "안녕하세요! STORE의 쇼핑 어시스턴트입니다. 🛋️\n\n가구, 조명, 인테리어 소품을 찾고 계신가요? 무엇을 도와드릴까요?",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // 스크롤을 하단으로 이동시키는 함수
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  // 새 메시지가 추가될 때 스크롤
  useEffect(() => {
    // 이미지 로딩 대기
    const timer = setTimeout(scrollToBottom, 150)
    return () => clearTimeout(timer)
  }, [messages])
  
  // 챗봇이 열릴 때마다 하단으로 스크롤
  useEffect(() => {
    if (isExpanded) {
      // 애니메이션 대기 후 스크롤
      const timer = setTimeout(scrollToBottom, 200)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", text: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")

    // Add loading message
    const loadingMessage: Message = { role: "bot", text: "생각 중..." }
    setMessages((prev) => [...prev, loadingMessage])

    try {
      // Call Gemini API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await response.json()

      // Remove loading message and add actual response
      setMessages((prev) => {
        const withoutLoading = prev.slice(0, -1)
        return [
          ...withoutLoading,
          {
            role: "bot",
            text: data.message || data.error || "죄송합니다. 응답을 받을 수 없습니다.",
            products: data.products || [],
          },
        ]
      })
    } catch (error) {
      console.error("Chat error:", error)
      // Remove loading message and show error
      setMessages((prev) => {
        const withoutLoading = prev.slice(0, -1)
        return [
          ...withoutLoading,
          {
            role: "bot",
            text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          },
        ]
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 md:bottom-6 md:right-6 ${
          isExpanded ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        size="icon"
        aria-label="Open shopping assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Expanded chat widget */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 md:bottom-6 md:left-auto md:right-6 md:w-96 ${
          isExpanded ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <Card className="flex h-[600px] flex-col shadow-2xl md:h-[600px]">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
            <h3 className="font-semibold text-foreground">Shopping Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8"
              aria-label="Minimize chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages area */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <div ref={scrollRef} className="h-full overflow-y-auto">
              <div className="flex flex-col gap-4 p-4">
                {messages.map((message, index) => (
                  <div key={index} className="space-y-2">
                    {/* 텍스트 메시지 */}
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                    </div>

                    {/* 추천 제품 카드 (봇 메시지만) */}
                    {message.role === "bot" && message.products && message.products.length > 0 && (
                      <div className="space-y-2">
                        {message.products.map((productRec) => {
                          const product = products.find((p) => p.id === productRec.id)
                          if (!product) return null

                          return (
                            <Link
                              key={productRec.id}
                              href={`/shop/${productRec.id}`}
                              className="flex flex-col gap-2 p-3 rounded-lg bg-card hover:bg-accent transition-colors border border-border"
                              onClick={() => setIsExpanded(false)}
                            >
                              <div className="flex gap-3">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground uppercase mb-1">
                                    {product.category}
                                  </p>
                                  <p className="text-sm font-medium line-clamp-2 mb-1">
                                    {product.name}
                                  </p>
                                  <p className="text-base font-semibold text-primary">
                                    ${Math.floor(product.price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {/* AI가 생성한 한국어 설명 */}
                              <p className="text-xs text-muted-foreground line-clamp-1 pt-1 border-t border-border">
                                {productRec.description}
                              </p>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()} size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
