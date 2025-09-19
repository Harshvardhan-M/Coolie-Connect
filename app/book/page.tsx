"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { createClient } from "@/lib/supabase/client"

type LatLng = { lat: number; lng: number }

function haversine(a: LatLng, b: LatLng) {
  const R = 6371 // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false })

function BookingContent() {
  const router = useRouter()
  const supabase = createClient()
  const [pickup, setPickup] = useState<LatLng | null>(null)
  const [dropoff, setDropoff] = useState<LatLng | null>(null)
  const [pickupText, setPickupText] = useState("")
  const [dropoffText, setDropoffText] = useState("")
  const [warnOpen, setWarnOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [bagCount, setBagCount] = useState<number>(1)
  const bagOptions = [
    "Trolley bag",
    "Laptop bag",
    "Backpack",
    "Duffel",
    "Suitcase",
    "Carton",
    "Stroller",
    "Instrument case",
  ]
  const [selectedBags, setSelectedBags] = useState<string[]>([])
  const [note, setNote] = useState<string>("")

  const distanceKm = useMemo(() => {
    if (!pickup || !dropoff) return 0
    return Number.parseFloat(haversine(pickup, dropoff).toFixed(2))
  }, [pickup, dropoff])

  const estimate = useMemo(() => {
    // Base: ₹60 + ₹20 per km + bag-type fee per bag
    const base = 60
    const perKm = 20
    const bagFeeMap: Record<string, number> = {
      Suitcase: 50,
      "Trolley bag": 40,
      Duffel: 35,
      Carton: 35,
      "Instrument case": 45,
      Stroller: 25,
      Backpack: 15,
      "Laptop bag": 10,
    }
    const selectedFees = selectedBags.length ? selectedBags.map((t) => bagFeeMap[t] ?? 20) : []
    const avgFeePerBag = selectedFees.length
      ? Math.round(selectedFees.reduce((a, b) => a + b, 0) / selectedFees.length)
      : 0
    const bagFee = avgFeePerBag * Math.max(0, bagCount)
    return pickup && dropoff ? base + perKm * distanceKm + bagFee : 0
  }, [pickup, dropoff, distanceKm, selectedBags, bagCount])

  const canConfirm = !!pickup && !!dropoff && selectedBags.length > 0

  async function geocode(q: string) {
    const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { cache: "no-store" })
    const j = await r.json()
    return j?.[0]
  }

  function handleConfirm() {
    if (!pickup || !dropoff || selectedBags.length === 0) return
    setWarnOpen(true)
  }

  async function confirmAfterWarning() {
    if (!pickup || !dropoff) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const bookingData = {
      user_id: user.id,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      pickup_address: pickupText || "Selected on map",
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      dropoff_address: dropoffText || "Selected on map",
      estimated_fare: Math.round(estimate),
      status: "pending",
    }

    const { data: booking, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) {
      console.error("Error creating booking:", error)
      return
    }

    const params = new URLSearchParams({
      px: String(pickup.lat),
      py: String(pickup.lng),
      dx: String(dropoff.lat),
      dy: String(dropoff.lng),
      pt: pickupText || "Selected on map",
      dt: dropoffText || "Selected on map",
      d: String(distanceKm),
      fare: String(Math.round(estimate)),
      warned: "1",
      bags: String(bagCount),
      types: selectedBags.join(","),
      note: note || "",
      bookingId: booking.id,
    })
    router.push(`/confirmation?${params.toString()}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Home
        </Link>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <h1 className="text-2xl font-semibold text-balance">Book a Coolie</h1>
      <p className="text-muted-foreground mt-1">Follow the steps to complete your booking.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <div className={`px-2 py-1 rounded ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1. Bags & tip
            </div>
            <div className="text-muted-foreground">→</div>
            <div className={`px-2 py-1 rounded ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2. Pickup & drop
            </div>
          </div>

          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bags">How many bags do you have?</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" onClick={() => setBagCount((c) => Math.max(0, c - 1))}>
                    -
                  </Button>
                  <Input
                    id="bags"
                    type="number"
                    min={0}
                    value={bagCount}
                    onChange={(e) => setBagCount(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 text-center"
                  />
                  <Button type="button" onClick={() => setBagCount((c) => c + 1)}>
                    +
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">You can adjust this at pickup if needed.</p>
              </div>

              <div className="grid gap-2">
                <Label>Select bag types</Label>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {bagOptions.map((opt) => {
                    const active = selectedBags.includes(opt)
                    return (
                      <Button
                        key={opt}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        className={active ? "" : "bg-background"}
                        onClick={() =>
                          setSelectedBags((prev) =>
                            prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
                          )
                        }
                      >
                        {opt}
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-destructive">
                  {selectedBags.length === 0 ? "Please select at least one bag type to continue." : "\u00a0"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="note">Tip / Note for your coolie (optional)</Label>
                <Textarea
                  id="note"
                  placeholder='E.g. "I have 4 bags — 2 trolley + 2 laptop bags. Meet at Gate 3 near the taxi stand."'
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Next: choose pickup & drop on map</div>
                <Button type="button" onClick={() => setStep(2)} disabled={selectedBags.length === 0}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="pickup">Pickup</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pickup"
                      placeholder="Search pickup (e.g., Mumbai Central)"
                      value={pickupText}
                      onChange={(e) => setPickupText(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && pickupText.trim()) {
                          const item = await geocode(pickupText)
                          if (item) setPickup({ lat: Number(item.lat), lng: Number(item.lon) })
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!pickupText.trim()) return
                        const item = await geocode(pickupText)
                        if (item) setPickup({ lat: Number(item.lat), lng: Number(item.lon) })
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dropoff">Drop-off</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="dropoff"
                      placeholder="Search drop-off (e.g., CST Terminus)"
                      value={dropoffText}
                      onChange={(e) => setDropoffText(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && dropoffText.trim()) {
                          const item = await geocode(dropoffText)
                          if (item) setDropoff({ lat: Number(item.lat), lng: Number(item.lon) })
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!dropoffText.trim()) return
                        const item = await geocode(dropoffText)
                        if (item) setDropoff({ lat: Number(item.lat), lng: Number(item.lon) })
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-[380px] rounded-md overflow-hidden border">
                <MapPicker pickup={pickup} dropoff={dropoff} onPickupChange={setPickup} onDropoffChange={setDropoff} />
              </div>
            </>
          )}
        </Card>

        <Card className="p-4 md:col-span-1">
          <h2 className="text-lg font-medium">Trip summary</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bags</span>
              <span>{bagCount}</span>
            </div>
            {selectedBags.length > 0 && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Types</span>
                <span className="text-right">{selectedBags.join(", ")}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Distance</span>
              <span>{distanceKm ? `${distanceKm} km` : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base fare</span>
              <span>₹60</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Per km</span>
              <span>₹20</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bag type fee</span>
              <span>{selectedBags.length > 0 ? `Included (per bag)` : "—"}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-medium">Estimated total</span>
              <span className="font-semibold">{estimate ? `₹${Math.round(estimate)}` : "—"}</span>
            </div>
          </div>

          {step === 2 ? (
            <>
              <Button className="mt-4 w-full" disabled={!canConfirm} onClick={handleConfirm}>
                Confirm Booking
              </Button>
            </>
          ) : (
            <Button className="mt-4 w-full" onClick={() => setStep(2)} disabled={selectedBags.length === 0}>
              Next: Pickup & Drop
            </Button>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Fare is an estimate. Final price is confirmed after on-site luggage weighing by our coolies.
          </p>
        </Card>
      </div>

      <AlertDialog open={warnOpen} onOpenChange={setWarnOpen}>
        <AlertDialogOverlay className="fixed inset-0 z-[9500] bg-black/60" />
        <AlertDialogContent className="z-[10000]">
          <AlertDialogHeader>
            <AlertDialogTitle>Luggage Weight Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Our coolies will check the weight of your luggage at pickup. The final fare may change based on the
              verified weight and handling effort. Do you want to proceed with your booking?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAfterWarning}>I Understand, Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

export default function BookPage() {
  return (
    <ProtectedRoute>
      <BookingContent />
    </ProtectedRoute>
  )
}
