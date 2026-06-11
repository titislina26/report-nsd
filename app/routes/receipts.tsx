import { useState, useRef } from "react";
import { redirect } from "react-router";
import { createClient } from "~/lib/server";
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
import { Separator } from "~/components/ui/separator";
import { Plus, Printer, Eye, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/receipts";

export function meta() {
  return [
    { title: "Receipts — Mahaga FieldOps" },
    { name: "description", content: "Generate and print official payment receipts" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return redirect("/login");
  return { user: session.user };
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

const MOCK_RECEIPTS: Receipt[] = [
  { id: "KW-001", carf_id: "CARF-2026-040", received_from: "PT Mahaga Pratama", amount: 2500000, amount_text: "Dua Juta Lima Ratus Ribu Rupiah", payment_for: "Jasa Maintenance RTGS Jabar", date: "2026-06-10", technician: "Andi Wijaya" },
  { id: "KW-002", carf_id: "CARF-2026-039", received_from: "PT Mahaga Pratama", amount: 10000000, amount_text: "Sepuluh Juta Rupiah", payment_for: "UBIQU Site Survey Sulsel", date: "2026-06-09", technician: "Siti Aminah" },
  { id: "KW-003", carf_id: "CARF-2026-038", received_from: "PT Mahaga Pratama", amount: 7500000, amount_text: "Tujuh Juta Lima Ratus Ribu Rupiah", payment_for: "LoRa Gateway Installation Sorong", date: "2026-06-08", technician: "Doni Pratama" },
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
          <h2 className="text-xl font-bold uppercase tracking-widest">KWITANSI</h2>
          <p className="text-xs mt-1">PT. MAHAGA PRATAMA</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">No. Kwitansi</span>
            <span className="font-semibold">: {receipt.id}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Ref. CARF</span>
            <span className="font-semibold">: {receipt.carf_id}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Tanggal</span>
            <span className="font-semibold">: {receipt.date}</span>
          </div>

          <div className="border-t border-dashed border-slate-300 my-3" />

          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Telah Terima Dari</span>
            <span className="font-semibold">: {receipt.received_from}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-36 text-slate-600 shrink-0">Untuk Pembayaran</span>
            <span className="font-semibold leading-relaxed">: {receipt.payment_for}</span>
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
            <p className="text-xs font-semibold mt-1">{receipt.technician}</p>
            <p className="text-xs text-slate-500">Teknisi / Penerima</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create Receipt Dialog ---
function CreateReceiptDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Kwitansi berhasil dibuat.");
      onClose();
    }, 1000);
  }
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Kwitansi Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Referensi CARF *</Label>
            <Select name="carf_id">
              <SelectTrigger><SelectValue placeholder="Pilih CARF..." /></SelectTrigger>
              <SelectContent>
                {["CARF-2026-041", "CARF-2026-040", "CARF-2026-039"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment_for">Untuk Pembayaran *</Label>
            <Input id="payment_for" name="payment_for" required placeholder="Jasa teknisi install VSAT..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Jumlah (Rp) *</Label>
              <Input id="amount" name="amount" type="number" required min="0" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Tanggal *</Label>
              <Input id="date" name="date" type="date" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount_text">Terbilang *</Label>
            <Input id="amount_text" name="amount_text" required placeholder="Dua Juta Lima Ratus Ribu Rupiah" />
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
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(MOCK_RECEIPTS[0]);
  const [showCreate, setShowCreate] = useState(false);

  function handlePrint() {
    window.print();
    toast.success("Print dialog dibuka.");
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#receipt-print-wrapper) { display: none !important; }
          #receipt-print-wrapper { display: block !important; }
          #receipt-print { page-break-inside: avoid; }
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
          <Button onClick={() => setShowCreate(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Kwitansi Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: List */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daftar Kwitansi</p>
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
                  {MOCK_RECEIPTS.map((r) => (
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
                  ))}
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
                  <Button variant="outline" size="sm" onClick={handlePrint}>
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

      <CreateReceiptDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
}
