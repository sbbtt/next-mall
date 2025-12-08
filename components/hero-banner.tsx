import { Button } from "@/components/ui/button"

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
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance">
          Discover Timeless Design
        </h1>
        <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto opacity-90">
          Curated collections of contemporary furniture and decor for the modern home
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Shop Collection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
          >
            Explore More
          </Button>
        </div>
      </div>
    </section>
  )
}
