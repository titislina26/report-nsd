import { useState } from "react";
import { requireMockUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Plus,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Briefcase,
  Loader2,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  Circle,
  Phone,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/field-ops";

export function meta() {
  return [
    { title: "Field Operations — Mahaga FieldOps" },
    { name: "description", content: "Track technician jobs and field operation status" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = requireMockUser(request);
  return { user };
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
  description?: string;
  carf_ref?: string;
}

interface Technician {
  id: string;
  name: string;
  area_coverage: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  phone: string;
  jobs_done: number;
  rating: number;
}

const TECHNICIANS: Technician[] = [
  { id: "t1", name: "Budi Santoso", area_coverage: "Papua & Maluku", bank_name: "BCA", bank_account_no: "1234567890", bank_account_name: "Budi Santoso", phone: "081234567890", jobs_done: 34, rating: 4.8 },
  { id: "t2", name: "Andi Wijaya", area_coverage: "Jawa Barat", bank_name: "Mandiri", bank_account_no: "0987654321", bank_account_name: "Andi Wijaya", phone: "082345678901", jobs_done: 28, rating: 4.6 },
  { id: "t3", name: "Siti Aminah", area_coverage: "Sulawesi Selatan", bank_name: "BNI", bank_account_no: "1122334455", bank_account_name: "Siti Aminah", phone: "083456789012", jobs_done: 21, rating: 4.9 },
  { id: "t4", name: "Doni Pratama", area_coverage: "Kalimantan", bank_name: "BRI", bank_account_no: "5544332211", bank_account_name: "Doni Pratama", phone: "084567890123", jobs_done: 19, rating: 4.5 },
  { id: "t5", name: "Rina Kartika", area_coverage: "Jawa Tengah & DIY", bank_name: "BCA", bank_account_no: "6677889900", bank_account_name: "Rina Kartika", phone: "085678901234", jobs_done: 15, rating: 4.7 },
  { id: "t6", name: "Ahmad Fauzi", area_coverage: "Sumatera Utara", bank_name: "Mandiri", bank_account_no: "9988776655", bank_account_name: "Ahmad Fauzi", phone: "086789012345", jobs_done: 11, rating: 4.3 },
];

const INITIAL_JOBS: Job[] = [
  { id: "j1", title: "Install VSAT Papua Remote", tech: "Budi Santoso", area: "PAPUA", start: "2026-06-12", end: "2026-06-15", status: "To Do", type: "VSAT", description: "Instalasi antena VSAT di site terpencil Papua. Perlu koordinasi dengan tim lokal.", carf_ref: "CARF-2026-041" },
  { id: "j2", title: "PSN RTGS Upgrade Kalimantan", tech: "Doni Pratama", area: "NON-PAPUA", start: "2026-06-14", end: "2026-06-18", status: "To Do", type: "RTGS", description: "Upgrade perangkat RTGS di kantor PSN Kalimantan Timur.", carf_ref: "CARF-2026-037" },
  { id: "j3", title: "Maintenance RTGS Jabar", tech: "Andi Wijaya", area: "JAWA", start: "2026-06-10", end: "2026-06-11", status: "In Progress", type: "RTGS", description: "Pemeliharaan rutin perangkat RTGS di Jawa Barat.", carf_ref: "CARF-2026-040" },
  { id: "j4", title: "UBIQU Site Survey Sulsel", tech: "Siti Aminah", area: "SULAWESI", start: "2026-06-09", end: "2026-06-12", status: "In Progress", type: "UBIQU", description: "Survey lokasi untuk pemasangan perangkat UBIQU di Sulawesi Selatan.", carf_ref: "CARF-2026-039" },
  { id: "j5", title: "Mikrotik Setup Semarang", tech: "Rina Kartika", area: "JAWA", start: "2026-06-11", end: "2026-06-11", status: "In Progress", type: "Mikrotik", description: "Konfigurasi Mikrotik untuk jaringan kantor Semarang.", carf_ref: "CARF-2026-036" },
  { id: "j6", title: "LoRa Gateway Sorong", tech: "Doni Pratama", area: "PAPUA", start: "2026-06-08", end: "2026-06-10", status: "Done", type: "LoRa", description: "Instalasi LoRa gateway selesai tepat waktu.", carf_ref: "CARF-2026-038" },
  { id: "j7", title: "Mikrotik Install Bandung", tech: "Andi Wijaya", area: "JAWA", start: "2026-06-06", end: "2026-06-06", status: "Done", type: "Mikrotik", description: "Instalasi Mikrotik di kantor Bandung berhasil.", carf_ref: "CARF-2026-035" },
  { id: "j8", title: "VSAT Troubleshoot Ternate", tech: "Budi Santoso", area: "PAPUA", start: "2026-06-05", end: "2026-06-07", status: "Done", type: "VSAT", description: "Perbaikan gangguan sinyal VSAT di Ternate.", carf_ref: "CARF-2026-034" },
  { id: "j9", title: "Survey Jaringan Sumut", tech: "Ahmad Fauzi", area: "NON-PAPUA", start: "2026-06-10", end: "2026-06-12", status: "In Progress", type: "Survey", description: "Survey jaringan untuk ekspansi ke wilayah Sumatera Utara.", carf_ref: "CARF-2026-033" },
  { id: "j10", title: "UBIQU Install Makasar", tech: "Siti Aminah", area: "SULAWESI", start: "2026-06-04", end: "2026-06-05", status: "Done", type: "UBIQU", description: "Instalasi UBIQU di kantor Makassar selesai.", carf_ref: "CARF-2026-032" },
];

const COLUMNS: { key: Job["status"]; label: string; color: string; badge: string; icon: React.ElementType }[] = [
  { key: "To Do", label: "To Do", color: "bg-slate-100", badge: "bg-slate-200 text-slate-700", icon: Circle },
  { key: "In Progress", label: "In Progress", color: "bg-amber-50", badge: "bg-amber-100 text-amber-700", icon: Clock },
  { key: "Done", label: "Done", color: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
];

const JOB_TYPES = ["VSAT", "RTGS", "UBIQU", "LoRa", "Mikrotik", "Survey", "Lainnya"];
const AREAS = ["PAPUA", "NON-PAPUA", "JAWA", "SULAWESI"];

// --- Job Card Component ---
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const typeColors: Record<string, string> = {
    VSAT: "bg-blue-100 text-blue-700",
    RTGS: "bg-purple-100 text-purple-700",
    UBIQU: "bg-orange-100 text-orange-700",
    LoRa: "bg-green-100 text-green-700",
    Mikrotik: "bg-pink-100 text-pink-700",
    Survey: "bg-cyan-100 text-cyan-700",
  };
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="font-semibold text-sm text-slate-900 leading-tight group-hover:text-slate-700 transition-colors">
          {job.title}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeColors[job.type] ?? "bg-slate-100 text-slate-600"}`}>
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
      {job.carf_ref && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-mono text-slate-400">{job.carf_ref}</span>
        </div>
      )}
    </div>
  );
}

// --- Assign Job Modal ---
function AssignJobModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (job: Job) => void }) {
  const [loading, setLoading] = useState(false);
  const [tech, setTech] = useState(TECHNICIANS[0].name);
  const [area, setArea] = useState("PAPUA");
  const [type, setType] = useState("VSAT");
  const [status, setStatus] = useState<Job["status"]>("To Do");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setTimeout(() => {
      const newJob: Job = {
        id: `j${Date.now()}`,
        title: data.get("title") as string,
        tech,
        area,
        start: data.get("start") as string,
        end: data.get("end") as string,
        status,
        type,
        description: data.get("description") as string,
        carf_ref: data.get("carf_ref") as string,
      };
      onSave(newJob);
      setLoading(false);
      toast.success("Pekerjaan berhasil ditugaskan!");
      onClose();
      form.reset();
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tugaskan Pekerjaan Baru</DialogTitle>
          <DialogDescription>Isi detail pekerjaan dan pilih teknisi yang akan ditugaskan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Judul Pekerjaan *</Label>
            <Input id="title" name="title" required placeholder="Contoh: Install VSAT di site Papua Remote" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipe Pekerjaan *</Label>
              <Select value={type} onValueChange={(val) => setType(val ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Area *</Label>
              <Select value={area} onValueChange={(val) => setArea(val ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Teknisi *</Label>
            <Select value={tech} onValueChange={(val) => setTech(val ?? "")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TECHNICIANS.map((t) => (
                  <SelectItem key={t.id} value={t.name}>{t.name} — {t.area_coverage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start">Tanggal Mulai *</Label>
              <Input id="start" name="start" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Tanggal Selesai *</Label>
              <Input id="end" name="end" type="date" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="carf_ref">Referensi CARF</Label>
            <Input id="carf_ref" name="carf_ref" placeholder="CARF-2026-042" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Deskripsi Pekerjaan</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Detail pekerjaan yang akan dilakukan..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Status Awal</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Job["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tugaskan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Job Detail Sheet ---
function JobDetailSheet({
  job,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  job: Job | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Job["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  if (!job) return null;

  const statusOptions: Job["status"][] = ["To Do", "In Progress", "Done"];
  const statusColors = {
    "To Do": "bg-slate-100 text-slate-700",
    "In Progress": "bg-amber-100 text-amber-700",
    "Done": "bg-emerald-100 text-emerald-700",
  };

  return (
    <>
      <Sheet open={!!job} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg leading-snug">{job.title}</SheetTitle>
            <SheetDescription className="flex items-center gap-2">
              <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[job.status]}`}>
                {job.status}
              </span>
              <span className="text-xs">·</span>
              <span className="text-xs">{job.type}</span>
              {job.carf_ref && (
                <>
                  <span className="text-xs">·</span>
                  <span className="text-xs font-mono">{job.carf_ref}</span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                { label: "Teknisi", value: job.tech, icon: User },
                { label: "Area", value: job.area, icon: MapPin },
                { label: "Tanggal Mulai", value: job.start, icon: Calendar },
                { label: "Tanggal Selesai", value: job.end, icon: Calendar },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </p>
                  <p className="font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            {job.description && (
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Deskripsi</p>
                <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
              </div>
            )}

            <Separator />

            {/* Update status */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Update Status</p>
              <div className="flex gap-2">
                {statusOptions.map((s) => (
                  <Button
                    key={s}
                    variant={job.status === s ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      onUpdateStatus(job.id, s);
                      toast.success(`Status diperbarui ke "${s}"`);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Tutup</Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                title="Hapus pekerjaan"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Hapus Pekerjaan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pekerjaan <strong>"{job.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(job.id);
                setShowDeleteConfirm(false);
                onClose();
                toast.success("Pekerjaan berhasil dihapus.");
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Main Page ---
export default function FieldOps() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAssign, setShowAssign] = useState(false);

  const grouped = jobs.reduce<Record<Job["status"], Job[]>>(
    (acc, job) => { acc[job.status].push(job); return acc; },
    { "To Do": [], "In Progress": [], Done: [] }
  );

  function handleAddJob(job: Job) {
    setJobs((prev) => [job, ...prev]);
  }

  function handleUpdateStatus(id: string, status: Job["status"]) {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
    setSelectedJob((prev) => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleDeleteJob(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

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
        <Button onClick={() => setShowAssign(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Tugaskan Pekerjaan
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`${col.color} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <col.icon className="h-4 w-4 text-slate-500" />
                <h3 className="font-semibold text-slate-700">{col.label}</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                {grouped[col.key].length}
              </span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {grouped[col.key].length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                  <col.icon className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs italic">Tidak ada pekerjaan.</p>
                </div>
              ) : (
                grouped[col.key].map((job) => (
                  <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                ))
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
          <span className="text-sm font-normal text-slate-500 ml-1">— klik untuk detail & info bank</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHNICIANS.map((tech) => (
            <Card
              key={tech.id}
              className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              onClick={() => setSelectedTech(tech)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:bg-slate-700 transition-colors">
                    {tech.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">{tech.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{tech.area_coverage}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-600">{tech.rating}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Jobs selesai </span>
                    <span className="text-sm font-bold text-slate-900">{tech.jobs_done}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals & Sheets */}
      <AssignJobModal
        open={showAssign}
        onClose={() => setShowAssign(false)}
        onSave={handleAddJob}
      />

      <JobDetailSheet
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteJob}
      />

      {/* Technician Profile Sheet */}
      <Sheet open={!!selectedTech} onOpenChange={(v) => !v && setSelectedTech(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {selectedTech?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-bold">{selectedTech?.name}</p>
                <p className="text-sm font-normal text-slate-500">{selectedTech?.area_coverage}</p>
              </div>
            </SheetTitle>
          </SheetHeader>

          {selectedTech && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{selectedTech.jobs_done}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Jobs Selesai</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <p className="text-2xl font-bold text-slate-900">{selectedTech.rating}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Rating</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontak</p>
                <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Nomor HP</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedTech.phone}</p>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="space-y-2">
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
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400 opacity-0" />
                    <div>
                      <p className="text-xs text-slate-500">Atas Nama</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedTech.bank_account_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Riwayat Pekerjaan</p>
                <div className="space-y-2">
                  {jobs.filter((j) => j.tech === selectedTech.name).length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Tidak ada pekerjaan terdaftar.</p>
                  ) : (
                    jobs.filter((j) => j.tech === selectedTech.name).map((job) => (
                      <div key={job.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                        <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                          job.status === "Done" ? "bg-emerald-500" : job.status === "In Progress" ? "bg-amber-500" : "bg-slate-300"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.area} · {job.start}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          job.status === "Done" ? "bg-emerald-100 text-emerald-700" :
                          job.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
