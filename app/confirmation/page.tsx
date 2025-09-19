"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin, Clock, Phone, MessageCircle } from "lucide-react"
import BookingStorage from "@/components/booking-storage"
import { ProtectedRoute } from "@/components/protected-route"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function pickNames(count: number) {
  const pool = [
    "Aman Kumar",
    "Rohit Singh",
    "Vikas Yadav",
    "Arjun Verma",
    "Sandeep Sharma",
    "Deepak Mishra",
    "Anil Chauhan",
    "Ravi Tiwari",
    "Vivek Gupta",
    "Pawan Pandey",
    "Mukesh Thakur",
    "Nitin Joshi",
    "Rajeev Rathi",
    "Harish Mehta",
    "Kunal Saxena",
  ]
  const names: string[] = []
  const used = new Set<number>()
  while (names.length < count && used.size < pool.length) {
    const i = Math.floor(Math.random() * pool.length)
    if (!used.has(i)) {
      used.add(i)
      names.push(pool[i])
    }
  }
  return names
}

function ConfirmationContent() {
  const searchParams = useSearchParams()

  const get = (k: string) => searchParams.get(k)
  const pt = get("pt") || "Pickup"
  const dt = get("dt") || "Drop-off"
  const d = Number(get("d") || "0")
  const fare = Number(get("fare") || "0")
  const c = Math.min(3, Math.max(1, Number(get("c") || "1")))
  const px = Number(get("px") || "0")
  const py = Number(get("py") || "0")
  const dx = Number(get("dx") || "0")
  const dy = Number(get("dy") || "0")
  const bookingId = get("bookingId")

  const names = pickNames(c)
  const assignments = names.map((name, idx) => {
    const dist = (Math.random() * 2 + 0.2).toFixed(1)
    const eta = Math.max(3, Math.round(Number.parseFloat(dist) * 10))
    const rating = (4.6 + Math.random() * 0.4).toFixed(1)
    return {
      name,
      isLead: idx === 0,
      dist,
      eta,
      rating,
      jobs: 50 + Math.floor(Math.random() * 200),
      id: 1000 + Math.floor(Math.random() * 9000),
    }
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <BookingStorage
        px={px}
        py={py}
        dx={Number.isFinite(dx) ? dx : null}
        dy={Number.isFinite(dy) ? dy : null}
        pickupLabel={pt}
        dropLabel={dt}
        name={assignments[0]?.name}
        eta={String(assignments[0]?.eta ?? "")}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
          <p className="text-muted-foreground mt-1">
            Your coolie team is being assigned. You'll receive live updates shortly.
          </p>
          {bookingId && (
            <p className="text-sm text-muted-foreground mt-2">
              Booking ID: <span className="font-mono font-medium">{bookingId}</span>
            </p>
          )}
        </div>
        <Badge className="bg-secondary text-secondary-foreground" variant="secondary">
          <Users className="h-4 w-4 mr-1" /> {c} {c > 1 ? "Coolies" : "Coolie"}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-foreground">{pt}</span>
                <span>→</span>
                <span className="font-medium text-foreground">{dt}</span>
              </div>
              <div className="text-sm flex items-center gap-4">
                <span>
                  Distance: <span className="font-medium">{d} km</span>
                </span>
                <span>
                  Est. fare: <span className="font-semibold">₹{Math.round(fare)}</span>
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {assignments.map((a, i) => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{a.name}</p>
                          {a.isLead && <Badge variant="secondary">Lead</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500" /> {a.rating} • {a.jobs}+ jobs
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> ETA ~ {a.eta} min
                          </span>
                          <span>{a.dist} km away</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {i === 0 ? (
                        <Badge className="bg-primary text-primary-foreground">Assigned</Badge>
                      ) : (
                        <Badge variant="outline">On standby</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Fare shown is an estimate. Final amount confirmed after luggage verification.</li>
                <li>• Your lead coolie will call you when they arrive at pickup location.</li>
                <li>• Keep your phone accessible for coordination.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:col-span-1">
          <h3 className="font-medium">What's next?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your lead coolie will navigate to your pickup point. You can track live movement and ETA on the map.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link
              href={`/tracking?px=${px}&py=${py}&dx=${dx}&dy=${dy}&pt=${encodeURIComponent(pt)}&dt=${encodeURIComponent(dt)}&name=${encodeURIComponent(
                assignments[0].name,
              )}&eta=${assignments[0].eta}`}
            >
              Open Live Tracking
            </Link>
          </Button>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="secondary">
              <Link href="/book">Book Another</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm">Need Help?</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Contact our support team if you have any issues with your booking.
            </p>
            <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex min-h-svh w-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading confirmation...</p>
            </div>
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </ProtectedRoute>
  )
}
