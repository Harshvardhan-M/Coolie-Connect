import TrackingClient from "@/components/tracking-client"

type LatLng = { lat: number; lng: number }

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

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <TrackingClient searchParams={searchParams} />
}
