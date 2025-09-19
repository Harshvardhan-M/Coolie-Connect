"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Info, IndianRupee } from "lucide-react"
import Link from "next/link"

type Pricing = {
  base: number
  perBag: number
  perKg: number
  per100m: number
}

const defaultPricing: Pricing = {
  base: 50,
  perBag: 20,
  perKg: 5,
  per100m: 10,
}

export function FareCalculator() {
  const [bags, setBags] = useState(2)
  const [weight, setWeight] = useState(25)
  const [distance, setDistance] = useState(400) // meters
  const [coolies, setCoolies] = useState(1)
  const pricing = defaultPricing

  const estimate = useMemo(() => {
    const distanceUnits = Math.ceil(distance / 100)
    const fare = pricing.base + bags * pricing.perBag + weight * pricing.perKg + distanceUnits * pricing.per100m

    // small multiplier for multiple coolies
    const adjusted = Math.ceil(fare * (1 + (coolies - 1) * 0.6))
    return adjusted
  }, [bags, weight, distance, coolies, pricing])

  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl md:text-3xl font-semibold text-gray-900">Instant fare estimate</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Check your price before you book. Final price may vary by station rules and dynamic demand.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Fare Calculator</CardTitle>
              <CardDescription>Transparent, upfront pricing based on your inputs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="bags">Number of bags</Label>
                <Input
                  id="bags"
                  type="number"
                  min={0}
                  value={bags}
                  onChange={(e) => setBags(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="weight">Approx total weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={0}
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="distance">Distance (meters)</Label>
                <Input
                  id="distance"
                  type="number"
                  min={0}
                  step={50}
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="coolies">Number of coolies required</Label>
                <Input
                  id="coolies"
                  type="number"
                  min={1}
                  value={coolies}
                  onChange={(e) => setCoolies(Math.max(1, Number(e.target.value)))}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4 text-emerald-500" />
                Fare factors: base {defaultPricing.base}, bag {defaultPricing.perBag}/bag, weight {defaultPricing.perKg}
                /kg, distance {defaultPricing.per100m}/100m, multi-coolie factor.
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="p-6">
              <div className="text-center">
                <span className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600/10 px-3 py-1 text-sm text-blue-600 mb-3">
                  <IndianRupee className="h-4 w-4" />
                  Estimated Fare
                </span>
                <div className="text-4xl font-semibold text-gray-900">₹{estimate}</div>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Inclusive of platform service and convenience fees. Taxes may apply.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/book">Book Now</Link>
                  </Button>
                  <Button variant="outline">
                    <Link href="#how">See Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
