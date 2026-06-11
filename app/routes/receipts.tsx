import { useState, useRef } from "react";
import { requireMockUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
import { Plus, Printer, FileText, Loader2, Search, Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import type { Route } from "./+types/receipts";

export function meta() {
  return [
    { title: "Receipts — Mahaga FieldOps" },
    { name: "description", content: "Generate, preview and print official payment receipts and expense reports" },
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
  ktp_image?: string; // Base64 data URL
  // Expense Report details
  department: string;
  created_by: string;
  approved_by: string;
  checked_by: string;
  bank_name: string;
  bank_account: string;
}

const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: "KW-001",
    carf_id: "CARF-2026-040",
    received_from: "PT Mahaga Pratama",
    amount: 6120000,
    amount_text: "Enam Juta Seratus Dua Puluh Ribu Rupiah",
    payment_for: "Sewa Mobil selama 9 hari",
    date: "2025-12-11",
    technician: "Dirga Jurianto Damanik",
    department: "Mahaga",
    created_by: "Dirga Jurianto Damanik",
    approved_by: "Ardi Ahmad Syauki",
    checked_by: "Adi Wibowo",
    bank_name: "MANDIRI",
    bank_account: "124 000 519 6192",
  },
  {
    id: "KW-002",
    carf_id: "CARF-2026-039",
    received_from: "PT Mahaga Pratama",
    amount: 10000000,
    amount_text: "Sepuluh Juta Rupiah",
    payment_for: "UBIQU Site Survey Sulsel",
    date: "2026-06-09",
    technician: "Siti Aminah",
    department: "Mahaga",
    created_by: "Siti Aminah",
    approved_by: "Ardi Ahmad Syauki",
    checked_by: "Adi Wibowo",
    bank_name: "BCA",
    bank_account: "883 092 1122",
  },
  {
    id: "KW-003",
    carf_id: "CARF-2026-038",
    received_from: "PT Mahaga Pratama",
    amount: 7500000,
    amount_text: "Tujuh Juta Lima Ratus Ribu Rupiah",
    payment_for: "LoRa Gateway Installation Sorong",
    date: "2026-06-08",
    technician: "Doni Pratama",
    department: "Mahaga",
    created_by: "Doni Pratama",
    approved_by: "Ardi Ahmad Syauki",
    checked_by: "Adi Wibowo",
    bank_name: "BRI",
    bank_account: "002 918 3774",
  }
];

const MOCK_CARFS = [
  { id: "CARF : 3401/MAHAGA/XII-2025", amount: 6120000, amountText: "Enam Juta Seratus Dua Puluh Ribu Rupiah", desc: "Sewa Mobil selama 9 hari" },
  { id: "CARF : 3402/MAHAGA/VI-2026", amount: 10000000, amountText: "Sepuluh Juta Rupiah", desc: "UBIQU Site Survey Sulsel" },
  { id: "CARF : 3403/MAHAGA/VI-2026", amount: 7500000, amountText: "Tujuh Juta Lima Ratus Ribu Rupiah", desc: "LoRa Gateway Installation Sorong" },
];

const MOCK_TECHNICIANS = [
  { name: "Dirga Jurianto Damanik", bank: "MANDIRI", acc: "124 000 519 6192" },
  { name: "Siti Aminah", bank: "BCA", acc: "883 092 1122" },
  { name: "Doni Pratama", bank: "BRI", acc: "002 918 3774" },
  { name: "Syarif Hidayatullah", bank: "BCA", acc: "023 999 1234" },
];

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatRawRupiah(amount: number) {
  return amount.toLocaleString("id-ID");
}

// --- Format 1: Non-Travel Expense Report ---
function ExpenseReportDocument({ receipt }: { receipt: Receipt }) {
  return (
    <div className="bg-white p-6 border border-slate-300 rounded shadow-sm text-slate-800 text-xs font-sans print:p-0 print:border-none print:shadow-none max-w-[900px] mx-auto overflow-x-auto" id="report-view">
      {/* Outer grid */}
      <div className="border border-slate-800 p-4 space-y-4">
        {/* Header Block */}
        <div className="flex border border-slate-800">
          <div className="w-24 border-r border-slate-800 p-2 flex items-center justify-center bg-slate-50 shrink-0">
            {/* Green M Circle Logo */}
            <svg viewBox="0 0 100 100" className="h-14 w-14">
              <circle cx="50" cy="50" r="45" fill="#e2f5e7" stroke="#22c55e" strokeWidth="4"/>
              <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#15803d" strokeWidth="2.5"/>
              <path d="M28 65 V35 L50 51 L72 35 V65" fill="none" stroke="#22c55e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 flex flex-col text-center divide-y divide-slate-800 font-bold">
            <div className="py-2 bg-slate-400 text-slate-900 tracking-wider font-extrabold uppercase">
              NON-TRAVEL EXPENSE REPORT - MAHAGA PRATAMA
            </div>
            <div className="py-1 text-slate-700 text-[10px] font-medium">
              Other
            </div>
            <div className="py-1.5 font-mono tracking-wide">
              No. CARF : {receipt.carf_id}
            </div>
          </div>
        </div>

        {/* User Metadata info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Metadata Left */}
          <div className="p-2 space-y-1 bg-white">
            <div className="flex">
              <span className="w-16 font-semibold">Nama</span>
              <span>: {receipt.technician}</span>
            </div>
            <div className="flex">
              <span className="w-16 font-semibold">Dept</span>
              <span>: {receipt.department}</span>
            </div>
            <div className="flex">
              <span className="w-16 font-semibold">Tanggal</span>
              <span>: {receipt.date}</span>
            </div>
          </div>

          {/* Metadata Center */}
          <div className="p-2 flex items-center justify-center font-bold text-sm bg-slate-50">
            Pengajuan No. {receipt.id.split("-")[1] || "33"}
          </div>

          {/* Metadata Right */}
          <div className="p-2 space-y-1 bg-white">
            <div className="flex justify-between">
              <span className="font-semibold">Tanggal Diterima</span>
              <span>: </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Paraf</span>
              <span className="text-[10px] text-red-500 font-medium italic">(Diisi oleh Admin)</span>
            </div>
          </div>
        </div>

        {/* Main Items Table */}
        <table className="w-full border-collapse border border-slate-800 text-[11px] text-center">
          <thead>
            <tr className="bg-slate-300 font-bold border-b border-slate-800">
              <td className="border-r border-slate-800 py-1.5 w-12">No</td>
              <td className="border-r border-slate-800 py-1.5 w-28">Tanggal</td>
              <td className="border-r border-slate-800 py-1.5">Uraian</td>
              <td className="border-r border-slate-800 py-1.5 w-32">Jumlah</td>
              <td className="py-1.5 w-36">Keterangan</td>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800">
              <td className="border-r border-slate-800 py-4 font-semibold text-slate-900">1</td>
              <td className="border-r border-slate-800 py-4">{receipt.date}</td>
              <td className="border-r border-slate-800 py-4 text-left px-3">{receipt.payment_for}</td>
              <td className="border-r border-slate-800 py-4 font-mono font-semibold text-right px-3">{formatRawRupiah(receipt.amount)}</td>
              <td className="py-4 text-slate-500">-</td>
            </tr>
            {/* Blank row for design layout parity */}
            <tr className="border-b border-slate-800 h-10">
              <td className="border-r border-slate-800 py-2"></td>
              <td className="border-r border-slate-800 py-2"></td>
              <td className="border-r border-slate-800 py-2"></td>
              <td className="border-r border-slate-800 py-2"></td>
              <td className="py-2"></td>
            </tr>
            {/* Summary Block */}
            <tr className="bg-slate-50 font-bold">
              <td colSpan={3} className="border-r border-slate-800 text-right px-4 py-1.5 uppercase font-semibold">REALISASI</td>
              <td className="border-r border-slate-800 text-left px-2 py-0.5 space-y-1.5" colSpan={2}>
                <div className="flex justify-between">
                  <span>Advance Taken</span>
                  <span className="font-mono">{formatRupiah(receipt.amount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-1">
                  <span>Total Expense</span>
                  <span className="font-mono">{formatRupiah(receipt.amount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-1 text-slate-900">
                  <span>Balance / Retur / (Add)</span>
                  <span className="font-mono">Rp0</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Approval Signatures block */}
        <div className="grid grid-cols-6 border border-slate-800 divide-x divide-slate-800 text-[9px] text-center bg-white">
          {/* Box 1 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Dibuat oleh,<br/>User</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold underline italic text-slate-900 truncate">{receipt.created_by}</span>
          </div>
          {/* Box 2 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Disetujui oleh,<br/>Atasan Langsung</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold underline italic text-slate-900 truncate">{receipt.approved_by}</span>
          </div>
          {/* Box 3 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Diperiksa oleh,<br/>Budget Admin</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold text-slate-400 italic">Pending</span>
          </div>
          {/* Box 4 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Diperiksa oleh,<br/>Kepala Divisi</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold underline italic text-slate-900 truncate">{receipt.checked_by}</span>
          </div>
          {/* Box 5 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Disetujui oleh,<br/>Direktur *</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold text-slate-400 italic">Required</span>
          </div>
          {/* Box 6 */}
          <div className="flex flex-col h-28 justify-between p-1.5">
            <span className="font-semibold text-slate-600">Disetujui oleh,<br/>Direktur **</span>
            <div className="h-10 border-b border-dashed border-slate-200" />
            <span className="font-bold text-slate-400 italic">N/A</span>
          </div>
        </div>

        {/* Footer info: Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-[10px] bg-slate-50">
          {/* Transfer Info */}
          <div className="p-2.5 space-y-1">
            <p className="font-bold text-center underline text-slate-900 mb-1">Transfer To</p>
            <div className="flex"><span className="w-12 font-semibold">Nama</span><span>: {receipt.technician}</span></div>
            <div className="flex"><span className="w-12 font-semibold">No. Rek</span><span>: {receipt.bank_account}</span></div>
            <div className="flex"><span className="w-12 font-semibold">Bank</span><span>: {receipt.bank_name}</span></div>
          </div>

          {/* Return Company info */}
          <div className="p-2.5 flex flex-col justify-center text-center space-y-1">
            <p className="font-bold text-slate-900">Retur to Company paid to :</p>
            <p className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded py-1">
              MANDIRI 124 000 519 6192
            </p>
            <p className="font-semibold text-[9px] text-slate-600">PT MAHAGA PRATAMA</p>
          </div>

          {/* Cost Allocation */}
          <table className="w-full text-left text-[9px] border-collapse bg-white">
            <thead>
              <tr className="bg-slate-300 font-bold border-b border-slate-800">
                <td colSpan={2} className="px-2 py-0.5 text-center font-bold text-slate-900">Distribusi Cost</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-2 py-0.5 font-semibold border-r border-slate-200">Budget Dept</td><td className="px-2 py-0.5">: Operations</td></tr>
              <tr><td className="px-2 py-0.5 font-semibold border-r border-slate-200">License</td><td className="px-2 py-0.5">: Active</td></tr>
              <tr><td className="px-2 py-0.5 font-semibold border-r border-slate-200">Product</td><td className="px-2 py-0.5">: Field Service</td></tr>
              <tr><td className="px-2 py-0.5 font-semibold border-r border-slate-200">Project</td><td className="px-2 py-0.5">: NSD Remote Site</td></tr>
            </tbody>
          </table>
        </div>

        {/* Footer Disclaimers */}
        <div className="text-[9px] text-slate-500 space-y-1 leading-normal pt-1.5">
          <p>* Jika Total Expense di Atas 5 juta harus mendapat approval Kepala Divisi dan Direktur terkait</p>
          <p>Untuk Bukti bayar harus dalam bentukan nota resmi dengan logo dan stempel, bila tidak harus ada approval budget holder atau atasan langsung</p>
          <p>Setelah mengembalikan uang retur ke rekening PSN wajib menginformasikan ke accounting melalui email</p>
        </div>
      </div>
    </div>
  );
}

// --- Format 2: Standard Receipt & KTP ---
function ReceiptAndKtpDocument({ receipt }: { receipt: Receipt }) {
  return (
    <div className="space-y-6 max-w-[600px] mx-auto print:space-y-8" id="receipt-ktp-view">
      {/* Uploaded KTP Section */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm text-center print:border-none print:shadow-none">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 print:hidden">KTP Teknisi (Bukti Identitas)</h4>
        {receipt.ktp_image ? (
          <div className="relative inline-block border-2 border-slate-300 rounded-lg overflow-hidden max-w-sm w-full bg-slate-50 shadow-inner">
            <img src={receipt.ktp_image} alt="KTP Teknisi" className="w-full h-auto object-cover max-h-[220px]" />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 max-w-sm mx-auto">
            <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-xs font-semibold">KTP Belum Diunggah</p>
            <p className="text-[10px] mt-1 text-slate-400">Silakan edit kwitansi atau unggah KTP baru</p>
          </div>
        )}
      </div>

      {/* Kwitansi Voucher */}
      <div className="bg-white font-mono text-sm border-2 border-black p-6 relative print:border-2 print:border-black print:p-8">
        {/* Voucher Header */}
        <div className="flex justify-between items-start border-b border-black pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold tracking-widest text-slate-900">PT. MAHAGA PRATAMA</h3>
            <p className="text-[10px] text-slate-500">Jakarta, Indonesia</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-extrabold uppercase tracking-widest text-slate-900">KWITANSI</h2>
          </div>
        </div>

        {/* Voucher Details */}
        <div className="space-y-3.5 text-xs text-slate-900">
          <div className="flex gap-4">
            <span className="w-32 font-bold shrink-0">No</span>
            <span className="font-semibold">: {receipt.id}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-32 font-bold shrink-0">Telah Terima Dari</span>
            <span>: {receipt.received_from}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-32 font-bold shrink-0">Uang Sejumlah</span>
            <span className="italic font-semibold bg-slate-50 border-b border-slate-300 px-1.5 py-0.5 rounded">: {receipt.amount_text}</span>
          </div>
          <div className="flex gap-4">
            <span className="w-32 font-bold shrink-0">Untuk Pembayaran</span>
            <span className="leading-relaxed">: {receipt.payment_for}</span>
          </div>
        </div>

        {/* Spacer line */}
        <div className="border-t border-dashed border-slate-300 my-5" />

        {/* Footer Row (Amount & Signature) */}
        <div className="flex justify-between items-end mt-4">
          {/* Price Tag Box */}
          <div className="bg-slate-100 border border-slate-300 px-4 py-2 text-center rounded">
            <span className="text-lg font-bold text-slate-900 font-mono">
              {formatRupiah(receipt.amount)}
            </span>
          </div>

          {/* Signature Area */}
          <div className="text-center w-48 text-[11px]">
            <p className="text-slate-500 mb-10">Jakarta, {receipt.date}</p>
            <div className="border-b border-black w-full" />
            <p className="font-bold mt-1 text-slate-900 truncate">{receipt.technician}</p>
            <p className="text-[10px] text-slate-500">Teknisi / Penerima</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create/Edit Receipt Dialog ---
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
  const [ktpUrl, setKtpUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCarfChange = (val: string) => {
    setCarfId(val);
    const matched = MOCK_CARFS.find(c => c.id === val);
    if (matched) {
      setAmount(matched.amount);
      setAmountText(matched.amountText);
      setPaymentFor(matched.desc);
    }
  };

  const handleTechChange = (val: string) => {
    setTechnician(val);
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setKtpUrl(event.target.result as string);
          toast.success("Foto KTP berhasil dimuat!");
        }
      };
      reader.readAsDataURL(file);
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
        ktp_image: ktpUrl,
        department: "Mahaga",
        created_by: technician,
        approved_by: "Ardi Ahmad Syauki",
        checked_by: "Adi Wibowo",
        bank_name: "MANDIRI",
        bank_account: "124 000 519 6192",
      });
      toast.success(`Kwitansi ${nextId} berhasil dibuat.`);
      // Reset
      setCarfId("");
      setPaymentFor("");
      setAmount(0);
      setAmountText("");
      setTechnician("");
      setKtpUrl(undefined);
      onClose();
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Kwitansi & Expense Report ({nextId})</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Referensi CARF *</Label>
            <Select value={carfId} onValueChange={handleCarfChange}>
              <SelectTrigger><SelectValue placeholder="Pilih CARF..." /></SelectTrigger>
              <SelectContent>
                {MOCK_CARFS.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
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
              placeholder="Jasa sewa mobil 9 hari..."
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
              placeholder="Enam Juta Seratus Dua Puluh Ribu Rupiah"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Teknisi / Penerima *</Label>
            <Select value={technician} onValueChange={handleTechChange}>
              <SelectTrigger><SelectValue placeholder="Pilih Teknisi..." /></SelectTrigger>
              <SelectContent>
                {MOCK_TECHNICIANS.map(t => (
                  <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* KTP upload field */}
          <div className="space-y-2 border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50">
            <Label className="text-xs font-semibold text-slate-700 block">Lampiran Foto KTP Teknisi</Label>
            {ktpUrl ? (
              <div className="relative inline-block rounded border overflow-hidden w-full h-32 bg-white">
                <img src={ktpUrl} alt="Preview KTP" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setKtpUrl(undefined)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-slate-500">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer border-slate-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Unggah Foto KTP
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleKtpUpload}
                  className="hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG (Max 5MB)</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog dibuka.");
  };

  const handleCreate = (newReceipt: Receipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    setSelectedReceipt(newReceipt);
  };

  const handleUploadKtpForSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedReceipt) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updated = { ...selectedReceipt, ktp_image: event.target.result as string };
          setSelectedReceipt(updated);
          setReceipts((prev) => prev.map((r) => r.id === selectedReceipt.id ? updated : r));
          toast.success("KTP berhasil diunggah untuk kwitansi " + selectedReceipt.id);
        }
      };
      reader.readAsDataURL(file);
    }
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
      {/* Custom print styling rules */}
      <style>{`
        @media print {
          /* Hide all dashboard content except preview wrapper */
          body > *:not(#print-root-wrapper) {
            display: none !important;
          }
          #print-root-wrapper {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Ensure we do not print background colors with shadows */
          #print-root-wrapper * {
            box-shadow: none !important;
          }
          #report-view {
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          #receipt-ktp-view {
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Receipt Generator & Expense Report</h1>
            <p className="text-slate-500 text-sm mt-1">
              Buat, preview, dan cetak form Expense Report serta Kwitansi resmi dengan foto KTP teknisi.
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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daftar Dokumen</p>
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
                    <TableHead className="text-xs font-semibold text-slate-600">Teknisi</TableHead>
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
                        <TableCell className={`text-xs ${selectedReceipt?.id === r.id ? "text-slate-300" : "text-slate-700"}`}>
                          {r.technician}
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

          {/* Right: Preview & Tab Formats */}
          <div className="lg:col-span-3">
            {selectedReceipt ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Preview Format Cetak</span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {/* Add KTP upload trigger for existing receipt */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload KTP
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleUploadKtpForSelected}
                      className="hidden"
                    />

                    <Button variant="default" size="sm" onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow cursor-pointer">
                      <Printer className="mr-1.5 h-3.5 w-3.5" />
                      Print / PDF
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 shadow-inner" id="print-root-wrapper">
                  <Tabs defaultValue="report" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4 bg-slate-200 p-1 rounded-lg print:hidden">
                      <TabsTrigger value="report" className="text-xs font-semibold py-1.5 rounded cursor-pointer">
                        Format 1: Expense Report
                      </TabsTrigger>
                      <TabsTrigger value="receipt" className="text-xs font-semibold py-1.5 rounded cursor-pointer">
                        Format 2: Kwitansi & KTP
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="report" className="outline-none focus:outline-none">
                      <ExpenseReportDocument receipt={selectedReceipt} />
                    </TabsContent>
                    
                    <TabsContent value="receipt" className="outline-none focus:outline-none">
                      <ReceiptAndKtpDocument receipt={selectedReceipt} />
                    </TabsContent>
                  </Tabs>
                </div>
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
