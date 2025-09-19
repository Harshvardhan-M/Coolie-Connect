import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rows = [
  { id: "TRP-1023", customer: "Aditi S", coolie: "Ravi K", station: "Central", status: "Completed", fare: 180 },
  { id: "TRP-1024", customer: "John D", coolie: "Mahesh P", station: "East Gate", status: "Active", fare: 120 },
  { id: "TRP-1025", customer: "Neha M", coolie: "Salim A", station: "Airport T2", status: "Cancelled", fare: 0 },
  { id: "TRP-1026", customer: "Rakesh R", coolie: "Arun V", station: "Platform 5", status: "Completed", fare: 220 },
]

export function TripActivityTable() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2">Trip ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Coolie</th>
                <th className="py-2">Location</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Fare (₹)</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.customer}</td>
                  <td className="py-2">{r.coolie}</td>
                  <td className="py-2">{r.station}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        r.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : r.status === "Active"
                            ? "bg-blue-600/10 text-blue-600"
                            : "bg-gray-900/5 text-gray-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 text-right">{r.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
