"use client"

import { usePathname } from "next/navigation"

export function HomeCredits() {
  const pathname = usePathname()
  if (pathname !== "/") return null

  return (
    <section aria-labelledby="team-credits-title" className="mt-12 border-t border-border bg-primary/5">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h2 id="team-credits-title" className="text-balance text-lg font-semibold text-foreground mb-4">
          Built by the CoolieConnect Team
        </h2>
        <ul className="grid grid-cols-1 gap-3 text-sm text-foreground md:grid-cols-2">
          <li className="rounded-md bg-background/70 px-3 py-2 ring-1 ring-border">
            <span className="font-medium">Harshvardhan</span>
            <span className="text-muted-foreground"> — 24BCE10079</span>
          </li>
          <li className="rounded-md bg-background/70 px-3 py-2 ring-1 ring-border">
            <span className="font-medium">Smaran</span>
            <span className="text-muted-foreground"> — 24BCE10035</span>
          </li>
          <li className="rounded-md bg-background/70 px-3 py-2 ring-1 ring-border">
            <span className="font-medium">Parth</span>
            <span className="text-muted-foreground"> — 24BCE10528</span>
          </li>
          <li className="rounded-md bg-background/70 px-3 py-2 ring-1 ring-border">
            <span className="font-medium">Saswat</span>
            <span className="text-muted-foreground"> — 24BCE10017</span>
          </li>
          <li className="rounded-md bg-background/70 px-3 py-2 ring-1 ring-border md:col-span-2">
            <span className="font-medium">Devang</span>
            <span className="text-muted-foreground"> — 24BCE11332</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
