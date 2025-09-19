import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { FeatureGrid } from "@/components/feature-grid"
import { FareCalculator } from "@/components/fare-calculator"
import { SiteFooter } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="font-sans">
      <SiteHeader />
      <Hero />
      <FeatureGrid />
      <FareCalculator />
      <section id="book" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Booking</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use the dedicated Book page to set pickup and drop-off on a live map, see distance and fare estimate,
                  and confirm your request.
                </p>
                <Button asChild className="w-full">
                  <Link href="/book">Book a Coolie</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">For Coolies (Providers)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join CoolieConnect and earn by helping travelers. Simple onboarding, identity verification, and a
                  clear earnings dashboard.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline">Learn More</Button>
                  <Button asChild>
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-balance text-2xl md:text-3xl font-semibold text-gray-900">Frequently asked questions</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            <li>
              <h3 className="font-medium text-gray-900">Is my coolie verified?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes. All providers pass a robust KYC process and are regularly reviewed.
              </p>
            </li>
            <li>
              <h3 className="font-medium text-gray-900">How is the fare calculated?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Based on distance, number of items, and weight. You'll see the estimate upfront.
              </p>
            </li>
            <li>
              <h3 className="font-medium text-gray-900">What payment methods are supported?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">UPI, card, cash, and wallet in supported regions.</p>
            </li>
            <li>
              <h3 className="font-medium text-gray-900">Can I schedule in advance?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes. Scheduled bookings are supported for future trips and arrivals.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
