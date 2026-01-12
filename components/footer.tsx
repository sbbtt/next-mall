import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">About This Project</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Next.js 16 기반 풀스택 E-Commerce 포트폴리오 프로젝트입니다.
              Supabase, TanStack Query, Google Gemini API를 활용한 실시간 동기화 쇼핑몰입니다.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-semibold mb-4">Tech Stack</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Next.js 16 (App Router)</li>
              <li>• React 19 + TypeScript</li>
              <li>• Supabase (DB + Auth)</li>
              <li>• TanStack Query</li>
              <li>• Google Gemini API</li>
              <li>• Tailwind CSS + Shadcn/ui</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a 
                  href="https://github.com/sbbtt/next-mall" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub Repository →
                </a>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} 이석주 E-Commerce Portfolio. Built with Next.js & Supabase.
          </p>
        </div>
      </div>
    </footer>
  )
} 
