import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Manrope } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { HomeCredits } from "@/components/home-credits"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "CoolieConnect — On‑Demand Coolie Booking",
  description:
    "Book a trusted coolie for luggage assistance at stations and terminals with live map pickup and drop-off.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${manrope.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <HomeCredits />
        <Analytics />
      </body>
    </html>
  )
}
