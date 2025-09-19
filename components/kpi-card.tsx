import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-600">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {sub ? <div className="text-xs text-emerald-500 mt-1">{sub}</div> : null}
      </CardContent>
    </Card>
  )
}
