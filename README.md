# Raporin - Sistem Informasi Pengelola Nilai Siswa

Raporin adalah aplikasi web untuk membantu proses pengelolaan nilai siswa secara digital. Aplikasi ini dibuat untuk menggantikan proses pengolahan nilai manual agar data siswa, guru, kelas, mata pelajaran, tahun ajaran, enrollment, nilai, dan laporan dapat dikelola lebih cepat, konsisten, dan mudah ditelusuri.

## Ringkasan

Raporin memiliki 3 role utama:

- `ADMIN`: mengelola master data, relasi akademik, laporan, dan export CSV.
- `TEACHER`: menginput, mengubah, menghapus, dan melihat nilai siswa sesuai assignment mata pelajaran miliknya.
- `STUDENT`: melihat nilai pribadi dan status kelulusan.

Perhitungan nilai akhir dilakukan otomatis oleh sistem:

```ts
finalScore = taskScore * 0.3 + utsScore * 0.3 + uasScore * 0.4;
```

Status kelulusan:

- `PASSED` / `LULUS` jika `finalScore >= 70`
- `FAILED` / `TIDAK LULUS` jika `finalScore < 70`

## Fitur Utama

### Authentication dan RBAC

- Login menggunakan username dan password.
- Redirect dashboard berdasarkan role.
- Guard route untuk admin, guru, dan siswa.
- Logout.
- User salah role otomatis diarahkan ke dashboard role miliknya.
- User belum login diarahkan ke `/login`.

### Admin

- Dashboard ringkasan.
- CRUD siswa.
- CRUD guru.
- CRUD kelas.
- CRUD mata pelajaran.
- CRUD tahun ajaran.
- Set tahun ajaran aktif.
- CRUD assignment guru dan mata pelajaran.
- CRUD enrollment siswa ke kelas berdasarkan tahun ajaran.
- Laporan nilai siswa.
- Filter laporan berdasarkan search, kelas, mata pelajaran, tahun ajaran, dan status.
- Export laporan CSV sesuai filter aktif.

### Guru

- Dashboard ringkasan total siswa dinilai dan total nilai diinput.
- Input nilai siswa.
- Update nilai siswa.
- Delete nilai siswa.
- Filter, search, pagination, dan limit data pada tabel nilai.
- Guru hanya dapat mengelola nilai untuk assignment mata pelajaran miliknya.

### Siswa

- Dashboard nilai pribadi.
- Melihat nama, kelas, tahun ajaran aktif, daftar nilai, nilai akhir, dan status kelulusan.
- Siswa hanya dapat melihat data nilai miliknya sendiri.

### UX dan UI

- Layout dashboard responsive.
- Sidebar desktop dan mobile sheet.
- Breadcrumb di setiap halaman.
- Search, filter, pagination, dan limit per page berbasis URL query params.
- Limit per page: `5`, `10`, `15`, `20` dengan default `10`.
- Toast success/error untuk mutation.
- Confirm dialog untuk delete.
- Empty state untuk data kosong.
- Table responsive dengan horizontal scroll.
- Dialog responsive dengan scroll internal pada layar kecil.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- bcryptjs
- Shadcn UI / Radix UI
- Tailwind CSS
- Sonner
- Lucide React
- Vitest
- ESLint

## Prasyarat

Pastikan sudah tersedia:

- Node.js versi modern
- npm
- PostgreSQL database

Project ini menggunakan Prisma dengan datasource PostgreSQL.

## Instalasi

Clone repository:

```bash
git clone https://github.com/Renaldis/Raporin-Sistem-Informasi-Pengelola-Nilai-Siswa.git
cd Raporin-Sistem-Informasi-Pengelola-Nilai-Siswa
```

Install dependency:

```bash
npm install
```

Buat file `.env` dari `.env.example`:

```bash
cp .env.example .env
```

Isi konfigurasi `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
BETTER_AUTH_SECRET="change-me"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Jalankan migration:

```bash
npm run prisma:migrate
```

Seed data demo:

```bash
npm run prisma:seed
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi berjalan di:

```text
http://localhost:3000
```

## Akun Demo

Data demo dibuat dari `prisma/seed.ts`.

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Guru | `guru001` | `guru123` |
| Siswa | `20240001` | `siswa123` |

## Struktur Folder

```text
prisma
├── schema.prisma
└── seed.ts

src
├── actions
├── app
│   ├── (auth)
│   └── dashboard
│       ├── admin
│       ├── teacher
│       └── student
├── components
│   └── ui
├── constants
├── lib
├── schemas
└── types
```

Penjelasan:

- `prisma/schema.prisma`: schema database dan relasi model.
- `prisma/seed.ts`: data awal untuk demo.
- `src/app`: route dan page Next.js App Router.
- `src/actions`: server actions untuk mutation data.
- `src/components`: komponen global reusable.
- `src/components/ui`: komponen UI berbasis Shadcn/Radix.
- `src/constants`: konstanta aplikasi.
- `src/lib`: helper, Prisma client, auth, permission, model OOP, pagination, report.
- `src/schemas`: validasi form menggunakan Zod.
- `src/types`: type shared.

## Routes

### Public

| Route | Deskripsi |
| --- | --- |
| `/` | Redirect awal |
| `/login` | Halaman login |

### Admin

| Route | Deskripsi |
| --- | --- |
| `/dashboard/admin` | Dashboard admin |
| `/dashboard/admin/students` | Kelola siswa |
| `/dashboard/admin/teachers` | Kelola guru |
| `/dashboard/admin/classes` | Kelola kelas |
| `/dashboard/admin/subjects` | Kelola mata pelajaran |
| `/dashboard/admin/academic-years` | Kelola tahun ajaran |
| `/dashboard/admin/teacher-subjects` | Kelola assignment guru-mapel |
| `/dashboard/admin/enrollments` | Kelola enrollment siswa-kelas |
| `/dashboard/admin/reports` | Laporan nilai |
| `/api/reports/scores/export` | Export CSV laporan nilai |

### Teacher

| Route | Deskripsi |
| --- | --- |
| `/dashboard/teacher` | Dashboard guru |
| `/dashboard/teacher/scores` | Input dan kelola nilai siswa |

### Student

| Route | Deskripsi |
| --- | --- |
| `/dashboard/student` | Dashboard nilai siswa |

## Database Model

Model utama:

- `User`
- `Student`
- `Teacher`
- `ClassRoom`
- `Subject`
- `AcademicYear`
- `TeacherSubject`
- `StudentClassEnrollment`
- `Score`

Relasi penting:

- `User` memiliki role `ADMIN`, `TEACHER`, atau `STUDENT`.
- `Student` terhubung ke `User`.
- `Teacher` terhubung ke `User`.
- `TeacherSubject` menghubungkan guru dan mata pelajaran.
- `StudentClassEnrollment` menghubungkan siswa, kelas, dan tahun ajaran.
- `Score` menghubungkan enrollment siswa dan assignment guru-mapel.

Constraint penting:

- Username unik.
- NIS siswa unik.
- Kode guru unik.
- Kode mata pelajaran unik.
- Nama tahun ajaran unik.
- Satu guru-mapel unik berdasarkan `teacherId + subjectId`.
- Satu siswa hanya boleh berada pada satu kelas untuk satu tahun ajaran berdasarkan `studentId + academicYearId`.
- Satu nilai unik berdasarkan `enrollmentId + teacherSubjectId`.

## Aturan Bisnis

### Nilai

- `taskScore`, `utsScore`, dan `uasScore` wajib integer.
- Nilai minimal `0`.
- Nilai maksimal `100`.
- Nilai akhir dihitung otomatis.
- Status kelulusan ditentukan otomatis.

### Tahun Ajaran Aktif

- Sistem hanya boleh memiliki satu tahun ajaran aktif.
- Saat admin mengaktifkan tahun ajaran baru, tahun ajaran lain otomatis menjadi tidak aktif.

### Akses Guru

- Guru hanya dapat menginput dan mengelola nilai untuk assignment mata pelajaran miliknya.

### Akses Siswa

- Siswa hanya dapat melihat data nilai miliknya sendiri.

## Pemrograman Terstruktur

Contoh fungsi/procedure ada di `src/lib/score.ts`:

```ts
export function validateScore(score: number): boolean {
  return Number.isInteger(score) && score >= 0 && score <= 100;
}

export function calculateFinalScore(
  taskScore: number,
  utsScore: number,
  uasScore: number
): number {
  return taskScore * 0.3 + utsScore * 0.3 + uasScore * 0.4;
}

export function determineGraduationStatus(finalScore: number): GraduationStatus {
  return finalScore >= 70 ? "PASSED" : "FAILED";
}
```

## OOP

Contoh class dan method ada di `src/lib/models.ts`:

```ts
export class StudentModel {
  constructor(
    public id: string,
    public nis: string,
    public name: string
  ) {}

  getProfile(): string {
    return `${this.name} - ${this.nis}`;
  }
}
```

```ts
export class ScoreModel {
  constructor(
    public classRoomName: string,
    public subjectName: string,
    public academicYearName: string,
    public teacherName: string,
    public taskScore: number,
    public utsScore: number,
    public uasScore: number
  ) {}

  calculateFinalScore(): number {
    return this.taskScore * 0.3 + this.utsScore * 0.3 + this.uasScore * 0.4;
  }

  getGraduationStatus(): "LULUS" | "TIDAK LULUS" {
    return this.calculateFinalScore() >= 70 ? "LULUS" : "TIDAK LULUS";
  }
}
```

## Scripts

| Script | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan development server di port `3000` dengan pengecekan port |
| `npm run dev:any` | Menjalankan Next.js dev server tanpa pengecekan port custom |
| `npm run build` | Build production |
| `npm run start` | Menjalankan production server setelah build |
| `npm run lint` | Menjalankan ESLint |
| `npm test` | Menjalankan unit test Vitest |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Menjalankan migration Prisma |
| `npm run prisma:seed` | Menjalankan seed database |

## Testing

Jalankan lint:

```bash
npm run lint
```

Jalankan unit test:

```bash
npm test
```

Jalankan build:

```bash
npm run build
```

Pengujian yang sudah dilakukan:

- Unit test helper nilai.
- Unit test model OOP.
- Smoke test route dashboard tanpa login redirect ke `/login`.
- Smoke test user salah role redirect ke dashboard role yang benar.
- Smoke test export CSV tanpa admin menghasilkan `403 Forbidden`.
- Build production berhasil.

## Export CSV

Admin dapat export laporan nilai dari halaman:

```text
/dashboard/admin/reports
```

Route export:

```text
/api/reports/scores/export
```

Export mengikuti filter aktif:

- search
- kelas
- mata pelajaran
- tahun ajaran
- status

Kolom CSV:

- NIS
- Nama Siswa
- Kelas
- Tahun Ajaran
- Kode Mapel
- Mata Pelajaran
- Guru
- Nilai Tugas
- Nilai UTS
- Nilai UAS
- Nilai Akhir
- Status

## Troubleshooting

### Port 3000 sedang dipakai

`npm run dev` menggunakan script `scripts/ensure-port.mjs`. Jika port `3000` sedang digunakan, terminal akan menampilkan PID proses.

Contoh:

```text
Port 3000 sedang dipakai.
PID: 381055
Matikan dengan: kill 381055
Kalau masih hidup: kill -9 381055
```

Matikan proses tersebut, lalu jalankan ulang:

```bash
npm run dev
```

### Build error karena cache `.next`

Jika build menampilkan error cache seperti module lama tidak ditemukan, bersihkan `.next`:

```bash
rm -rf .next
npm run build
```

### Database belum terhubung

Pastikan:

- `DATABASE_URL` pada `.env` benar.
- Database PostgreSQL aktif.
- Migration sudah dijalankan.
- Prisma Client sudah digenerate.

Perintah yang dapat dijalankan:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Status Project

Fitur MVP utama sudah tersedia:

- Auth dan RBAC.
- CRUD master data admin.
- Relasi guru-mapel.
- Enrollment siswa-kelas.
- Input dan pengelolaan nilai oleh guru.
- Dashboard siswa.
- Laporan admin.
- Export CSV.
- Responsive layout.
- Unit test dan build verification.

## Lisensi

Project ini dibuat untuk kebutuhan pembelajaran dan tugas implementasi aplikasi pengelolaan nilai siswa.
