<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UjianSeeder extends Seeder
{
    private array $opsiLabels = ['A', 'B', 'C', 'D'];

    public function run(): void
    {
        // ── Get dosen & mahasiswa IDs ─────────────────────────────────
        $irvanId  = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');
        $desiId   = DB::table('users')->where('email', 'desi.arisandi@untar.ac.id')->value('id');
        $bagusId  = DB::table('users')->where('email', 'bagus.mulyawan@untar.ac.id')->value('id');
        $jansonId = DB::table('users')->where('email', 'janson.hendryli@untar.ac.id')->value('id');

        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');
        $andiId     = DB::table('users')->where('nim', '535240005')->value('id');

        $ti = DB::table('prodi')->where('kode', 'TI')->value('id');
        $si = DB::table('prodi')->where('kode', 'SI')->value('id');

        // ── Mata Kuliah ───────────────────────────────────────────────
        $mkTI501 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Software Development',        'kode' => 'TI501', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkTI502 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Frontend Development',        'kode' => 'TI502', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkTI503 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Backend Development',         'kode' => 'TI503', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI501 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Software Development SI',     'kode' => 'SI501', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI502 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Database Systems',            'kode' => 'SI502', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI503 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Rekayasa Sistem Informasi',   'kode' => 'SI503', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);
        $mkTI504 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Mobile Development',          'kode' => 'TI504', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkTI505 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Cloud Computing',             'kode' => 'TI505', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkTI506 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Keamanan Jaringan',           'kode' => 'TI506', 'prodi_id' => $ti, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI504 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Analisis Sistem Informasi',   'kode' => 'SI504', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI505 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Manajemen Proyek TI',         'kode' => 'SI505', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);
        $mkSI506 = DB::table('mata_kuliah')->insertGetId(['nama' => 'Business Intelligence',       'kode' => 'SI506', 'prodi_id' => $si, 'created_at' => now(), 'updated_at' => now()]);

        // ── Dosen Matkul ──────────────────────────────────────────────
        $ta = '2025/2026';
        DB::table('dosen_matkul')->insert([
            ['user_id' => $irvanId,  'mata_kuliah_id' => $mkTI501, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $irvanId,  'mata_kuliah_id' => $mkTI502, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $irvanId,  'mata_kuliah_id' => $mkTI503, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $desiId,   'mata_kuliah_id' => $mkSI501, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $desiId,   'mata_kuliah_id' => $mkSI502, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $desiId,   'mata_kuliah_id' => $mkSI503, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $bagusId,  'mata_kuliah_id' => $mkTI504, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $bagusId,  'mata_kuliah_id' => $mkTI505, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $bagusId,  'mata_kuliah_id' => $mkTI506, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jansonId, 'mata_kuliah_id' => $mkSI504, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jansonId, 'mata_kuliah_id' => $mkSI505, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jansonId, 'mata_kuliah_id' => $mkSI506, 'tahun_ajaran' => $ta, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── User Matkul — Natanael & Andi enrolled in Irvan & Desi's matkul ──
        $umRows = [];
        foreach ([$natanaelId, $andiId] as $uid) {
            foreach ([$mkTI501, $mkTI502, $mkTI503, $mkSI501, $mkSI502, $mkSI503] as $mkId) {
                $umRows[] = ['user_id' => $uid, 'mata_kuliah_id' => $mkId, 'tahun_ajaran' => $ta, 'is_aktif' => true, 'created_at' => now(), 'updated_at' => now()];
            }
        }
        DB::table('user_mata_kuliah')->insert($umRows);

        // ── Bank Soal ─────────────────────────────────────────────────
        $bankSD = $this->insertBank($irvanId, $mkTI501, 'Bank Soal Software Development', 'Soal UTS Software Development');
        $bankFE = $this->insertBank($irvanId, $mkTI502, 'Bank Soal Frontend Development', 'Soal UTS Frontend Development');
        $bankBE = $this->insertBank($irvanId, $mkTI503, 'Bank Soal Backend Development',  'Soal UTS Backend Development');
        $bankDB = $this->insertBank($desiId,  $mkSI502, 'Bank Soal Database Systems',     'Soal UTS Database Systems');

        // ── Soal Definitions ──────────────────────────────────────────

        // Software Development
        $sdPG = [
            ['q' => 'Metodologi Agile menekankan pada?', 'a' => ['Dokumentasi lengkap di awal', 'Kolaborasi tim dan respons terhadap perubahan', 'Perencanaan kaku tanpa iterasi', 'Pengembangan individual tanpa review'], 'correct' => 1],
            ['q' => 'Dalam Git, perintah untuk menggabungkan branch adalah?', 'a' => ['git commit', 'git push', 'git merge', 'git clone'], 'correct' => 2],
            ['q' => 'Design Pattern Singleton memastikan?', 'a' => ['Banyak instance dari sebuah class', 'Hanya satu instance dari sebuah class', 'Penghapusan otomatis objek', 'Pewarisan multiple inheritance'], 'correct' => 1],
            ['q' => 'Unit testing menguji pada tingkat?', 'a' => ['Sistem keseluruhan end-to-end', 'Integrasi antar modul', 'Fungsi atau method individual', 'Antarmuka pengguna (UI)'], 'correct' => 2],
            ['q' => 'CI/CD dalam pengembangan software singkatan dari?', 'a' => ['Code Integration / Code Deployment', 'Continuous Integration / Continuous Deployment', 'Complete Integration / Complete Delivery', 'Central Integration / Central Delivery'], 'correct' => 1],
        ];
        $sdCB = [
            ['q' => 'Manakah yang merupakan Agile ceremonies?', 'options' => ['Sprint Planning', 'Waterfall Review', 'Daily Standup', 'Gantt Chart Update'], 'correct' => [0, 2]],
            ['q' => 'Manakah yang termasuk prinsip SOLID?', 'options' => ['Single Responsibility Principle', 'Sequential Logic Principle', 'Open/Closed Principle', 'Overloading Data Principle'], 'correct' => [0, 2]],
        ];
        $sdEssay = [
            ['q' => 'Jelaskan perbedaan antara metodologi Scrum dan Kanban beserta kelebihan dan kekurangan masing-masing!'],
            ['q' => 'Bagaimana cara menerapkan Test-Driven Development (TDD) dalam sebuah proyek? Jelaskan tahapan Red-Green-Refactor dengan contoh!'],
        ];

        // Frontend Development
        $fePG = [
            ['q' => 'Tag HTML semantic yang digunakan untuk navigasi utama adalah?', 'a' => ['<div>', '<section>', '<nav>', '<span>'], 'correct' => 2],
            ['q' => 'CSS Flexbox dirancang untuk layout?', 'a' => ['Dua dimensi (baris dan kolom sekaligus)', 'Satu dimensi (baris atau kolom)', 'Animasi elemen saja', 'Responsivitas gambar saja'], 'correct' => 1],
            ['q' => 'Virtual DOM dalam React berfungsi untuk?', 'a' => ['Menyimpan data ke server', 'Mengoptimalkan render dengan diff algorithm', 'Mengelola state global aplikasi', 'Membuat komponen baru secara otomatis'], 'correct' => 1],
            ['q' => 'React Hook useState digunakan untuk?', 'a' => ['Mengambil data dari API', 'Mengelola state lokal dalam functional component', 'Membuat routing halaman', 'Menghubungkan ke Redux store'], 'correct' => 1],
            ['q' => 'Media query dalam CSS digunakan untuk?', 'a' => ['Mengambil data dari REST API', 'Membuat responsive design berdasarkan ukuran layar', 'Membuat animasi kompleks', 'Manipulasi DOM secara langsung'], 'correct' => 1],
        ];
        $feCB = [
            ['q' => 'Manakah yang merupakan semantic HTML5 tag?', 'options' => ['<header>', '<div>', '<article>', '<span>'], 'correct' => [0, 2]],
            ['q' => 'Manakah yang termasuk React Hooks bawaan?', 'options' => ['useState', 'componentDidMount', 'useEffect', 'render'], 'correct' => [0, 2]],
        ];
        $feEssay = [
            ['q' => 'Jelaskan perbedaan antara Server-Side Rendering (SSR) dan Client-Side Rendering (CSR) beserta use case yang tepat untuk masing-masing!'],
            ['q' => 'Apa yang dimaksud dengan state management dalam aplikasi React? Kapan sebaiknya menggunakan Context API dibandingkan dengan Redux?'],
        ];

        // Backend Development
        $bePG = [
            ['q' => 'HTTP method yang digunakan untuk membuat resource baru dalam REST API adalah?', 'a' => ['GET', 'PUT', 'POST', 'DELETE'], 'correct' => 2],
            ['q' => 'JWT (JSON Web Token) terdiri dari berapa bagian yang dipisahkan oleh titik?', 'a' => ['1', '2', '3', '4'], 'correct' => 2],
            ['q' => 'ORM (Object Relational Mapping) dalam backend development digunakan untuk?', 'a' => ['Mengoptimalkan performa server', 'Memetakan object ke tabel database secara abstrak', 'Mengelola file sistem', 'Mengatur konfigurasi server'], 'correct' => 1],
            ['q' => 'Middleware dalam framework backend berfungsi sebagai?', 'a' => ['Database connection manager', 'Perantara yang memproses request sebelum sampai ke controller', 'Template engine untuk view', 'Cache manager untuk response'], 'correct' => 1],
            ['q' => 'Arsitektur Microservices membagi aplikasi menjadi?', 'a' => ['Satu service besar monolitik', 'Layanan-layanan kecil yang independen dan dapat di-deploy terpisah', 'Dua tier: frontend dan backend saja', 'Tiga layer MVC yang terpisah'], 'correct' => 1],
        ];
        $beCB = [
            ['q' => 'Manakah yang merupakan prinsip utama REST API?', 'options' => ['Stateless', 'Stateful session wajib', 'Uniform Interface', 'Single endpoint saja'], 'correct' => [0, 2]],
            ['q' => 'Manakah yang merupakan best practice keamanan pada API?', 'options' => ['Input validation dan sanitasi', 'Menyimpan password plain text', 'Rate limiting pada endpoint', 'Menonaktifkan HTTPS'], 'correct' => [0, 2]],
        ];
        $beEssay = [
            ['q' => 'Jelaskan arsitektur MVC (Model-View-Controller) dan bagaimana penerapannya dalam framework Laravel! Berikan contoh konkret untuk masing-masing komponen!'],
            ['q' => 'Apa itu rate limiting pada API? Mengapa rate limiting penting untuk keamanan dan performa? Bagaimana cara mengimplementasikannya di Laravel?'],
        ];

        // Database Systems
        $dbPG = [
            ['q' => 'Bentuk Normal Ketiga (3NF) mensyaratkan tidak adanya?', 'a' => ['Atribut multivalued', 'Dependensi transitif terhadap non-primary key', 'Foreign key di setiap tabel', 'Kolom dengan nilai NULL'], 'correct' => 1],
            ['q' => 'INNER JOIN mengembalikan?', 'a' => ['Semua baris dari tabel kiri meski tidak cocok', 'Semua baris dari tabel kanan meski tidak cocok', 'Hanya baris yang memiliki kecocokan di kedua tabel', 'Semua baris dari kedua tabel termasuk yang tidak cocok'], 'correct' => 2],
            ['q' => 'Dalam sifat ACID database, huruf C singkatan dari?', 'a' => ['Concurrency', 'Consistency', 'Compression', 'Cascade'], 'correct' => 1],
            ['q' => 'Index pada kolom database berfungsi utama untuk?', 'a' => ['Mempercepat operasi INSERT', 'Mempercepat operasi SELECT dan pencarian data', 'Mengurangi ukuran storage tabel', 'Meningkatkan keamanan akses data'], 'correct' => 1],
            ['q' => 'Perbedaan utama antara NoSQL dan SQL database adalah?', 'a' => ['NoSQL selalu lebih lambat dari SQL', 'NoSQL bersifat schema-less dan lebih mudah di-scale horizontal', 'SQL tidak mendukung operasi JOIN sama sekali', 'NoSQL tidak dapat menyimpan data dalam format JSON'], 'correct' => 1],
        ];
        $dbCB = [
            ['q' => 'Manakah yang merupakan jenis SQL constraint yang valid?', 'options' => ['PRIMARY KEY', 'SORT KEY', 'FOREIGN KEY', 'SEARCH KEY'], 'correct' => [0, 2]],
            ['q' => 'Manakah yang merupakan langkah dalam proses normalisasi database?', 'options' => ['Identifikasi functional dependency', 'Penambahan data dummy untuk testing', 'Eliminasi partial dependency menuju 2NF', 'Menghapus semua index untuk efisiensi'], 'correct' => [0, 2]],
        ];
        $dbEssay = [
            ['q' => 'Jelaskan perbedaan antara INNER JOIN, LEFT JOIN, dan RIGHT JOIN beserta contoh query SQL untuk masing-masing jenis JOIN!'],
            ['q' => 'Bagaimana merancang skema database untuk sistem e-commerce sederhana? Sebutkan tabel-tabel utama yang diperlukan, atributnya, dan hubungan antar tabel!'],
        ];

        // ── Insert Soal ───────────────────────────────────────────────
        [$sdPGIds, $sdCBIds, $sdEssayIds] = $this->insertAllSoal($sdPG, $sdCB, $sdEssay, $bankSD, $mkTI501);
        [$fePGIds, $feCBIds, $feEssayIds] = $this->insertAllSoal($fePG, $feCB, $feEssay, $bankFE, $mkTI502);
        [$bePGIds, $beCBIds, $beEssayIds] = $this->insertAllSoal($bePG, $beCB, $beEssay, $bankBE, $mkTI503);
        [$dbPGIds, $dbCBIds, $dbEssayIds] = $this->insertAllSoal($dbPG, $dbCB, $dbEssay, $bankDB, $mkSI502);

        // ── Ujian ─────────────────────────────────────────────────────
        $base = Carbon::create(2026, 3, 10, 8, 0, 0);
        $ujianSD = $this->insertUjian($irvanId, $mkTI501, 'UTS Software Development 2025/2026', $base,                   'UTISD01');
        $ujianFE = $this->insertUjian($irvanId, $mkTI502, 'UTS Frontend Development 2025/2026',  $base->copy()->addDays(3), 'UTIFE01');
        $ujianBE = $this->insertUjian($irvanId, $mkTI503, 'UTS Backend Development 2025/2026',   $base->copy()->addDays(5), 'UTIBE01');
        $ujianDB = $this->insertUjian($desiId,  $mkSI502, 'UTS Database Systems 2025/2026',      $base->copy()->addDays(7), 'USIDB01');

        DB::table('ujian_setting')->insert([
            ['ujian_id' => $ujianSD, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujianFE, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujianBE, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujianDB, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $gradeRanges = [['A', 85, 100], ['B', 75, 84], ['C', 65, 74], ['D', 55, 64], ['E', 0, 54]];
        foreach ([$ujianSD, $ujianFE, $ujianBE, $ujianDB] as $uid) {
            $this->insertGradeSetting($uid, $gradeRanges);
        }

        // ── Link Ujian → Soal (bobot: PG=8, CB=10, Essay=20) ─────────
        $ujianSoalSD = $this->linkUjianSoal($ujianSD, $sdPGIds, $sdCBIds, $sdEssayIds);
        $ujianSoalFE = $this->linkUjianSoal($ujianFE, $fePGIds, $feCBIds, $feEssayIds);
        $ujianSoalBE = $this->linkUjianSoal($ujianBE, $bePGIds, $beCBIds, $beEssayIds);
        $ujianSoalDB = $this->linkUjianSoal($ujianDB, $dbPGIds, $dbCBIds, $dbEssayIds);

        // ── Peserta: 30 TI-2024 (index 4=Andi, index 29=Natanael) ────
        $tiStudents = DB::table('users')
            ->where('prodi_id', $ti)->where('tahun_masuk', 2024)
            ->where('role', 'mahasiswa')->where('nim', '!=', '535240042')
            ->orderBy('nim')->limit(29)->pluck('id')->toArray();
        $tiStudents   = array_values($tiStudents);
        $tiStudents[] = $natanaelId; // index 29

        // ── Peserta DB ujian: 28 SI-2024 + Andi(28) + Natanael(29) ───
        $siStudents = DB::table('users')
            ->where('prodi_id', $si)->where('tahun_masuk', 2024)
            ->where('role', 'mahasiswa')->orderBy('nim')->limit(28)->pluck('id')->toArray();
        $dbStudents   = array_values($siStudents);
        $dbStudents[] = $andiId;     // index 28
        $dbStudents[] = $natanaelId; // index 29

        // Scores: index 4=Andi(72), index 29=Natanael(88)
        $scoresTI = [78, 82, 65, 70, 72, 88, 55, 60, 75, 90, 68, 73, 84, 62, 57, 79, 86, 64, 71, 83, 59, 77, 91, 67, 74, 80, 63, 69, 76, 88];
        // Scores: index 28=Andi(72), index 29=Natanael(88)
        $scoresDB = [74, 80, 63, 69, 76, 85, 55, 60, 75, 88, 68, 73, 84, 62, 57, 79, 86, 64, 71, 83, 59, 77, 91, 67, 74, 80, 63, 70, 72, 88];

        $soalSets = [
            [$ujianSD, $ujianSoalSD, $tiStudents, $scoresTI, $base],
            [$ujianFE, $ujianSoalFE, $tiStudents, $scoresTI, $base->copy()->addDays(3)],
            [$ujianBE, $ujianSoalBE, $tiStudents, $scoresTI, $base->copy()->addDays(5)],
            [$ujianDB, $ujianSoalDB, $dbStudents, $scoresDB, $base->copy()->addDays(7)],
        ];

        foreach ($soalSets as [$ujianId, $ujianSoal, $students, $skor, $tanggal]) {
            foreach ($students as $idx => $studentId) {
                $this->buatPeserta($studentId, $ujianId, $ujianSoal, (float) ($skor[$idx] ?? 70), $tanggal);
            }
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private function insertBank(int $dosenId, int $mkId, string $nama, string $deskripsi): int
    {
        return DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $mkId,
            'nama'           => $nama,
            'deskripsi'      => $deskripsi,
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);
    }

    private function insertAllSoal(array $pg, array $cb, array $essay, int $bankId, int $mkId): array
    {
        return [
            $this->insertSoalPG($pg, $bankId, $mkId),
            $this->insertSoalCB($cb, $bankId, $mkId),
            $this->insertSoalEssay($essay, $bankId, $mkId),
        ];
    }

    private function insertSoalPG(array $soalList, int $bankId, int $mkId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $mkId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            $jsId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($s['a'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jsId,
                    'opsi'          => $this->opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => ($i === $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }
            $result[] = ['soal_id' => $soalId, 'correct' => $s['correct'], 'tipe' => 'pilihan_ganda'];
        }
        return $result;
    }

    private function insertSoalCB(array $soalList, int $bankId, int $mkId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $mkId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            $jsId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'checklist',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($s['options'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jsId,
                    'opsi'          => $this->opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => in_array($i, $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }
            $kunci = implode(',', array_map(fn($idx) => $this->opsiLabels[$idx], $s['correct']));
            $result[] = ['soal_id' => $soalId, 'kunci' => $kunci, 'tipe' => 'checklist'];
        }
        return $result;
    }

    private function insertSoalEssay(array $soalList, int $bankId, int $mkId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $mkId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sulit',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            DB::table('jenis_soal')->insert([
                'soal_id'    => $soalId,
                'jenis_soal' => 'essay',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $result[] = ['soal_id' => $soalId, 'tipe' => 'essay'];
        }
        return $result;
    }

    private function insertUjian(int $dosenId, int $mkId, string $nama, Carbon $start, string $kode): int
    {
        return DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $mkId,
            'nama_ujian'     => $nama,
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $start,
            'end_date'       => $start->copy()->addHours(2),
            'durasi_menit'   => 90,
            'kode_akses'     => $kode,
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);
    }

    private function insertGradeSetting(int $ujianId, array $grades): void
    {
        foreach ($grades as [$grade, $min, $max]) {
            DB::table('grade_setting')->insert([
                'ujian_id'   => $ujianId,
                'grade'      => $grade,
                'nilai_min'  => $min,
                'nilai_max'  => $max,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function linkUjianSoal(int $ujianId, array $pgIds, array $cbIds, array $essayIds): array
    {
        $result = [];
        $urutan = 1;
        foreach ($pgIds as $s) {
            $result[] = [
                'id'      => DB::table('ujian_soal')->insertGetId(['ujian_id' => $ujianId, 'soal_id' => $s['soal_id'], 'bobot' => 8,  'urutan' => $urutan++, 'created_at' => now(), 'updated_at' => now()]),
                'tipe'    => 'pilihan_ganda',
                'correct' => $s['correct'],
            ];
        }
        foreach ($cbIds as $s) {
            $result[] = [
                'id'    => DB::table('ujian_soal')->insertGetId(['ujian_id' => $ujianId, 'soal_id' => $s['soal_id'], 'bobot' => 10, 'urutan' => $urutan++, 'created_at' => now(), 'updated_at' => now()]),
                'tipe'  => 'checklist',
                'kunci' => $s['kunci'],
            ];
        }
        foreach ($essayIds as $s) {
            $result[] = [
                'id'   => DB::table('ujian_soal')->insertGetId(['ujian_id' => $ujianId, 'soal_id' => $s['soal_id'], 'bobot' => 20, 'urutan' => $urutan++, 'created_at' => now(), 'updated_at' => now()]),
                'tipe' => 'essay',
            ];
        }
        return $result;
    }

    private function getComponentScores(float $total): array
    {
        // [pg_correct(0-5), cb_correct(0-2), essay_total(0-40)]
        [$pgC, $cbC] = match (true) {
            $total >= 90 => [5, 2],
            $total >= 80 => [4, 2],
            $total >= 70 => [4, 1],
            $total >= 60 => [3, 1],
            $total >= 50 => [2, 1],
            default      => [2, 0],
        };
        $essay = max(0, min(40, (int) round($total - ($pgC * 8) - ($cbC * 10))));
        return [$pgC, $cbC, $essay];
    }

    private function buatPeserta(int $userId, int $ujianId, array $ujianSoal, float $score, Carbon $tanggal): void
    {
        [$pgCorrect, $cbCorrect, $essayTotal] = $this->getComponentScores($score);

        $mulai    = $tanggal->copy()->addMinutes(rand(0, 10));
        $selesai  = $mulai->copy()->addMinutes(rand(60, 88));

        $pesertaId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'selesai',
            'mulai_at'   => $mulai,
            'selesai_at' => $selesai,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $pgIdx  = 0;
        $cbIdx  = 0;
        $essIdx = 0;
        $essayTexts = [
            'Berdasarkan pemahaman saya, konsep ini berkaitan dengan penerapan prinsip-prinsip yang telah dipelajari. Terdapat beberapa aspek penting yang perlu diperhatikan dalam implementasinya di dunia nyata.',
            'Analisis mendalam terhadap topik ini menunjukkan bahwa ada beberapa faktor kritis yang mempengaruhi hasil akhir. Diperlukan pemahaman yang komprehensif untuk dapat menerapkannya secara efektif.',
        ];

        foreach ($ujianSoal as $entry) {
            if ($entry['tipe'] === 'pilihan_ganda') {
                $benar   = $pgIdx < $pgCorrect;
                $correct = $entry['correct'];
                $jawaban = $benar ? $this->opsiLabels[$correct] : $this->opsiLabels[($correct + 1) % 4];
                $nilai   = $benar ? 8.0 : 0.0;
                DB::table('jawaban_peserta')->insert([
                    'peserta_ujian_id' => $pesertaId,
                    'ujian_soal_id'    => $entry['id'],
                    'jawaban'          => $jawaban,
                    'nilai'            => $nilai,
                    'is_manual_graded' => false,
                    'final_nilai'      => $nilai,
                    'created_at'       => now(), 'updated_at' => now(),
                ]);
                $pgIdx++;
            } elseif ($entry['tipe'] === 'checklist') {
                $benar   = $cbIdx < $cbCorrect;
                $jawaban = $benar ? $entry['kunci'] : 'A,B';
                $nilai   = $benar ? 10.0 : 0.0;
                DB::table('jawaban_peserta')->insert([
                    'peserta_ujian_id' => $pesertaId,
                    'ujian_soal_id'    => $entry['id'],
                    'jawaban'          => $jawaban,
                    'nilai'            => $nilai,
                    'is_manual_graded' => false,
                    'final_nilai'      => $nilai,
                    'created_at'       => now(), 'updated_at' => now(),
                ]);
                $cbIdx++;
            } else { // essay
                $essayScore = $essIdx === 0 ? (int) ceil($essayTotal / 2) : (int) floor($essayTotal / 2);
                DB::table('jawaban_peserta')->insert([
                    'peserta_ujian_id' => $pesertaId,
                    'ujian_soal_id'    => $entry['id'],
                    'jawaban'          => $essayTexts[$essIdx % 2],
                    'nilai'            => 0,
                    'is_manual_graded' => true,
                    'final_nilai'      => (float) $essayScore,
                    'created_at'       => now(), 'updated_at' => now(),
                ]);
                $essIdx++;
            }
        }

        $grade = match (true) {
            $score >= 85 => 'A',
            $score >= 75 => 'B',
            $score >= 65 => 'C',
            $score >= 55 => 'D',
            default      => 'E',
        };

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaId,
            'nilai_total'      => $score,
            'lulus'            => $score >= 65,
            'grade'            => $grade,
            'graded_at'        => $selesai->copy()->addDays(3),
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }
}
