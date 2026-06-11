import { useState } from "react";
import { redirect } from "react-router";
import { createClient } from "~/lib/server";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Plus, MapPin, Calendar, User, CreditCard, Briefcase } from "lucide-react";
import type { Route } from "./+types/field-ops";

export function meta() {
  return [
    { title: "Field Operations — Mahaga FieldOps" },
    { name: "description", content: "Track technician jobs and field operation status" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return redirect("/login");
  return { user: session.user };
}

// --- Types & Mock Data ---
interface Job {
  id: string;
  title: string;
  tech: string;
  area: string;
  start: string;
  end: string;
  status: "To Do" | "In Progress" | "Done";
  type: string;
}

interface Technician {
  id: string;
  name: string;
  area_coverage: string;
  bank_name: string;
  bank_account_no: string;
  jobs_done: number;
}

const TECHNICIANS: Technician[] = [
  { id: "t1", name: "Budi Santoso", area_coverage: "Papua & Maluku", bank_name: "BCA", bank_account_no: "1234567890", jobs_done: 34 },
  { id: "t2", name: "Andi Wijaya", area_coverage: "Jawa Barat", bank_name: "Mandiri", bank_account_no: "0987654321", jobs_done: 28 },
  { id: "t3", name: "Siti Aminah", area_coverage: "Sulawesi Selatan", bank_name: "BNI", bank_account_no: "1122334455", jobs_done: 21 },
  { id: "t4", name: "Doni Pratama", area_coverage: "Kalimantan", bank_name: "BRI", bank_account_no: "5544332211", jobs_done: 19 },
];

const MOCK_JOBS: Job[] = [
  { id: "j1", title: "Install VSAT Papua Remote", tech: "Budi Santoso", area: "PAPUA", start: "2026-06-12", end: "2026-06-15", status: "To Do", type: "VSAT" },
  { id: "j2", title: "Maintenance RTGS Jabar", tech: "Andi Wijaya", area: "JAWA", start: "2026-06-10", end: "2026-06-11", status: "In Progress", type: "RTGS" },
  { id: "j3", title: "UBIQU Site Survey Sulsel", tech: "Siti Aminah", area: "SULAWESI", start: "2026-06-09", end: "2026-06-12", status: "In Progress", type: "UBIQU" },
  { id: "j4", title: "LoRa Gateway Sorong", tech: "Doni Pratama", area: "PAPUA", start: "2026-06-08", end: "2026-06-10", status: "Done", type: "LoRa" },
  { id: "j5", title: "PSN RTGS Upgrade Kalimantan", tech: "Budi Santoso", area: "NON-PAPUA", start: "2026-06-14", end: "2026-06-18", status: "To Do", type: "RTGS" },
  { id: "j6", title: "Mikrotik Install Bandung", tech: "Andi Wijaya", area: "JAWA", start: "2026-06-06", end: "2026-06-06", status: "Done", type: "Mikrotik" },
];

const COLUMNS: { key: Job["status"]; label: string; color: string; badge: string }[] = [
  { key: "To Do", label: "To Do", color: "bg-slate-100", badge: "bg-slate-200 text-slate-700" },
  { key: "In Progress", label: "In Progress", color: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  { key: "Done", label: "Done", color: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
];

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="font-semibold text-sm text-slate-900 leading-tight">{job.title}</p>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium shrink-0">
          {job.type}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <User className="h-3 w-3" />
          <span>{job.tech}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          <span>{job.area}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>{job.start} → {job.end}</span>
        </div>
      </div>
    </div>
  );
}

export default function FieldOps() {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  const grouped = MOCK_JOBS.reduce<Record<Job["status"], Job[]>>(
    (acc, job) => {
      acc[job.status].push(job);
      return acc;
    },
    { "To Do": [], "In Progress": [], Done: [] }
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Field Operations</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status pekerjaan teknisi di lapangan secara real-time.
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Tugaskan Pekerjaan
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`${col.color} rounded-xl p-4 min-h-[480px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">{col.label}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                {grouped[col.key].length}
              </span>
            </div>
            <div className="space-y-3">
              {grouped[col.key].length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 italic">Tidak ada pekerjaan.</p>
              ) : (
                grouped[col.key].map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Technician Profiles */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-slate-500" />
          Profil Teknisi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECHNICIANS.map((tech) => (
            <Card
              key={tech.id}
              className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => setSelectedTech(tech)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{tech.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">{tech.area_coverage}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Jobs selesai</span>
                  <span className="text-lg font-bold text-slate-900">{tech.jobs_done}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technician Profile Sheet */}
      <Sheet open={!!selectedTech} onOpenChange={(v) => !v && setSelectedTech(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                {selectedTech?.name.charAt(0)}
              </div>
              {selectedTech?.name}
            </SheetTitle>
            <SheetDescription>{selectedTech?.area_coverage}</SheetDescription>
          </SheetHeader>

          {selectedTech && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Informasi Bank</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Bank</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedTech.bank_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400 opacity-0" />
                    <div>
                      <p className="text-xs text-slate-500">No. Rekening</p>
                      <p className="text-sm font-mono font-semibold text-slate-900">{selectedTech.bank_account_no}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Riwayat Pekerjaan</p>
                <div className="space-y-3">
                  {MOCK_JOBS.filter((j) => j.tech === selectedTech.name).map((job) => (
                    <div key={job.id} className="flex items-start gap-3 py-2">
                      <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                        job.status === "Done" ? "bg-emerald-500" : job.status === "In Progress" ? "bg-amber-500" : "bg-slate-300"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{job.title}</p>
                        <p className="text-xs text-slate-500">{job.area} · {job.start}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.status === "Done" ? "bg-emerald-100 text-emerald-700" :
                        job.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
