"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary" aria-hidden />
          <span className="font-semibold text-lg text-gray-900">CoolieConnect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            Admin Demo
          </Link>
          <Link href="#faq" className="text-sm text-gray-600 hover:text-gray-900">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" className="text-gray-900">
            <a href="#download">Download App</a>
          </Button>
          <UserNav />
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            <Link href="#features" className="py-2 text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="#pricing" className="py-2 text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <Link href="/admin" className="py-2 text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
              Admin Demo
            </Link>
            <Link href="#faq" className="py-2 text-gray-600 hover:text-gray-900" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <div className="pt-2 flex gap-2">
              <Button asChild variant="ghost" className="flex-1 text-gray-900">
                <a href="#download">Download App</a>
              </Button>
              <div className="flex-1">
                <UserNav />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
