import { useState } from "react";
import { useLoaderData } from "react-router";
import { requireMockUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
import { Separator } from "~/components/ui/separator";
import {
  Plus,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Loader2,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/carf";

export function meta() {
  return [
    { title: "CARF & Expenses — Mahaga FieldOps" },
    { name: "description", content: "Manage Cash Advance Request Forms and track expenses" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = requireMockUser(request);
  return { user };
}

// --- Types ---
interface CarfRecord {
  id: string;
  trans_code: string;
  req_date: string;
  requestor_name: string;
  doc_type: "CARF NT" | "CARF T";
  area_type: string;
  division: string;
  description_needs: string;
  amount: number;
  status: "Not Yet" | "Pending" | "Done" | "Paid";
  start_date: string;
  end_date: string;
  description_funds: string;
}

// --- Mock Data (replace with Supabase) ---
const INITIAL_CARF: CarfRecord[] = [
  { id: "1", trans_code: "CARF-2026-041", req_date: "2026-06-11", requestor_name: "Budi Santoso", doc_type: "CARF NT", area_type: "PAPUA", division: "NSD", description_needs: "Install VSAT Papua Remote", amount: 5000000, status: "Pending", start_date: "2026-06-12", end_date: "2026-06-15", description_funds: "DP 1: Rp 2.500.000 | DP 2: Rp 1.500.000 | Pelunasan: Rp 1.000.000" },
  { id: "2", trans_code: "CARF-2026-040", req_date: "2026-06-10", requestor_name: "Andi Wijaya", doc_type: "CARF T", area_type: "JAWA", division: "NSD", description_needs: "Maintenance RTGS Jabar", amount: 2500000, status: "Paid", start_date: "2026-06-10", end_date: "2026-06-11", description_funds: "Full Payment: Rp 2.500.000" },
  { id: "3", trans_code: "CARF-2026-039", req_date: "2026-06-09", requestor_name: "Siti Aminah", doc_type: "CARF NT", area_type: "SULAWESI", division: "NSD", description_needs: "UBIQU Site Survey Sulsel", amount: 10000000, status: "Done", start_date: "2026-06-09", end_date: "2026-06-12", description_funds: "DP 1: Rp 5.000.000 | Pelunasan: Rp 5.000.000" },
  { id: "4", trans_code: "CARF-2026-038", req_date: "2026-06-08", requestor_name: "Doni Pratama", doc_type: "CARF T", area_type: "PAPUA", division: "NSD", description_needs: "LoRa Gateway Installation Sorong", amount: 7500000, status: "Done", start_date: "2026-06-08", end_date: "2026-06-10", description_funds: "Full Payment: Rp 7.500.000" },
  { id: "5", trans_code: "CARF-2026-037", req_date: "2026-06-07", requestor_name: "Budi Santoso", doc_type: "CARF NT", area_type: "NON-PAPUA", division: "NSD", description_needs: "PSN RTGS Upgrade Kalimantan", amount: 12000000, status: "Not Yet", start_date: "2026-06-14", end_date: "2026-06-18", description_funds: "" },
  { id: "6", trans_code: "CARF-2026-036", req_date: "2026-06-06", requestor_name: "Rina Kartika", doc_type: "CARF T", area_type: "JAWA", division: "NSD", description_needs: "Jasa Teknisi Install Mikrotik", amount: 1500000, status: "Paid", start_date: "2026-06-06", end_date: "2026-06-06", description_funds: "Full Payment: Rp 1.500.000" },
  { id: "7", trans_code: "CARF-2026-035", req_date: "2026-06-05", requestor_name: "Ahmad Fauzi", doc_type: "CARF NT", area_type: "NON-PAPUA", division: "NSD", description_needs: "Survey Jaringan Sumut", amount: 8500000, status: "Done", start_date: "2026-06-10", end_date: "2026-06-12", description_funds: "DP 1: Rp 4.000.000 | Pelunasan: Rp 4.500.000" },
  { id: "8", trans_code: "CARF-2026-034", req_date: "2026-06-04", requestor_name: "Siti Aminah", doc_type: "CARF T", area_type: "SULAWESI", division: "NSD", description_needs: "UBIQU Install Makassar", amount: 6000000, status: "Paid", start_date: "2026-06-04", end_date: "2026-06-05", description_funds: "Full Payment: Rp 6.000.000" },
  { id: "9", trans_code: "CARF-2026-033", req_date: "2026-06-03", requestor_name: "Doni Pratama", doc_type: "CARF NT", area_type: "PAPUA", division: "NSD", description_needs: "VSAT Troubleshoot Ternate", amount: 9000000, status: "Done", start_date: "2026-06-05", end_date: "2026-06-07", description_funds: "DP 1: Rp 4.500.000 | Pelunasan: Rp 4.500.000" },
  { id: "10", trans_code: "CARF-2026-032", req_date: "2026-06-02", requestor_name: "Rina Kartika", doc_type: "CARF NT", area_type: "JAWA", division: "NSD", description_needs: "Mikrotik Setup Semarang", amount: 3500000, status: "Pending", start_date: "2026-06-11", end_date: "2026-06-11", description_funds: "DP 1: Rp 2.000.000 | Pelunasan: Rp 1.500.000" },
  { id: "11", trans_code: "CARF-2026-031", req_date: "2026-06-01", requestor_name: "Budi Santoso", doc_type: "CARF T", area_type: "PAPUA", division: "NSD", description_needs: "Mikrotik Install Bandung", amount: 2000000, status: "Paid", start_date: "2026-06-01", end_date: "2026-06-01", description_funds: "Full Payment: Rp 2.000.000" },
  { id: "12", trans_code: "CARF-2026-030", req_date: "2026-05-30", requestor_name: "Andi Wijaya", doc_type: "CARF NT", area_type: "NON-PAPUA", division: "NSD", description_needs: "LoRa Expansion Kalimantan Barat", amount: 15000000, status: "Not Yet", start_date: "2026-06-20", end_date: "2026-06-25", description_funds: "" },
];

const AREAS = ["Semua", "PAPUA", "NON-PAPUA", "JAWA", "SULAWESI"];
const STATUSES = ["Semua", "Not Yet", "Pending", "Done", "Paid"];
const DOC_TYPES = ["Semua", "CARF NT", "CARF T"];

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Done: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    "Not Yet": "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles["Not Yet"]}`}>
      {status}
    </span>
  );
}

// --- Create/Edit Modal ---
function CarfFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: CarfRecord | null;
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isEdit ? "Pengajuan berhasil diperbarui." : "Pengajuan CARF berhasil dibuat.");
      onClose();
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pengajuan CARF" : "Buat Pengajuan CARF Baru"}</DialogTitle>
          <DialogDescription>
            Isi form berikut dengan lengkap. Semua field bertanda (*) wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="requestor">Nama Requestor *</Label>
              <Input id="requestor" name="requestor" required defaultValue={initial?.requestor_name} placeholder="Nama lengkap" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="req_date">Tanggal Pengajuan *</Label>
              <Input id="req_date" name="req_date" type="date" required defaultValue={initial?.req_date} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tipe Dokumen *</Label>
              <Select name="doc_type" defaultValue={initial?.doc_type ?? "CARF NT"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARF NT">CARF NT</SelectItem>
                  <SelectItem value="CARF T">CARF T</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Area *</Label>
              <Select name="area_type" defaultValue={initial?.area_type ?? "JAWA"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["PAPUA", "NON-PAPUA", "JAWA", "SULAWESI"].map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description_needs">Deskripsi Kebutuhan *</Label>
            <textarea
              id="description_needs"
              name="description_needs"
              required
              defaultValue={initial?.description_needs}
              placeholder="Contoh: Install VSAT di site Papua Remote..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Tanggal Mulai Pekerjaan</Label>
              <Input id="start_date" name="start_date" type="date" defaultValue={initial?.start_date} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_date">Tanggal Selesai Pekerjaan</Label>
              <Input id="end_date" name="end_date" type="date" defaultValue={initial?.end_date} />
            </div>
          </div>

          <Separator />
          <p className="text-sm font-semibold text-slate-700">Rincian Biaya</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Jasa Teknisi (Rp)", name: "biaya_jasa", placeholder: "0" },
              { label: "Transport (Rp)", name: "biaya_transport", placeholder: "0" },
              { label: "Sewa Mobil (Rp)", name: "biaya_mobil", placeholder: "0" },
              { label: "Biaya Lainnya (Rp)", name: "biaya_lain", placeholder: "0" },
            ].map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name}>{f.label}</Label>
                <Input id={f.name} name={f.name} type="number" min="0" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description_funds">Deskripsi Dana / Rincian Lain</Label>
            <textarea
              id="description_funds"
              name="description_funds"
              defaultValue={initial?.description_funds}
              placeholder="Contoh: DP 1: Rp 2.500.000 | DP 2: Rp 1.500.000 | Pelunasan: Rp 1.000.000"
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Buat Pengajuan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Detail Slide-over ---
function CarfDetailSheet({
  record,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  record: CarfRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CarfRecord["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  if (!record) return null;

  const statusFlow: CarfRecord["status"][] = ["Not Yet", "Pending", "Done", "Paid"];

  return (
    <>
      <Sheet open={!!record} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Detail Pengajuan
            </SheetTitle>
            <SheetDescription>{record.trans_code}</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <StatusBadge status={record.status} />
              <span className="text-xs text-slate-500">{record.req_date}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                { label: "Requestor", value: record.requestor_name },
                { label: "Tipe Dokumen", value: record.doc_type },
                { label: "Area", value: record.area_type },
                { label: "Divisi", value: record.division },
                { label: "Mulai Pekerjaan", value: record.start_date },
                { label: "Selesai Pekerjaan", value: record.end_date },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                  <p className="font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Deskripsi Kebutuhan</p>
                <p className="text-sm text-slate-600 leading-relaxed">{record.description_needs}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Rincian Dana</p>
                <div className="space-y-2">
                  {record.description_funds ? (
                    record.description_funds.split("|").map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-600">{item.trim()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">Belum ada rincian dana.</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">Total Pengajuan</span>
                  <span className="text-base font-bold text-slate-900">{formatRupiah(record.amount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status Update */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                Update Status
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {statusFlow.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={record.status === s ? "default" : "outline"}
                    className="text-xs h-7"
                    onClick={() => {
                      onUpdateStatus(record.id, s);
                      toast.success(`Status diperbarui ke "${s}"`);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1" variant="outline" onClick={onClose}>Tutup</Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                title="Hapus pengajuan"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Hapus Pengajuan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengajuan <strong>{record.trans_code}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(record.id);
                setShowDeleteConfirm(false);
                onClose();
                toast.success("Pengajuan berhasil dihapus.");
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
const PAGE_SIZE = 5;

export default function CarfManagement() {
  const [carfData, setCarfData] = useState<CarfRecord[]>(INITIAL_CARF);
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<CarfRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<CarfRecord | null>(null);

  function handleUpdateStatus(id: string, status: CarfRecord["status"]) {
    setCarfData((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    setDetailRecord((prev) => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleDeleteRecord(id: string) {
    setCarfData((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = carfData.filter((r) => {
    const matchSearch =
      r.trans_code.toLowerCase().includes(search.toLowerCase()) ||
      r.requestor_name.toLowerCase().includes(search.toLowerCase()) ||
      r.description_needs.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === "Semua" || r.area_type === filterArea;
    const matchStatus = filterStatus === "Semua" || r.status === filterStatus;
    const matchType = filterType === "Semua" || r.doc_type === filterType;
    return matchSearch && matchArea && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = filterArea !== "Semua" || filterStatus !== "Semua" || filterType !== "Semua";

  function clearFilters() {
    setFilterArea("Semua");
    setFilterStatus("Semua");
    setFilterType("Semua");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CARF & Expense Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola Cash Advance Request Forms dan lacak pengeluaran lapangan.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Buat Pengajuan
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari kode transaksi, requestor, atau deskripsi..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filterArea} onValueChange={(v) => { setFilterArea(v ?? "Semua"); setPage(1); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v ?? "Semua"); setPage(1); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v ?? "Semua"); setPage(1); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Hapus filter">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-600">Kode Transaksi</TableHead>
              <TableHead className="font-semibold text-slate-600">Tanggal</TableHead>
              <TableHead className="font-semibold text-slate-600">Requestor</TableHead>
              <TableHead className="font-semibold text-slate-600">Tipe</TableHead>
              <TableHead className="font-semibold text-slate-600">Area</TableHead>
              <TableHead className="font-semibold text-slate-600 text-right">Jumlah</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                  <Filter className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  Tidak ada data yang sesuai filter.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((carf, i) => (
                <TableRow
                  key={carf.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <TableCell className="font-mono text-xs font-semibold text-slate-800">
                    {carf.trans_code}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">{carf.req_date}</TableCell>
                  <TableCell className="font-medium text-slate-900">{carf.requestor_name}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {carf.doc_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">{carf.area_type}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 text-sm">
                    {formatRupiah(carf.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={carf.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDetailRecord(carf)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} data
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CarfFormModal
        open={showCreate || !!editRecord}
        onClose={() => { setShowCreate(false); setEditRecord(null); }}
        initial={editRecord}
      />
      <CarfDetailSheet
        record={detailRecord}
        onClose={() => setDetailRecord(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
