# Product Requirements Document (PRD)
## Mahaga FieldOps & Expense Manager

---

### 0. Kontrol Dokumen (Document Control)

| Field | Nilai |
|---|---|
| **Nama Produk** | Mahaga FieldOps & Expense Manager |
| **Versi Dokumen** | 2.0 (Enhanced) |
| **Status** | Draft for Review |
| **Pemilik Produk (Product Owner)** | _[Diisi]_ |
| **Tanggal Dibuat** | _[Diisi]_ |
| **Terakhir Diperbarui** | _[Diisi]_ |
| **Reviewer / Stakeholder** | Finance, Operasional Lapangan, Manajemen, Tim Engineering |

**Riwayat Revisi**

| Versi | Tanggal | Penulis | Perubahan |
|---|---|---|---|
| 1.0 | — | — | Draft awal (struktur dasar, 4 entitas, fitur high-level) |
| 2.0 | — | — | Penambahan problem statement, persona, user story + acceptance criteria, logika bisnis cash advance, state machine, skema DB detail, RBAC/RLS, NFR terukur, strategi testing, risk register, glosarium |

> **Catatan keterbacaan:** Bagian yang ditandai dengan ⚠️ **ASUMSI** adalah interpretasi atas data sumber (DATA.csv, COVER.csv, KWITANSI.csv, PIVOT.csv) yang **perlu dikonfirmasi** oleh stakeholder bisnis sebelum implementasi. Lihat juga §22 (Open Questions).

---

### 1. Ringkasan Eksekutif (Executive Summary)

PT Mahaga Pratama menjalankan operasional lapangan untuk proyek jaringan/telekomunikasi (VSAT, UBIQU, RTGS PSN, LoRa Gateway) yang tersebar di berbagai area, termasuk lokasi terpencil (Papua). Saat ini proses **permintaan dana muka (Cash Advance Request Form / CARF)**, **penugasan teknisi**, dan **pertanggungjawaban biaya** dikelola secara manual lewat Excel. Proses manual ini menimbulkan: data tersebar di banyak file, sulit dilacak secara real-time, rawan kesalahan rekonsiliasi, dan tidak ada *audit trail* yang jelas.

**Mahaga FieldOps & Expense Manager** adalah aplikasi web tersentralisasi yang mendigitalkan seluruh siklus: dari pengajuan dana → persetujuan → pencairan bertahap (DP) → realisasi biaya → rekonsiliasi → penutupan, lengkap dengan manajemen dokumen (PRQ/WO/Invoice/Kwitansi), pelacakan pekerjaan teknisi, dan dashboard analitik.

**Nilai utama yang ditargetkan:**
- Satu sumber data tunggal (single source of truth) menggantikan banyak file Excel.
- Visibilitas real-time atas posisi dana, status pekerjaan, dan beban per area.
- Jejak audit dan kontrol akses berbasis peran.
- Otomatisasi pembuatan kwitansi & laporan, mengurangi pekerjaan manual.

---

### 2. Latar Belakang & Pernyataan Masalah (Background & Problem Statement)

**Kondisi saat ini (As-Is):**
- Pengajuan dana dicatat manual di Excel (DATA.csv / COVER.csv); tidak ada validasi otomatis.
- Pencairan sering bertahap (DP 1, DP 2, Pelunasan) namun pelacakannya hanya berupa catatan teks bebas pada kolom "Deskripsi Dana Other", sehingga **rincian per tahap pencairan tidak terstruktur**.
- Kwitansi (KWITANSI.csv) dibuat manual dan terpisah dari transaksi induknya.
- Rekap/pivot (PIVOT.csv) dibuat ulang setiap kali laporan dibutuhkan.
- Tidak ada notifikasi; status (Not Yet / Done / Paid) diperbarui manual dan rawan basi.

**Masalah inti yang ingin diselesaikan:**
1. **Kehilangan visibilitas dana** — sulit menjawab "berapa total dana belum dipertanggungjawabkan?" secara cepat.
2. **Rekonsiliasi sulit** — selisih antara dana diminta vs. realisasi tidak terhitung otomatis.
3. **Pencairan bertahap tidak terstruktur** — DP 1/DP 2/Pelunasan tidak terkait formal ke satu CARF.
4. **Dokumen tercecer** — bukti (PRQ/WO/Invoice/Kwitansi/bukti transfer) tidak menempel pada transaksi.
5. **Tidak ada kontrol akses** — semua orang yang punya file Excel bisa mengubah apa saja.

---

### 3. Tujuan, Sasaran & Metrik Keberhasilan (Goals, Objectives & Success Metrics)

**Tujuan Bisnis:**
- Mempercepat siklus pengajuan-hingga-pencairan dana.
- Meningkatkan akurasi pertanggungjawaban biaya dan ketepatan rekonsiliasi.
- Memberikan visibilitas manajemen atas pengeluaran operasional lapangan.

**Sasaran Produk (Objectives) & KPI (Success Metrics):**

| # | Sasaran | Metrik (KPI) | Target |
|---|---|---|---|
| O1 | Percepat pencairan | Rata-rata waktu Submit → Approved | < 1 hari kerja |
| O2 | Kurangi pekerjaan manual | Kwitansi & laporan dihasilkan otomatis | 100% generate dari sistem |
| O3 | Akurasi rekonsiliasi | Selisih realisasi terhitung otomatis & terdokumentasi | 100% CARF closed punya rekonsiliasi |
| O4 | Visibilitas dana | Dashboard menampilkan dana outstanding real-time | Refresh < 5 detik |
| O5 | Adopsi | Pengajuan dibuat via aplikasi (bukan Excel) | > 90% dalam 3 bulan |
| O6 | Kepatuhan dokumen | CARF closed memiliki lampiran bukti lengkap | > 95% |

---

### 4. Ruang Lingkup (Scope)

**In-Scope (MVP & rilis awal):**
- Autentikasi & manajemen pengguna berbasis peran.
- Modul CARF: pengajuan, persetujuan, rincian biaya (line items).
- Pencairan bertahap (DP 1 / DP 2 / Pelunasan) + realisasi + rekonsiliasi.
- Manajemen master: teknisi, proyek, area.
- Generator & cetak Kwitansi (PDF print-friendly).
- Manajemen dokumen / lampiran (Supabase Storage).
- Dashboard & analitik (statistik, chart, pivot/summary).
- Field Operations (timeline/kanban status pekerjaan teknisi).
- Notifikasi in-app dan toast feedback.
- Audit trail / riwayat status.

**Out-of-Scope (untuk rilis awal — lihat §21):**
- Integrasi langsung ke sistem akuntansi/ERP eksternal.
- Pembayaran/transfer bank otomatis (host-to-host banking).
- Aplikasi mobile native (dipenuhi via web responsive dulu).
- Modul payroll/HR.
- Mode offline penuh untuk teknisi lapangan (hanya degradasi anggun di koneksi lemah).
- E-signature/tanda tangan digital tersertifikasi.

---

### 5. Persona & Peran Pengguna (User Personas & Roles)

| Peran | Persona singkat | Kebutuhan utama |
|---|---|---|
| **Admin** | Mengelola sistem & master data | Atur pengguna, master teknisi/proyek/area, konfigurasi, akses penuh |
| **Finance** | Tim keuangan yang mencairkan & merekonsiliasi | Cairkan DP, verifikasi realisasi, generate kwitansi, lihat laporan dana |
| **Approver** | Atasan/penyetuju anggaran | Setujui/tolak CARF dengan konteks rincian biaya |
| **Requestor** | Staf yang mengajukan dana (mis. PM/koordinator lapangan) | Buat CARF, lampirkan kebutuhan, pantau status & sisa dana |
| **Technician** | Teknisi lapangan (sering di lokasi terpencil) | Lihat penugasan, unggah bukti/kwitansi dari HP, lihat status transfer |
| **Viewer** | Manajemen/auditor | Akses baca-saja dashboard & laporan |

> ⚠️ **ASUMSI:** Pemisahan `CARF NT` (Non-Teknisi) vs `CARF T` (Teknisi) menandakan bahwa sebagian pengajuan tidak terkait teknisi (mis. pengadaan/operasional kantor). Karena itu `technician_id` bersifat *nullable*. Mohon konfirmasi arti pasti NT/T.

---

### 6. Matriks Hak Akses (Role-Based Access Control / RBAC)

`C` = Create, `R` = Read, `U` = Update, `D` = Delete, `A` = Action khusus, `—` = tidak ada akses.

| Kapabilitas | Admin | Finance | Approver | Requestor | Technician | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Kelola pengguna & peran | CRUD | — | — | — | — | — |
| Kelola master (teknisi/proyek/area) | CRUD | R | R | R | R | R |
| Buat/edit CARF (draft) | CRUD | R | R | C,R,U (milik sendiri) | R (yg ditugaskan) | R |
| Submit CARF | A | — | — | A (milik sendiri) | — | — |
| Setujui / Tolak CARF | A | A | A | — | — | — |
| Catat pencairan (DP/Pelunasan) | A | A | — | — | — | — |
| Unggah lampiran/bukti | CRUD | CRUD | R | C,R (milik sendiri) | C,R (yg ditugaskan) | R |
| Input realisasi biaya | A | A | — | A (milik sendiri) | A (yg ditugaskan) | — |
| Rekonsiliasi & tutup CARF | A | A | — | — | — | — |
| Generate & cetak Kwitansi | A | A | — | R | R | R |
| Lihat dashboard & laporan | R | R | R | R (terbatas) | R (terbatas) | R |
| Lihat audit trail | R | R | R | R (milik sendiri) | — | R |

---

### 7. User Story & Kriteria Penerimaan (User Stories & Acceptance Criteria)

Ditulis per *epic*. Format: **Sebagai** \<peran\>, **saya ingin** \<kebutuhan\>, **agar** \<manfaat\>.

#### Epic A — Pengajuan Dana (CARF)
- **US-A1** — Sebagai *Requestor*, saya ingin membuat CARF dengan rincian biaya (Jasa, Transport, Sewa Mobil, dll.) agar pengajuan terstruktur.
  - **AC:** Form memvalidasi field wajib (proyek, area, periode, minimal 1 line item). Total terhitung otomatis. Status awal = `draft`. Bisa simpan draft tanpa submit.
- **US-A2** — Sebagai *Requestor*, saya ingin mengaitkan teknisi & periode pekerjaan agar penugasan jelas.
  - **AC:** `start_date ≤ end_date`. Teknisi dipilih dari master. Untuk `doc_type = CARF_NT`, teknisi opsional.
- **US-A3** — Sebagai *Requestor*, saya ingin men-submit CARF untuk persetujuan.
  - **AC:** Submit hanya boleh dari status `draft`/`rejected`. Setelah submit, line items terkunci (read-only) hingga ditolak. Notifikasi terkirim ke Approver.

#### Epic B — Persetujuan
- **US-B1** — Sebagai *Approver*, saya ingin menyetujui/menolak CARF beserta alasan.
  - **AC:** Aksi hanya valid dari status `submitted`. Penolakan wajib mengisi alasan. Perubahan status tercatat di audit trail. Notifikasi ke Requestor.

#### Epic C — Pencairan & Realisasi (inti kompleksitas)
- **US-C1** — Sebagai *Finance*, saya ingin mencairkan dana bertahap (DP 1, DP 2, Pelunasan) terhadap satu CARF.
  - **AC:** Setiap pencairan punya jumlah, tanggal, rekening tujuan, bukti transfer. Total tercairkan tidak boleh melebihi `requested_amount` kecuali ditandai sebagai reimbursement (lihat US-C3). Status CARF → `disbursing`.
- **US-C2** — Sebagai *Requestor/Technician*, saya ingin menginput realisasi biaya per kategori dan melampirkan kwitansi/bukti.
  - **AC:** Realisasi per line item bisa diisi. Sistem menghitung `realized_amount` total & selisih terhadap `requested_amount`.
- **US-C3** — Sebagai *Finance*, saya ingin merekonsiliasi selisih.
  - **AC:** Jika realisasi < tercairkan → muncul "Kembalian dari teknisi". Jika realisasi > tercairkan → muncul "Reimbursement ke teknisi". Setelah rekonsiliasi selesai → status `reconciled` lalu `closed`.

#### Epic D — Kwitansi & Dokumen
- **US-D1** — Sebagai *Finance*, saya ingin generate kwitansi otomatis dari data CARF/pencairan.
  - **AC:** Field "Telah Terima Dari" default `PT Mahaga Pratama`, "Terbilang" digenerate otomatis dari angka (Bahasa Indonesia), bisa cetak/export PDF rapi (print-friendly).
- **US-D2** — Sebagai pengguna, saya ingin drag-and-drop lampiran (PRQ/WO/Invoice) dengan preview.
  - **AC:** Mendukung PDF & gambar. Preview tampil di modal. Tersimpan di Supabase Storage dengan akses sesuai RBAC.

#### Epic E — Dashboard & Field Ops
- **US-E1** — Sebagai *Viewer/Manajemen*, saya ingin melihat ringkasan dana, pekerjaan Done vs Pending, dan area dengan pengeluaran terbesar.
  - **AC:** Angka cocok dengan data transaksi; filter berdasarkan periode/area/proyek.
- **US-E2** — Sebagai *Requestor*, saya ingin tabel pivot Count of Deskripsi Kebutuhan per Requestor (meniru PIVOT.csv).
  - **AC:** Grouping & count akurat; dapat diexport.
- **US-E3** — Sebagai *Technician*, saya ingin melihat timeline pekerjaan berdasarkan periode `START`–`END`.
  - **AC:** Pekerjaan ditampilkan per status; hanya menampilkan yang ditugaskan ke teknisi tersebut.

---

### 8. Kebutuhan Fungsional (Functional Requirements)

Prioritas dengan **MoSCoW**: **M**ust / **S**hould / **C**ould / **W**on't (rilis ini).

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Autentikasi email/password via Supabase Auth + manajemen sesi | M |
| FR-02 | Manajemen pengguna & penetapan peran (RBAC) | M |
| FR-03 | CRUD master: teknisi, proyek, area | M |
| FR-04 | Buat/Edit/Submit CARF dengan line items biaya | M |
| FR-05 | Alur persetujuan (approve/reject + alasan) | M |
| FR-06 | Pencairan bertahap (DP 1/DP 2/Pelunasan) dengan bukti transfer | M |
| FR-07 | Input realisasi & perhitungan selisih otomatis | M |
| FR-08 | Rekonsiliasi & penutupan CARF | M |
| FR-09 | Generator Kwitansi + terbilang otomatis + export PDF | M |
| FR-10 | Upload lampiran (drag-drop) + preview (PDF/gambar) | M |
| FR-11 | Data table CARF: sorting, filter (area/status/tipe), pagination | M |
| FR-12 | Dashboard statistik + chart pengeluaran bulanan | M |
| FR-13 | Pivot/summary table (Count per Requestor) | S |
| FR-14 | Notifikasi in-app + toast feedback CRUD | S |
| FR-15 | Audit trail / riwayat perubahan status | S |
| FR-16 | Field Ops: timeline/kanban status pekerjaan | S |
| FR-17 | Pencarian global (CARF, teknisi, dokumen) | S |
| FR-18 | Export laporan (CSV/Excel/PDF) | S |
| FR-19 | Profil teknisi: riwayat pekerjaan & riwayat transfer | C |
| FR-20 | Penomoran dokumen otomatis (`trans_code`, `doc_no`) terformat | C |
| FR-21 | Real-time update (Supabase Realtime) pada tabel & dashboard | C |
| FR-22 | Mode gelap (dark mode) | C |
| FR-23 | Tanda tangan digital tersertifikasi | W |
| FR-24 | Integrasi banking host-to-host | W |

---

### 9. Logika Bisnis & Alur Kerja (Business Logic & Workflows)

Bagian ini adalah **jantung aplikasi** dan area kompleksitas tertinggi.

#### 9.1 State Machine Status CARF

```
draft ──submit──▶ submitted ──approve──▶ approved ──disburse──▶ disbursing
  ▲                   │                                              │
  │               reject│                                            │ input realisasi
  └──revise──── rejected ────cancel──▶ cancelled                     ▼
                                                                  realized
                                                                     │ verifikasi & rekonsiliasi
                                                                     ▼
                                                                 reconciled ──close──▶ closed
```

Aturan transisi:
- `draft → submitted`: oleh Requestor (validasi line items lengkap).
- `submitted → approved | rejected`: oleh Approver/Finance/Admin.
- `rejected → draft`: revisi oleh Requestor; atau `→ cancelled`.
- `approved → disbursing`: saat pencairan pertama dicatat (Finance).
- `disbursing → realized`: saat realisasi diinput & bukti dilampirkan.
- `realized → reconciled`: setelah Finance memverifikasi selisih.
- `reconciled → closed`: penutupan final.
- `* → cancelled`: dengan izin (Admin/Finance), kecuali status `closed`.

> **Pemetaan status legacy** (untuk migrasi dari Excel): `Not Yet → submitted/approved`, `Done → realized/reconciled`, `Paid → closed`. Mohon konfirmasi pemetaan ini.

#### 9.2 Logika Pencairan Bertahap (DP) & Rekonsiliasi

Definisi nilai:
- `requested_amount` = Σ line item (estimasi kebutuhan).
- `disbursed_total` = Σ semua pencairan (DP 1 + DP 2 + Pelunasan).
- `realized_amount` = Σ realisasi aktual (didukung bukti/kwitansi).
- `variance` = `disbursed_total − realized_amount`.

Aturan rekonsiliasi:
- `variance > 0` → **dana lebih**: teknisi/requestor mengembalikan selisih (status pengembalian dicatat).
- `variance < 0` → **dana kurang**: perusahaan melakukan **reimbursement** sebesar |variance| (umumnya lewat "Pelunasan").
- `variance = 0` → seimbang, langsung dapat ditutup.

Invarian/validasi:
- Total pencairan reguler tidak melebihi `requested_amount`, kecuali tahap `pelunasan` yang khusus dipakai untuk menutup kekurangan realisasi yang sudah terbukti.
- CARF tidak bisa `closed` jika masih ada lampiran wajib yang kosong atau `variance` belum direkonsiliasi.

#### 9.3 Logika "Terbilang" (Number-to-Words)
- Konversi angka Rupiah ke kata Bahasa Indonesia (mis. `1.500.000` → "satu juta lima ratus ribu rupiah").
- Diimplementasikan sebagai utilitas murni (`amountToWords(amount: number): string`) dengan unit test menyeluruh (lihat §19), mendukung hingga miliaran.

#### 9.4 Penomoran Dokumen
- `trans_code` & `doc_no` digenerate berdasarkan pola terkonfigurasi (mis. `CARF/T/2025/06/0001`).
- Pola, reset periode (bulanan/tahunan), dan komponen (divisi/area) dapat dikonfigurasi Admin.
- ⚠️ **ASUMSI:** Pola format perlu dikonfirmasi dari data nyata pada DATA.csv/COVER.csv.

---

### 10. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Persyaratan | Target |
|---|---|---|
| **Performa** | Render tabel & dashboard dengan ribuan baris tetap responsif (pagination/virtualization sisi server) | TTFB < 500ms; interaksi < 100ms |
| **Skalabilitas** | Mendukung pertumbuhan data operasional (puluhan ribu CARF) | Query terindeks; pagination keyset |
| **Keamanan** | RBAC + Row Level Security wajib aktif; tidak ada akses lintas peran tak sah | RLS pada semua tabel |
| **Privasi data** | Data rekening bank & PII terlindungi; akses sesuai peran | Enkripsi at-rest (Supabase) |
| **Ketersediaan** | Uptime layanan | ≥ 99.5% |
| **Keandalan** | Operasi keuangan idempoten; tidak ada double-disbursement | Constraint DB + guard aplikasi |
| **Aksesibilitas** | Komponen accessible (shadcn/ui), kontras memadai, navigasi keyboard | WCAG 2.1 AA |
| **Responsif/Mobile** | Layak digunakan teknisi via HP di lapangan | Breakpoint mobile-first untuk alur upload/lihat tugas |
| **Lokalisasi** | Format Rupiah (`Rp 1.500.000`), tanggal `DD/MM/YYYY` atau `DD MMMM YYYY`, Bahasa Indonesia | Konsisten di seluruh UI |
| **Observability** | Logging error & audit aksi penting | Tercatat & dapat ditelusuri |
| **Backup** | Pencadangan basis data berkala | Sesuai kebijakan Supabase + ekspor periodik |

---

### 11. Arsitektur Teknis (Technical Architecture)

#### 11.1 Tech Stack (dengan rasional)
- **Frontend:** Next.js (App Router) + React — SSR/streaming untuk performa, routing modern.
- **Styling/UI:** Tailwind CSS + shadcn/ui — komponen accessible, mudah dikustomisasi.
- **Animasi:** Framer Motion — transisi route, modal, micro-interactions.
- **Tabel:** TanStack Table — sorting/filtering/pagination data besar.
- **Chart:** Recharts — visualisasi pengeluaran.
- **Form & Validasi:** React Hook Form + Zod — validasi tipe-aman selaras dengan constraint DB.
- **State server:** TanStack Query (React Query) — caching, sinkronisasi data Supabase.
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions).
- **PDF/Print:** react-to-print atau @react-pdf/renderer untuk kwitansi.
- **Toast:** sonner.
- **Deployment:** Vercel (CI/CD, Edge).

#### 11.2 Arsitektur Sistem (deskripsi)
```
[ Browser (Next.js/React) ]
        │  HTTPS
        ▼
[ Vercel Edge / Server Components ]
        │  Supabase JS SDK (RLS-enforced)
        ▼
[ Supabase: Postgres │ Auth │ Storage │ Realtime │ Edge Functions ]
```
- Operasi sensitif (penomoran, rekonsiliasi) sebaiknya lewat **Postgres function (RPC)** atau **Edge Function** agar atomik dan tidak bisa diakali dari klien.

#### 11.3 Struktur Folder (rekomendasi)
```
src/
├── app/                  # App Router (routes, layouts)
│   ├── (auth)/login
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── carf/
│   │   ├── field-ops/
│   │   ├── receipts/
│   │   └── settings/
├── components/           # UI reusable (ui/, shared/)
├── features/             # modul: carf/, disbursement/, receipts/...
│   └── carf/{api,components,hooks,schema,types}
├── lib/                  # supabase client, utils (currency, terbilang)
├── server/               # RPC wrappers, edge function clients
└── types/                # tipe global & generated DB types
```

---

### 12. Skema Database (Supabase / PostgreSQL)

Enum & tabel utama. (Tipe disederhanakan; gunakan `numeric(15,2)` untuk uang, `timestamptz` untuk waktu.)

**Enums**
```sql
create type user_role as enum ('admin','finance','approver','requestor','technician','viewer');
create type doc_type   as enum ('CARF_NT','CARF_T');
create type carf_status as enum
  ('draft','submitted','approved','rejected','disbursing','realized','reconciled','closed','cancelled');
create type cost_category as enum ('jasa','transport','sewa_mobil','akomodasi','material','lain_lain');
create type disbursement_type as enum ('dp_1','dp_2','pelunasan','full');
create type disbursement_status as enum ('pending','paid');
create type doc_category as enum ('prq','wo','invoice','kwitansi','bukti_transfer','lainnya');
```

**`profiles`** (perluasan `auth.users`)
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid (PK, FK→auth.users) | |
| email | text | |
| full_name | text | |
| role | user_role | default `requestor` |
| phone | text | |
| avatar_url | text | |
| is_active | boolean | default true |
| created_at / updated_at | timestamptz | |

**`technicians`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid (PK) | |
| code | text (unique) | kode teknisi |
| name | text | |
| user_id | uuid (FK→profiles, nullable) | jika teknisi juga user app |
| phone | text | |
| bank_name | text | |
| bank_account_no | text | |
| bank_account_holder | text | |
| area_coverage | text[] | atau relasi ke `areas` |
| is_active | boolean | |

**`projects`** — master proyek (VSAT, UBIQU, RTGS PSN, LoRa Gateway)
`id, code, name, client, description, is_active`

**`areas`** — master area
`id, name, region_type ('papua'|'non_papua'|'jawa'|...), is_active`

**`carf_requests`** (header transaksi — dari DATA.csv & COVER.csv)
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid (PK) | |
| trans_code | text (unique) | kode transaksi tergenerate |
| doc_no | text | no dokumen |
| req_date | date | tanggal permintaan |
| division | text | |
| doc_type | doc_type | CARF_NT / CARF_T |
| project_id | uuid (FK→projects) | |
| area_id | uuid (FK→areas) | |
| requestor_id | uuid (FK→profiles) | |
| technician_id | uuid (FK→technicians, nullable) | |
| title / description_needs | text | deskripsi kebutuhan |
| description_funds | text | rincian dana "other" |
| start_date / end_date | date | periode pekerjaan |
| requested_amount | numeric(15,2) | Σ line items |
| disbursed_total | numeric(15,2) | terhitung (atau view) |
| realized_amount | numeric(15,2) | nullable hingga realisasi |
| variance_amount | numeric(15,2) | computed/generated |
| status | carf_status | default `draft` |
| approved_by | uuid (FK→profiles, nullable) | |
| approved_at | timestamptz | |
| rejected_reason | text | |
| created_by | uuid | |
| created_at / updated_at | timestamptz | |

Index: `(status)`, `(area_id)`, `(doc_type)`, `(req_date)`, `(requestor_id)`, `(technician_id)`.

**`carf_line_items`** (rincian kebutuhan: Jasa/Transport/Sewa Mobil/…)
| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| carf_id | uuid (FK→carf_requests, on delete cascade) |
| category | cost_category |
| description | text |
| quantity | numeric |
| unit | text |
| unit_price | numeric(15,2) |
| amount | numeric(15,2) |
| realized_amount | numeric(15,2) nullable |
| sort_order | int |

**`disbursements`** (DP 1 / DP 2 / Pelunasan)
| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| carf_id | uuid (FK→carf_requests) |
| type | disbursement_type |
| sequence | int |
| amount | numeric(15,2) |
| disbursed_date | date |
| payment_method | text |
| bank_ref | text |
| recipient_bank_account | text |
| transfer_proof_url | text |
| status | disbursement_status |
| paid_by | uuid (FK→profiles) |
| notes | text |
| created_at | timestamptz |

**`receipts`** (kwitansi — dari KWITANSI.csv)
| Kolom | Tipe | Catatan |
|---|---|---|
| id | uuid (PK) | |
| receipt_no | text (unique) | |
| carf_id | uuid (FK, nullable) | |
| disbursement_id | uuid (FK, nullable) | |
| received_from | text | default `PT Mahaga Pratama` |
| payee | text | telah terima oleh |
| amount | numeric(15,2) | |
| amount_in_words | text | terbilang (auto) |
| payment_for | text | untuk pembayaran |
| place | text | tempat |
| receipt_date | date | |
| created_by | uuid | |

**`attachments`**
| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| carf_id | uuid (FK, nullable) |
| disbursement_id | uuid (FK, nullable) |
| doc_category | doc_category |
| file_name | text |
| file_url | text (Supabase Storage path) |
| file_type | text |
| file_size | bigint |
| uploaded_by | uuid |
| uploaded_at | timestamptz |

**`carf_status_history`** (audit trail)
`id, carf_id, from_status, to_status, changed_by, changed_at, note`

**`notifications`**
`id, user_id, type, title, body, link, is_read, created_at`

**Relasi ringkas:** `carf_requests` 1—N `carf_line_items`, 1—N `disbursements`, 1—N `attachments`, 1—N `receipts`, 1—N `carf_status_history`. `technicians` 1—N `carf_requests`. `projects`/`areas` 1—N `carf_requests`.

---

### 13. Kebijakan Row Level Security (RLS)

Prinsip: **default deny**, aktifkan RLS di semua tabel, beri akses berdasarkan `auth.uid()` dan peran (dari `profiles.role`).

Contoh kebijakan (deskripsi + sketsa SQL):
- **Requestor hanya lihat CARF miliknya; Admin/Finance/Approver/Viewer lihat semua.**
```sql
create policy "carf_select" on carf_requests for select using (
  exists (select 1 from profiles p where p.id = auth.uid()
          and p.role in ('admin','finance','approver','viewer'))
  or requestor_id = auth.uid()
  or technician_id in (select id from technicians t where t.user_id = auth.uid())
);
```
- **Hanya Requestor pemilik yang boleh insert/update saat status `draft`.**
- **Hanya Finance/Admin yang boleh insert ke `disbursements`.**
- **Hanya Finance/Admin yang boleh mengubah `status` ke `reconciled`/`closed`** (sebaiknya lewat RPC ber-`security definer` agar aturan terpusat).
- **Lampiran rekening/PII** hanya terlihat sesuai peran.

> Operasi multi-langkah (cairkan + ubah status + catat audit) sebaiknya dibungkus dalam **Postgres function transaksional** agar atomik dan konsisten dengan RLS.

---

### 14. Pola Akses Data / API (Data Access Patterns)

- **Baca daftar/detail:** Supabase client + RLS (server components / React Query).
- **Operasi keuangan & transisi status:** **RPC** (`create_carf`, `submit_carf`, `approve_carf`, `record_disbursement`, `record_realization`, `reconcile_carf`) — atomik, tervalidasi server-side, mencatat audit.
- **Penomoran dokumen:** RPC dengan locking (mis. advisory lock) untuk hindari nomor duplikat.
- **Realtime:** subscribe pada `carf_requests` & `notifications` untuk update dashboard & badge notifikasi.
- **Storage:** upload ke bucket privat; akses via signed URL sesuai peran.

---

### 15. Panduan UI/UX & "Vibe"

- **Layout:** App Shell — sidebar kiri (navigasi modul) + topbar (profil, pencarian global, notifikasi).
- **Palet warna:** enterprise bersih (Navy/Slate). Indikator status jelas:
  - 🟢 Hijau = Paid/Done/Closed
  - 🟡 Kuning = Pending/DP/Disbursing
  - 🔴 Merah = Rejected/Issue
  - ⚪ Abu = Draft
- **Tipografi:** Inter atau Geist; bersih & terbaca.
- **Interaktivitas (Framer Motion):** transisi route fade halus; modal scale-up/slide-up dengan spring lembut; baris tabel stagger; angka statistik count-up.
- **Feedback:** toast (sonner) untuk setiap aksi CRUD sukses/gagal; skeleton loading; empty states informatif.
- **Pola form kompleks (CARF):** line items dinamis (tambah/hapus baris), subtotal real-time, accordion/card untuk breakdown DP & realisasi pada slide-over detail.
- **Konsistensi:** komponen reusable (Badge status, CurrencyInput, FileDropzone, DataTable wrapper).

---

### 16. Pertimbangan Mobile & Lapangan

- Alur **upload bukti** dan **lihat penugasan** dioptimalkan mobile-first (teknisi sering di lapangan).
- Tombol besar, target sentuh memadai, kamera-ke-upload untuk foto kwitansi.
- Degradasi anggun pada koneksi lemah: indikator status upload, retry, kompresi gambar sisi klien.
- Hindari aksi destruktif tanpa konfirmasi pada layar kecil.

---

### 17. Analitik, Notifikasi & Audit

- **Dashboard:** total dana keluar, outstanding (belum dipertanggungjawabkan), Done vs Pending, area dengan pengeluaran terbesar, chart pengeluaran bulanan, pivot Count of Deskripsi Kebutuhan per Requestor. Filter periode/area/proyek.
- **Notifikasi:** saat CARF disubmit (→Approver), disetujui/ditolak (→Requestor), dicairkan (→Requestor/Technician), perlu rekonsiliasi (→Finance).
- **Audit trail:** setiap transisi status & aksi keuangan tercatat (siapa, kapan, dari→ke, catatan).

---

### 18. Roadmap Implementasi (Vibe Coding Roadmap)

| Fase | Fokus | Deliverable kunci |
|---|---|---|
| **0 — Discovery** | Validasi asumsi & pemetaan data Excel→skema | Skema final, konfirmasi NT/T, pola penomoran, contoh data |
| **1 — Setup** | Init Next.js + Tailwind + shadcn/ui; setup Supabase, tabel, enum, RLS dasar | Project boilerplate jalan; migrasi DB awal |
| **2 — Auth & Layout** | Supabase Auth, RBAC, App Shell (sidebar/topbar) | Login, guard rute per peran, layout dasar |
| **3 — Master Data** | CRUD teknisi/proyek/area | Modul master siap dipakai modul CARF |
| **4 — Core CARF (kompleksitas tertinggi)** | Form + line items, submit/approve, DataTable + filter/search | Modul CARF end-to-end (draft→approved) |
| **5 — Pencairan & Rekonsiliasi** | DP 1/DP 2/Pelunasan, realisasi, perhitungan selisih, tutup CARF | Siklus dana lengkap dengan audit |
| **6 — Dokumen & Kwitansi** | Upload+preview, generator kwitansi + terbilang + export PDF | Kwitansi print-friendly |
| **7 — Dashboard & Field Ops** | Recharts, pivot/summary, timeline/kanban teknisi | Analitik & pelacakan pekerjaan |
| **8 — Polish & Deploy** | Framer Motion, responsive/mobile, realtime, optimasi env | Deploy Vercel, QA, dokumentasi |

> Setiap fase ditutup dengan demo + checklist acceptance criteria terkait.

---

### 19. Strategi Pengujian (Testing Strategy)

- **Unit test:** utilitas kritis — `amountToWords` (terbilang), format Rupiah, kalkulasi total/selisih/rekonsiliasi, generator penomoran.
- **Integration test:** RPC keuangan (cairkan, realisasi, rekonsiliasi) termasuk kasus tepi (over/under realization, double-disbursement).
- **RLS test:** verifikasi tiap peran hanya mengakses yang diizinkan (positif & negatif).
- **E2E (Playwright):** alur utama — buat→submit→approve→cairkan→realisasi→rekonsiliasi→kwitansi.
- **Aksesibilitas:** audit kontras & navigasi keyboard.
- **Performa:** uji tabel dengan ribuan baris (pagination/virtualization).

---

### 20. Risiko, Asumsi & Dependensi

**Risk Register**

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| R1 | Logika DP/rekonsiliasi salah tafsir dari Excel | Tinggi | Validasi §9 dengan Finance sebelum coding (Fase 0) |
| R2 | Kualitas data Excel buruk saat migrasi | Sedang | Skrip pembersihan + validasi + dry-run import |
| R3 | RLS bocor (akses lintas peran) | Tinggi | Test RLS otomatis; review keamanan |
| R4 | Performa tabel ribuan baris | Sedang | Pagination keyset + index + virtualization |
| R5 | Operasi keuangan tidak atomik (double pay) | Tinggi | RPC transaksional + constraint unik |
| R6 | Konektivitas lapangan buruk | Sedang | UI mobile tahan koneksi lemah, retry upload |

**Asumsi (perlu konfirmasi):** arti `CARF NT/T`; pemetaan status legacy; pola `trans_code`/`doc_no`; daftar kategori biaya final; apakah satu CARF bisa banyak teknisi.

**Dependensi:** akun Supabase & Vercel; akses ke file sumber lengkap (DATA, COVER, KWITANSI, PIVOT) untuk validasi skema; keputusan stakeholder atas open questions.

---

### 21. Pengembangan Lanjutan (Future Enhancements / Backlog)

- Integrasi ke sistem akuntansi/ERP.
- Pembayaran/transfer bank otomatis.
- Aplikasi mobile native + mode offline penuh.
- E-signature tersertifikasi pada kwitansi/persetujuan.
- Approval berjenjang/multi-level berdasarkan nominal.
- Analitik lanjutan (forecasting anggaran, anomali biaya).
- Ekspor terjadwal & langganan laporan via email.

---

### 22. Pertanyaan Terbuka (Open Questions)

1. Apa definisi resmi `CARF NT` vs `CARF T`?
2. Apakah satu CARF bisa melibatkan lebih dari satu teknisi?
3. Bagaimana alur persetujuan sebenarnya — satu approver atau berjenjang berdasarkan nominal?
4. Pola penomoran `trans_code`/`doc_no` yang benar?
5. Daftar kategori biaya final (selain Jasa/Transport/Sewa Mobil)?
6. Bagaimana pengembalian dana lebih ditangani — kas, transfer balik, atau pemotongan CARF berikutnya?
7. Apakah perlu mata uang selain Rupiah?

---

### 23. Glosarium (Glossary)

| Istilah | Arti |
|---|---|
| **CARF** | Cash Advance Request Form — formulir permintaan dana muka |
| **CARF NT / CARF T** | Varian CARF — diduga Non-Teknisi / Teknisi (⚠️ konfirmasi) |
| **DP 1 / DP 2** | Down Payment tahap 1 / tahap 2 (pencairan bertahap) |
| **Pelunasan** | Pembayaran/penyelesaian akhir dari sisa dana |
| **Realisasi** | Biaya aktual yang benar-benar terpakai (didukung bukti) |
| **Rekonsiliasi** | Pencocokan dana tercairkan vs realisasi, lalu penyelesaian selisih |
| **Kwitansi** | Bukti penerimaan uang (receipt) |
| **Terbilang** | Nilai uang dalam kata-kata Bahasa Indonesia |
| **PRQ** | Purchase Request / dokumen permintaan (⚠️ konfirmasi) |
| **WO** | Work Order — perintah kerja |
| **Invoice** | Faktur tagihan |
| **VSAT** | Very Small Aperture Terminal — terminal satelit |
| **UBIQU / RTGS PSN / LoRa Gateway** | Nama proyek/layanan jaringan |
| **Requestor** | Pihak yang mengajukan dana |
| **RLS** | Row Level Security (kontrol akses tingkat baris di Postgres) |
| **RBAC** | Role-Based Access Control |

---

*Catatan untuk AI Assistant (Vibe Coding Basis):* Gunakan dokumen ini sebagai satu-satunya source of truth saat scaffolding komponen & menyusun logika bisnis. **Sebelum** mengimplementasikan logika keuangan, konfirmasi dulu item di §22. Prioritaskan clean code, reusable components, validasi tipe-aman (Zod selaras constraint DB), operasi keuangan atomik via RPC, dan RLS yang ketat.