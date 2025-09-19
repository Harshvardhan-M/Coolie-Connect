"use client"
import { useState, useEffect, useRef } from "react"

type LatLng = { lat: number; lng: number }

// Dynamic import for Leaflet to avoid SSR issues
function InteractiveMap({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  mode,
}: {
  pickup: LatLng | null
  dropoff: LatLng | null
  onPickupChange: (p: LatLng) => void
  onDropoffChange: (p: LatLng) => void
  mode: "pickup" | "dropoff"
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const pickupMarkerRef = useRef<any>(null)
  const dropoffMarkerRef = useRef<any>(null)
  const routeLineRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        await new Promise((resolve) => {
          script.onload = resolve
          document.head.appendChild(script)
        })
      }

      setIsLoaded(true)
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || leafletMapRef.current) return

    const L = (window as any).L
    const map = L.map(mapRef.current).setView([19.076, 72.8777], 12)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    // Custom icons for pickup and dropoff
    const pickupIcon = L.divIcon({
      html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>`,
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    const dropoffIcon = L.divIcon({
      html: `<div style="background: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>`,
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    // Handle map clicks
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      const newPoint = { lat, lng }

      if (mode === "pickup") {
        onPickupChange(newPoint)
      } else {
        onDropoffChange(newPoint)
      }
    })

    leafletMapRef.current = map

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isLoaded, mode, onPickupChange, onDropoffChange])

  // Update pickup marker
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return
    const L = (window as any).L

    if (pickupMarkerRef.current) {
      leafletMapRef.current.removeLayer(pickupMarkerRef.current)
    }

    if (pickup) {
      const pickupIcon = L.divIcon({
        html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
        </div>`,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
        .addTo(leafletMapRef.current)
        .bindPopup("Pickup Location")

      leafletMapRef.current.setView([pickup.lat, pickup.lng], 15)
    }
  }, [pickup, isLoaded])

  // Update dropoff marker
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return
    const L = (window as any).L

    if (dropoffMarkerRef.current) {
      leafletMapRef.current.removeLayer(dropoffMarkerRef.current)
    }

    if (dropoff) {
      const dropoffIcon = L.divIcon({
        html: `<div style="background: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
        </div>`,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
        .addTo(leafletMapRef.current)
        .bindPopup("Drop-off Location")
    }
  }, [dropoff, isLoaded])

  // Update route line
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return
    const L = (window as any).L

    if (routeLineRef.current) {
      leafletMapRef.current.removeLayer(routeLineRef.current)
    }

    if (pickup && dropoff) {
      routeLineRef.current = L.polyline(
        [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng],
        ],
        {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.7,
          dashArray: "10, 10",
        },
      ).addTo(leafletMapRef.current)

      // Fit map to show both points
      const group = L.featureGroup([pickupMarkerRef.current, dropoffMarkerRef.current])
      leafletMapRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [pickup, dropoff, isLoaded])

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-sm shadow-lg">
        <p className="font-medium text-gray-900">
          {mode === "pickup" ? "Click to set pickup location" : "Click to set drop-off location"}
        </p>
        <p className="text-gray-600 text-xs mt-1">Zoom and pan to find the exact location</p>
      </div>
    </div>
  )
}

export default function MapPicker({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
}: {
  pickup: LatLng | null
  dropoff: LatLng | null
  onPickupChange: (p: LatLng) => void
  onDropoffChange: (p: LatLng) => void
}) {
  const [mode, setMode] = useState<"pickup" | "dropoff">("pickup")

  return (
    <div className="relative h-full w-full">
      {/* Mode selector */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <button
          type="button"
          onClick={() => setMode("pickup")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            mode === "pickup" ? "bg-red-500 text-white shadow-lg" : "bg-white/90 text-gray-700 border border-gray-200"
          }`}
        >
          Set Pickup
        </button>
        <button
          type="button"
          onClick={() => setMode("dropoff")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            mode === "dropoff" ? "bg-blue-500 text-white shadow-lg" : "bg-white/90 text-gray-700 border border-gray-200"
          }`}
        >
          Set Drop-off
        </button>
      </div>

      {/* Interactive map */}
      <InteractiveMap
        pickup={pickup}
        dropoff={dropoff}
        onPickupChange={onPickupChange}
        onDropoffChange={onDropoffChange}
        mode={mode}
      />

      {/* Location display */}
      {(pickup || dropoff) && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 space-y-2 shadow-lg">
          {pickup && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">
                Pickup: {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
              </span>
            </div>
          )}
          {dropoff && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">
                Drop-off: {dropoff.lat.toFixed(4)}, {dropoff.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
