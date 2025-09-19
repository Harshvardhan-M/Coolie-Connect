import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, UserCheck, Route, Handshake } from "lucide-react"

const steps = [
  {
    icon: Target,
    title: "Pin & Specify",
    desc: "Set the exact pickup point and add luggage details.",
  },
  {
    icon: UserCheck,
    title: "Get Matched",
    desc: "We match you with a nearby verified coolie.",
  },
  {
    icon: Route,
    title: "Track & Coordinate",
    desc: "Track live location and chat/call privately.",
  },
  {
    icon: Handshake,
    title: "Complete & Pay",
    desc: "Mark completion and pay via UPI, card, or cash.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl md:text-3xl font-semibold text-gray-900">How Porta works</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            A simple, guided experience to help you move effortlessly.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, desc }) => (
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
