"use client"

import { useMemo, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, MapPin, Phone, XCircle } from "lucide-react"
import type { SavedBooking } from "@/components/booking-storage"
import TrackingMap from "./tracking-map"

type LatLng = { lat: number; lng: number }
type SearchParams = { [key: string]: string | string[] | undefined }

// Haversine distance in km
function haversine(a: LatLng, b: LatLng) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

// Offset a ~0.5 km from base at a bearing (deg)
function offsetFromPoint(base: LatLng, distanceKm: number, bearingDeg: number): LatLng {
  const R = 6371
  const br = (bearingDeg * Math.PI) / 180
  const lat1 = (base.lat * Math.PI) / 180
  const lng1 = (base.lng * Math.PI) / 180
  const dR = distanceKm / R
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dR) + Math.cos(lat1) * Math.sin(dR) * Math.cos(br)) * (180 / Math.PI)
  const lng2 =
    (lng1 +
      Math.atan2(
        Math.sin(br) * Math.sin(dR) * Math.cos(lat1),
        Math.cos(dR) - Math.sin(lat1) * Math.sin((lat2 * Math.PI) / 180),
      )) *
    (180 / Math.PI)
  return { lat: lat2, lng: lng2 }
}

export default function TrackingClient({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter()

  // Extract primitives from server-provided search params (stable, no useSearchParams loop)
  const px = typeof searchParams?.px === "string" ? searchParams.px : undefined
  const py = typeof searchParams?.py === "string" ? searchParams.py : undefined
  const dx = typeof searchParams?.dx === "string" ? searchParams.dx : undefined
  const dy = typeof searchParams?.dy === "string" ? searchParams.dy : undefined

  const pickupLabel = typeof searchParams?.pt === "string" ? searchParams.pt : "Pickup Location"
  const dropoffLabel = typeof searchParams?.dt === "string" ? searchParams.dt : "Drop-off Location"

  // URL-provided name/eta (may be missing in production)
  const nameFromUrl = (typeof searchParams?.name === "string" && searchParams.name) || null
  const etaFromUrl = (typeof searchParams?.eta === "string" && searchParams.eta) || null

  // Load last booking from localStorage as a fallback
  const [saved, setSaved] = useState<SavedBooking | null>(null)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("coolieconnect:lastBooking")
      if (raw) {
        const parsed = JSON.parse(raw) as SavedBooking
        if (parsed && typeof parsed.px === "number" && typeof parsed.py === "number") {
          setSaved(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Compute pickup/dropoff from URL or saved fallback
  const pickup = useMemo<LatLng | null>(() => {
    if (px && py) {
      const lat = Number(py)
      const lng = Number(px)
      console.log("[v0] Parsing pickup coordinates:", { px, py, lat, lng })
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng }
    }
    if (saved?.py != null && saved?.px != null) {
      console.log("[v0] Using saved pickup coordinates:", { px: saved.px, py: saved.py })
      return { lat: saved.py, lng: saved.px }
    }
    console.log("[v0] No pickup coordinates found")
    return null
  }, [px, py, saved])

  const dropoff = useMemo<LatLng | null>(() => {
    if (dx && dy) {
      const lat = Number(dy)
      const lng = Number(dx)
      console.log("[v0] Parsing dropoff coordinates:", { dx, dy, lat, lng })
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng }
    }
    if (saved?.dy != null && saved?.dx != null) {
      console.log("[v0] Using saved dropoff coordinates:", { dx: saved.dx, dy: saved.dy })
      return { lat: saved.dy, lng: saved.dx }
    }
    console.log("[v0] No dropoff coordinates found")
    return null
  }, [dx, dy, saved])

  // Effective display name and ETA prefer URL then fallback
  const name = nameFromUrl || saved?.name || "Assigned Coolie"
  const initialEtaMin = useMemo(() => {
    const fromUrl = etaFromUrl ? Number(etaFromUrl) : Number.NaN
    if (!Number.isNaN(fromUrl) && fromUrl > 0) return fromUrl
    const savedEta = saved?.eta ? Number(saved.eta) : Number.NaN
    if (!Number.isNaN(savedEta) && savedEta > 0) return savedEta
    return 10
  }, [etaFromUrl, saved?.eta])

  const startFrom = useMemo<LatLng | null>(() => {
    if (!pickup) return null
    return offsetFromPoint(pickup, 1.0, 135) // 1km Southeast direction
  }, [pickup])

  const distanceToPickupKm = useMemo(
    () => (startFrom && pickup ? haversine(startFrom, pickup) : 0),
    [startFrom, pickup],
  )
  const approachDurationSec = useMemo(() => Math.max(60, Math.round(distanceToPickupKm * 60)), [distanceToPickupKm])

  // Animation progress (0..1) and ETA seconds
  const [t, setT] = useState(0)
  const [etaSec, setEtaSec] = useState(Math.max(initialEtaMin * 60, approachDurationSec))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [center, setCenter] = useState<[number, number]>(() => {
    if (pickup && dropoff) {
      return [(pickup.lat + dropoff.lat) / 2, (pickup.lng + dropoff.lng) / 2] as [number, number]
    }
    if (pickup) {
      return [pickup.lat, pickup.lng] as [number, number]
    }
    return [28.6139, 77.209] as [number, number] // Delhi fallback
  })

  useEffect(() => {
    if (pickup && dropoff) {
      setCenter([(pickup.lat + dropoff.lat) / 2, (pickup.lng + dropoff.lng) / 2] as [number, number])
    } else if (pickup) {
      setCenter([pickup.lat, pickup.lng] as [number, number])
    }
  }, [pickup, dropoff])

  // Single stable interval for movement
  useEffect(() => {
    if (!pickup || !startFrom) return
    const start = performance.now()
    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const nt = Math.min(1, elapsed / (approachDurationSec * 1000))
      setT(nt)
      const left = Math.max(0, approachDurationSec - elapsed / 1000)
      setEtaSec(Math.round(left))
      if (nt >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 1000)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [pickup, startFrom, approachDurationSec])

  const currentPos = useMemo<LatLng | null>(() => {
    if (!pickup || !startFrom) return null
    const lat = startFrom.lat + (pickup.lat - startFrom.lat) * t
    const lng = startFrom.lng + (pickup.lng - startFrom.lng) * t
    return { lat, lng }
  }, [startFrom, pickup, t])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const mins = Math.floor(etaSec / 60)
  const secs = etaSec % 60

  console.log("[v0] TrackingClient searchParams:", searchParams)

  console.log("[v0] Extracted coordinates:", { px, py, dx, dy })
  console.log("[v0] Extracted labels:", { pickupLabel, dropoffLabel })

  console.log("[v0] Final computed coordinates:", { pickup, dropoff })

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Live Tracking</h1>
          <p className="text-muted-foreground mt-1">Track your assigned coolie on the map in real time.</p>
        </div>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          <Clock className="h-4 w-4 mr-1" /> ETA ~ {mins}:{secs.toString().padStart(2, "0")}
        </Badge>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Pickup Location</p>
              <p className="text-xs text-muted-foreground">{pickupLabel}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Drop-off Location</p>
              <p className="text-xs text-muted-foreground">{dropoffLabel}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2">
          <div className="h-[420px] rounded-md overflow-hidden border">
            {isMounted && pickup && currentPos ? (
              <TrackingMap
                center={center}
                pickup={pickup}
                dropoff={dropoff ?? null}
                currentPos={currentPos}
                pickupLabel={pickupLabel}
                dropoffLabel={dropoffLabel}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                <div>Missing tracking coordinates.</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => router.push("/confirmation")}>
                    Back to confirmation
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => router.push("/book")}>
                    Start booking
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 md:col-span-1">
          <h3 className="font-medium">Your Coolie</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">Status: {t < 1 ? "En route to pickup" : "Arrived"}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" className="w-full" onClick={() => alert("Calling coolie...")}>
              <Phone className="h-4 w-4 mr-2" /> Call
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>

          <div className="mt-4 rounded-md bg-muted p-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <p className="font-medium">Weight Policy</p>
                <p className="text-muted-foreground">
                  Final fare is confirmed after your coolie verifies luggage weight at pickup.
                </p>
              </div>
            </div>
          </div>

          <Button variant="ghost" className="mt-2 w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Card>
      </div>
    </main>
  )
}
