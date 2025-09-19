import { SiteHeader } from "@/components/site-header"
import { KpiCard } from "@/components/kpi-card"
import { TripActivityTable } from "@/components/trip-activity-table"
import { AdminCharts } from "@/components/admin-charts"

const tripsData = [
  { day: "Mon", trips: 120, active: 15 },
  { day: "Tue", trips: 135, active: 18 },
  { day: "Wed", trips: 160, active: 20 },
  { day: "Thu", trips: 145, active: 17 },
  { day: "Fri", trips: 210, active: 25 },
  { day: "Sat", trips: 240, active: 28 },
  { day: "Sun", trips: 180, active: 22 },
]

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 138000 },
  { month: "Mar", revenue: 152500 },
  { month: "Apr", revenue: 160200 },
  { month: "May", revenue: 175400 },
  { month: "Jun", revenue: 189000 },
]

export default function AdminPage() {
  return (
    <main className="font-sans">
      <SiteHeader />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-balance text-2xl md:text-3xl font-semibold text-gray-900">Admin Dashboard (Demo)</h1>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Trips (7d)" value="1,190" sub="+8.2% vs last week" />
            <KpiCard label="Active Coolies" value="284" sub="+3.1% today" />
            <KpiCard label="Avg. Rating" value="4.7" sub="last 500 trips" />
            <KpiCard label="Revenue (MoM)" value="₹1.89M" sub="+7.9% MoM" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Charts are now rendered by a client component to avoid server import of Recharts */}
            <AdminCharts />
            <TripActivityTable />
          </div>
        </div>
      </section>
    </main>
  )
}
