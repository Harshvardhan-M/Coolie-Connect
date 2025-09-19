import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  if (!q || q.length < 2) {
    return NextResponse.json([], { status: 200 })
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CoolieConnect/1.0 (Demo)",
      "Accept-Language": "en",
    },
    cache: "no-store",
  })

  if (!res.ok) {
    return NextResponse.json([], { status: 200 })
  }

  const data = await res.json()
  const items = (Array.isArray(data) ? data : []).slice(0, 5).map((d: any) => ({
    display_name: d.display_name,
    lat: d.lat,
    lon: d.lon,
  }))
  return NextResponse.json(items)
}
