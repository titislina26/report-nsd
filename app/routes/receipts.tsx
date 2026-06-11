import { useState } from "react";
import { requireMockUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Plus, Printer, FileText, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/receipts";

export function meta() {
  return [
    { title: "Receipts — Mahaga FieldOps" },
    { name: "description", content: "Generate and print official payment receipts" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = requireMockUser(request);
  return { user };
}

// --- Types ---
interface Receipt {
  id: string;
  carf_id: string;
  received_from: string;
  amount: number;
  amount_text: string;
  payment_for: string;
  date: string;
  technician: string;
}

const INITIAL_RECEIPTS: Receipt[] = [
  { id: "KW-001", carf_id: "CARF-2026-040", received_from: "PT Mahaga Pratama", amount: 2500000, amount_text: "Dua Juta Lima Ratus Ribu Rupiah", payment_for: "Jasa Maintenance RTGS Jabar", date: "2026-06-10", technician: "Andi Wijaya" },
  { id: "KW-002", carf_id: "CARF-2026-039", received_from: "PT Mahaga Pratama", amount: 10000000, amount_text: "Sepuluh Juta Rupiah", payment_for: "UBIQU Site Survey Sulsel", date: "2026-06-09", technician: "Siti Aminah" },
  { id: "KW-003", carf_id: "CARF-2026-038", received_from: "PT Mahaga Pratama", amount: 7500000, amount_text: "Tujuh Juta Lima Ratus Ribu Rupiah", payment_for: "LoRa Gateway Installation Sorong", date: "2026-06-08", technician: "Doni Pratama" },
  { id: "KW-004", carf_id: "CARF-2026-037", received_from: "PT Mahaga Pratama", amount: 1250000, amount_text: "Satu Juta Dua Ratus Lima Puluh Ribu Rupiah", payment_for: "Akomodasi Survey Site Depok", date: "2026-06-05", technician: "Budi Santoso" },
  { id: "KW-005", carf_id: "CARF-2026-036", received_from: "PT Mahaga Pratama", amount: 4800000, amount_text: "Empat Juta Delapan Ratus Ribu Rupiah", payment_for: "Pengadaan Material Kabel FO", date: "2026-06-03", technician: "Ahmad Fauzi" },
];

const MOCK_CARFS = [
  { id: "CARF-2026-042", amount: 3500000, amountText: "Tiga Juta Lima Ratus Ribu Rupiah", desc: "Instalasi VSAT Merauke" },
  { id: "CARF-2026-041", amount: 1800000, amountText: "Satu Juta Delapan Ratus Ribu Rupiah", desc: "Troubleshooting Site Bogor" },
  { id: "CARF-2026-040", amount: 2500000, amountText: "Dua Juta Lima Ratus Ribu Rupiah", desc: "Jasa Maintenance RTGS Jabar" },
  { id: "CARF-2026-039", amount: 10000000, amountText: "Sepuluh Juta Rupiah", desc: "UBIQU Site Survey Sulsel" },
];

const MOCK_TECHNICIANS = [
  "Andi Wijaya",
  "Siti Aminah",
  "Doni Pratama",
  "Budi Santoso",
  "Ahmad Fauzi",
  "Hendra Wijaya",
];

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

// --- Print-friendly Receipt Component ---
function ReceiptDocument({ receipt }: { receipt: Receipt }) {
  return (
    <div className="bg-white font-mono text-sm" id="receipt-print">
      <div className="border-2 border-black p-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">KWITANSI</h2>
          <p className="text-xs mt-1 text-slate-800">PT. MAHAGA PRATAMA</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">No. Kwitansi</span>
            <span className="font-semibold text-slate-900">: {receipt.id}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Ref. CARF</span>
            <span className="font-semibold text-slate-900">: {receipt.carf_id}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Tanggal</span>
            <span className="font-semibold text-slate-900">: {receipt.date}</span>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Telah Terima Dari</span>
            <span className="font-semibold text-slate-900">: {receipt.received_from}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Untuk Pembayaran</span>
            <span className="font-semibold leading-relaxed text-slate-900">: {receipt.payment_for}</span>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          <div className="bg-slate-100 border border-slate-300 rounded p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{formatRupiah(receipt.amount)}</div>
            <div className="text-xs text-slate-600 mt-1 italic">Terbilang: {receipt.amount_text}</div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 flex justify-end">
          <div className="text-center w-40">
            <p className="text-xs text-slate-600 mb-12">Yang Menerima,</p>
            <div className="border-b border-black" />
            <p className="text-xs font-semibold mt-1 text-slate-900">{receipt.technician}</p>
            <p className="text-xs text-slate-500">Teknisi / Penerima</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create Receipt Dialog ---
function CreateReceiptDialog({
  open,
  onClose,
  onCreate,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (receipt: Receipt) => void;
  nextId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [carfId, setCarfId] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [amountText, setAmountText] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [technician, setTechnician] = useState("");
  const [receivedFrom, setReceivedFrom] = useState("PT Mahaga Pratama");

  const handleCarfChange = (val: string) => {
    setCarfId(val);
    const matched = MOCK_CARFS.find(c => c.id === val);
    if (matched) {
      setAmount(matched.amount);
      setAmountText(matched.amountText);
      setPaymentFor(matched.desc);
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!carfId || !paymentFor || !amount || !date || !technician) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreate({
        id: nextId,
        carf_id: carfId,
        received_from: receivedFrom,
        amount,
        amount_text: amountText || "Jumlah Terkait",
        payment_for: paymentFor,
        date,
        technician,
      });
      toast.success(`Kwitansi ${nextId} berhasil dibuat.`);
      // Reset form
      setCarfId("");
      setPaymentFor("");
      setAmount(0);
      setAmountText("");
      setTechnician("");
      onClose();
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Kwitansi Baru ({nextId})</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Referensi CARF *</Label>
            <Select value={carfId} onValueChange={(val) => handleCarfChange(val ?? "")}>
              <SelectTrigger><SelectValue placeholder="Pilih CARF..." /></SelectTrigger>
              <SelectContent>
                {MOCK_CARFS.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.id} - {c.desc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="received_from">Diterima Dari *</Label>
            <Input
              id="received_from"
              value={receivedFrom}
              onChange={(e) => setReceivedFrom(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment_for">Untuk Pembayaran *</Label>
            <Input
              id="payment_for"
              value={paymentFor}
              onChange={(e) => setPaymentFor(e.target.value)}
              required
              placeholder="Jasa teknisi install VSAT..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Jumlah (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                min="0"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount_text">Terbilang *</Label>
            <Input
              id="amount_text"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              required
              placeholder="Dua Juta Lima Ratus Ribu Rupiah"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Teknisi / Penerima *</Label>
            <Select value={technician} onValueChange={(val) => setTechnician(val ?? "")}>
              <SelectTrigger><SelectValue placeholder="Pilih Teknisi..." /></SelectTrigger>
              <SelectContent>
                {MOCK_TECHNICIANS.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Kwitansi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(INITIAL_RECEIPTS[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog dibuka.");
  };

  const handleCreate = (newReceipt: Receipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    setSelectedReceipt(newReceipt);
  };

  // Generate next sequence receipt ID
  const lastNum = receipts.reduce((max, r) => {
    const num = parseInt(r.id.split("-")[1] || "0", 10);
    return num > max ? num : max;
  }, 0);
  const nextId = `KW-${String(lastNum + 1).padStart(3, "0")}`;

  const filteredReceipts = receipts.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.carf_id.toLowerCase().includes(search.toLowerCase()) ||
      r.technician.toLowerCase().includes(search.toLowerCase()) ||
      r.payment_for.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#receipt-print-wrapper) { display: none !important; }
          #receipt-print-wrapper { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
          #receipt-print { page-break-inside: avoid; border: none !important; }
        }
      `}</style>

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Receipt Generator</h1>
            <p className="text-slate-500 text-sm mt-1">
              Buat dan cetak kwitansi pembayaran resmi untuk teknisi.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <Plus className="mr-2 h-4 w-4" /> Kwitansi Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daftar Kwitansi</p>
              <span className="text-xs text-slate-400 font-medium">{filteredReceipts.length} total</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9 bg-white border-slate-200"
                placeholder="Cari kwitansi, CARF, teknisi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-600">No. Kwitansi</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Tanggal</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.length > 0 ? (
                    filteredReceipts.map((r) => (
                      <TableRow
                        key={r.id}
                        className={`cursor-pointer transition-colors ${
                          selectedReceipt?.id === r.id ? "bg-slate-900 text-white hover:bg-slate-800" : "hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedReceipt(r)}
                      >
                        <TableCell className={`font-mono text-xs font-semibold ${selectedReceipt?.id === r.id ? "text-white" : ""}`}>
                          {r.id}
                        </TableCell>
                        <TableCell className={`text-xs ${selectedReceipt?.id === r.id ? "text-slate-300" : "text-slate-500"}`}>
                          {r.date}
                        </TableCell>
                        <TableCell className={`text-xs text-right font-semibold ${selectedReceipt?.id === r.id ? "text-white" : "text-slate-900"}`}>
                          {formatRupiah(r.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-slate-400 text-sm">
                        Kwitansi tidak ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview Kwitansi</p>
              {selectedReceipt && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="border-slate-200 hover:bg-slate-50 text-slate-700">
                    <Printer className="mr-1.5 h-3.5 w-3.5" />
                    Print / Export PDF
                  </Button>
                </div>
              )}
            </div>

            {selectedReceipt ? (
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 shadow-sm" id="receipt-print-wrapper">
                <ReceiptDocument receipt={selectedReceipt} />
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center h-[400px] text-slate-400">
                <FileText className="h-12 w-12 mb-3 text-slate-300" />
                <p className="font-medium">Pilih kwitansi untuk preview</p>
                <p className="text-sm mt-1">Atau buat kwitansi baru</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateReceiptDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
        nextId={nextId}
      />
    </>
  );
}
