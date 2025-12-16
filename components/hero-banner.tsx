import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroBanner() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=600&width=1200&query=modern+minimalist+interior+design+hero+image)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance hover:text-accent transition-colors">
          Discover Timeless Design
          </h1>
        <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto opacity-90">
        🍀 큐레이션된 컨템포러리 디자인 가구 컬렉션을 만나보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/70">
            <Link href="/shop">컬렉션 보러가기</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
          >
            <Link href="/about">브랜드 소개</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
