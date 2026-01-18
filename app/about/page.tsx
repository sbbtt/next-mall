import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-center">About Us</h1>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-semibold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2020, we set out to create a space where modern design meets timeless craftsmanship. Our
                passion for beautiful, functional pieces drives everything we do.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that your home should be a reflection of your personality, filled with pieces that bring you
                joy and comfort. That's why we carefully curate each item in our collection.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-semibold">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every product is selected for its superior craftsmanship and materials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sustainable Design</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We partner with makers who prioritize eco-friendly practices and materials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customer Focused</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your satisfaction is our priority, from browsing to delivery and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-serif font-semibold mb-4">Visit Our Showroom</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience our products in person at our flagship showroom. Our design consultants are available to help
              you create the perfect space.
            </p>
            <p className="text-sm text-muted-foreground">
              123 Design Street, Suite 100
              <br />
              San Francisco, CA 94102
              <br />
              Open Monday - Saturday, 10am - 6pm
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
