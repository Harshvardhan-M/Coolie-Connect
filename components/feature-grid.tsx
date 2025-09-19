import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Smartphone,
  MapPin,
  BedSingle as WeighingScale,
  MessageCircle,
  CreditCard,
  Star,
  ShieldCheck,
  BellRing,
} from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Easy Booking",
    desc: "Drop a precise pin and specify luggage details. Clear, step-by-step flow.",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "Track your coolie’s ETA in real-time on the map.",
  },
  {
    icon: WeighingScale,
    title: "Upfront Pricing",
    desc: "Transparent fare based on distance, items, and weight.",
  },
  {
    icon: MessageCircle,
    title: "Private Chat/Call",
    desc: "Coordinate seamlessly without sharing personal numbers.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payments",
    desc: "Cash, UPI, cards, and in‑app wallet supported.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    desc: "Choose verified porters with strong ratings.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Coolies",
    desc: "Robust KYC and identity verification.",
  },
  {
    icon: BellRing,
    title: "Smart Requests",
    desc: "Nearby porters notified instantly with your pickup info.",
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl md:text-3xl font-semibold text-gray-900">
            Built for real-world travel moments
          </h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            From heavy suitcases to multiple bags, Porta connects you with verified coolies who can help—reliably and
            safely.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="h-full">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-md bg-blue-600/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-gray-900">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
