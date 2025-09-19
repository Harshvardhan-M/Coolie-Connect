"use client"

import { useEffect, useRef, useState } from "react"

type LatLng = { lat: number; lng: number }

export default function TrackingMap({
  center,
  pickup,
  dropoff,
  currentPos,
  pickupLabel,
  dropoffLabel,
}: {
  center: [number, number]
  pickup: LatLng
  dropoff?: LatLng | null
  currentPos: LatLng
  pickupLabel?: string
  dropoffLabel?: string
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const pickupMarkerRef = useRef<any>(null)
  const dropoffMarkerRef = useRef<any>(null)
  const coolieMarkerRef = useRef<any>(null)
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
    const map = L.map(mapRef.current).setView(center, 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    leafletMapRef.current = map

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isLoaded, center])

  // Update markers and routes
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return
    const L = (window as any).L

    // Clear existing markers
    if (pickupMarkerRef.current) leafletMapRef.current.removeLayer(pickupMarkerRef.current)
    if (dropoffMarkerRef.current) leafletMapRef.current.removeLayer(dropoffMarkerRef.current)
    if (coolieMarkerRef.current) leafletMapRef.current.removeLayer(coolieMarkerRef.current)
    if (routeLineRef.current) leafletMapRef.current.removeLayer(routeLineRef.current)

    // Pickup marker
    const pickupIcon = L.divIcon({
      html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="background: white; width: 12px; height: 12px; border-radius: 50%;"></div>
      </div>`,
      className: "custom-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .addTo(leafletMapRef.current)
      .bindPopup(`<strong>Pickup Location</strong><br/>${pickupLabel || "Selected on map"}`)

    // Dropoff marker (if exists)
    if (dropoff) {
      const dropoffIcon = L.divIcon({
        html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="background: white; width: 12px; height: 12px; border-radius: 50%;"></div>
        </div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`<strong>Drop-off Location</strong><br/>${dropoffLabel || "Selected on map"}`)
    }

    // Coolie marker with pulsing animation
    const coolieIcon = L.divIcon({
      html: `<div style="position: relative;">
        <div style="position: absolute; background: #10b981; width: 48px; height: 48px; border-radius: 50%; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="background: #10b981; width: 48px; height: 48px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 16px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; position: relative; z-index: 10;">
          <div style="background: white; width: 16px; height: 16px; border-radius: 50%;"></div>
        </div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>`,
      className: "custom-marker",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    })

    coolieMarkerRef.current = L.marker([currentPos.lat, currentPos.lng], { icon: coolieIcon })
      .addTo(leafletMapRef.current)
      .bindPopup("Your Coolie - Live Location")

    // Route lines
    const routePoints = []
    routePoints.push([currentPos.lat, currentPos.lng])
    routePoints.push([pickup.lat, pickup.lng])
    if (dropoff) {
      routePoints.push([dropoff.lat, dropoff.lng])
    }

    routeLineRef.current = L.polyline(routePoints, {
      color: "#10b981",
      weight: 4,
      opacity: 0.8,
      dashArray: "10, 5",
    }).addTo(leafletMapRef.current)

    // Fit map to show all points
    const allMarkers = [pickupMarkerRef.current, coolieMarkerRef.current]
    if (dropoffMarkerRef.current) allMarkers.push(dropoffMarkerRef.current)

    const group = L.featureGroup(allMarkers)
    leafletMapRef.current.fitBounds(group.getBounds().pad(0.1))
  }, [pickup, dropoff, currentPos, isLoaded, pickupLabel, dropoffLabel])

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading tracking map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />

      {/* Status overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Tracking</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border border-white"></div>
            <span className="font-medium">Your Coolie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border border-white"></div>
            <span>Pickup Location</span>
          </div>
          {dropoff && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
              <span>Drop-off Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Distance indicator */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs text-center">
          <div className="font-medium text-green-600">En Route</div>
          <div className="text-gray-600 mt-1">Moving to pickup</div>
        </div>
      </div>
    </div>
  )
}
