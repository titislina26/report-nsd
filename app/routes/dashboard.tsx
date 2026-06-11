import { requireMockUser } from "~/lib/auth";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Route } from "./+types/dashboard";

export function meta() {
  return [
    { title: "Dashboard — Mahaga FieldOps & Expense Manager" },
    { name: "description", content: "Overview analytics for field operations and expenses" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = requireMockUser(request);
  return { user };
}

// Mock data (will be replaced by Supabase data)
const monthlyData = [
  { name: "Jan", amount: 15000000, count: 8 },
  { name: "Feb", amount: 25000000, count: 12 },
  { name: "Mar", amount: 18000000, count: 9 },
  { name: "Apr", amount: 30000000, count: 15 },
  { name: "May", amount: 28000000, count: 14 },
  { name: "Jun", amount: 45000000, count: 21 },
];

const areaData = [
  { name: "PAPUA", value: 45, color: "#0f172a" },
  { name: "JAWA", value: 30, color: "#334155" },
  { name: "SULAWESI", value: 15, color: "#64748b" },
  { name: "NON-PAPUA", value: 10, color: "#94a3b8" },
];

const pivotData = [
  { requestor: "Budi Santoso", vsat: 5, ubiqu: 2, rtgs: 1, lora: 3, total: 11 },
  { requestor: "Andi Wijaya", vsat: 3, ubiqu: 4, rtgs: 2, lora: 1, total: 10 },
  { requestor: "Siti Aminah", vsat: 7, ubiqu: 1, rtgs: 3, lora: 2, total: 13 },
  { requestor: "Doni Pratama", vsat: 2, ubiqu: 3, rtgs: 0, lora: 5, total: 10 },
];

const recentActivity = [
  { id: "CARF-041", name: "Budi Santoso", type: "CARF NT", area: "PAPUA", amount: "Rp 5.000.000", status: "Pending", time: "2 jam lalu" },
  { id: "CARF-040", name: "Andi Wijaya", type: "CARF T", area: "JAWA", amount: "Rp 2.500.000", status: "Paid", time: "4 jam lalu" },
  { id: "CARF-039", name: "Siti Aminah", type: "CARF NT", area: "SULAWESI", amount: "Rp 10.000.000", status: "Done", time: "1 hari lalu" },
  { id: "CARF-038", name: "Doni Pratama", type: "CARF T", area: "PAPUA", amount: "Rp 7.500.000", status: "Done", time: "2 hari lalu" },
];

function StatCard({
  title,
  value,
  delta,
  deltaType,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down";
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="rounded-lg bg-slate-100 p-2">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {delta && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            {deltaType === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className={deltaType === "up" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
              {delta}
            </span>
            {subtitle}
          </p>
        )}
        {!delta && subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Done: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    "Not Yet": "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles["Not Yet"]}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ringkasan operasional lapangan dan manajemen pengeluaran CARF.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Dana Keluar"
          value="Rp 161 Jt"
          delta="+12%"
          deltaType="up"
          subtitle="dari bulan lalu"
          icon={DollarSign}
        />
        <StatCard
          title="Pekerjaan Aktif"
          value="24"
          delta="+4"
          deltaType="up"
          subtitle="minggu ini"
          icon={Briefcase}
        />
        <StatCard
          title="Pending Requests"
          value="12"
          delta="2"
          deltaType="down"
          subtitle="kurang dari kemarin"
          icon={Clock}
        />
        <StatCard
          title="Pekerjaan Selesai"
          value="142"
          subtitle="total selesai tahun ini"
          icon={CheckCircle2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Bar Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Pengeluaran Bulanan</CardTitle>
            <CardDescription>Total CARF yang dicairkan per bulan (2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(v) => `${v / 1000000}M`}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Total"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                  />
                  <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Distribusi per Area</CardTitle>
            <CardDescription>Persentase pengajuan berdasarkan wilayah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {areaData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Porsi"]} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {areaData.map((area) => (
                <div key={area.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: area.color }} />
                  <span className="text-xs text-slate-600">{area.name}</span>
                  <span className="text-xs font-semibold text-slate-900 ml-auto">{area.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pivot Table + Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Pivot Summary Table */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              Pivot: Kebutuhan per Requestor
            </CardTitle>
            <CardDescription>Count of Deskripsi Kebutuhan berdasarkan Requestor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Requestor</th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">VSAT</th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">UBIQU</th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">RTGS</th>
                    <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">LoRa</th>
                    <th className="text-right py-2 pl-2 text-xs font-semibold text-slate-900 uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pivotData.map((row) => (
                    <tr key={row.requestor} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{row.requestor}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.vsat}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.ubiqu}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.rtgs}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.lora}</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-slate-900">{row.total}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="py-2 pr-4 text-xs font-bold text-slate-500 uppercase">Grand Total</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">{pivotData.reduce((a, r) => a + r.vsat, 0)}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">{pivotData.reduce((a, r) => a + r.ubiqu, 0)}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">{pivotData.reduce((a, r) => a + r.rtgs, 0)}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-900">{pivotData.reduce((a, r) => a + r.lora, 0)}</td>
                    <td className="py-2 pl-2 text-right font-bold text-slate-900">{pivotData.reduce((a, r) => a + r.total, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
            <CardDescription>Pengajuan CARF paling baru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="rounded-full bg-slate-100 p-1.5">
                      <MapPin className="h-3 w-3 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.id} · {item.type} · {item.area}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-semibold text-slate-700">{item.amount}</span>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
