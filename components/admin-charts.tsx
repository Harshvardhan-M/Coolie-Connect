"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function AdminCharts() {
  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-gray-900">Trips & Active Coolies (7 days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tripsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trips" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
