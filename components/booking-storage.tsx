"use client"

import { useEffect } from "react"

export type SavedBooking = {
  px: number
  py: number
  dx?: number | null
  dy?: number | null
  pickupLabel?: string | null
  dropLabel?: string | null
  name?: string | null
  eta?: string | null
  createdAt: number
}

export default function BookingStorage(props: {
  px: number
  py: number
  dx?: number | null
  dy?: number | null
  pickupLabel?: string | null
  dropLabel?: string | null
  name?: string | null
  eta?: string | null
}) {
  useEffect(() => {
    // Persist once on mount/update; safe in client
    try {
      const payload: SavedBooking = {
        px: props.px,
        py: props.py,
        dx: props.dx ?? null,
        dy: props.dy ?? null,
        pickupLabel: props.pickupLabel ?? null,
        dropLabel: props.dropLabel ?? null,
        name: props.name ?? null,
        eta: props.eta ?? null,
        createdAt: Date.now(),
      }
      localStorage.setItem("coolieconnect:lastBooking", JSON.stringify(payload))
    } catch {
      // ignore storage issues
    }
  }, [props.px, props.py, props.dx, props.dy, props.pickupLabel, props.dropLabel, props.name, props.eta])

  return null
}
