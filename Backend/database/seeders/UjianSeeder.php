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
        // ── Inisialisasi Data User & Prodi ─────────────────────────
        $irvanId  = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');
        $desiId   = DB::table('users')->where('email', 'desi.arisandi@untar.ac.id')->value('id');
        $bagusId  = DB::table('users')->where('email', 'bagus.mulyawan@untar.ac.id')->value('id');
        $jansonId = DB::table('users')->where('email', 'janson.hendryli@untar.ac.id')->value('id');

        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');
        $andiId     = DB::table('users')->where('nim', '535240005')->value('id');

        $ti = DB::table('prodi')->where('kode', 'TI')->value('id');
        $si = DB::table('prodi')->where('kode', 'SI')->value('id');

        // ── Contoh Pengambilan Data dari getSoal5 ──────────────────
        $dataLogika = $this->getSoal5('Logika Matematika');
        $sdPG    = $dataLogika['pg'] ?? [];
        $sdCB    = $dataLogika['cb'] ?? [];
        $sdEssay = $dataLogika['essay'] ?? [];

        // ── Buat Bank Soal ─────────────────────────────────────────
        $bankSD = $this->insertBank($irvanId, $mkTI501, 'Bank Soal Logika Matematika', 'Soal UTS Logika Matematika');

        // ── Insert Soal ────────────────────────────────────────────
        $sdPGIds    = $this->insertSoalPG($sdPG, $bankSD, $mkTI501);
        $sdCBIds    = $this->insertSoalCB($sdCB, $bankSD, $mkTI501);
        $sdEssayIds = $this->insertSoalEssay($sdEssay, $bankSD, $mkTI501);
        
        // ... Lanjutkan sisa logika ujian dan peserta di sini ...
    }

    // ══════════════════════════════════════════════════════════════
    // Posisikan method getSoal5 di luar method run() seperti ini:
    // ══════════════════════════════════════════════════════════════
    private function getSoal5(string $nama): array
    {
  
    
        $data = [
             'Logika Matematika' => [
                'pg' => [
                    ['q' => 'Negasi dari "Semua mahasiswa lulus" adalah?', 'a' => ['Semua tidak lulus', 'Ada yang tidak lulus', 'Tidak ada yang lulus', 'Semua lulus ujian'], 'correct' => 1],
                    ['q' => '"p → q" bernilai FALSE hanya ketika?', 'a' => ['p=T q=T', 'p=F q=F', 'p=T q=F', 'p=F q=T'], 'correct' => 2],
                    ['q' => 'Formula yang selalu bernilai TRUE disebut?', 'a' => ['Kontradiksi', 'Kontingensi', 'Tautologi', 'Proposisi'], 'correct' => 2],
                    ['q' => '¬(p ∧ q) ekuivalen dengan (De Morgan)?', 'a' => ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ ¬q', '¬p ∧ q'], 'correct' => 1],
                    ['q' => 'Jika "p→q" benar dan "p" benar, maka (Modus Ponens)?', 'a' => ['p salah', 'q benar', 'q salah', 'p→q salah'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah konektor logika yang valid?', 'options' => ['AND (∧)', 'PLUS (+)', 'OR (∨)', 'DIVIDE (÷)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aturan inferensi logika yang valid?', 'options' => ['Modus Ponens', 'Spekulasi', 'Modus Tollens', 'Asumsi bebas'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang merupakan hukum ekuivalensi logika?', 'options' => ['De Morgan Law', 'Hukum Newton', 'Distributive Law', 'Hukum Ohm'], 'correct' => [0, 2]],
                    ['q' => 'Manakah quantifier logika predikat yang valid?', 'options' => ['Universal (∀)', 'Biner (∑)', 'Eksistensial (∃)', 'Linear (∫)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang merupakan contoh tautologi?', 'options' => ['p ∨ ¬p', 'p ∧ q', 'p → p', '¬p ∧ p'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep proposisi dan buat tabel kebenaran untuk operator AND, OR, dan IMPLICATION!'],
                    ['q' => 'Apa yang dimaksud dengan tautologi? Buktikan bahwa (p → q) ↔ (¬q → ¬p) adalah tautologi!'],
                    ['q' => 'Jelaskan hukum De Morgan dan tunjukkan bagaimana hukum ini digunakan dalam penyederhanaan ekspresi!'],
                    ['q' => 'Apa perbedaan antara logika proposisional dan logika predikat? Berikan contoh pernyataan yang membutuhkan logika predikat!'],
                    ['q' => 'Bagaimana aljabar Boolean berkaitan dengan logika matematika? Berikan contoh penerapan dalam desain rangkaian digital!'],
                ],
            ],

            'Basis Data Lanjut' => [
                'pg' => [
                    ['q' => 'Teorema CAP: huruf C singkatan dari?', 'a' => ['Caching', 'Consistency', 'Concurrency', 'Connectivity'], 'correct' => 1],
                    ['q' => 'Membagi tabel ke beberapa node secara horizontal disebut?', 'a' => ['Replication', 'Indexing', 'Sharding', 'Caching'], 'correct' => 2],
                    ['q' => 'Materialized view berbeda dari view biasa karena?', 'a' => ['Tidak bisa di-query', 'Menyimpan hasil query secara fisik', 'Hanya satu tabel', 'Tidak bisa refresh'], 'correct' => 1],
                    ['q' => 'OLAP dioptimalkan untuk?', 'a' => ['Transaksi real-time', 'Analisis data multidimensi', 'CRUD cepat', 'Login pengguna'], 'correct' => 1],
                    ['q' => 'Column-store database optimal untuk?', 'a' => ['Banyak INSERT', 'Analytical query banyak kolom', 'Transaksi perbankan', 'Full-text search'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah teknik optimasi database yang valid?', 'options' => ['Indexing', 'Mengabaikan constraint', 'Query Optimization', 'Full table scan selalu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang merupakan jenis NoSQL database?', 'options' => ['Document store (MongoDB)', 'Relational (MySQL)', 'Key-Value (Redis)', 'Tabular (Excel)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah pola replikasi database yang umum?', 'options' => ['Master-Slave', 'ACID mode', 'Master-Master', 'CAP mode'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis partitioning yang valid?', 'options' => ['Horizontal partitioning', 'Diagonal partitioning', 'Vertical partitioning', 'Circular partitioning'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis index database yang umum?', 'options' => ['B-Tree Index', 'Linked Index', 'Hash Index', 'Random Index'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan teorema CAP dalam distributed database dan mengapa ketiga properti tidak bisa dipenuhi bersamaan!'],
                    ['q' => 'Apa perbedaan OLTP dan OLAP? Jelaskan karakteristik dan use case masing-masing!'],
                    ['q' => 'Jelaskan sharding dalam database, beserta kelebihan dan tantangan implementasinya!'],
                    ['q' => 'Kapan denormalisasi lebih baik dari normalisasi? Berikan contoh kasus yang tepat!'],
                    ['q' => 'Bagaimana cara mengoptimalkan query SQL yang lambat? Jelaskan strategi query optimization!'],
                ],
            ],

            'Pemrograman Fungsional' => [
                'pg' => [
                    ['q' => 'Fungsi tanpa efek samping dalam FP disebut?', 'a' => ['Impure function', 'Pure function', 'Static function', 'Global function'], 'correct' => 1],
                    ['q' => 'map() pada list berfungsi untuk?', 'a' => ['Menyaring elemen', 'Menerapkan fungsi ke tiap elemen', 'Menggabungkan elemen', 'Mengurutkan'], 'correct' => 1],
                    ['q' => 'Bahasa pemrograman fungsional murni?', 'a' => ['Python', 'Java', 'Haskell', 'C++'], 'correct' => 2],
                    ['q' => 'Teknik ubah fungsi n-argumen menjadi rangkaian fungsi 1-argumen?', 'a' => ['Memoization', 'Composition', 'Currying', 'Recursion'], 'correct' => 2],
                    ['q' => 'Data yang tidak bisa diubah setelah dibuat dalam FP disebut?', 'a' => ['Mutable', 'Variable', 'Immutable', 'Dynamic'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah prinsip pemrograman fungsional yang benar?', 'options' => ['Immutability', 'Shared state', 'Pure functions', 'Side effects'], 'correct' => [0, 2]],
                    ['q' => 'Manakah higher-order function yang umum?', 'options' => ['map()', 'print()', 'filter()', 'input()'], 'correct' => [0, 2]],
                    ['q' => 'Manakah bahasa dengan fitur fungsional?', 'options' => ['Haskell', 'Assembly', 'Scala', 'COBOL'], 'correct' => [0, 2]],
                    ['q' => 'Manakah konsep FP yang valid?', 'options' => ['Currying', 'Inheritance', 'Function Composition', 'Class hierarchy'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik optimasi FP?', 'options' => ['Memoization', 'Global variables', 'Tail-call optimization', 'Mutation'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan paradigma fungsional vs imperatif beserta kelebihan masing-masing!'],
                    ['q' => 'Mengapa pure function lebih mudah di-test dan di-debug? Berikan contoh!'],
                    ['q' => 'Jelaskan higher-order function dengan contoh map, filter, reduce dalam Python atau JS!'],
                    ['q' => 'Apa itu closure? Berikan contoh closure dan jelaskan cara kerjanya!'],
                    ['q' => 'Jelaskan immutability dan manfaatnya dalam concurrent programming!'],
                ],
            ],

            'Arsitektur Komputer' => [
                'pg' => [
                    ['q' => 'Komponen CPU yang melakukan operasi aritmatika dan logika?', 'a' => ['Control Unit', 'ALU', 'Register', 'Cache'], 'correct' => 1],
                    ['q' => 'Siklus eksekusi instruksi CPU disebut?', 'a' => ['Boot Cycle', 'Fetch-Decode-Execute', 'Read-Write Cycle', 'IO Cycle'], 'correct' => 1],
                    ['q' => 'Cache L1 memiliki karakteristik?', 'a' => ['Paling besar paling lambat', 'Paling kecil paling cepat', 'Sama dengan RAM', 'Sama dengan HDD'], 'correct' => 1],
                    ['q' => 'Teknik eksekusi beberapa instruksi secara bersamaan?', 'a' => ['Caching', 'Pipelining', 'Buffering', 'Multiplexing'], 'correct' => 1],
                    ['q' => 'DMA memungkinkan?', 'a' => ['CPU akses memori lebih cepat', 'Device I/O transfer data ke memori tanpa CPU', 'Multi-CPU bekerja bersamaan', 'Cache otomatis'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen utama CPU?', 'options' => ['ALU', 'Hard Disk', 'Control Unit', 'Monitor'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis arsitektur ISA yang valid?', 'options' => ['RISC', 'CISC', 'x86', 'ARM'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik peningkatan performa CPU?', 'options' => ['Pipelining', 'Slower clock', 'Branch Prediction', 'Less Cache'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis memori sekunder?', 'options' => ['HDD', 'Register', 'SSD', 'Cache L1'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis bus dalam komputer?', 'options' => ['Data bus', 'Network bus', 'Address bus', 'Power bus'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan arsitektur von Neumann beserta kelebihan dan keterbatasannya!'],
                    ['q' => 'Jelaskan siklus Fetch-Decode-Execute dalam CPU secara rinci!'],
                    ['q' => 'Apa perbedaan RISC dan CISC? Berikan contoh prosesor masing-masing!'],
                    ['q' => 'Jelaskan hierarki memori dari register hingga storage beserta karakteristiknya!'],
                    ['q' => 'Bagaimana cache memory bekerja? Jelaskan cache hit, miss, dan strategi replacement-nya!'],
                ],
            ],

            'Kompilator' => [
                'pg' => [
                    ['q' => 'Fase pertama dalam proses kompilasi adalah?', 'a' => ['Parsing', 'Lexical Analysis', 'Code Generation', 'Optimization'], 'correct' => 1],
                    ['q' => 'Parse tree dibangun oleh fase?', 'a' => ['Lexer', 'Parser', 'Semantic Analyzer', 'Code Generator'], 'correct' => 1],
                    ['q' => 'Intermediate Representation (IR) berguna karena?', 'a' => ['Output final', 'Abstraksi antara source dan machine code', 'Error reporting saja', 'Symbol table'], 'correct' => 1],
                    ['q' => 'Interpreter berbeda dari compiler karena?', 'a' => ['Output lebih cepat', 'Terjemahkan dan eksekusi baris per baris', 'Hasilkan object file', 'Lebih banyak optimasi'], 'correct' => 1],
                    ['q' => 'JIT compilation berarti?', 'a' => ['Dikompilasi sebelum runtime', 'Dikompilasi saat runtime ketika dibutuhkan', 'Hanya diinterpretasikan', 'Tidak perlu dikompilasi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah fase front-end kompiler?', 'options' => ['Lexical Analysis', 'Code Generation', 'Parsing', 'Optimization'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis error yang dideteksi kompiler?', 'options' => ['Syntax Error', 'Logic Error', 'Semantic Error', 'Network Error'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik optimasi kode?', 'options' => ['Constant Folding', 'Tokenization', 'Dead Code Elimination', 'Parsing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis parser?', 'options' => ['Recursive Descent', 'Lexer', 'LR Parser', 'Tokenizer'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang disimpan dalam symbol table?', 'options' => ['Nama identifier', 'Machine code', 'Tipe variabel', 'Grammar rules'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan fase-fase kompilasi dari source code hingga machine code!'],
                    ['q' => 'Apa yang dimaksud lexical analysis? Jelaskan cara tokenizer bekerja dengan contoh!'],
                    ['q' => 'Jelaskan parsing dan parse tree! Apa perbedaan top-down dan bottom-up parsing?'],
                    ['q' => 'Apa perbedaan compiler, interpreter, dan JIT? Berikan contoh bahasa untuk masing-masing!'],
                    ['q' => 'Jelaskan minimal 3 teknik optimasi kode yang dilakukan kompiler beserta contohnya!'],
                ],
            ],

            'Grafika Komputer' => [
                'pg' => [
                    ['q' => 'Algoritma menggambar garis pada grid piksel?', 'a' => ["Bresenham's Line Algorithm", 'Flood Fill', 'Ray Casting', 'Scanline'], 'correct' => 0],
                    ['q' => 'Teknik rendering yang mensimulasikan jalur cahaya dari mata ke sumber?', 'a' => ['Rasterization', 'Ray Tracing', 'Scanline', 'Z-Buffering'], 'correct' => 1],
                    ['q' => 'Z-buffer algorithm digunakan untuk?', 'a' => ['Anti-aliasing', 'Hidden surface removal', 'Texture mapping', 'Lighting'], 'correct' => 1],
                    ['q' => 'Model warna untuk pencetakan adalah?', 'a' => ['RGB', 'HSV', 'CMYK', 'YCbCr'], 'correct' => 2],
                    ['q' => 'Shading model yang menghasilkan permukaan tampak halus disebut?', 'a' => ['Flat shading', 'Gouraud shading', 'Phong shading', 'Ray shading'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah transformasi geometri 2D yang valid?', 'options' => ['Translation', 'Erosion', 'Rotation', 'Dilation'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik rendering 3D?', 'options' => ['Ray Tracing', 'Sorting', 'Rasterization', 'Hashing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik pencahayaan dalam grafika 3D?', 'options' => ['Phong lighting', 'Z-buffering', 'Blinn-Phong', 'Scanline'], 'correct' => [0, 2]],
                    ['q' => 'Manakah Graphics API yang umum digunakan?', 'options' => ['OpenGL', 'MySQL', 'Vulkan', 'HTTP'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik anti-aliasing?', 'options' => ['MSAA', 'Z-buffer', 'FXAA', 'Rasterization'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan pipeline rendering GPU modern dari vertex input hingga pixel output!'],
                    ['q' => 'Apa yang dimaksud ray tracing? Jelaskan cara kerjanya dan mengapa lebih realistis dari rasterization!'],
                    ['q' => 'Jelaskan transformasi geometri 3D (translation, rotation, scaling) dalam representasi matriks!'],
                    ['q' => 'Jelaskan model pencahayaan Phong beserta komponen ambient, diffuse, dan specular!'],
                    ['q' => 'Apa yang dimaksud Z-buffer? Bagaimana Z-buffer menyelesaikan hidden surface removal?'],
                ],
            ],

            'Internet of Things' => [
                'pg' => [
                    ['q' => 'Protokol komunikasi ringan paling umum di IoT adalah?', 'a' => ['HTTP', 'MQTT', 'FTP', 'SMTP'], 'correct' => 1],
                    ['q' => 'Mikrokontroler paling populer untuk edukasi IoT?', 'a' => ['Raspberry Pi', 'Arduino', 'Intel NUC', 'NVIDIA Jetson'], 'correct' => 1],
                    ['q' => 'Edge computing dalam IoT berarti?', 'a' => ['Semua data di cloud', 'Proses data di dekat sumber', 'Tanpa internet', 'Server terpusat'], 'correct' => 1],
                    ['q' => 'LPWAN untuk IoT cakupan luas?', 'a' => ['Bluetooth', 'Zigbee', 'LoRaWAN', 'WiFi'], 'correct' => 2],
                    ['q' => 'OTA update pada IoT memungkinkan?', 'a' => ['Tanpa baterai', 'Update firmware nirkabel jarak jauh', 'Koneksi lebih cepat', 'Sensor lebih akurat'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah protokol komunikasi IoT yang valid?', 'options' => ['MQTT', 'HTTP', 'CoAP', 'FTP'], 'correct' => [0, 2]],
                    ['q' => 'Manakah platform IoT yang populer?', 'options' => ['Arduino', 'Windows Desktop', 'Raspberry Pi', 'Oracle DB'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknologi wireless untuk IoT?', 'options' => ['Zigbee', 'Ethernet', 'LoRa', 'Fiber optic'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tantangan utama dalam IoT?', 'options' => ['Security', 'Terlalu banyak daya', 'Scalability', 'Terlalu cepat'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi IoT nyata?', 'options' => ['Smart home', 'TV tabung', 'Smart agriculture', 'Koran cetak'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep IoT dan komponen utama dalam ekosistemnya!'],
                    ['q' => 'Apa perbedaan Arduino dan Raspberry Pi? Kapan menggunakan masing-masing?'],
                    ['q' => 'Jelaskan protokol MQTT dan model publish-subscribe dalam komunikasi IoT!'],
                    ['q' => 'Apa yang dimaksud edge computing dalam IoT dan bagaimana mengurangi latensi?'],
                    ['q' => 'Jelaskan tantangan keamanan IoT dan teknik mitigasi yang umum digunakan!'],
                ],
            ],

            'Big Data Analytics' => [
                'pg' => [
                    ['q' => 'Karakteristik Big Data "5V" dimulai dari Volume, Velocity, Variety, Veracity, dan?', 'a' => ['Visibility', 'Value', 'Version', 'Validation'], 'correct' => 1],
                    ['q' => 'Framework paling populer untuk Big Data terdistribusi?', 'a' => ['MySQL', 'MongoDB', 'Apache Hadoop', 'Redis'], 'correct' => 2],
                    ['q' => 'Apache Spark lebih cepat dari Hadoop MapReduce karena?', 'a' => ['Lebih banyak node', 'In-memory processing', 'Pakai SSD', 'Kode lebih efisien'], 'correct' => 1],
                    ['q' => 'Apache Kafka digunakan untuk?', 'a' => ['Batch processing', 'Real-time data streaming', 'Machine learning saja', 'Database management'], 'correct' => 1],
                    ['q' => 'Data lake berbeda dari data warehouse karena?', 'a' => ['Hanya structured data', 'Simpan data dalam format raw/asli', 'Lebih mahal', 'Tidak bisa dianalisis'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah karakteristik Big Data (V) yang valid?', 'options' => ['Volume', 'Velocity', 'Variety', 'Veracity'], 'correct' => [0, 2]],
                    ['q' => 'Manakah framework Big Data populer?', 'options' => ['Apache Hadoop', 'MySQL', 'Apache Spark', 'PostgreSQL'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools stream processing?', 'options' => ['Apache Kafka', 'Hadoop HDFS', 'Apache Flink', 'MySQL'], 'correct' => [0, 2]],
                    ['q' => 'Manakah format penyimpanan kolumnar untuk big data?', 'options' => ['Parquet', 'CSV', 'ORC', 'JSON'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools visualisasi data?', 'options' => ['Tableau', 'Hadoop', 'Power BI', 'Spark'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep Big Data dan karakteristik 5V-nya!'],
                    ['q' => 'Jelaskan arsitektur Hadoop (HDFS, MapReduce, YARN) dan cara kerjanya!'],
                    ['q' => 'Apa perbedaan Apache Spark vs Hadoop MapReduce? Mengapa Spark sering dipilih?'],
                    ['q' => 'Jelaskan Lambda Architecture dalam big data beserta peran setiap layer-nya!'],
                    ['q' => 'Apa itu ETL? Jelaskan setiap tahap Extract, Transform, Load dalam pipeline data!'],
                ],
            ],

            'DevOps' => [
                'pg' => [
                    ['q' => 'DevOps menggabungkan antara?', 'a' => ['Design dan Operations', 'Development dan Operations', 'Data dan Operations', 'Deploy dan Optimization'], 'correct' => 1],
                    ['q' => 'Container orchestration paling populer?', 'a' => ['Docker', 'Ansible', 'Kubernetes', 'Terraform'], 'correct' => 2],
                    ['q' => 'Continuous Integration (CI) berarti?', 'a' => ['Deploy otomatis ke production', 'Merge dan otomatis build/test', 'Monitor terus-menerus', 'Backup database otomatis'], 'correct' => 1],
                    ['q' => 'Deployment yang bertahap pindahkan traffic ke versi baru disebut?', 'a' => ['Big Bang', 'Blue-Green', 'Canary', 'Rollback'], 'correct' => 2],
                    ['q' => 'Tiga pilar observability dalam DevOps?', 'a' => ['Code, Test, Deploy', 'Logs, Metrics, Traces', 'Plan, Build, Monitor', 'Dev, Int, Deliver'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah tools CI/CD populer?', 'options' => ['Jenkins', 'Docker', 'GitHub Actions', 'Kubernetes'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools Infrastructure as Code?', 'options' => ['Terraform', 'Jenkins', 'Ansible', 'Git'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip DevOps yang valid?', 'options' => ['Continuous Integration', 'Waterfall dev', 'Automation', 'Manual testing only'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools monitoring dan observability?', 'options' => ['Prometheus', 'Docker', 'Grafana', 'Kubernetes'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi deployment?', 'options' => ['Blue-Green', 'Waterfall', 'Canary', 'Agile'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep DevOps dan bagaimana menjembatani gap antara Development dan Operations!'],
                    ['q' => 'Apa yang dimaksud CI/CD pipeline? Jelaskan tahapan dalam pipeline yang ideal!'],
                    ['q' => 'Jelaskan containerization dengan Docker! Apa perbedaan Container dan Virtual Machine?'],
                    ['q' => 'Apa itu Kubernetes? Jelaskan komponen utamanya dan cara kerjanya!'],
                    ['q' => 'Jelaskan Infrastructure as Code (IaC) dan keuntungan menggunakan Terraform!'],
                ],
            ],

            'Etika Profesi TI' => [
                'pg' => [
                    ['q' => 'Kode etik profesi TI bertujuan untuk?', 'a' => ['Meningkatkan gaji', 'Mengatur perilaku profesional dan tanggung jawab', 'Mempercepat proyek', 'Mengurangi biaya'], 'correct' => 1],
                    ['q' => 'Hak cipta perangkat lunak melindungi?', 'a' => ['Ide algoritma', 'Ekspresi kode sumber yang tertulis', 'Konsep umum', 'Hasil output program'], 'correct' => 1],
                    ['q' => 'GDPR adalah regulasi yang mengatur?', 'a' => ['Hak cipta software', 'Perlindungan data pribadi warga EU', 'Standar coding', 'Keamanan jaringan'], 'correct' => 1],
                    ['q' => 'Whistleblowing dalam konteks etika TI adalah?', 'a' => ['Membocorkan data klien', 'Melaporkan pelanggaran etika/hukum oleh organisasi', 'Mencuri kode sumber', 'Mengundurkan diri'], 'correct' => 1],
                    ['q' => 'Prinsip privasi "data minimization" berarti?', 'a' => ['Simpan data sebanyak mungkin', 'Hanya kumpulkan data yang benar-benar diperlukan', 'Enkripsi semua data', 'Hapus semua data'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk jenis kekayaan intelektual di TI?', 'options' => ['Hak Cipta (Copyright)', 'Hak minum', 'Paten', 'Hak bernafas'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip etika dalam pengembangan AI yang diakui?', 'options' => ['Fairness', 'Profitability first', 'Transparency', 'Speed only'], 'correct' => [0, 2]],
                    ['q' => 'Manakah regulasi terkait privasi data yang valid?', 'options' => ['GDPR', 'ISO 9001', 'UU ITE', 'ISO 14001'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tanggung jawab profesional TI?', 'options' => ['Menjaga kerahasiaan data klien', 'Menjual data klien', 'Mengutamakan keselamatan publik', 'Mengabaikan bug minor'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk isu etika dalam cybersecurity?', 'options' => ['Ethical hacking', 'Mencuri kredensial', 'Responsible disclosure', 'Menyebarkan malware'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan pentingnya kode etik profesi dalam bidang teknologi informasi!'],
                    ['q' => 'Apa yang dimaksud dengan hak cipta software? Jelaskan perbedaan proprietary dan open source license!'],
                    ['q' => 'Jelaskan isu privasi data dalam era digital dan regulasi yang mengaturnya (GDPR, UU ITE)!'],
                    ['q' => 'Apa yang dimaksud dengan ethical hacking? Jelaskan perbedaan black hat, white hat, dan grey hat hacker!'],
                    ['q' => 'Bagaimana seorang profesional TI seharusnya menangani konflik kepentingan antara klien dan kepentingan publik?'],
                ],
            ],

            // ─────────────────────────────────────────────────────
            // SISTEM INFORMASI (SI)
            // ─────────────────────────────────────────────────────

            'Analisis Sistem' => [
                'pg' => [
                    ['q' => 'Tahap pertama dalam analisis sistem adalah?', 'a' => ['Desain', 'Identifikasi masalah', 'Implementasi', 'Testing'], 'correct' => 1],
                    ['q' => 'DFD (Data Flow Diagram) digunakan untuk?', 'a' => ['Menggambar struktur database', 'Menggambarkan aliran data dalam sistem', 'Membuat wireframe UI', 'Mendokumentasikan kode'], 'correct' => 1],
                    ['q' => 'Studi kelayakan (feasibility study) mencakup aspek?', 'a' => ['Teknis saja', 'Ekonomis saja', 'Teknis, ekonomis, operasional, dan jadwal', 'Jadwal saja'], 'correct' => 2],
                    ['q' => 'Wawancara, kuesioner, dan observasi adalah teknik?', 'a' => ['Desain sistem', 'Pengumpulan kebutuhan (requirement gathering)', 'Testing', 'Deployment'], 'correct' => 1],
                    ['q' => 'Simbol proses dalam DFD berbentuk?', 'a' => ['Kotak persegi', 'Lingkaran/gelembung', 'Panah', 'Silinder'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah teknik pengumpulan kebutuhan yang valid?', 'options' => ['Wawancara', 'Coding', 'Kuesioner', 'Testing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk tipe feasibility study?', 'options' => ['Technical feasibility', 'Logical feasibility', 'Economic feasibility', 'Binary feasibility'], 'correct' => [0, 2]],
                    ['q' => 'Manakah elemen dalam DFD?', 'options' => ['Proses', 'Class', 'Data store', 'Method'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk tipe sistem informasi?', 'options' => ['TPS (Transaction Processing)', 'MIS (Management Info)', 'DSS (Decision Support)', 'UML (Unified Modeling)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah output dari analisis sistem?', 'options' => ['Requirements document', 'Source code', 'System design', 'Test plan'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tahapan dalam proses analisis sistem informasi secara lengkap!'],
                    ['q' => 'Apa yang dimaksud DFD? Jelaskan komponen-komponen DFD dan cara membacanya!'],
                    ['q' => 'Jelaskan perbedaan antara kebutuhan fungsional dan non-fungsional beserta contoh masing-masing!'],
                    ['q' => 'Apa yang dimaksud studi kelayakan? Jelaskan aspek-aspek yang dievaluasi!'],
                    ['q' => 'Bagaimana cara melakukan fact-finding dalam analisis sistem? Jelaskan teknik-teknik yang digunakan!'],
                ],
            ],

            'Perancangan Sistem' => [
                'pg' => [
                    ['q' => 'Diagram yang menggambarkan struktur fisik komponen sistem?', 'a' => ['Use Case Diagram', 'Class Diagram', 'Deployment Diagram', 'Sequence Diagram'], 'correct' => 2],
                    ['q' => 'Normalisasi database bertujuan untuk?', 'a' => ['Mempercepat query saja', 'Mengurangi redundansi dan anomali data', 'Memperbesar database', 'Menambah tabel'], 'correct' => 1],
                    ['q' => 'Perancangan antarmuka pengguna mempertimbangkan prinsip?', 'a' => ['Kecepatan server', 'Usability dan user experience', 'Ukuran database', 'Jumlah kode'], 'correct' => 1],
                    ['q' => 'Prototyping dalam perancangan sistem berguna untuk?', 'a' => ['Final deployment', 'Validasi kebutuhan dengan pengguna lebih awal', 'Pengganti dokumentasi', 'Optimasi performa'], 'correct' => 1],
                    ['q' => 'Arsitektur three-tier terdiri dari?', 'a' => ['Input, Proses, Output', 'Presentation, Business Logic, Data', 'Frontend, API, Server', 'Client, Network, Cloud'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk jenis diagram UML untuk perancangan?', 'options' => ['Class Diagram', 'Gantt Chart', 'Sequence Diagram', 'Pert Chart'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip desain sistem yang baik?', 'options' => ['Modularity', 'Coupling tinggi', 'Cohesion tinggi', 'Redundansi tinggi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk tipe arsitektur sistem?', 'options' => ['Client-Server', 'Peer-to-Peer', 'Monolithic', 'Binary'], 'correct' => [0, 2]],
                    ['q' => 'Manakah output dari perancangan sistem?', 'options' => ['Design document', 'Test result', 'ERD', 'Source code'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang merupakan pertimbangan dalam desain database?', 'options' => ['Normalisasi', 'Warna UI', 'Indexing strategy', 'Font size'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara analisis sistem dan perancangan sistem!'],
                    ['q' => 'Jelaskan konsep normalisasi database dan tahapannya (1NF, 2NF, 3NF)!'],
                    ['q' => 'Apa yang dimaksud dengan arsitektur three-tier? Jelaskan keuntungannya dibanding two-tier!'],
                    ['q' => 'Jelaskan prinsip high cohesion dan low coupling dalam perancangan sistem!'],
                    ['q' => 'Bagaimana prototyping membantu dalam proses perancangan sistem? Jelaskan jenisnya!'],
                ],
            ],

            'Enterprise Resource Planning' => [
                'pg' => [
                    ['q' => 'ERP adalah sistem yang mengintegrasikan?', 'a' => ['Hanya keuangan', 'Seluruh proses bisnis dalam satu platform', 'Hanya HR', 'Hanya produksi'], 'correct' => 1],
                    ['q' => 'Vendor ERP terbesar di dunia adalah?', 'a' => ['Microsoft Office', 'SAP', 'Adobe', 'Salesforce'], 'correct' => 1],
                    ['q' => 'Modul utama dalam sistem ERP biasanya mencakup?', 'a' => ['Gaming saja', 'Finance, HR, SCM, CRM', 'Email saja', 'Media sosial'], 'correct' => 1],
                    ['q' => 'Implementasi ERP yang mengganti sistem lama sekaligus disebut?', 'a' => ['Phased rollout', 'Big Bang approach', 'Parallel running', 'Pilot approach'], 'correct' => 1],
                    ['q' => 'Penyebab utama kegagalan implementasi ERP?', 'a' => ['Software terlalu bagus', 'Resistensi pengguna dan manajemen perubahan buruk', 'Hardware terlalu mahal', 'Internet terlalu cepat'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah modul yang umum ada dalam ERP?', 'options' => ['Financial Management', 'Game Engine', 'Human Resources', 'Photo Editor'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi implementasi ERP?', 'options' => ['Big Bang', 'No planning', 'Phased rollout', 'Random deployment'], 'correct' => [0, 2]],
                    ['q' => 'Manakah vendor ERP terkenal?', 'options' => ['SAP', 'Instagram', 'Oracle', 'YouTube'], 'correct' => [0, 2]],
                    ['q' => 'Manakah keuntungan ERP?', 'options' => ['Data terintegrasi', 'Sistem terfragmentasi', 'Proses lebih efisien', 'Biaya selalu lebih murah'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tantangan implementasi ERP?', 'options' => ['Change management', 'Terlalu mudah digunakan', 'Data migration', 'Tidak perlu training'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep ERP dan bagaimana sistem ini mengintegrasikan proses bisnis!'],
                    ['q' => 'Apa kelebihan dan kekurangan implementasi ERP pada perusahaan?'],
                    ['q' => 'Jelaskan strategi Big Bang vs Phased Rollout dalam implementasi ERP!'],
                    ['q' => 'Mengapa banyak proyek implementasi ERP gagal? Jelaskan faktor-faktor penyebabnya!'],
                    ['q' => 'Apa perbedaan ERP cloud vs on-premise? Kapan memilih masing-masing?'],
                ],
            ],

            'Audit Sistem Informasi' => [
                'pg' => [
                    ['q' => 'Tujuan utama audit sistem informasi adalah?', 'a' => ['Menambah fitur sistem', 'Menilai efektivitas kontrol dan keamanan SI', 'Mempercepat sistem', 'Mengganti sistem lama'], 'correct' => 1],
                    ['q' => 'Framework audit IT yang paling dikenal adalah?', 'a' => ['SCRUM', 'COBIT', 'Kanban', 'Agile'], 'correct' => 1],
                    ['q' => 'Audit trail dalam sistem informasi adalah?', 'a' => ['Jalur jaringan', 'Catatan log semua aktivitas sistem', 'Diagram alur', 'Kode program'], 'correct' => 1],
                    ['q' => 'Kontrol preventif bertujuan untuk?', 'a' => ['Mendeteksi kesalahan setelah terjadi', 'Mencegah kesalahan sebelum terjadi', 'Memperbaiki kesalahan', 'Mendokumentasikan kesalahan'], 'correct' => 1],
                    ['q' => 'Sertifikasi auditor IT yang paling dikenal adalah?', 'a' => ['PMP', 'CISA', 'CCNA', 'AWS'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis kontrol dalam audit SI?', 'options' => ['Preventive control', 'Decorative control', 'Detective control', 'Physical control'], 'correct' => [0, 2]],
                    ['q' => 'Manakah framework yang digunakan dalam audit IT?', 'options' => ['COBIT', 'Scrum', 'ITIL', 'Kanban'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk area audit dalam SI?', 'options' => ['Audit keamanan', 'Audit desain UI', 'Audit operasional', 'Audit warna'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang merupakan bukti audit?', 'options' => ['Log files', 'Desain grafis', 'Interview notes', 'Foto produk'], 'correct' => [0, 2]],
                    ['q' => 'Manakah standar yang relevan dalam audit SI?', 'options' => ['ISO 27001', 'ISO 9001 Mutu', 'SOX (Sarbanes-Oxley)', 'ISO 14001'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tujuan dan ruang lingkup audit sistem informasi!'],
                    ['q' => 'Apa yang dimaksud COBIT? Jelaskan bagaimana COBIT digunakan sebagai framework audit IT!'],
                    ['q' => 'Jelaskan perbedaan antara kontrol preventif, detektif, dan korektif dalam audit SI!'],
                    ['q' => 'Bagaimana proses audit trail bekerja? Mengapa audit trail penting dalam keamanan sistem?'],
                    ['q' => 'Apa saja risiko yang diidentifikasi dalam audit keamanan sistem informasi? Jelaskan pendekatannya!'],
                ],
            ],

            'Manajemen Proyek TI' => [
                'pg' => [
                    ['q' => 'Triple constraint dalam manajemen proyek terdiri dari?', 'a' => ['Waktu, biaya, kualitas', 'Waktu, biaya, scope', 'Biaya, scope, tim', 'Scope, kualitas, tim'], 'correct' => 1],
                    ['q' => 'Diagram Gantt digunakan untuk?', 'a' => ['Alokasi anggaran', 'Jadwal dan progress aktivitas proyek', 'Struktur organisasi', 'Alur data'], 'correct' => 1],
                    ['q' => 'Sertifikasi manajemen proyek paling diakui secara global?', 'a' => ['CISA', 'PMP (Project Management Professional)', 'CCNA', 'AWS Certified'], 'correct' => 1],
                    ['q' => 'Work Breakdown Structure (WBS) digunakan untuk?', 'a' => ['Mengelola keuangan', 'Memecah proyek menjadi deliverable lebih kecil', 'Mengatur tim', 'Membuat jadwal'], 'correct' => 1],
                    ['q' => 'Critical Path Method (CPM) digunakan untuk?', 'a' => ['Menganalisis biaya', 'Menentukan rangkaian aktivitas terpanjang yang kritis', 'Merekrut tim', 'Testing aplikasi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah tools manajemen proyek yang populer?', 'options' => ['JIRA', 'Photoshop', 'Trello', 'Illustrator'], 'correct' => [0, 2]],
                    ['q' => 'Manakah fase dalam siklus hidup proyek (PMBOK)?', 'options' => ['Initiating', 'Painting', 'Planning', 'Decorating'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk dalam project risk management?', 'options' => ['Risk identification', 'Risk decoration', 'Risk mitigation', 'Risk creation'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik estimasi proyek yang valid?', 'options' => ['Function Point Analysis', 'Random guessing', 'Story Points', 'No estimation'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk dokumen manajemen proyek?', 'options' => ['Project Charter', 'Source code', 'WBS', 'Database schema'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan triple constraint dalam manajemen proyek dan bagaimana ketiga elemen saling mempengaruhi!'],
                    ['q' => 'Apa yang dimaksud WBS? Jelaskan cara membuat WBS yang efektif untuk proyek TI!'],
                    ['q' => 'Jelaskan proses manajemen risiko proyek dari identifikasi hingga mitigasi!'],
                    ['q' => 'Apa perbedaan pendekatan Waterfall dan Agile dalam manajemen proyek TI?'],
                    ['q' => 'Bagaimana cara mengelola stakeholder dalam proyek TI? Jelaskan teknik komunikasi yang efektif!'],
                ],
            ],

            'Sistem Pendukung Keputusan' => [
                'pg' => [
                    ['q' => 'DSS (Decision Support System) dirancang untuk membantu?', 'a' => ['Karyawan operasional', 'Manajer dalam pengambilan keputusan semi-terstruktur', 'Programmer', 'Akuntan saja'], 'correct' => 1],
                    ['q' => 'Model dalam DSS yang mensimulasikan berbagai skenario disebut?', 'a' => ['Dialog model', 'What-if analysis model', 'Database model', 'Report model'], 'correct' => 1],
                    ['q' => 'Komponen utama DSS terdiri dari?', 'a' => ['UI saja', 'Model base, database, dan user interface', 'Jaringan saja', 'Kode program saja'], 'correct' => 1],
                    ['q' => 'Data warehouse mendukung DSS karena?', 'a' => ['Menyimpan data transaksional', 'Menyediakan data historis terintegrasi untuk analisis', 'Mempercepat input data', 'Mengamankan data'], 'correct' => 1],
                    ['q' => 'Analytic Hierarchy Process (AHP) digunakan dalam DSS untuk?', 'a' => ['Sorting data', 'Pengambilan keputusan multi-kriteria', 'Kompresi data', 'Backup database'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen dalam DSS?', 'options' => ['Model base', 'Printer', 'Database', 'Scanner'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis DSS berdasarkan teknologi?', 'options' => ['Data-driven DSS', 'Manual DSS', 'Model-driven DSS', 'Paper-based DSS'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik analisis dalam DSS?', 'options' => ['What-if analysis', 'Sorting only', 'Sensitivity analysis', 'Data entry only'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang mendukung DSS?', 'options' => ['OLAP', 'CRUD only', 'Data mining', 'File storage only'], 'correct' => [0, 2]],
                    ['q' => 'Manakah perbedaan DSS dari MIS?', 'options' => ['Mendukung keputusan tidak terstruktur', 'Hanya laporan rutin', 'Fleksibel dan ad-hoc', 'Output tetap'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep DSS dan perbedaannya dengan MIS (Management Information System)!'],
                    ['q' => 'Jelaskan tiga komponen utama DSS (model base, database, user interface) beserta fungsinya!'],
                    ['q' => 'Apa yang dimaksud dengan what-if analysis dalam DSS? Berikan contoh penggunaannya!'],
                    ['q' => 'Bagaimana data warehouse mendukung fungsi DSS? Jelaskan hubungannya!'],
                    ['q' => 'Jelaskan metode AHP (Analytic Hierarchy Process) dan bagaimana digunakan dalam pengambilan keputusan!'],
                ],
            ],

            'Manajemen Basis Data' => [
                'pg' => [
                    ['q' => 'DBA (Database Administrator) bertanggung jawab atas?', 'a' => ['Menulis aplikasi', 'Performa, keamanan, dan integritas database', 'Desain UI', 'Manajemen jaringan'], 'correct' => 1],
                    ['q' => 'Backup database jenis full backup dilakukan dengan cara?', 'a' => ['Hanya menyimpan perubahan sejak backup terakhir', 'Menyimpan seluruh data database', 'Hanya menyimpan log', 'Tidak menyimpan apapun'], 'correct' => 1],
                    ['q' => 'Database tuning bertujuan untuk?', 'a' => ['Menambah tabel', 'Meningkatkan performa query dan manajemen resource', 'Menghapus data', 'Mengubah skema'], 'correct' => 1],
                    ['q' => 'Recovery database menggunakan redo log untuk?', 'a' => ['Menghapus data', 'Memulihkan committed transaction yang hilang', 'Membuat backup', 'Membuat index'], 'correct' => 1],
                    ['q' => 'Connection pooling dalam database management berguna untuk?', 'a' => ['Menambah koneksi fisik', 'Menggunakan kembali koneksi yang sudah ada', 'Mengurangi keamanan', 'Memperbesar database'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis backup database?', 'options' => ['Full backup', 'Color backup', 'Incremental backup', 'Shape backup'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tugas DBA?', 'options' => ['Performance tuning', 'UI design', 'Security management', 'Content writing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik database monitoring?', 'options' => ['Query execution plan', 'Code review', 'Slow query log', 'Unit testing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik high availability database?', 'options' => ['Replication', 'Manual backup only', 'Failover clustering', 'No redundancy'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk database security?', 'options' => ['Role-based access control', 'Public access all', 'Data encryption', 'No authentication'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan peran DBA dalam organisasi dan tanggung jawab utamanya!'],
                    ['q' => 'Jelaskan strategi backup dan recovery database! Apa perbedaan full, incremental, dan differential backup?'],
                    ['q' => 'Bagaimana cara melakukan database performance tuning? Jelaskan langkah-langkahnya!'],
                    ['q' => 'Jelaskan konsep database security! Apa saja lapisan keamanan yang perlu diterapkan?'],
                    ['q' => 'Apa yang dimaksud high availability database? Jelaskan teknik clustering dan replication!'],
                ],
            ],

            'E-Business' => [
                'pg' => [
                    ['q' => 'Model bisnis B2C dalam e-business berarti?', 'a' => ['Business to Company', 'Business to Consumer', 'Bank to Consumer', 'Brand to Customer'], 'correct' => 1],
                    ['q' => 'Payment gateway dalam e-commerce berfungsi untuk?', 'a' => ['Menyimpan produk', 'Memproses transaksi pembayaran online secara aman', 'Mengelola inventori', 'Mengirim email'], 'correct' => 1],
                    ['q' => 'SEO (Search Engine Optimization) bertujuan untuk?', 'a' => ['Membayar iklan', 'Meningkatkan visibilitas organik di mesin pencari', 'Membuat aplikasi mobile', 'Meningkatkan keamanan'], 'correct' => 1],
                    ['q' => 'Marketplace digital seperti Tokopedia adalah contoh model?', 'a' => ['B2B', 'C2C/B2C (platform)', 'B2G', 'G2C'], 'correct' => 1],
                    ['q' => 'Digital marketing channel yang paling hemat biaya untuk startup?', 'a' => ['TV advertising', 'Content marketing dan social media', 'Billboard', 'Print media'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah model bisnis e-commerce yang valid?', 'options' => ['B2C', 'B2Z', 'B2B', 'C2C'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen utama dalam e-commerce?', 'options' => ['Payment gateway', 'Physical store', 'Shopping cart', 'Manual invoicing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik digital marketing?', 'options' => ['SEO', 'Billboard', 'Email marketing', 'TV ads'], 'correct' => [0, 2]],
                    ['q' => 'Manakah keamanan dalam transaksi e-commerce?', 'options' => ['SSL/TLS', 'Plain HTTP', 'Two-factor auth', 'No encryption'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk e-business strategy?', 'options' => ['Omnichannel', 'Single channel', 'Digital transformation', 'Manual process'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara e-commerce dan e-business! Mana yang lebih luas cakupannya?'],
                    ['q' => 'Jelaskan model bisnis B2B, B2C, dan C2C beserta contoh platform masing-masing!'],
                    ['q' => 'Apa yang dimaksud digital transformation? Bagaimana perusahaan konvensional bertransisi ke e-business?'],
                    ['q' => 'Jelaskan strategi omnichannel dalam e-business! Apa keuntungannya bagi pelanggan dan bisnis?'],
                    ['q' => 'Bagaimana cara mengamankan transaksi dalam e-commerce? Jelaskan teknik keamanan yang digunakan!'],
                ],
            ],

            'Business Intelligence' => [
                'pg' => [
                    ['q' => 'BI (Business Intelligence) bertujuan untuk?', 'a' => ['Mengganti sistem ERP', 'Mengubah data menjadi insight yang mendukung keputusan bisnis', 'Mengelola keuangan saja', 'Membuat aplikasi web'], 'correct' => 1],
                    ['q' => 'KPI (Key Performance Indicator) dalam BI digunakan untuk?', 'a' => ['Menyimpan data', 'Mengukur performa bisnis terhadap target', 'Mengamankan data', 'Memformat laporan'], 'correct' => 1],
                    ['q' => 'Dashboard dalam BI berfungsi sebagai?', 'a' => ['Database', 'Visualisasi ringkasan metrik bisnis secara real-time', 'Kode program', 'Jaringan'], 'correct' => 1],
                    ['q' => 'OLAP cube dalam BI digunakan untuk?', 'a' => ['Menyimpan foto', 'Analisis data multidimensi dari berbagai sudut pandang', 'Membuat laporan teks', 'Testing software'], 'correct' => 1],
                    ['q' => 'Tools BI yang paling populer di perusahaan besar?', 'a' => ['Notepad', 'Power BI dan Tableau', 'Paint', 'Calculator'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen dalam ekosistem BI?', 'options' => ['Data warehouse', 'Source code repo', 'ETL pipeline', 'Game engine'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools BI yang populer?', 'options' => ['Tableau', 'Notepad', 'Power BI', 'Paint'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tipe laporan dalam BI?', 'options' => ['Ad-hoc report', 'Random report', 'Scheduled report', 'Imaginary report'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik visualisasi data dalam BI?', 'options' => ['Dashboard', 'Plain text file', 'Scorecard', 'Raw CSV'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sumber data untuk BI?', 'options' => ['Data warehouse', 'Social media APIs', 'CRM systems', 'Sticky notes'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep Business Intelligence dan bagaimana mengubah data menjadi business insight!'],
                    ['q' => 'Apa yang dimaksud dengan KPI? Berikan contoh KPI untuk perusahaan e-commerce!'],
                    ['q' => 'Jelaskan arsitektur BI dari data source hingga dashboard! Sebutkan komponen-komponen utamanya!'],
                    ['q' => 'Apa perbedaan antara laporan operasional dan laporan analitik dalam BI?'],
                    ['q' => 'Bagaimana BI mendukung pengambilan keputusan strategis perusahaan? Berikan contoh kasus nyata!'],
                ],
            ],

            'IT Governance' => [
                'pg' => [
                    ['q' => 'IT Governance bertujuan untuk?', 'a' => ['Mempercepat coding', 'Memastikan IT mendukung tujuan bisnis dan dikelola dengan baik', 'Mengurangi karyawan IT', 'Membeli hardware terbaru'], 'correct' => 1],
                    ['q' => 'Framework IT Governance yang paling banyak digunakan?', 'a' => ['Scrum', 'COBIT', 'Kanban', 'XP'], 'correct' => 1],
                    ['q' => 'ITIL adalah framework untuk mengelola?', 'a' => ['Proyek software', 'Layanan IT (IT service management)', 'Database', 'Jaringan'], 'correct' => 1],
                    ['q' => 'IT Steering Committee bertanggung jawab untuk?', 'a' => ['Menulis kode program', 'Mengarahkan investasi dan prioritas IT sejalan dengan bisnis', 'Mengelola server', 'Testing software'], 'correct' => 1],
                    ['q' => 'ISO/IEC 38500 adalah standar untuk?', 'a' => ['Keamanan informasi', 'Corporate governance of IT', 'Kualitas software', 'Manajemen layanan IT'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah framework IT Governance yang valid?', 'options' => ['COBIT', 'Scrum', 'ITIL', 'Kanban'], 'correct' => [0, 2]],
                    ['q' => 'Manakah domain utama dalam COBIT?', 'options' => ['Evaluate, Direct and Monitor', 'Code and Test', 'Align, Plan and Organize', 'Deploy and Forget'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tujuan IT Governance?', 'options' => ['Value delivery', 'Cost maximization', 'Risk management', 'Ignore compliance'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk IT risk management?', 'options' => ['Risk identification', 'Risk creation', 'Risk mitigation', 'Risk ignoring'], 'correct' => [0, 2]],
                    ['q' => 'Manakah peran dalam IT Governance?', 'options' => ['IT Steering Committee', 'Game developers', 'Board of Directors', 'Social media managers'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep IT Governance dan mengapa penting bagi organisasi!'],
                    ['q' => 'Apa yang dimaksud dengan COBIT? Jelaskan domain-domain utama dalam COBIT!'],
                    ['q' => 'Bagaimana IT Governance memastikan alignment antara strategi IT dan strategi bisnis?'],
                    ['q' => 'Jelaskan konsep IT risk management dalam konteks IT Governance!'],
                    ['q' => 'Apa perbedaan antara IT Governance dan IT Management? Jelaskan dengan contoh!'],
                ],
            ],

            'Manajemen Layanan TI' => [
                'pg' => [
                    ['q' => 'ITSM (IT Service Management) bertujuan untuk?', 'a' => ['Mengelola kode sumber', 'Mengelola layanan IT agar memenuhi kebutuhan bisnis', 'Mengelola database saja', 'Mengelola jaringan saja'], 'correct' => 1],
                    ['q' => 'SLA dalam konteks ITSM berarti?', 'a' => ['Software License Agreement', 'Service Level Agreement', 'System Login Access', 'Security Layer Agreement'], 'correct' => 1],
                    ['q' => 'ITIL versi terbaru yang berfokus pada value co-creation adalah?', 'a' => ['ITIL v2', 'ITIL v3', 'ITIL 4', 'ITIL 5'], 'correct' => 2],
                    ['q' => 'Incident management bertujuan untuk?', 'a' => ['Mencegah insiden', 'Memulihkan layanan secepat mungkin setelah gangguan', 'Menghapus insiden', 'Membuat laporan saja'], 'correct' => 1],
                    ['q' => 'Change management dalam ITSM bertujuan untuk?', 'a' => ['Mencegah semua perubahan', 'Mengelola perubahan IT dengan risiko minimal', 'Mempercepat semua perubahan tanpa review', 'Mendokumentasikan saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah proses utama dalam ITIL?', 'options' => ['Incident Management', 'Game Management', 'Change Management', 'Photo Management'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen dalam SLA?', 'options' => ['Uptime guarantee', 'Employee salary', 'Response time', 'Office location'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools ITSM yang populer?', 'options' => ['ServiceNow', 'Photoshop', 'Jira Service Desk', 'Instagram'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tipe change dalam ITSM?', 'options' => ['Standard change', 'Random change', 'Emergency change', 'Hidden change'], 'correct' => [0, 2]],
                    ['q' => 'Manakah ITIL service management practice?', 'options' => ['Problem management', 'Cooking management', 'Knowledge management', 'Sports management'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep ITSM dan bagaimana ITIL menjadi framework panduan implementasinya!'],
                    ['q' => 'Apa yang dimaksud SLA? Jelaskan komponen-komponen penting dalam SLA layanan IT!'],
                    ['q' => 'Jelaskan perbedaan antara Incident Management dan Problem Management dalam ITIL!'],
                    ['q' => 'Bagaimana change management dalam ITSM membantu mengurangi risiko gangguan layanan?'],
                    ['q' => 'Jelaskan konsep service catalog dalam ITSM! Bagaimana service catalog membantu pengguna IT?'],
                ],
            ],

        ];
 
        return $data[$nama] ?? [];
    }

    // ── Helpers ──────────────────────────────────────────────────
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

    // ... (Fungsi helper lainnya tidak berubah dan taruh di sini) ...
}