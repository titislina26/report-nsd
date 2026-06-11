import { useState, useEffect } from "react";
import { requireMockUser } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Switch } from "@base-ui/react/switch";
import { toast } from "sonner";
import { Settings as SettingsIcon, Shield, Sliders, Database, RefreshCw, Trash2 } from "lucide-react";
import type { Route } from "./+types/settings";

export function meta() {
  return [
    { title: "Settings — Mahaga FieldOps" },
    { name: "description", content: "Configure application settings and mock simulation" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = requireMockUser(request);
  return { user };
}

export default function Settings() {
  const [enterpriseName, setEnterpriseName] = useState("PT. Mahaga Pratama");
  const [simulationLatency, setSimulationLatency] = useState(500);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan umum berhasil disimpan!");
  };

  const handleResetData = () => {
    if (confirm("Apakah Anda yakin ingin menyetel ulang semua data simulasi ke bawaan?")) {
      localStorage.clear();
      toast.success("Semua data simulasi berhasil disetel ulang!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-indigo-600 animate-spin-slow" /> Pengaturan Sistem
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Kelola konfigurasi platform, database lokal, dan simulator operasional Mahaga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Config Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-500" /> Profil Enterprise
              </CardTitle>
              <CardDescription>Sesuaikan detail dasar organisasi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="org-name">Nama Perusahaan / Instansi</Label>
                  <Input
                    id="org-name"
                    value={enterpriseName}
                    onChange={(e) => setEnterpriseName(e.target.value)}
                    placeholder="Contoh: PT. Mahaga Pratama"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="region">Wilayah Operasional</Label>
                    <Input id="region" defaultValue="Indonesia (WIB/WITA/WIT)" disabled className="bg-slate-50 text-slate-500" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="timezone">Zona Waktu Sistem</Label>
                    <Input id="timezone" defaultValue="GMT+07:00 (Asia/Jakarta)" disabled className="bg-slate-50 text-slate-500" />
                  </div>
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow">
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Simulator & Environment Settings */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-indigo-500" /> Pengaturan Simulator & UI
              </CardTitle>
              <CardDescription>Mengatur responsivitas simulasi data front-end.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-900">Auto Refresh Simulasi</label>
                    <p className="text-xs text-slate-500">Secara dinamis memperbarui status teknisi di dashboard.</p>
                  </div>
                  <Switch.Root
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    className="h-6 w-11 inline-flex items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600 cursor-pointer"
                  >
                    <Switch.Thumb className="h-4 w-4 transform rounded-full bg-white transition-transform data-[checked]:translate-x-6 translate-x-1" />
                  </Switch.Root>
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-900">Mode Debug / Logger</label>
                    <p className="text-xs text-slate-500">Tampilkan payload JSON real-time untuk simulasi aksi.</p>
                  </div>
                  <Switch.Root
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                    className="h-6 w-11 inline-flex items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600 cursor-pointer"
                  >
                    <Switch.Thumb className="h-4 w-4 transform rounded-full bg-white transition-transform data-[checked]:translate-x-6 translate-x-1" />
                  </Switch.Root>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-900">Simulasi Latensi Jaringan</label>
                  <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                    {simulationLatency} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={simulationLatency}
                  onChange={(e) => setSimulationLatency(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[11px] text-slate-400">
                  Waktu tunda buatan saat memuat data, mensimulasikan pemuatan backend sesungguhnya.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Database Maintenance */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-indigo-500" /> Pemeliharaan Data
              </CardTitle>
              <CardDescription>Tindakan pembersihan dan reset lokal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3.5">
                <h4 className="text-xs font-bold text-yellow-800">Perhatian Sandbox</h4>
                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                  Data yang Anda input disimpan di memori React state (atau localStorage). Jika data bermasalah, silakan reset ke kondisi awal.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleResetData}
                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Setel Ulang Data Simulasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
