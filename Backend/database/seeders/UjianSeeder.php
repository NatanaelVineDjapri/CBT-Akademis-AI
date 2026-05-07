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
        
    }

    // Posisikan method getSoal5 di luar method run() seperti ini:
    private function getSoal5(string $nama): array
    {
  
    
        $data = [
            //TI
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

            'Struktur Data' => [
                'pg' => [
                    ['q' => 'Struktur data yang bersifat LIFO (Last In First Out) adalah?', 'a' => ['Queue', 'Stack', 'Tree', 'Linked List'], 'correct' => 1],
                    ['q' => 'Operasi untuk menambahkan elemen pada antrean (queue) disebut?', 'a' => ['Enqueue', 'Dequeue', 'Push', 'Pop'], 'correct' => 0],
                    ['q' => 'Jika sebuah antrean (queue) menggunakan array dengan ukuran 5, dan telah diisi 5 elemen, maka kondisi tersebut disebut?', 'a' => ['Underflow', 'Overflow', 'Empty', 'Full'], 'correct' => 1],
                    ['q' => 'Kompleksitas waktu terbaik dari algoritma Binary Search adalah?', 'a' => ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], 'correct' => 2],
                    ['q' => 'Binary Tree yang setiap node-nya memiliki paling banyak 2 anak disebut?', 'a' => ['General Tree', 'Binary Tree', 'AVL Tree', 'Graph'], 'correct' => 1],
                    ['q' => 'Algoritma sorting yang membandingkan elemen yang berdekatan dan menukarnya jika salah adalah?', 'a' => ['Selection Sort', 'Bubble Sort', 'Insertion Sort', 'Merge Sort'], 'correct' => 1],
                    ['q' => 'Struktur data yang cocok untuk menyimpan data dengan relasi hirarki adalah?', 'a' => ['Graph', 'Stack', 'Tree', 'Queue'], 'correct' => 2],
                    ['q' => 'Pada Linked List, setiap node terdiri dari dua bagian utama, yaitu?', 'a' => ['Data dan Next', 'Key dan Value', 'Head dan Tail', 'Index dan Data'], 'correct' => 0],
                    ['q' => 'Operasi pengambilan elemen pada Stack disebut?', 'a' => ['Enqueue', 'Dequeue', 'Push', 'Pop'], 'correct' => 3],
                    ['q' => 'Manakah traversal pada Binary Tree yang mengunjungi root terlebih dahulu?', 'a' => ['In-order', 'Pre-order', 'Post-order', 'Level-order'], 'correct' => 1],
                    ['q' => 'Struktur data mana yang digunakan dalam Breadth-First Search (BFS) pada graf?', 'a' => ['Stack', 'Queue', 'Linked List', 'Array'], 'correct' => 1],
                    ['q' => 'Kompleksitas waktu terburuk untuk Quick Sort pada kondisi tertentu adalah?', 'a' => ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'], 'correct' => 3],
                    ['q' => 'Hashing digunakan untuk?', 'a' => ['Mengurutkan data', 'Mencari data secara instan O(1)', 'Menghubungkan antar node', 'Membuat hirarki'], 'correct' => 1],
                    ['q' => 'Kondisi saat Stack penuh dan tidak dapat ditambahkan elemen lagi disebut?', 'a' => ['Underflow', 'Overflow', 'Empty', 'Active'], 'correct' => 1],
                    ['q' => 'Algoritma yang menggunakan teknik divide and conquer untuk memecah array menjadi dua bagian adalah?', 'a' => ['Merge Sort', 'Bubble Sort', 'Insertion Sort', 'Linear Search'], 'correct' => 0],
                    ['q' => 'Pada graf, jika sebuah sisi memiliki arah, maka disebut?', 'a' => ['Undirected Graph', 'Directed Graph', 'Weighted Graph', 'Tree'], 'correct' => 1],
                    ['q' => 'Pencarian data pada array yang dilakukan secara berurutan dari awal sampai akhir disebut?', 'a' => ['Binary Search', 'Linear Search', 'Interpolation Search', 'Depth First Search'], 'correct' => 1],
                    ['q' => 'Struktur data yang dapat diakses dari kedua ujungnya (bisa enqueue dan dequeue di kedua sisi) adalah?', 'a' => ['Stack', 'Double-Ended Queue (Deque)', 'Circular Queue', 'Priority Queue'], 'correct' => 1],
                    ['q' => 'Simpul pada tree yang tidak memiliki anak disebut?', 'a' => ['Root', 'Parent', 'Leaf', 'Sibling'], 'correct' => 2],
                    ['q' => 'Pencarian dengan cara membagi array menjadi dua bagian untuk setiap langkahnya disebut?', 'a' => ['Linear Search', 'Binary Search', 'Hash Search', 'Sequential Search'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah struktur data yang bersifat linier?', 'options' => ['Array', 'Tree', 'Linked List', 'Graph'], 'correct' => [0, 2]],
                    ['q' => 'Manakah algoritma yang termasuk dalam kategori comparison sort?', 'options' => ['Merge Sort', 'Radix Sort', 'Quick Sort', 'Counting Sort'], 'correct' => [0, 2]],
                    ['q' => 'Manakah operasi dasar yang berlaku pada Stack?', 'options' => ['Push', 'Enqueue', 'Pop', 'Peek'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah yang merupakan jenis graf (Graph) dalam struktur data?', 'options' => ['Directed Graph', 'Cyclic Graph', 'Weighted Graph', 'Sequential Graph'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah metode traversal pada Binary Tree?', 'options' => ['Pre-order', 'Cross-order', 'In-order', 'Post-order'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah struktur data abstrak (Abstract Data Type)?', 'options' => ['Stack', 'Array', 'Queue', 'Linked List'], 'correct' => [0, 2]],
                    ['q' => 'Manakah kondisi error yang dapat terjadi pada struktur data tertentu?', 'options' => ['Stack Overflow', 'Memory Leak', 'Queue Underflow', 'Index Out of Bounds'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah struktur data yang mengimplementasikan antrean prioritas (Priority Queue)?', 'options' => ['Binary Heap', 'Linked List', 'Circular Array', 'Matrix'], 'correct' => [0, 2]],
                    ['q' => 'Manakah implementasi untuk menelusuri Graf secara mendalam (DFS)?', 'options' => ['Stack', 'Queue', 'Rekursi', 'Hash Table'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik hashing collision resolution?', 'options' => ['Chaining', 'Linear Probing', 'Bubble Hashing', 'Double Hashing'], 'correct' => [0, 1, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara Stack dan Queue! Berikan masing-masing dua contoh penerapannya dalam kehidupan nyata atau pemrograman!'],
                    ['q' => 'Apa yang dimaksud dengan struktur data Linked List? Jelaskan perbedaan antara Singly Linked List dan Doubly Linked List!'],
                    ['q' => 'Jelaskan konsep Binary Search Tree (BST) dan bagaimana cara melakukan pencarian nilai di dalamnya!'],
                    ['q' => 'Bagaimana algoritma Bubble Sort bekerja? Jelaskan tahapan iterasi pada array [5, 1, 4, 2, 8] hingga terurut!'],
                    ['q' => 'Apa yang dimaksud dengan Graph? Jelaskan representasi Adjacency Matrix dan Adjacency List pada Graph!'],
                    ['q' => 'Mengapa operasi Binary Search jauh lebih efisien dibandingkan Linear Search? Jelaskan dengan menyebutkan kompleksitas waktunya!'],
                    ['q' => 'Jelaskan apa yang dimaksud dengan Hash Collision dan sebutkan dua metode untuk mengatasinya!'],
                    ['q' => 'Apa fungsi struktur data Priority Queue? Jelaskan bagaimana struktur data Heap digunakan untuk mengimplementasikannya!'],
                    ['q' => 'Jelaskan konsep rekursi dalam implementasi struktur data seperti Tree dan kaitannya dengan memori Stack!'],
                    ['q' => 'Analisis dan bandingkan kompleksitas waktu (Time Complexity) antara Selection Sort, Insertion Sort, dan Merge Sort pada kondisi Best, Average, dan Worst!'],
                ],
            ],

            'Kalkulus' => [
                'pg' => [
                    ['q' => 'Nilai dari $\\lim_{x \\to 2} (3x^2 - 4x + 1)$ adalah?', 'a' => ['5', '9', '7', '3'], 'correct' => 0],
                    ['q' => 'Turunan pertama dari fungsi $f(x) = 2x^3 - 5x^2 + 7$ adalah?', 'a' => ['6x^2 - 10x', '6x^2 - 5x', '3x^2 - 10x', '6x^2 + 10x'], 'correct' => 0],
                    ['q' => 'Integral dari fungsi $f(x) = 4x^3 - 2x$ terhadap x adalah?', 'a' => ['x^4 - x^2 + C', 'x^4 - x^2', '4x^4 - 2x^2 + C', 'x^4 + x^2 + C'], 'correct' => 0],
                    ['q' => 'Jika $f(x) = \\sin(x)$, maka turunan pertamanya $f\'(x)$ adalah?', 'a' => ['-\\cos(x)', '\\cos(x)', '\\sin(x)', '-\\sin(x)'], 'correct' => 1],
                    ['q' => 'Nilai dari $\\lim_{x \\to 0} \\frac{\\sin(2x)}{x}$ adalah?', 'a' => ['1', '2', '0', '\\infty'], 'correct' => 1],
                    ['q' => 'Turunan dari $f(x) = \\cos(3x)$ adalah?', 'a' => ['-\\sin(3x)', '-3\\sin(3x)', '3\\sin(3x)', '\\sin(3x)'], 'correct' => 1],
                    ['q' => 'Jika $f(x) = (x^2 + 3)^4$, maka turunan pertamanya adalah?', 'a' => ['4(x^2 + 3)^3', '8x(x^2 + 3)^3', '4x(x^2 + 3)^3', '8(x^2 + 3)^3'], 'correct' => 1],
                    ['q' => 'Integral tertentu $\\int_0^1 3x^2 dx$ adalah?', 'a' => ['1', '2', '3', '0'], 'correct' => 0],
                    ['q' => 'Persamaan garis singgung pada kurva $f(x) = x^2$ di titik $(2, 4)$ memiliki gradien sebesar?', 'a' => ['2', '4', '1', '8'], 'correct' => 1],
                    ['q' => 'Aturan yang digunakan untuk mencari turunan dari pembagian dua fungsi adalah?', 'a' => ['Product Rule', 'Chain Rule', 'Quotient Rule', 'Addition Rule'], 'correct' => 2],
                    ['q' => 'Nilai dari $\\int (2x + 3)^5 dx$ adalah?', 'a' => ['\\frac{(2x+3)^6}{12} + C', '\\frac{(2x+3)^6}{6} + C', '(2x+3)^6 + C', '\\frac{(2x+3)^4}{4} + C'], 'correct' => 0],
                    ['q' => 'Fungsi $f(x) = x^3 - 3x^2$ mencapai nilai stasioner saat $x$ bernilai?', 'a' => ['0 dan 2', '0 dan -2', '1 dan 3', '2 dan -2'], 'correct' => 0],
                    ['q' => 'Jika sebuah fungsi kontinu pada interval $[a, b]$ dan $f(a) \\times f(b) < 0$, maka menurut Teorema Nilai Antara terdapat titik $c \\in (a, b)$ sedemikian sehingga?', 'a' => ['f(c) = 0', 'f\'(c) = 0', 'f(c) = 1', 'f(c) = \\infty'], 'correct' => 0],
                    ['q' => 'Limit $\\lim_{x \\to \\infty} \\frac{2x^2 + 3}{3x^2 - 5x}$ adalah?', 'a' => ['\\frac{2}{3}', '0', '\\infty', '1'], 'correct' => 0],
                    ['q' => 'Turunan dari $f(x) = e^{2x}$ adalah?', 'a' => ['e^{2x}', '2e^{2x}', 'xe^{2x}', '2e^x'], 'correct' => 1],
                    ['q' => 'Integral dari $\\int \\frac{1}{x} dx$ adalah?', 'a' => ['\\ln|x| + C', 'x + C', 'e^x + C', '0'], 'correct' => 0],
                    ['q' => 'Titik balik minimum dari grafik fungsi $f(x) = x^2 - 4x + 4$ berada pada sumbu x di titik?', 'a' => ['x=2', 'x=4', 'x=-2', 'x=0'], 'correct' => 0],
                    ['q' => 'Aturan rantai (Chain Rule) pada kalkulus digunakan untuk mencari turunan dari fungsi?', 'a' => ['Penjumlahan', 'Komposisi', 'Perkalian', 'Pembagian'], 'correct' => 1],
                    ['q' => 'Nilai dari $\\lim_{x \\to 0} \\frac{1-\\cos(x)}{x^2}$ adalah?', 'a' => ['1', '0', '\\frac{1}{2}', '\\infty'], 'correct' => 2],
                    ['q' => 'Integral tak tentu $\\int \\frac{1}{1+x^2} dx$ adalah?', 'a' => ['\\arctan(x) + C', '\\arcsin(x) + C', '\\ln|x| + C', 'x + C'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah dari fungsi berikut yang memiliki turunan yang sama dengan dirinya sendiri?', 'options' => ['f(x) = e^x', 'f(x) = 0', 'f(x) = \\cos(x)', 'f(x) = \\tan(x)'], 'correct' => [0, 1]],
                    ['q' => 'Manakah metode yang valid dalam integrasi?', 'options' => ['Substitusi', 'Parsial', 'Pecahan Parsial', 'Matriks'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah kondisi suatu fungsi dikatakan kontinu pada titik x = c?', 'options' => ['f(c) terdefinisi', 'Limit f(x) x->c ada', 'Limit f(x) x->c = f(c)', 'Limit f(x) x->c $\\neq$ f(c)'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah aturan dalam pencarian limit (Limit Laws)?', 'options' => ['Sum Law', 'Difference Law', 'Product Law', 'Constant Multiple Law'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah yang merupakan bentuk tak tentu pada limit?', 'options' => ['0/0', '$\\infty/\\infty$', '$1^\\infty$', '$0 \\times \\infty$'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah teknik turunan yang benar untuk fungsi majemuk?', 'options' => ['Aturan Rantai', 'Aturan Perkalian', 'Aturan Pembagian', 'Aturan Substitusi'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah aturan penentuan nilai ekstrim (maksimum/minimum) suatu fungsi?', 'options' => ['Uji turunan pertama', 'Uji turunan kedua', 'Uji titik ujung', 'Uji limit tak hingga'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah fungsi yang monoton naik pada seluruh daerah asalnya?', 'options' => ['f(x) = e^x', 'f(x) = x^3', 'f(x) = x^2', 'f(x) = \\ln(x)'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah integral yang hasilnya dapat diselesaikan dengan substitusi $u = \\ln(x)$?', 'options' => ['\\int \\frac{\\ln(x)}{x} dx', '\\int \\frac{e^x}{x} dx', '\\int \\frac{1}{x \\ln(x)} dx', '\\int \\sin(\\ln(x)) \\frac{1}{x} dx'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah dari fungsi trigonometri berikut yang memiliki turunan berupa fungsi negatif?', 'options' => ['\\sin(x)', '\\cos(x)', '\\tan(x)', '\\csc(x)'], 'correct' => [1, 3]],
                ],
                'essay' => [
                    ['q' => 'Tentukan nilai dari limit berikut: $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.'],
                    ['q' => 'Tentukan turunan pertama dari fungsi $f(x) = (2x^2 + 1)(x - 3)$ menggunakan aturan perkalian (Product Rule).'],
                    ['q' => 'Tentukan titik stasioner dan jenisnya (maksimum/minimum lokal) dari fungsi $f(x) = x^3 - 3x^2 - 9x + 5$.'],
                    ['q' => 'Selesaikan integral tak tentu berikut: $\\int (3x^2 + 4x - 5) dx$.'],
                    ['q' => 'Hitunglah nilai integral tentu dari $\\int_1^3 (2x - 1) dx$.'],
                    ['q' => 'Jelaskan konsep Teorema Dasar Kalkulus (Fundamental Theorem of Calculus) dan sebutkan hubungannya antara turunan dan integral.'],
                    ['q' => 'Tentukan turunan fungsi berikut menggunakan aturan rantai (Chain Rule): $f(x) = \\sqrt{x^2 + 5}$.'],
                    ['q' => 'Hitunglah nilai dari $\\lim_{x \\to 0} \\frac{\\tan(3x)}{4x}$ menggunakan sifat limit fungsi trigonometri.'],
                    ['q' => 'Gunakan metode integrasi parsial untuk menyelesaikan: $\\int x \\cos(x) dx$.'],
                    ['q' => 'Tentukan interval di mana fungsi $f(x) = \\frac{1}{3}x^3 - 2x^2 + 3x$ merupakan fungsi naik dan fungsi turun.'],
                ],
            ],

            // SISTEM INFORMASI (SI)
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

            // TEKNIK SIPIL (TS)
            'Mekanika Tanah' => [
                'pg' => [
                    ['q' => 'Batas cair (Liquid Limit) tanah ditentukan dengan alat?', 'a' => ['Proctor', 'Casagrande', 'Triaxial', 'Oedometer'], 'correct' => 1],
                    ['q' => 'Consolidasi primer tanah berkaitan dengan?', 'a' => ['Deformasi plastis tanah pasir', 'Keluarnya air pori dari tanah lempung', 'Pemadatan mekanis', 'Erosi tanah'], 'correct' => 1],
                    ['q' => 'Nilai N-SPT digunakan untuk menentukan?', 'a' => ['Kadar air tanah', 'Kepadatan/konsistensi lapisan tanah', 'Batas plastis', 'Berat jenis tanah'], 'correct' => 1],
                    ['q' => 'Tanah yang memiliki permeabilitas tinggi adalah?', 'a' => ['Lempung', 'Lanau', 'Pasir kasar', 'Gambut'], 'correct' => 2],
                    ['q' => 'Tegangan efektif tanah dihitung dengan rumus?', 'a' => ['σ = γ × z', "σ' = σ - u", 'σ = cu × Nc', 'σ = q × Nq'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk klasifikasi tanah berdasarkan USCS?', 'options' => ['GW (Well-graded Gravel)', 'RB (Red Brick)', 'CL (Clay Low plasticity)', 'WS (Wet Sand)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter kuat geser tanah?', 'options' => ['Kohesi (c)', 'Berat jenis (Gs)', 'Sudut geser dalam (φ)', 'Kadar air (w)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah uji laboratorium mekanika tanah?', 'options' => ['Triaxial test', 'Tensile test baja', 'Direct shear test', 'Bending test beton'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk masalah stabilitas lereng?', 'options' => ['Slip circle failure', 'Bending failure', 'Translational failure', 'Tensile failure'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter konsolidasi tanah?', 'options' => ['Cc (Compression index)', 'Modulus elastis baja', 'Cv (Coefficient of consolidation)', 'Kuat tekan beton'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep Atterberg Limits dan signifikansinya dalam klasifikasi tanah berbutir halus!'],
                    ['q' => 'Apa yang dimaksud dengan konsolidasi tanah? Jelaskan perbedaan konsolidasi primer dan sekunder!'],
                    ['q' => 'Jelaskan prinsip tegangan efektif Terzaghi dan aplikasinya dalam perencanaan fondasi!'],
                    ['q' => 'Bagaimana cara menganalisis stabilitas lereng? Jelaskan metode irisan Bishop yang disederhanakan!'],
                    ['q' => 'Jelaskan prosedur uji SPT (Standard Penetration Test) dan interpretasi hasilnya!'],
                ],
            ],

            'Struktur Beton' => [
                'pg' => [
                    ['q' => 'Kuat tekan beton fc\' diuji pada umur berapa hari?', 'a' => ['7 hari', '14 hari', '28 hari', '56 hari'], 'correct' => 2],
                    ['q' => 'Tulangan baja dalam beton bertulang berfungsi utama menahan?', 'a' => ['Tegangan tekan', 'Tegangan tarik', 'Tegangan geser saja', 'Beban angin'], 'correct' => 1],
                    ['q' => 'Selimut beton (concrete cover) berfungsi untuk?', 'a' => ['Estetika', 'Melindungi tulangan dari korosi dan kebakaran', 'Menambah kekuatan', 'Mengurangi berat'], 'correct' => 1],
                    ['q' => 'Water-cement ratio (w/c) yang rendah menghasilkan beton?', 'a' => ['Lebih lemah', 'Lebih kuat dan kedap', 'Lebih mudah dikerjakan', 'Lebih ringan'], 'correct' => 1],
                    ['q' => 'Balok T dalam struktur beton digunakan karena?', 'a' => ['Lebih hemat tulangan', 'Pelat lantai ikut bekerja sebagai flens tekan', 'Lebih mudah dibuat', 'Lebih ringan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk material penyusun beton?', 'options' => ['Semen Portland', 'Baja profil', 'Agregat kasar', 'Kayu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis beton berdasarkan berat jenisnya?', 'options' => ['Beton normal', 'Beton elastis', 'Beton ringan', 'Beton kaku'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk uji beton segar?', 'options' => ['Slump test', 'Compression test', 'Flow table test', 'Bending test'], 'correct' => [0, 2]],
                    ['q' => 'Manakah keunggulan beton prategang?', 'options' => ['Retak lebih awal', 'Bentang lebih panjang', 'Penampang lebih ramping', 'Biaya lebih murah selalu'], 'correct' => [1, 2]],
                    ['q' => 'Manakah yang mempengaruhi kuat tekan beton?', 'options' => ['w/c ratio', 'Warna agregat', 'Kualitas agregat', 'Nama proyek'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perilaku lentur balok beton bertulang! Bagaimana distribusi tegangan pada penampang?'],
                    ['q' => 'Apa yang dimaksud dengan rasio tulangan seimbang (balanced reinforcement ratio)? Mengapa penting dalam desain?'],
                    ['q' => 'Jelaskan cara mendesain kolom beton bertulang yang menerima beban aksial dan momen!'],
                    ['q' => 'Apa perbedaan beton bertulang biasa dan beton prategang? Jelaskan prinsip kerja beton prategang!'],
                    ['q' => 'Jelaskan faktor-faktor yang mempengaruhi durabilitas beton dan cara meningkatkannya!'],
                ],
            ],

            'Hidrolika' => [
                'pg' => [
                    ['q' => 'Persamaan kontinuitas aliran fluida menyatakan?', 'a' => ['Tekanan konstan', 'Massa fluida yang masuk = massa yang keluar', 'Kecepatan konstan', 'Volume tetap'], 'correct' => 1],
                    ['q' => 'Bilangan Reynolds menentukan jenis aliran. Aliran turbulen terjadi ketika Re?', 'a' => ['Re < 2000', 'Re antara 2000-4000', 'Re > 4000', 'Re = 0'], 'correct' => 2],
                    ['q' => 'Persamaan Bernoulli menghubungkan?', 'a' => ['Massa dan percepatan', 'Tekanan, kecepatan, dan elevasi', 'Debit dan luas penampang', 'Viskositas dan densitas'], 'correct' => 1],
                    ['q' => 'Koefisien Manning (n) digunakan dalam?', 'a' => ['Aliran bertekanan dalam pipa', 'Aliran permukaan bebas di saluran', 'Aliran tanah', 'Aliran udara'], 'correct' => 1],
                    ['q' => 'Head losses dalam pipa disebabkan oleh?', 'a' => ['Gravitasi saja', 'Gesekan dan minor losses', 'Tekanan atmosfer', 'Kecepatan angin'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah sifat fluida yang penting dalam hidrolika?', 'options' => ['Viskositas', 'Warna', 'Densitas', 'Bau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis aliran dalam saluran terbuka?', 'options' => ['Aliran kritis', 'Aliran sirkular', 'Aliran subkritis', 'Aliran spiral'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen head dalam persamaan Bernoulli?', 'options' => ['Pressure head', 'Temperature head', 'Velocity head', 'Color head'], 'correct' => [0, 2]],
                    ['q' => 'Manakah struktur hidraulik yang umum digunakan?', 'options' => ['Bendung (weir)', 'Jembatan gantung', 'Pintu air (gate)', 'Fondasi tiang'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang mempengaruhi debit aliran sungai?', 'options' => ['Luas penampang', 'Warna air', 'Kecepatan aliran', 'Kekeruhan air'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan persamaan Bernoulli dan asumsi-asumsinya! Berikan contoh aplikasi persamaan Bernoulli!'],
                    ['q' => 'Apa yang dimaksud bilangan Reynolds? Jelaskan perbedaan aliran laminar dan turbulen!'],
                    ['q' => 'Jelaskan cara menghitung debit aliran dalam saluran terbuka menggunakan persamaan Manning!'],
                    ['q' => 'Apa yang dimaksud dengan loncatan hidrolik? Jelaskan kapan dan mengapa terjadi!'],
                    ['q' => 'Jelaskan prinsip kerja pompa sentrifugal dan kurva karakteristiknya!'],
                ],
            ],

            'Manajemen Konstruksi' => [
                'pg' => [
                    ['q' => 'Metode penjadwalan yang menggambarkan urutan dan durasi aktivitas secara visual?', 'a' => ['WBS', 'Gantt Chart', 'Flowchart', 'Mindmap'], 'correct' => 1],
                    ['q' => 'Nilai Earned Value (EV) dalam proyek konstruksi merepresentasikan?', 'a' => ['Biaya aktual', 'Nilai pekerjaan yang telah diselesaikan', 'Anggaran rencana', 'Laba proyek'], 'correct' => 1],
                    ['q' => 'K3 (Keselamatan dan Kesehatan Kerja) di proyek konstruksi diatur oleh?', 'a' => ['Menteri Keuangan', 'Permenaker dan SNI terkait K3', 'Departemen Perdagangan', 'Bank Indonesia'], 'correct' => 1],
                    ['q' => 'RAB (Rencana Anggaran Biaya) disusun berdasarkan?', 'a' => ['Perkiraan kasar', 'Volume pekerjaan × harga satuan', 'Harga pasar bebas', 'Negosiasi saja'], 'correct' => 1],
                    ['q' => 'Metode CPM (Critical Path Method) mengidentifikasi?', 'a' => ['Aktivitas termudah', 'Jalur terpanjang yang menentukan durasi proyek', 'Aktivitas paling mahal', 'Tim terbaik'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah dokumen tender proyek konstruksi?', 'options' => ['Bill of Quantities (BQ)', 'Buku harian', 'Spesifikasi teknis', 'Daftar nama pekerja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah indikator kinerja proyek dalam Earned Value Analysis?', 'options' => ['CPI (Cost Performance Index)', 'IQ (Intelligence Quotient)', 'SPI (Schedule Performance Index)', 'BMI (Body Mass Index)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah pihak dalam kontrak konstruksi?', 'options' => ['Pemilik (Owner)', 'Pengamat', 'Kontraktor', 'Penonton'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis kontrak konstruksi?', 'options' => ['Lump sum', 'Kontrak verbal', 'Unit price', 'Kontrak musiman'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk sumber daya proyek konstruksi (5M)?', 'options' => ['Man (tenaga kerja)', 'Mind map', 'Material', 'Meeting'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tahapan manajemen proyek konstruksi dari perencanaan hingga serah terima!'],
                    ['q' => 'Apa yang dimaksud Earned Value Analysis? Jelaskan CPI dan SPI beserta cara interpretasinya!'],
                    ['q' => 'Jelaskan perbedaan antara kontrak Lump Sum dan Unit Price dalam konstruksi!'],
                    ['q' => 'Bagaimana cara mengelola risiko dalam proyek konstruksi? Jelaskan tahapannya!'],
                    ['q' => 'Jelaskan pentingnya K3 dalam proyek konstruksi dan peraturan yang mengaturnya di Indonesia!'],
                ],
            ],

            'Rekayasa Transportasi' => [
                'pg' => [
                    ['q' => 'LHR (Lalu Lintas Harian Rata-rata) digunakan untuk?', 'a' => ['Menghitung biaya', 'Merencanakan kapasitas dan lebar jalan', 'Mengatur rambu', 'Menghitung kecelakaan'], 'correct' => 1],
                    ['q' => 'V/C ratio dalam analisis kapasitas jalan menggambarkan?', 'a' => ['Kecepatan/kapasitas', 'Volume lalu lintas/kapasitas jalan', 'Nilai/biaya', 'Viskositas/kepadatan'], 'correct' => 1],
                    ['q' => 'Tingkat pelayanan jalan (Level of Service) F menunjukkan kondisi?', 'a' => ['Arus bebas', 'Arus stabil', 'Mendekati jenuh', 'Macet total/terhenti'], 'correct' => 3],
                    ['q' => 'Perkerasan lentur (flexible pavement) menggunakan material utama?', 'a' => ['Beton semen', 'Aspal sebagai pengikat', 'Batu bata', 'Baja'], 'correct' => 1],
                    ['q' => 'Simpang bersinyal didesain untuk?', 'a' => ['Mengurangi kapasitas', 'Mengatur konflik arus lalu lintas', 'Memperindah kota', 'Meningkatkan kemacetan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah moda transportasi dalam sistem transportasi perkotaan?', 'options' => ['Bus Rapid Transit', 'Sepeda', 'Light Rail Transit', 'Skuter listrik'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter arus lalu lintas?', 'options' => ['Volume', 'Warna kendaraan', 'Kecepatan', 'Nomor plat'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis perkerasan jalan?', 'options' => ['Perkerasan lentur', 'Perkerasan elastis', 'Perkerasan kaku', 'Perkerasan cair'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk geometrik jalan?', 'options' => ['Alinyemen horizontal', 'Warna marka', 'Alinyemen vertikal', 'Nama jalan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah faktor yang mempengaruhi kecelakaan lalu lintas (3E)?', 'options' => ['Engineering', 'Economics', 'Enforcement', 'Entertainment'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep Level of Service (LOS) jalan! Jelaskan masing-masing level A hingga F!'],
                    ['q' => 'Apa yang dimaksud dengan kapasitas jalan? Jelaskan faktor-faktor yang mempengaruhi kapasitas!'],
                    ['q' => 'Jelaskan perbedaan perkerasan lentur dan perkerasan kaku! Kapan masing-masing digunakan?'],
                    ['q' => 'Bagaimana cara merencanakan sistem transportasi perkotaan yang berkelanjutan?'],
                    ['q' => 'Jelaskan metode 3E dalam penanganan kecelakaan lalu lintas (Engineering, Enforcement, Education)!'],
                ],
            ],

            'Geoteknik' => [
                'pg' => [
                    ['q' => 'Tipe fondasi yang digunakan ketika lapisan tanah keras berada sangat dalam?', 'a' => ['Fondasi telapak', 'Fondasi rakit', 'Fondasi tiang', 'Fondasi sumuran'], 'correct' => 2],
                    ['q' => 'Kelongsoran tanah (slope failure) paling sering terjadi pada?', 'a' => ['Tanah pasir kering', 'Tanah lempung jenuh setelah hujan lebat', 'Tanah berbatu padat', 'Tanah gambut kering'], 'correct' => 1],
                    ['q' => 'Liquefaction (likuifaksi) tanah terjadi pada?', 'a' => ['Tanah lempung saat kering', 'Tanah pasir jenuh saat gempa', 'Batuan keras', 'Tanah gambut'], 'correct' => 1],
                    ['q' => 'Perkuatan tanah dengan geotextile berfungsi sebagai?', 'a' => ['Drainase saja', 'Perkuatan, separasi, dan filtrasi', 'Estetika saja', 'Penanda batas'], 'correct' => 1],
                    ['q' => 'Tekanan tanah aktif (Ka) bekerja pada?', 'a' => ['Dinding yang tidak bergerak', 'Dinding yang bergerak menjauhi tanah', 'Dinding yang bergerak ke tanah', 'Fondasi dalam'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis fondasi berdasarkan kedalaman?', 'options' => ['Fondasi dangkal', 'Fondasi melayang', 'Fondasi dalam', 'Fondasi apung'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode perkuatan lereng?', 'options' => ['Soil nailing', 'Penambahan beban', 'Ground anchor', 'Penggalian lereng'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang mempengaruhi daya dukung fondasi?', 'options' => ['Kohesi tanah', 'Warna tanah', 'Sudut geser dalam', 'Bau tanah'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode penyelidikan tanah di lapangan?', 'options' => ['SPT (Standard Penetration Test)', 'Uji tekan beton', 'CPT (Cone Penetration Test)', 'Uji tarik baja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah material geosintetik?', 'options' => ['Geotextile', 'Baja tulangan', 'Geomembrane', 'Beton'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan fondasi dangkal dan fondasi dalam! Kapan masing-masing digunakan?'],
                    ['q' => 'Apa yang dimaksud dengan daya dukung tanah? Jelaskan persamaan Terzaghi untuk fondasi telapak!'],
                    ['q' => 'Jelaskan fenomena likuifaksi tanah! Apa kondisi yang menyebabkannya dan bagaimana mitigasinya?'],
                    ['q' => 'Jelaskan tekanan tanah lateral aktif dan pasif! Bagaimana menghitung tekanan tanah pada dinding penahan?'],
                    ['q' => 'Apa peran geosintetik dalam rekayasa geoteknik? Jelaskan jenis dan fungsinya!'],
                ],
            ],

            'Struktur Baja' => [
                'pg' => [
                    ['q' => 'Keunggulan utama baja sebagai material struktur?', 'a' => ['Tidak berkarat', 'Kuat tarik dan tekan tinggi dengan berat ringan', 'Lebih murah dari beton', 'Tahan api'], 'correct' => 1],
                    ['q' => 'Sambungan baut mutu tinggi dalam struktur baja bekerja dengan?', 'a' => ['Geser bolt saja', 'Gesek (friction-type) dan/atau tumpuan (bearing-type)', 'Tarik saja', 'Tekuk saja'], 'correct' => 1],
                    ['q' => 'Tekuk lokal (local buckling) pada profil baja dapat dicegah dengan?', 'a' => ['Mengurangi beban', 'Membatasi rasio lebar/tebal (b/t ratio)', 'Cat anti karat', 'Memperlebar fondasi'], 'correct' => 1],
                    ['q' => 'Profil WF (Wide Flange) efisien untuk balok karena?', 'a' => ['Memiliki luas penampang kecil', 'Momen inersia tinggi terhadap sumbu kuat', 'Mudah disambung', 'Lebih ringan dari pipa'], 'correct' => 1],
                    ['q' => 'Korosi baja dapat dicegah dengan?', 'a' => ['Memperbesar penampang saja', 'Galvanisasi dan pengecatan', 'Menambah tulangan', 'Dibakar'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis sambungan struktur baja?', 'options' => ['Sambungan las', 'Sambungan semen', 'Sambungan baut', 'Sambungan kayu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis profil baja struktural?', 'options' => ['WF (Wide Flange)', 'Baja tulangan polos', 'HSS (Hollow Structural Section)', 'Kawat besi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis tekuk (buckling) pada struktur baja?', 'options' => ['Tekuk kolom (global)', 'Tekuk tanah', 'Tekuk lokal sayap', 'Tekuk fondasi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah perlindungan korosi pada baja?', 'options' => ['Galvanisasi', 'Penambahan beban', 'Pengecatan epoksi', 'Penggalian tanah'], 'correct' => [0, 2]],
                    ['q' => 'Manakah standar desain struktur baja di Indonesia?', 'options' => ['SNI 1729', 'ISO 14001', 'AISC 360', 'ASTM A36'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan keunggulan dan kelemahan baja sebagai material struktur dibandingkan beton!'],
                    ['q' => 'Apa yang dimaksud tekuk (buckling) pada kolom baja? Jelaskan faktor kelangsingan dan pengaruhnya!'],
                    ['q' => 'Jelaskan jenis-jenis sambungan baut pada struktur baja dan cara kerjanya!'],
                    ['q' => 'Bagaimana cara mencegah dan melindungi struktur baja dari korosi? Jelaskan metode-metodenya!'],
                    ['q' => 'Jelaskan perencanaan balok baja terhadap lentur! Apa yang dimaksud dengan momen plastis?'],
                ],
            ],

            // TEKNIK MESIN (TM)
            'Termodinamika' => [
                'pg' => [
                    ['q' => 'Hukum Pertama Termodinamika menyatakan?', 'a' => ['Panas tidak bisa diciptakan', 'Energi tidak dapat diciptakan atau dimusnahkan', 'Entropi selalu meningkat', 'Panas mengalir dari dingin ke panas'], 'correct' => 1],
                    ['q' => 'Siklus Carnot merupakan siklus yang?', 'a' => ['Paling nyata di industri', 'Efisiensi termal tertinggi yang teoritis mungkin', 'Menggunakan uap air saja', 'Menggunakan gas ideal saja'], 'correct' => 1],
                    ['q' => 'Efisiensi termal mesin kalor Carnot bergantung pada?', 'a' => ['Jenis bahan bakar', 'Suhu sumber panas dan sumber dingin (T_H dan T_L)', 'Ukuran mesin', 'Jenis gas'], 'correct' => 1],
                    ['q' => 'Entalpi (H) didefinisikan sebagai?', 'a' => ['H = U - pV', 'H = U + pV', 'H = Q/T', 'H = W + Q'], 'correct' => 1],
                    ['q' => 'Proses adiabatik adalah proses tanpa perpindahan?', 'a' => ['Kerja', 'Massa', 'Kalor', 'Tekanan'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah hukum termodinamika yang valid?', 'options' => ['Hukum Pertama (kekekalan energi)', 'Hukum Nol (kesetimbangan termal)', 'Hukum Kedua (entropi)', 'Hukum Keempat (tidak ada)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis proses termodinamika?', 'options' => ['Isotermal', 'Isopolygonal', 'Isobarik', 'Isodecorative'], 'correct' => [0, 2]],
                    ['q' => 'Manakah siklus termodinamika dalam teknik?', 'options' => ['Siklus Otto', 'Siklus Fibonacci', 'Siklus Diesel', 'Siklus Newton'], 'correct' => [0, 2]],
                    ['q' => 'Manakah properti termodinamika intensif?', 'options' => ['Suhu (T)', 'Massa (m)', 'Tekanan (P)', 'Volume (V)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi termodinamika dalam teknik mesin?', 'options' => ['Mesin pembakaran dalam', 'Pemrograman komputer', 'Sistem refrigerasi', 'Desain jembatan'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan Hukum Pertama dan Kedua Termodinamika beserta implikasinya!'],
                    ['q' => 'Apa itu siklus Carnot? Mengapa efisiensinya menjadi batas atas efisiensi mesin kalor nyata?'],
                    ['q' => 'Jelaskan perbedaan antara siklus Otto dan siklus Diesel! Mana yang lebih efisien dan mengapa?'],
                    ['q' => 'Apa yang dimaksud dengan entropi? Jelaskan hubungannya dengan Hukum Kedua Termodinamika!'],
                    ['q' => 'Jelaskan cara kerja sistem refrigerasi/AC berdasarkan prinsip termodinamika!'],
                ],
            ],

            'Mekanika Fluida' => [
                'pg' => [
                    ['q' => 'Fluida ideal (inviscid) memiliki karakteristik?', 'a' => ['Viskositas berhingga', 'Viskositas nol', 'Tak dapat dimampatkan dan berkompresibilitas tinggi', 'Densitas berubah'], 'correct' => 1],
                    ['q' => 'Hukum Pascal menyatakan tekanan dalam fluida tertutup?', 'a' => ['Berkurang sesuai kedalaman', 'Diteruskan sama besar ke segala arah', 'Hanya menuju ke bawah', 'Bergantung pada luas permukaan'], 'correct' => 1],
                    ['q' => 'Gaya angkat (lift) pada sayap pesawat terjadi akibat?', 'a' => ['Perbedaan gravitasi', 'Perbedaan tekanan akibat perbedaan kecepatan aliran (Bernoulli)', 'Berat mesin', 'Gaya magnet'], 'correct' => 1],
                    ['q' => 'Viskositas fluida mengukur?', 'a' => ['Kerapatan fluida', 'Ketahanan fluida terhadap deformasi/aliran', 'Tekanan fluida', 'Suhu fluida'], 'correct' => 1],
                    ['q' => 'Boundary layer dalam aliran viskos terbentuk di?', 'a' => ['Tengah aliran', 'Dekat permukaan benda padat', 'Di atas aliran', 'Di daerah bebas'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah sifat fluida yang penting?', 'options' => ['Densitas', 'Warna', 'Viskositas', 'Bau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis aliran fluida?', 'options' => ['Laminar', 'Circular', 'Turbulent', 'Diagonal'], 'correct' => [0, 2]],
                    ['q' => 'Manakah persamaan dasar mekanika fluida?', 'options' => ['Persamaan Bernoulli', 'Hukum Faraday', 'Persamaan Navier-Stokes', 'Hukum Mendel'], 'correct' => [0, 2]],
                    ['q' => 'Manakah bilangan tak berdimensi dalam mekanika fluida?', 'options' => ['Bilangan Reynolds', 'Bilangan Fibonacci', 'Bilangan Mach', 'Bilangan Avogadro'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi mekanika fluida dalam teknik?', 'options' => ['Desain turbin', 'Desain rangkaian listrik', 'Desain pompa', 'Desain processor'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan persamaan kontinuitas dan persamaan Bernoulli! Bagaimana hubungan keduanya?'],
                    ['q' => 'Apa yang dimaksud bilangan Reynolds? Jelaskan transisi dari aliran laminar ke turbulen!'],
                    ['q' => 'Jelaskan konsep lapisan batas (boundary layer) pada aliran di atas pelat datar!'],
                    ['q' => 'Apa yang dimaksud dengan kavitasi? Jelaskan penyebab dan dampaknya pada pompa!'],
                    ['q' => 'Jelaskan prinsip kerja turbin air (Pelton, Francis, Kaplan) dan perbedaannya!'],
                ],
            ],

            'Perpindahan Panas' => [
                'pg' => [
                    ['q' => 'Konduksi panas terjadi melalui?', 'a' => ['Perpindahan massa', 'Kontak langsung antar molekul/partikel', 'Gelombang elektromagnetik', 'Aliran fluida'], 'correct' => 1],
                    ['q' => 'Hukum Fourier untuk konduksi menyatakan laju perpindahan panas sebanding dengan?', 'a' => ['Perbedaan tekanan', 'Gradien suhu dan luas penampang', 'Kecepatan fluida', 'Konsentrasi partikel'], 'correct' => 1],
                    ['q' => 'Konveksi paksa (forced convection) terjadi ketika?', 'a' => ['Tidak ada aliran fluida', 'Fluida digerakkan oleh gaya eksternal (pompa/kipas)', 'Hanya ada perbedaan densitas', 'Radiasi dominan'], 'correct' => 1],
                    ['q' => 'Koefisien perpindahan panas keseluruhan (U) digunakan dalam?', 'a' => ['Konduksi murni', 'Heat exchanger (penukar panas)', 'Radiasi saja', 'Konduksi dan konveksi terpisah'], 'correct' => 1],
                    ['q' => 'Bilangan Nusselt (Nu) dalam konveksi menggambarkan?', 'a' => ['Rasio inersia terhadap viskositas', 'Perbandingan perpindahan panas konveksi terhadap konduksi', 'Rasio difusivitas termal', 'Laju perpindahan massa'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah mekanisme perpindahan panas?', 'options' => ['Konduksi', 'Gravitasi', 'Konveksi', 'Rotasi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah bilangan tak berdimensi dalam perpindahan panas?', 'options' => ['Bilangan Nusselt', 'Bilangan Fibonacci', 'Bilangan Prandtl', 'Bilangan Avogadro'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis heat exchanger?', 'options' => ['Shell and tube', 'Drum and pipe', 'Plate heat exchanger', 'Box heat exchanger'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang mempengaruhi laju konduksi panas?', 'options' => ['Konduktivitas termal material', 'Warna material', 'Gradien suhu', 'Berat material'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi perpindahan panas dalam teknik?', 'options' => ['Radiator mobil', 'Desain program', 'Heat sink prosesor', 'Desain jalan'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tiga mekanisme perpindahan panas (konduksi, konveksi, radiasi) beserta contoh aplikasi!'],
                    ['q' => 'Jelaskan Hukum Fourier untuk konduksi! Bagaimana resistansi termal digunakan dalam analisis konduksi?'],
                    ['q' => 'Apa perbedaan konveksi bebas dan konveksi paksa? Jelaskan korelasi bilangan Nusselt untuk masing-masing!'],
                    ['q' => 'Jelaskan cara kerja heat exchanger tipe shell-and-tube! Apa yang dimaksud LMTD?'],
                    ['q' => 'Jelaskan hukum Stefan-Boltzmann untuk radiasi termal dan faktor emisivitas!'],
                ],
            ],

            'Elemen Mesin' => [
                'pg' => [
                    ['q' => 'Pasak (key) pada poros berfungsi untuk?', 'a' => ['Menahan beban aksial', 'Mentransmisikan torsi antara poros dan komponen', 'Mengurangi gesekan', 'Menahan beban bending'], 'correct' => 1],
                    ['q' => 'Bantalan (bearing) digunakan untuk?', 'a' => ['Memperkuat poros', 'Mendukung poros berputar dan mengurangi gesekan', 'Menghubungkan dua poros', 'Mengubah kecepatan'], 'correct' => 1],
                    ['q' => 'Roda gigi (gear) berfungsi untuk?', 'a' => ['Hanya memindahkan daya', 'Mentransmisikan daya sambil mengubah kecepatan dan torsi', 'Menghentikan gerakan', 'Menyimpan energi'], 'correct' => 1],
                    ['q' => 'Faktor keamanan (safety factor) dalam desain elemen mesin digunakan untuk?', 'a' => ['Mengurangi berat', 'Memberikan cadangan terhadap ketidakpastian pembebanan dan material', 'Mempercepat produksi', 'Menghemat material'], 'correct' => 1],
                    ['q' => 'Kegagalan fatigue (kelelahan) pada elemen mesin terjadi karena?', 'a' => ['Beban statis yang besar', 'Beban berulang-ulang di bawah kekuatan ultimat material', 'Suhu terlalu tinggi', 'Korosi saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah elemen transmisi daya yang umum?', 'options' => ['Roda gigi', 'Sekrup', 'Sabuk-puli', 'Palu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis bantalan (bearing)?', 'options' => ['Bantalan gelinding (ball bearing)', 'Bantalan tali', 'Bantalan luncur (journal bearing)', 'Bantalan kayu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis sambungan elemen mesin?', 'options' => ['Sambungan keling (rivet)', 'Sambungan semen', 'Sambungan ulir (bolt)', 'Sambungan lem kertas'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk analisis kegagalan elemen mesin?', 'options' => ['Analisis tegangan', 'Analisis warna', 'Analisis fatigue', 'Analisis desain grafis'], 'correct' => [0, 2]],
                    ['q' => 'Manakah faktor yang mempengaruhi kekuatan fatigue?', 'options' => ['Kekasaran permukaan', 'Warna benda', 'Konsentrasi tegangan', 'Bau material'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep faktor keamanan dalam desain elemen mesin! Bagaimana menentukan nilainya?'],
                    ['q' => 'Apa yang dimaksud kegagalan fatigue? Jelaskan diagram Wöhler (S-N curve)!'],
                    ['q' => 'Jelaskan cara mendesain poros terhadap beban puntir dan lentur kombinasi!'],
                    ['q' => 'Apa perbedaan roda gigi spur, helical, dan bevel? Jelaskan kelebihan masing-masing!'],
                    ['q' => 'Jelaskan prinsip pemilihan bantalan (bearing selection) berdasarkan beban dan kecepatan!'],
                ],
            ],

            'Proses Manufaktur' => [
                'pg' => [
                    ['q' => 'Proses pemotongan logam (machining) yang paling umum adalah?', 'a' => ['Casting', 'Turning (pembubutan)', 'Forging', 'Welding'], 'correct' => 1],
                    ['q' => 'Toleransi dimensi dalam manufaktur bertujuan untuk?', 'a' => ['Estetika produk', 'Memastikan interchagebility dan fungsi produk', 'Mengurangi material', 'Mempercepat produksi'], 'correct' => 1],
                    ['q' => 'CNC (Computer Numerical Control) digunakan untuk?', 'a' => ['Desain grafis', 'Mengotomasi dan mengontrol mesin perkakas secara presisi', 'Manajemen keuangan', 'Quality control saja'], 'correct' => 1],
                    ['q' => 'Proses pengelasan (welding) menggabungkan material dengan cara?', 'a' => ['Mekanis saja', 'Panas dan/atau tekanan hingga menyatu', 'Lem kimia', 'Baut saja'], 'correct' => 1],
                    ['q' => 'Surface roughness (Ra) dalam manufaktur mengukur?', 'a' => ['Kekerasan permukaan', 'Kekasaran rata-rata permukaan hasil proses', 'Warna permukaan', 'Kilap permukaan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah proses pembentukan logam (metal forming)?', 'options' => ['Forging (tempa)', 'Melting saja', 'Rolling (rol)', 'Painting'], 'correct' => [0, 2]],
                    ['q' => 'Manakah proses casting (pengecoran)?', 'options' => ['Sand casting', 'Machining', 'Die casting', 'Turning'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter proses machining?', 'options' => ['Cutting speed', 'Material color', 'Feed rate', 'Product name'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis proses welding?', 'options' => ['MIG welding', 'Cold welding (temperature)', 'TIG welding', 'Hot glue only'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk proses rapid prototyping/additive manufacturing?', 'options' => ['FDM (3D Printing)', 'Conventional milling', 'SLA (Stereolithography)', 'Sand casting'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan proses pembubutan (turning)! Sebutkan parameter proses dan cara menghitung material removal rate!'],
                    ['q' => 'Apa perbedaan antara proses casting dan forging? Jelaskan kelebihan dan kekurangan masing-masing!'],
                    ['q' => 'Jelaskan konsep toleransi dimensi dan suaian (fit) dalam manufaktur! Berikan contoh aplikasi!'],
                    ['q' => 'Apa yang dimaksud additive manufacturing (3D printing)? Jelaskan prinsip kerja FDM!'],
                    ['q' => 'Jelaskan konsep lean manufacturing dan bagaimana mengurangi pemborosan (waste) dalam produksi!'],
                ],
            ],

            'Getaran Mekanik' => [
                'pg' => [
                    ['q' => 'Frekuensi natural sistem pegas-massa bergantung pada?', 'a' => ['Amplitudo getaran', 'Kekakuan pegas (k) dan massa (m)', 'Gaya eksternal', 'Redaman saja'], 'correct' => 1],
                    ['q' => 'Resonansi terjadi ketika frekuensi eksitasi?', 'a' => ['Lebih rendah dari frekuensi natural', 'Sama dengan frekuensi natural', 'Lebih tinggi dari frekuensi natural', 'Nol'], 'correct' => 1],
                    ['q' => 'Getaran bebas tanpa redaman (undamped free vibration) memiliki sifat?', 'a' => ['Amplitudo berkurang terus', 'Amplitudo tetap konstan', 'Getaran berhenti sendiri', 'Frekuensi berubah'], 'correct' => 1],
                    ['q' => 'Rasio redaman kritis (ζ) = 1 menunjukkan sistem?', 'a' => ['Underdamped', 'Critically damped', 'Overdamped', 'Undamped'], 'correct' => 1],
                    ['q' => 'Vibration isolation digunakan untuk?', 'a' => ['Memperkuat getaran', 'Mengurangi transmisi getaran ke struktur pendukung', 'Meningkatkan frekuensi', 'Menambah massa'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis sistem getaran berdasarkan derajat kebebasan?', 'options' => ['SDOF (Single Degree of Freedom)', 'ZDOF (Zero)', 'MDOF (Multiple DOF)', 'IDOF (Infinite)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter dalam analisis getaran?', 'options' => ['Amplitudo', 'Warna getaran', 'Frekuensi', 'Bau getaran'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode analisis getaran mekanik?', 'options' => ['Analisis modal', 'Analisis warna', 'Fast Fourier Transform (FFT)', 'Analisis rasa'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk sumber getaran mesin?', 'options' => ['Ketidakseimbangan rotor', 'Warna cat mesin', 'Misalignment poros', 'Nama mesin'], 'correct' => [0, 2]],
                    ['q' => 'Manakah penerapan analisis getaran?', 'options' => ['Predictive maintenance', 'Desain grafis', 'Isolasi getaran mesin', 'Pemrograman web'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan sistem pegas-massa-redaman! Bagaimana pengaruh redaman terhadap respon getaran?'],
                    ['q' => 'Apa yang dimaksud resonansi? Mengapa resonansi berbahaya dan bagaimana mengatasinya?'],
                    ['q' => 'Jelaskan konsep frekuensi natural dan mode shape dalam analisis getaran multi DOF!'],
                    ['q' => 'Apa yang dimaksud dengan vibration isolation? Jelaskan cara mendesain isolator getaran yang efektif!'],
                    ['q' => 'Jelaskan peran analisis getaran dalam predictive maintenance mesin industri!'],
                ],
            ],

            // TEKNIK ELEKTRO (TE)
            'Rangkaian Listrik' => [
                'pg' => [
                    ['q' => 'Hukum Kirchhoff Tegangan (KVL) menyatakan?', 'a' => ['Jumlah arus masuk = keluar di suatu node', 'Jumlah tegangan pada loop tertutup = 0', 'Tegangan berbanding lurus arus', 'Daya = tegangan × arus'], 'correct' => 1],
                    ['q' => 'Impedansi kapasitor (Xc) pada rangkaian AC?', 'a' => ['Xc = ωL', 'Xc = 1/(ωC)', 'Xc = R', 'Xc = ω/C'], 'correct' => 1],
                    ['q' => 'Teorema Thevenin menyederhanakan rangkaian menjadi?', 'a' => ['Sumber arus dan tahanan paralel', 'Sumber tegangan dan tahanan seri', 'Sumber daya dan kapasitor', 'Induktor dan kapasitor'], 'correct' => 1],
                    ['q' => 'Faktor daya (power factor) yang ideal pada beban listrik?', 'a' => ['0', '0.5', '1 (unity)', '-1'], 'correct' => 2],
                    ['q' => 'Resonansi seri LC terjadi ketika?', 'a' => ['XL > XC', 'XL = XC sehingga impedansi minimum', 'XC > XL', 'R = 0'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah hukum dasar rangkaian listrik?', 'options' => ["Hukum Ohm (V=IR)", 'Hukum Darwin', 'Hukum Kirchhoff', 'Hukum Mendel'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis komponen pasif rangkaian listrik?', 'options' => ['Resistor', 'Transistor', 'Kapasitor', 'Op-amp'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode analisis rangkaian listrik?', 'options' => ['Analisis mesh', 'Analisis warna', 'Analisis node', 'Analisis bau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teorema rangkaian listrik?', 'options' => ['Teorema Thevenin', 'Teorema Darwin', 'Teorema Norton', 'Teorema Mendel'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis daya dalam rangkaian AC?', 'options' => ['Daya aktif (P)', 'Daya gelap', 'Daya reaktif (Q)', 'Daya negatif selalu'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan Hukum Kirchhoff Arus dan Tegangan! Berikan contoh penerapan dalam analisis rangkaian!'],
                    ['q' => 'Apa yang dimaksud Teorema Thevenin? Jelaskan langkah-langkah mencari rangkaian ekivalen Thevenin!'],
                    ['q' => 'Jelaskan analisis rangkaian AC! Apa perbedaan antara daya aktif, reaktif, dan semu?'],
                    ['q' => 'Apa yang dimaksud resonansi pada rangkaian RLC seri? Jelaskan kondisi dan pengaruhnya!'],
                    ['q' => 'Jelaskan perbedaan hubungan seri dan paralel pada resistor, kapasitor, dan induktor!'],
                ],
            ],

            'Elektronika Dasar' => [
                'pg' => [
                    ['q' => 'Dioda semikonduktor berfungsi utama sebagai?', 'a' => ['Penguat sinyal', 'Penyearah arus (hanya mengalirkan arus satu arah)', 'Penyimpan muatan', 'Penghasil frekuensi'], 'correct' => 1],
                    ['q' => 'Transistor BJT dioperasikan sebagai penguat di daerah?', 'a' => ['Saturasi', 'Cut-off', 'Aktif/Linier', 'Breakdown'], 'correct' => 2],
                    ['q' => 'Penguat operasional (Op-Amp) ideal memiliki?', 'a' => ['Gain terbatas', 'Impedansi masukan tak terhingga dan impedansi keluaran nol', 'Bandwidth terbatas', 'Arus offset besar'], 'correct' => 1],
                    ['q' => 'Rangkaian penyearah gelombang penuh (full-wave rectifier) menggunakan?', 'a' => ['Satu dioda', 'Dua atau empat dioda', 'Satu transistor', 'Kapasitor saja'], 'correct' => 1],
                    ['q' => 'Transistor MOSFET dikontrol oleh?', 'a' => ['Arus basis', 'Tegangan gate-source', 'Arus kolektor', 'Tegangan emitor'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen semikonduktor aktif?', 'options' => ['Transistor BJT', 'Resistor', 'MOSFET', 'Kapasitor'], 'correct' => [0, 2]],
                    ['q' => 'Manakah konfigurasi penguat transistor?', 'options' => ['Common Emitter', 'Common Collector', 'Common Ground', 'Common Base'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis Op-Amp circuit?', 'options' => ['Inverting amplifier', 'Power amplifier', 'Non-inverting amplifier', 'Signal generator'], 'correct' => [0, 2]],
                    ['q' => 'Manakah fungsi kapasitor dalam elektronika?', 'options' => ['Filter frekuensi', 'Penguat arus', 'Coupling/decoupling', 'Osilasi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi elektronika dasar?', 'options' => ['Power supply', 'Mesin diesel', 'Amplifier audio', 'Konstruksi beton'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan cara kerja dioda semikonduktor dalam kondisi forward dan reverse bias!'],
                    ['q' => 'Jelaskan tiga daerah operasi transistor BJT (cut-off, aktif, saturasi) dan kegunaannya!'],
                    ['q' => 'Apa itu Op-Amp? Jelaskan konfigurasi inverting dan non-inverting amplifier beserta persamaan gain-nya!'],
                    ['q' => 'Jelaskan cara kerja penyearah (rectifier) gelombang penuh dengan jembatan dioda!'],
                    ['q' => 'Apa perbedaan antara transistor BJT dan MOSFET? Kapan menggunakan masing-masing?'],
                ],
            ],

            'Sistem Tenaga Listrik' => [
                'pg' => [
                    ['q' => 'Transformator daya digunakan untuk?', 'a' => ['Menyimpan energi', 'Mengubah level tegangan AC', 'Mengubah AC ke DC', 'Menghasilkan daya'], 'correct' => 1],
                    ['q' => 'Tegangan transmisi listrik dibuat tinggi untuk?', 'a' => ['Keamanan', 'Mengurangi rugi-rugi daya pada saluran (I²R)', 'Mempercepat transmisi', 'Mengurangi material kabel'], 'correct' => 1],
                    ['q' => 'Generator sinkron dalam pembangkit listrik bekerja berdasarkan?', 'a' => ['Efek Hall', 'Hukum Faraday (induksi elektromagnetik)', 'Hukum Ohm', 'Efek fotolistrik'], 'correct' => 1],
                    ['q' => 'Sistem proteksi tenaga listrik menggunakan?', 'a' => ['Hanya sekering', 'Relay proteksi untuk mendeteksi dan mengamankan gangguan', 'Hanya MCB', 'Tidak perlu proteksi'], 'correct' => 1],
                    ['q' => 'Faktor beban (load factor) dalam sistem tenaga listrik adalah?', 'a' => ['Daya maksimum saja', 'Rasio beban rata-rata terhadap beban puncak', 'Tegangan nominal', 'Frekuensi sistem'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen utama sistem tenaga listrik?', 'options' => ['Pembangkit', 'Generator gas', 'Transmisi', 'Pompa air'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis pembangkit listrik?', 'options' => ['PLTA (tenaga air)', 'PLTM (tenaga musik)', 'PLTU (tenaga uap)', 'PLTS (tenaga suara)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah peralatan proteksi sistem tenaga?', 'options' => ['Relay proteksi', 'Multimeter', 'Circuit breaker', 'Voltmeter'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis gangguan dalam sistem tenaga?', 'options' => ['Short circuit (hubung singkat)', 'Long circuit', 'Open circuit (rangkaian terbuka)', 'Medium circuit'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aspek kualitas daya listrik?', 'options' => ['Tegangan harmonik', 'Warna kabel', 'Flicker tegangan', 'Panjang kabel'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan struktur sistem tenaga listrik dari pembangkitan hingga distribusi ke konsumen!'],
                    ['q' => 'Mengapa tegangan transmisi dibuat sangat tinggi? Jelaskan dengan perhitungan rugi-rugi daya!'],
                    ['q' => 'Jelaskan cara kerja transformator daya beserta persamaan dan efisiensinya!'],
                    ['q' => 'Apa yang dimaksud sistem proteksi tenaga listrik? Jelaskan fungsi relay dan circuit breaker!'],
                    ['q' => 'Jelaskan konsep renewable energy dalam sistem tenaga listrik modern (PLTS, PLTB)!'],
                ],
            ],

            'Kontrol Otomatis' => [
                'pg' => [
                    ['q' => 'Sistem kontrol loop tertutup (closed-loop) menggunakan?', 'a' => ['Hanya referensi', 'Feedback dari output untuk mengoreksi error', 'Tidak ada feedback', 'Hanya sensor'], 'correct' => 1],
                    ['q' => 'Kontroler PID terdiri dari komponen?', 'a' => ['Position, Integral, Direction', 'Proportional, Integral, Derivative', 'Power, Input, Data', 'Phase, Index, Delta'], 'correct' => 1],
                    ['q' => 'Fungsi alih (transfer function) dalam sistem kontrol menggambarkan?', 'a' => ['Tegangan sistem', 'Hubungan output terhadap input dalam domain Laplace', 'Arus sistem', 'Daya sistem'], 'correct' => 1],
                    ['q' => 'Stabilitas sistem kontrol dapat dianalisis menggunakan?', 'a' => ['Grafik batang', 'Diagram Bode, Nyquist, atau Root Locus', 'Histogram', 'Pie chart'], 'correct' => 1],
                    ['q' => 'Sistem kontrol yang memiliki steady-state error nol terhadap masukan step adalah?', 'a' => ['Sistem tipe 0', 'Sistem tipe 1 atau lebih', 'Sistem tanpa integrator', 'Sistem overdamped'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen sistem kontrol?', 'options' => ['Plant/proses', 'Warna sistem', 'Kontroler', 'Bau sistem'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis kontroler industri?', 'options' => ['PID controller', 'Word controller', 'Fuzzy controller', 'Excel controller'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode analisis stabilitas?', 'options' => ['Diagram Bode', 'Diagram batang', 'Root Locus', 'Diagram pie'], 'correct' => [0, 2]],
                    ['q' => 'Manakah spesifikasi respon transien?', 'options' => ['Rise time', 'Color time', 'Settling time', 'Paint time'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi sistem kontrol otomatis?', 'options' => ['Autopilot pesawat', 'Desain grafis', 'Kontrol suhu industri', 'Editing video'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan sistem kontrol open-loop dan closed-loop! Apa kelebihan closed-loop?'],
                    ['q' => 'Apa fungsi masing-masing komponen P, I, D dalam kontroler PID? Bagaimana tuning PID dilakukan?'],
                    ['q' => 'Jelaskan konsep fungsi alih (transfer function)! Bagaimana mendapatkan fungsi alih dari persamaan diferensial?'],
                    ['q' => 'Apa yang dimaksud stabilitas sistem kontrol? Jelaskan kriteria Routh-Hurwitz!'],
                    ['q' => 'Jelaskan cara membaca diagram Bode! Apa yang dimaksud gain margin dan phase margin?'],
                ],
            ],

            'Telekomunikasi' => [
                'pg' => [
                    ['q' => 'Modulasi AM (Amplitude Modulation) mengubah?', 'a' => ['Frekuensi carrier', 'Amplitudo carrier sesuai sinyal informasi', 'Fase carrier', 'Kecepatan transmisi'], 'correct' => 1],
                    ['q' => 'Bandwidth (lebar pita) dalam telekomunikasi menentukan?', 'a' => ['Kekuatan sinyal', 'Kapasitas data yang bisa ditransmisikan', 'Jarak transmisi', 'Keamanan sinyal'], 'correct' => 1],
                    ['q' => 'Teorema Shannon-Hartley menentukan?', 'a' => ['Daya sinyal maksimum', 'Kapasitas kanal maksimum berdasarkan bandwidth dan SNR', 'Panjang gelombang', 'Kecepatan cahaya dalam medium'], 'correct' => 1],
                    ['q' => 'Multiplexing FDM memisahkan sinyal berdasarkan?', 'a' => ['Waktu', 'Frekuensi', 'Kode', 'Ruang'], 'correct' => 1],
                    ['q' => 'Teknologi 5G beroperasi di frekuensi?', 'a' => ['Hanya < 1 GHz', 'Sub-6 GHz dan mmWave (>24 GHz)', 'Hanya AM band', 'HF band saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis modulasi sinyal?', 'options' => ['AM (Amplitude Modulation)', 'Color Modulation', 'FM (Frequency Modulation)', 'Shape Modulation'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik multiplexing?', 'options' => ['FDM (Frequency Division)', 'RDM (Random Division)', 'TDM (Time Division)', 'CDM (Code Division)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah media transmisi dalam telekomunikasi?', 'options' => ['Fiber optik', 'Kain', 'Kabel koaksial', 'Kayu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah protokol dalam jaringan telekomunikasi?', 'options' => ['GSM', 'COBIT', 'LTE', 'SCRUM'], 'correct' => [0, 2]],
                    ['q' => 'Manakah parameter kualitas sinyal telekomunikasi?', 'options' => ['SNR (Signal-to-Noise Ratio)', 'Warna sinyal', 'BER (Bit Error Rate)', 'Bau sinyal'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara modulasi analog (AM, FM) dan modulasi digital (ASK, FSK, PSK)!'],
                    ['q' => 'Apa yang dimaksud teorema Shannon-Hartley? Jelaskan implikasinya terhadap desain sistem komunikasi!'],
                    ['q' => 'Jelaskan teknik multiplexing FDM, TDM, dan CDMA! Kapan masing-masing digunakan?'],
                    ['q' => 'Apa yang dimaksud dengan noise dalam sistem telekomunikasi? Jelaskan jenis-jenis noise dan dampaknya!'],
                    ['q' => 'Jelaskan perkembangan generasi teknologi seluler dari 1G hingga 5G beserta perbedaan utamanya!'],
                ],
            ],

            'Mikrokontroler' => [
                'pg' => [
                    ['q' => 'Perbedaan utama mikrokontroler dengan mikroprosesor adalah?', 'a' => ['Mikrokontroler lebih cepat', 'Mikrokontroler memiliki RAM, ROM, dan I/O terintegrasi dalam satu chip', 'Mikroprosesor lebih murah', 'Tidak ada perbedaan'], 'correct' => 1],
                    ['q' => 'GPIO (General Purpose Input/Output) pada mikrokontroler berfungsi untuk?', 'a' => ['Komunikasi serial saja', 'Antarmuka digital dengan perangkat eksternal', 'Penyimpanan data', 'Clock system'], 'correct' => 1],
                    ['q' => 'PWM (Pulse Width Modulation) pada mikrokontroler digunakan untuk?', 'a' => ['Komunikasi I2C', 'Mengontrol motor DC, LED dimming, dan konversi DAC', 'Membaca sensor analog', 'Komunikasi SPI'], 'correct' => 1],
                    ['q' => 'Protokol komunikasi serial I2C menggunakan berapa jalur?', 'a' => ['1 jalur', '2 jalur (SDA dan SCL)', '3 jalur', '4 jalur'], 'correct' => 1],
                    ['q' => 'Interrupt pada mikrokontroler digunakan untuk?', 'a' => ['Memperlambat program', 'Merespons kejadian eksternal tanpa polling terus-menerus', 'Menyimpan data', 'Mengatur clock'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah platform mikrokontroler yang populer?', 'options' => ['Arduino Uno (ATmega328P)', 'Raspberry Pi 4', 'STM32', 'Intel Core i7'], 'correct' => [0, 2]],
                    ['q' => 'Manakah protokol komunikasi serial pada mikrokontroler?', 'options' => ['UART', 'USB 3.0', 'I2C', 'HDMI'], 'correct' => [0, 2]],
                    ['q' => 'Manakah peripheral umum dalam mikrokontroler?', 'options' => ['ADC (Analog-to-Digital)', 'GPU', 'Timer/Counter', 'Dedicated CPU cache'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis memori dalam mikrokontroler?', 'options' => ['Flash (program memory)', 'Hard Disk', 'SRAM (data memory)', 'SSD'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sensor yang umum dihubungkan ke mikrokontroler?', 'options' => ['DHT11 (suhu/kelembaban)', 'LCD monitor', 'Ultrasonic HC-SR04', 'Keyboard USB'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan arsitektur mikrokontroler AVR ATmega328P yang digunakan pada Arduino!'],
                    ['q' => 'Apa yang dimaksud dengan ADC dalam mikrokontroler? Jelaskan cara kerja dan parameter pentingnya!'],
                    ['q' => 'Jelaskan cara mengimplementasikan PWM untuk mengontrol kecepatan motor DC dengan mikrokontroler!'],
                    ['q' => 'Apa perbedaan protokol komunikasi UART, I2C, dan SPI? Kapan menggunakan masing-masing?'],
                    ['q' => 'Jelaskan konsep interrupt dalam mikrokontroler! Apa kelebihan interrupt dibandingkan polling?'],
                ],
            ],

            // TEKNIK INDUSTRI (TIN)
            'Riset Operasi' => [
                'pg' => [
                    ['q' => 'Metode simplex digunakan untuk menyelesaikan masalah?', 'a' => ['Integer programming', 'Linear programming', 'Dynamic programming', 'Goal programming'], 'correct' => 1],
                    ['q' => 'Fungsi tujuan dalam linear programming bertujuan untuk?', 'a' => ['Selalu memaksimalkan', 'Memaksimalkan atau meminimalkan nilai objektif', 'Selalu meminimalkan', 'Menyamakan semua variabel'], 'correct' => 1],
                    ['q' => 'Metode transportasi dalam riset operasi digunakan untuk?', 'a' => ['Routing kendaraan saja', 'Meminimalkan biaya distribusi dari sumber ke tujuan', 'Manajemen inventori', 'Penjadwalan produksi'], 'correct' => 1],
                    ['q' => 'Teori antrian (queueing theory) menganalisis?', 'a' => ['Aliran produksi', 'Sistem dengan entitas yang menunggu layanan', 'Transportasi barang', 'Optimasi jadwal'], 'correct' => 1],
                    ['q' => 'Analisis sensitivitas dalam LP digunakan untuk?', 'a' => ['Memvalidasi model', 'Mengetahui dampak perubahan parameter terhadap solusi optimal', 'Memformat laporan', 'Mengubah model'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah metode dalam riset operasi?', 'options' => ['Linear Programming', 'Bubble Sort', 'Integer Programming', 'Binary Search'], 'correct' => [0, 2]],
                    ['q' => 'Manakah asumsi dalam Linear Programming?', 'options' => ['Linearitas', 'Non-linearitas', 'Kepastian (certainty)', 'Ketidakpastian penuh'], 'correct' => [0, 2]],
                    ['q' => 'Manakah aplikasi riset operasi dalam industri?', 'options' => ['Optimasi jadwal produksi', 'Desain produk', 'Optimasi rute distribusi', 'Pemasaran produk'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen masalah linear programming?', 'options' => ['Fungsi tujuan', 'Fungsi warna', 'Batasan (constraint)', 'Fungsi bau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah software yang umum digunakan untuk riset operasi?', 'options' => ['LINGO', 'Photoshop', 'GAMS', 'Instagram'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan komponen-komponen masalah Linear Programming (LP) beserta contoh formulasinya!'],
                    ['q' => 'Jelaskan metode grafis untuk menyelesaikan LP dengan dua variabel! Bagaimana menentukan solusi optimal?'],
                    ['q' => 'Apa yang dimaksud analisis sensitivitas dalam LP? Mengapa penting dalam pengambilan keputusan?'],
                    ['q' => 'Jelaskan model antrian M/M/1! Apa yang dimaksud dengan intensitas lalu lintas (ρ)?'],
                    ['q' => 'Bagaimana riset operasi diaplikasikan dalam manajemen rantai pasok? Berikan contoh kasus!'],
                ],
            ],

            'Ergonomi' => [
                'pg' => [
                    ['q' => 'Ergonomi bertujuan untuk?', 'a' => ['Memperindah produk', 'Menyesuaikan pekerjaan/produk dengan kemampuan dan keterbatasan manusia', 'Meningkatkan produksi saja', 'Mengurangi biaya saja'], 'correct' => 1],
                    ['q' => 'Antropometri dalam ergonomi mempelajari?', 'a' => ['Fisiologi kerja', 'Dimensi dan proporsi tubuh manusia', 'Psikologi kerja', 'Lingkungan kerja'], 'correct' => 1],
                    ['q' => 'Prinsip persentil dalam desain ergonomis. Desain untuk pengguna umum menggunakan persentil?', 'a' => ['P5 dan P95', 'P50 saja', 'P1 saja', 'P99 saja'], 'correct' => 0],
                    ['q' => 'Beban kerja mental dapat diukur menggunakan?', 'a' => ['Dynamometer', 'NASA-TLX (Task Load Index)', 'Timbangan', 'Penggaris'], 'correct' => 1],
                    ['q' => 'Faktor lingkungan kerja yang mempengaruhi produktivitas?', 'a' => ['Hanya suhu', 'Suhu, pencahayaan, kebisingan, dan getaran', 'Hanya pencahayaan', 'Hanya warna dinding'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah aspek ergonomi yang dikaji?', 'options' => ['Ergonomi fisik', 'Ergonomi finansial', 'Ergonomi kognitif', 'Ergonomi marketing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode analisis postur kerja?', 'options' => ['RULA (Rapid Upper Limb Assessment)', 'SWOT Analysis', 'REBA (Rapid Entire Body Assessment)', 'BCG Matrix'], 'correct' => [0, 2]],
                    ['q' => 'Manakah faktor risiko musculoskeletal disorders (MSDs)?', 'options' => ['Postur canggung', 'Pencahayaan baik', 'Repetisi tinggi', 'Suhu nyaman'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk prinsip desain ergonomis?', 'options' => ['Sesuai dengan antropometri pengguna', 'Desain untuk kenyamanan perancang', 'Meminimalkan kelelahan', 'Estetika diutamakan saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah kondisi lingkungan kerja yang optimal?', 'options' => ['Suhu 20-26°C', 'Suhu 40°C', 'Pencahayaan 300-500 lux', 'Kebisingan 100 dB'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep ergonomi dan mengapa penting dalam perancangan sistem kerja!'],
                    ['q' => 'Apa yang dimaksud antropometri? Jelaskan cara menggunakan data antropometri dalam desain produk!'],
                    ['q' => 'Jelaskan konsep beban kerja fisik dan mental! Bagaimana cara mengukur masing-masing?'],
                    ['q' => 'Apa yang dimaksud musculoskeletal disorders (MSDs)? Bagaimana ergonomi mencegah MSDs?'],
                    ['q' => 'Jelaskan pengaruh faktor lingkungan (suhu, pencahayaan, kebisingan) terhadap kinerja pekerja!'],
                ],
            ],

            'Perencanaan Produksi' => [
                'pg' => [
                    ['q' => 'MRP (Material Requirements Planning) digunakan untuk?', 'a' => ['Merekrut tenaga kerja', 'Merencanakan kebutuhan material berdasarkan jadwal produksi', 'Mengelola keuangan', 'Memasarkan produk'], 'correct' => 1],
                    ['q' => 'Master Production Schedule (MPS) merupakan?', 'a' => ['Jadwal kedatangan bahan baku', 'Rencana produksi item akhir per periode waktu', 'Jadwal maintenance mesin', 'Rencana pemasaran'], 'correct' => 1],
                    ['q' => 'Sistem produksi Just-In-Time (JIT) bertujuan?', 'a' => ['Memperbesar inventori', 'Meminimalkan inventori dan pemborosan', 'Mempercepat produksi tanpa batas', 'Menghasilkan batch besar'], 'correct' => 1],
                    ['q' => 'Capacity Requirements Planning (CRP) bertujuan untuk?', 'a' => ['Merencanakan tenaga kerja saja', 'Memastikan kapasitas produksi cukup untuk memenuhi MRP', 'Merencanakan bahan baku', 'Menjadwalkan pengiriman'], 'correct' => 1],
                    ['q' => 'Bill of Materials (BOM) dalam perencanaan produksi menunjukkan?', 'a' => ['Jadwal produksi', 'Daftar komponen dan bahan baku yang dibutuhkan untuk membuat produk', 'Harga produk', 'Kapasitas mesin'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen utama sistem MRP?', 'options' => ['Master Production Schedule', 'Marketing plan', 'Bill of Materials', 'Financial report'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis sistem produksi?', 'options' => ['Make-to-order (MTO)', 'No-order', 'Make-to-stock (MTS)', 'Never-order'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode peramalan permintaan?', 'options' => ['Moving average', 'Random guessing', 'Exponential smoothing', 'No forecast'], 'correct' => [0, 2]],
                    ['q' => 'Manakah ukuran lot dalam perencanaan produksi?', 'options' => ['EOQ (Economic Order Quantity)', 'Arbitrary lot', 'Lot-for-lot', 'Maximum lot always'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip lean manufacturing?', 'options' => ['Eliminasi pemborosan (waste)', 'Tambah inventori', 'Nilai dari sudut pandang pelanggan', 'Produksi batch besar selalu'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan sistem MRP dan komponen-komponen inputnya! Bagaimana MRP menentukan kebutuhan material?'],
                    ['q' => 'Apa yang dimaksud Master Production Schedule? Bagaimana hubungannya dengan peramalan permintaan?'],
                    ['q' => 'Jelaskan konsep Just-In-Time (JIT) dan bagaimana sistem Kanban mendukung JIT!'],
                    ['q' => 'Apa yang dimaksud dengan aggregate planning? Jelaskan strategi-strategi yang tersedia!'],
                    ['q' => 'Bagaimana cara menentukan ukuran lot produksi menggunakan metode EOQ? Jelaskan asumsi dan rumusnya!'],
                ],
            ],

            'Manajemen Kualitas' => [
                'pg' => [
                    ['q' => 'Total Quality Management (TQM) berfokus pada?', 'a' => ['Kualitas produk akhir saja', 'Perbaikan kualitas secara menyeluruh di seluruh organisasi', 'Kualitas bahan baku saja', 'Kepuasan manajemen saja'], 'correct' => 1],
                    ['q' => 'Diagram Pareto dalam pengendalian kualitas berdasarkan prinsip?', 'a' => ['50-50', '80-20 (80% masalah berasal dari 20% penyebab)', '90-10', '70-30'], 'correct' => 1],
                    ['q' => 'Standar internasional untuk sistem manajemen mutu?', 'a' => ['ISO 14001', 'ISO 9001', 'ISO 45001', 'ISO 27001'], 'correct' => 1],
                    ['q' => 'Peta kendali (control chart) digunakan untuk?', 'a' => ['Menggambar proses', 'Memantau variabilitas proses dan mendeteksi penyimpangan', 'Menghitung biaya', 'Merencanakan produksi'], 'correct' => 1],
                    ['q' => 'Six Sigma bertujuan mencapai kualitas dengan tingkat cacat?', 'a' => ['100 per juta', '10 per juta', '3.4 per juta (DPMO)', '0.1 per juta'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah 7 alat kualitas (7 QC tools)?', 'options' => ['Diagram Pareto', 'Diagram SWOT', 'Fishbone diagram', 'BCG Matrix'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metodologi peningkatan kualitas?', 'options' => ['Six Sigma DMAIC', 'Waterfall model', 'Kaizen', 'Agile Scrum'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip ISO 9001?', 'options' => ['Fokus pada pelanggan', 'Fokus pada keuntungan saja', 'Perbaikan berkelanjutan', 'Status quo'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis biaya kualitas?', 'options' => ['Prevention cost', 'Marketing cost', 'Appraisal cost', 'Finance cost'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk fase DMAIC dalam Six Sigma?', 'options' => ['Define', 'Discover', 'Measure', 'Model'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep TQM dan prinsip-prinsip dasarnya dalam organisasi manufaktur!'],
                    ['q' => 'Apa yang dimaksud dengan Statistical Process Control (SPC)? Jelaskan cara menggunakan peta kendali!'],
                    ['q' => 'Jelaskan metodologi Six Sigma DMAIC! Apa yang dimaksud dengan DPMO?'],
                    ['q' => 'Jelaskan 7 alat kualitas (7 QC Tools) beserta fungsi masing-masing!'],
                    ['q' => 'Apa yang dimaksud dengan biaya kualitas (Cost of Quality)? Jelaskan kategori-kategorinya!'],
                ],
            ],

            'Sistem Produksi' => [
                'pg' => [
                    ['q' => 'Tata letak pabrik (plant layout) bertipe product layout cocok untuk?', 'a' => ['Produksi beragam dalam jumlah kecil', 'Produksi massal dengan aliran proses tetap', 'Produksi custom order', 'Produksi proyek'], 'correct' => 1],
                    ['q' => 'OEE (Overall Equipment Effectiveness) mengukur?', 'a' => ['Kapasitas mesin maksimal', 'Efektivitas penggunaan mesin (availability × performance × quality)', 'Biaya perawatan mesin', 'Umur mesin'], 'correct' => 1],
                    ['q' => 'Konsep 5S dalam sistem produksi (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) berasal dari?', 'a' => ['Amerika Serikat', 'Jerman', 'Jepang', 'China'], 'correct' => 2],
                    ['q' => 'Bottleneck dalam sistem produksi adalah?', 'a' => ['Mesin tercepat', 'Proses/stasiun kerja yang membatasi kapasitas produksi keseluruhan', 'Produk terlaris', 'Bahan baku utama'], 'correct' => 1],
                    ['q' => 'Preventive maintenance dilakukan untuk?', 'a' => ['Memperbaiki mesin yang rusak', 'Mencegah kerusakan dengan perawatan terjadwal sebelum terjadi', 'Menambah kapasitas', 'Mengganti mesin lama'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis tata letak (layout) pabrik?', 'options' => ['Product layout', 'Random layout', 'Process layout', 'No layout'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis sistem produksi berdasarkan aliran?', 'options' => ['Flow shop', 'No shop', 'Job shop', 'Color shop'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk pemborosan (7 waste) dalam lean production?', 'options' => ['Overproduction', 'Karyawan banyak', 'Waiting time', 'Produksi cepat'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis maintenance?', 'options' => ['Preventive maintenance', 'Decorative maintenance', 'Predictive maintenance', 'Optional maintenance'], 'correct' => [0, 2]],
                    ['q' => 'Manakah indikator kinerja sistem produksi?', 'options' => ['OEE (Overall Equipment Effectiveness)', 'CEO performance', 'Throughput', 'Employee satisfaction only'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan jenis-jenis tata letak pabrik (product, process, cellular, fixed position)! Kapan masing-masing digunakan?'],
                    ['q' => 'Apa yang dimaksud OEE? Jelaskan cara menghitung dan interpretasinya!'],
                    ['q' => 'Jelaskan konsep Theory of Constraints (TOC)! Bagaimana mengidentifikasi dan mengelola bottleneck?'],
                    ['q' => 'Jelaskan 7 pemborosan (7 Muda) dalam lean manufacturing! Berikan contoh masing-masing!'],
                    ['q' => 'Apa perbedaan antara push system dan pull system dalam produksi? Jelaskan keunggulan pull system!'],
                ],
            ],

            'Analisis Perancangan Kerja' => [
                'pg' => [
                    ['q' => 'Time study (studi waktu) digunakan untuk?', 'a' => ['Menentukan jadwal produksi saja', 'Menetapkan waktu standar kerja melalui pengukuran langsung', 'Menganalisis biaya', 'Merencanakan kapasitas saja'], 'correct' => 1],
                    ['q' => 'Kelonggaran (allowance) dalam penetapan waktu standar kerja mencakup?', 'a' => ['Waktu produktif saja', 'Kebutuhan pribadi, kelelahan, dan keterlambatan tak terhindarkan', 'Hanya waktu istirahat', 'Waktu setup saja'], 'correct' => 1],
                    ['q' => 'Work sampling (sampling kerja) digunakan untuk?', 'a' => ['Mengukur waktu siklus', 'Menentukan proporsi waktu aktivitas berbeda secara statistik', 'Menganalisis gerakan', 'Merancang alat kerja'], 'correct' => 1],
                    ['q' => 'Peta tangan kiri-kanan (right/left hand chart) digunakan untuk?', 'a' => ['Analisis aliran produksi', 'Menganalisis dan menyeimbangkan gerakan kedua tangan operator', 'Penjadwalan produksi', 'Analisis kualitas'], 'correct' => 1],
                    ['q' => 'Prinsip ekonomi gerakan (motion economy) bertujuan untuk?', 'a' => ['Mempercepat tanpa memperhatikan kelelahan', 'Merancang gerakan kerja yang efisien dan mengurangi kelelahan', 'Meningkatkan kompleksitas', 'Memperindah gerakan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah metode pengukuran kerja?', 'options' => ['Time study', 'Market study', 'Work sampling', 'Competitor study'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen waktu standar?', 'options' => ['Waktu normal', 'Waktu istirahat saja', 'Allowance', 'Waktu desain'], 'correct' => [0, 2]],
                    ['q' => 'Manakah peta proses (process chart) yang valid?', 'options' => ['Peta proses operasi', 'Peta organisasi', 'Peta aliran proses', 'Peta lokasi pasar'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk simbol ASME dalam peta proses?', 'options' => ['Operasi (lingkaran)', 'Keputusan (berlian)', 'Transportasi (panah)', 'Terminal (oval)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sistem penetapan waktu yang terstandarisasi?', 'options' => ['MTM (Methods-Time Measurement)', 'PERT', 'MOST (Maynard Operation Sequence Technique)', 'CPM'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan prosedur time study untuk menetapkan waktu standar kerja! Apa yang dimaksud rating factor?'],
                    ['q' => 'Apa yang dimaksud work sampling? Jelaskan cara merancang dan melaksanakan studi work sampling!'],
                    ['q' => 'Jelaskan prinsip-prinsip ekonomi gerakan beserta contoh penerapannya dalam desain stasiun kerja!'],
                    ['q' => 'Apa yang dimaksud peta aliran proses? Jelaskan simbol-simbol yang digunakan dan cara menganalisisnya!'],
                    ['q' => 'Bagaimana analisis metode kerja dapat meningkatkan produktivitas? Jelaskan pendekatan ECRS (Eliminate, Combine, Rearrange, Simplify)!'],
                ],
            ],

            'Statistik Industri' => [
                'pg' => [
                    ['q' => 'Acceptance sampling dalam quality control digunakan untuk?', 'a' => ['Memeriksa semua produk', 'Memutuskan menerima/menolak lot berdasarkan sampel', 'Memproduksi lebih cepat', 'Mendesain produk'], 'correct' => 1],
                    ['q' => 'Distribusi normal digunakan dalam pengendalian statistik karena?', 'a' => ['Paling mudah dihitung', 'Banyak karakteristik kualitas mendekati distribusi normal', 'Hanya ada satu distribusi', 'Dianjurkan ISO'], 'correct' => 1],
                    ['q' => 'Koefisien variasi (CV) digunakan untuk?', 'a' => ['Mengukur nilai rata-rata', 'Membandingkan variabilitas relatif antara dataset berbeda skala', 'Menghitung median', 'Mengukur distribusi'], 'correct' => 1],
                    ['q' => 'Regresi linier berganda digunakan ketika?', 'a' => ['Ada satu variabel independen', 'Ada lebih dari satu variabel independen mempengaruhi variabel dependen', 'Data tidak linear', 'Tidak ada variabel independen'], 'correct' => 1],
                    ['q' => 'Uji Chi-square digunakan untuk menguji?', 'a' => ['Perbedaan rata-rata', 'Kecocokan data (goodness of fit) atau independensi variabel kategoris', 'Korelasi linear', 'Normalitas saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah distribusi statistik yang digunakan dalam industri?', 'options' => ['Distribusi normal', 'Distribusi Fibonacci', 'Distribusi Poisson', 'Distribusi Newton'], 'correct' => [0, 2]],
                    ['q' => 'Manakah peta kendali (control chart) yang valid?', 'options' => ['X-bar chart', 'Color chart', 'R-chart', 'Mood chart'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode sampling dalam statistik industri?', 'options' => ['Simple random sampling', 'Biased sampling', 'Stratified sampling', 'All-in sampling'], 'correct' => [0, 2]],
                    ['q' => 'Manakah ukuran variabilitas data?', 'options' => ['Standar deviasi', 'Mean', 'Variance', 'Median'], 'correct' => [0, 2]],
                    ['q' => 'Manakah uji statistik yang umum dalam industri?', 'options' => ['T-test', 'Color test', 'ANOVA', 'Shape test'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep Statistical Process Control (SPC) dan bagaimana peta kendali X-bar dan R digunakan!'],
                    ['q' => 'Apa yang dimaksud acceptance sampling? Jelaskan Operating Characteristic (OC) curve!'],
                    ['q' => 'Jelaskan penggunaan distribusi normal dalam pengendalian kualitas statistik! Apa itu batas kendali 3-sigma?'],
                    ['q' => 'Bagaimana regresi linier digunakan untuk analisis data industri? Berikan contoh penerapannya!'],
                    ['q' => 'Jelaskan konsep Design of Experiments (DOE) dalam optimasi proses industri!'],
                ],
            ],

            'Manajemen Rantai Pasok' => [
                'pg' => [
                    ['q' => 'Rantai pasok (supply chain) mencakup?', 'a' => ['Hanya pabrik', 'Seluruh aliran material, informasi, dan keuangan dari pemasok hingga pelanggan', 'Hanya distribusi', 'Hanya retailer'], 'correct' => 1],
                    ['q' => 'Bullwhip effect dalam supply chain terjadi karena?', 'a' => ['Produksi berlebih', 'Amplifikasi variabilitas permintaan ke hulu rantai pasok', 'Pengiriman tepat waktu', 'Informasi sempurna'], 'correct' => 1],
                    ['q' => 'Vendor Managed Inventory (VMI) berarti?', 'a' => ['Pembeli mengelola inventori sendiri', 'Pemasok mengelola level inventori di lokasi pembeli', 'Konsultasi bersama inventori', 'Tidak ada inventori'], 'correct' => 1],
                    ['q' => 'Lead time dalam supply chain adalah?', 'a' => ['Waktu pengiriman saja', 'Total waktu dari pemesanan hingga penerimaan produk', 'Waktu produksi saja', 'Waktu pembayaran'], 'correct' => 1],
                    ['q' => 'Strategi supply chain yang responsif (agile) cocok untuk?', 'a' => ['Produk komoditas volume tinggi', 'Produk inovatif dengan permintaan tidak pasti', 'Produk standar permintaan stabil', 'Produk murah'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah aliran dalam supply chain?', 'options' => ['Aliran material', 'Aliran udara', 'Aliran informasi', 'Aliran suara'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi pengadaan (procurement)?', 'options' => ['Single sourcing', 'Random sourcing', 'Multiple sourcing', 'No sourcing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknologi yang mendukung supply chain management?', 'options' => ['ERP system', 'Social media', 'RFID tracking', 'Newspaper'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metrik kinerja supply chain?', 'options' => ['Perfect order fulfillment', 'Employee age', 'Cash-to-cash cycle time', 'Office location'], 'correct' => [0, 2]],
                    ['q' => 'Manakah risiko dalam supply chain?', 'options' => ['Supply disruption', 'Employee promotion', 'Demand uncertainty', 'Office renovation'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep supply chain management dan elemen-elemen yang terlibat!'],
                    ['q' => 'Apa yang dimaksud dengan bullwhip effect? Bagaimana cara menguranginya?'],
                    ['q' => 'Jelaskan perbedaan strategi supply chain lean vs agile! Kapan masing-masing diterapkan?'],
                    ['q' => 'Apa yang dimaksud dengan supply chain visibility? Bagaimana teknologi RFID dan IoT mendukungnya?'],
                    ['q' => 'Jelaskan konsep risiko rantai pasok dan strategi mitigasi yang dapat diterapkan!'],
                ],
            ],

            // ARSITEKTUR (ARS)
            'Perancangan Arsitektur' => [
                'pg' => [
                    ['q' => 'Program arsitektur (architectural program) berisi?', 'a' => ['Kode komputer', 'Kebutuhan ruang dan hubungan antar fungsi bangunan', 'Anggaran biaya', 'Jadwal konstruksi'], 'correct' => 1],
                    ['q' => 'Sirkulasi dalam arsitektur berkaitan dengan?', 'a' => ['Sistem MEP', 'Alur pergerakan manusia dan barang dalam bangunan', 'Struktur bangunan', 'Pencahayaan'], 'correct' => 1],
                    ['q' => 'Denah (floor plan) dalam gambar arsitektur merupakan?', 'a' => ['Tampak depan bangunan', 'Potongan horizontal bangunan setinggi ±1.2m', 'Potongan vertikal', 'Perspektif 3D'], 'correct' => 1],
                    ['q' => 'Zoning dalam perencanaan arsitektur bertujuan untuk?', 'a' => ['Menentukan warna bangunan', 'Mengelompokkan area berdasarkan fungsi dan privasi', 'Menghitung luas bangunan', 'Menentukan material'], 'correct' => 1],
                    ['q' => 'Skala 1:100 dalam gambar arsitektur berarti?', 'a' => ['1 cm gambar = 100 m nyata', '1 cm gambar = 100 cm (1 m) nyata', '100 cm gambar = 1 cm nyata', '1 mm gambar = 100 mm nyata'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk elemen desain arsitektur?', 'options' => ['Ruang (space)', 'Suara musik', 'Massa (mass)', 'Bau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tahap desain arsitektur?', 'options' => ['Schematic design', 'Random design', 'Design development', 'No-plan design'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis gambar arsitektur?', 'options' => ['Denah (plan)', 'Foto panorama', 'Tampak (elevation)', 'Video tour'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip desain arsitektur?', 'options' => ['Proporsi', 'Harga murah selalu', 'Skala', 'Warna gelap selalu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah software yang digunakan dalam perancangan arsitektur?', 'options' => ['AutoCAD', 'Notepad', 'Revit BIM', 'Calculator'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tahapan proses perancangan arsitektur dari programming hingga construction documents!'],
                    ['q' => 'Apa yang dimaksud dengan program arsitektur? Bagaimana cara menyusunnya?'],
                    ['q' => 'Jelaskan prinsip-prinsip dasar komposisi dalam arsitektur (proporsi, skala, ritme, dll)!'],
                    ['q' => 'Bagaimana sirkulasi vertikal dan horizontal dirancang dalam bangunan bertingkat?'],
                    ['q' => 'Jelaskan konsep zoning dalam perancangan bangunan! Apa yang dimaksud zona publik, semi-publik, dan privat?'],
                ],
            ],

            'Teori Arsitektur' => [
                'pg' => [
                    ['q' => 'Arsitektur Modernisme ditandai dengan prinsip?', 'a' => ['Ornamen berlebihan', '"Form follows function" dan kesederhanaan bentuk', 'Revivalis gaya lama', 'Dekorasi kompleks'], 'correct' => 1],
                    ['q' => 'Vitruvius mendefinisikan arsitektur baik harus memenuhi?', 'a' => ['Estetika saja', 'Firmitas (kekuatan), Utilitas (kegunaan), Venustas (keindahan)', 'Biaya murah saja', 'Ukuran besar saja'], 'correct' => 1],
                    ['q' => 'Arsitektur Dekonstruktivisme dipelopori oleh?', 'a' => ['Le Corbusier', 'Frank Lloyd Wright', 'Frank Gehry dan Zaha Hadid', 'Mies van der Rohe'], 'correct' => 2],
                    ['q' => 'Genius loci dalam teori arsitektur berarti?', 'a' => ['Desainer jenius', 'Semangat atau karakter khas suatu tempat/lokasi', 'Teknologi tinggi', 'Gaya internasional'], 'correct' => 1],
                    ['q' => 'Arsitektur vernakular merujuk pada?', 'a' => ['Arsitektur futuristik', 'Arsitektur tradisional yang khas suatu daerah tanpa arsitek formal', 'Arsitektur modern', 'Arsitektur impor'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah aliran arsitektur modern yang valid?', 'options' => ['Modernisme', 'Classicism only', 'Post-modernisme', 'Art Nouveau'], 'correct' => [0, 2]],
                    ['q' => 'Manakah arsitek modernisme terkenal?', 'options' => ['Le Corbusier', 'Michelangelo', 'Mies van der Rohe', 'Raphael'], 'correct' => [0, 2]],
                    ['q' => 'Manakah konsep dalam teori arsitektur?', 'options' => ['Genius loci', 'Net profit', 'Fenomenologi arsitektur', 'Market share'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip arsitektur tradisional Jawa?', 'options' => ['Tritangtu (tiga tingkatan)', 'Mancapat (orientasi arah)', 'Saka guru (tiang utama)', 'Atap pelana saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah konsep keberlanjutan (sustainable architecture)?', 'options' => ['Green building', 'Maximum energy use', 'Passive design strategy', 'Ignore environment'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perkembangan arsitektur dari Modernisme hingga Post-modernisme! Apa perbedaan utamanya?'],
                    ['q' => 'Apa yang dimaksud dengan konsep Vitruvius (Firmitas, Utilitas, Venustas)? Masih relevankah di era modern?'],
                    ['q' => 'Jelaskan konsep arsitektur vernakular dan nilai-nilai yang terkandung di dalamnya!'],
                    ['q' => 'Apa yang dimaksud dengan genius loci dalam teori arsitektur? Bagaimana arsitek meresponsnya?'],
                    ['q' => 'Jelaskan prinsip-prinsip arsitektur hijau (green architecture) dan penerapannya di Indonesia!'],
                ],
            ],

            'Struktur Bangunan' => [
                'pg' => [
                    ['q' => 'Sistem struktur rangka (frame structure) pada bangunan bertingkat terdiri dari?', 'a' => ['Dinding pemikul saja', 'Kolom dan balok sebagai komponen utama', 'Pelat saja', 'Fondasi saja'], 'correct' => 1],
                    ['q' => 'Beban mati (dead load) pada bangunan adalah?', 'a' => ['Beban orang', 'Berat sendiri elemen bangunan yang permanen', 'Beban angin', 'Beban gempa'], 'correct' => 1],
                    ['q' => 'Sistem struktur cangkang (shell structure) efisien karena?', 'a' => ['Menggunakan baja', 'Mentransfer beban melalui tegangan membran (tarik/tekan)', 'Menggunakan banyak kolom', 'Bentuknya kotak'], 'correct' => 1],
                    ['q' => 'Dilatasi (expansion joint) dalam bangunan berfungsi untuk?', 'a' => ['Menambah kekuatan', 'Mengakomodasi pergerakan diferensial akibat suhu dan gempa', 'Mempercantik tampak', 'Mengurangi berat'], 'correct' => 1],
                    ['q' => 'Struktur atap rangka baja ringan menggunakan profil?', 'a' => ['WF besar', 'Cold-formed steel (baja ringan/kanal C)', 'Beton bertulang', 'Kayu solid'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis beban pada bangunan?', 'options' => ['Beban mati (dead load)', 'Beban kecantikan', 'Beban hidup (live load)', 'Beban kebisingan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sistem struktur bangunan?', 'options' => ['Sistem rangka (frame)', 'Sistem kamuflase', 'Sistem dinding pemikul (bearing wall)', 'Sistem warna'], 'correct' => [0, 2]],
                    ['q' => 'Manakah material struktur utama bangunan?', 'options' => ['Beton bertulang', 'Plastik', 'Baja struktural', 'Kain'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk elemen struktur vertikal?', 'options' => ['Kolom', 'Balok', 'Dinding geser (shear wall)', 'Pelat lantai'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk pertimbangan struktur tahan gempa?', 'options' => ['Kekakuan (stiffness)', 'Warna bangunan', 'Daktilitas (ductility)', 'Tinggi bangunan saja'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara sistem struktur rangka (frame) dan sistem dinding pemikul (bearing wall)!'],
                    ['q' => 'Apa yang dimaksud dengan beban mati dan beban hidup? Bagaimana cara menentukannya dalam perencanaan?'],
                    ['q' => 'Jelaskan konsep bangunan tahan gempa! Apa yang dimaksud dengan daktilitas struktur?'],
                    ['q' => 'Jelaskan sistem struktur atap untuk bentang lebar (rangka, shell, kabel, dll)!'],
                    ['q' => 'Bagaimana memilih sistem fondasi yang tepat berdasarkan kondisi tanah dan beban bangunan?'],
                ],
            ],

            'Utilitas Bangunan' => [
                'pg' => [
                    ['q' => 'Sistem plumbing dalam bangunan mencakup?', 'a' => ['Listrik saja', 'Air bersih, air kotor, dan drainase', 'AC saja', 'Pencahayaan'], 'correct' => 1],
                    ['q' => 'HVAC singkatan dari?', 'a' => ['High Voltage Air Conditioning', 'Heating, Ventilation, and Air Conditioning', 'Humidity Ventilation and Cooling', 'Heat Value Air Control'], 'correct' => 1],
                    ['q' => 'Sistem fire protection pasif dalam bangunan meliputi?', 'a' => ['Sprinkler saja', 'Kompartemenisasi api melalui dinding dan pintu tahan api', 'Alarm kebakaran saja', 'Hydrant saja'], 'correct' => 1],
                    ['q' => 'Iluminansi (illuminance) dalam pencahayaan diukur dalam satuan?', 'a' => ['Watt', 'Lumen', 'Lux (lm/m²)', 'Candela'], 'correct' => 2],
                    ['q' => 'Tata udara (air conditioning) pada bangunan bertingkat umumnya menggunakan sistem?', 'a' => ['Window AC unit per ruang saja', 'Chilled water system atau VRF', 'Kipas angin saja', 'Ventilasi alami saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah sistem utilitas bangunan?', 'options' => ['Sistem plumbing', 'Sistem dekorasi', 'Sistem HVAC', 'Sistem furnitur'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sistem proteksi kebakaran aktif?', 'options' => ['Sistem sprinkler', 'Dinding tahan api', 'Hydrant', 'Pintu tahan api'], 'correct' => [0, 2]],
                    ['q' => 'Manakah pertimbangan dalam desain pencahayaan bangunan?', 'options' => ['Tingkat iluminansi (lux)', 'Berat bangunan', 'Kenyamanan visual (glare)', 'Warna cat tembok'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sistem transportasi vertikal dalam bangunan?', 'options' => ['Lift/elevator', 'Tangga spiral saja', 'Eskalator', 'Ramp saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sumber energi terbarukan untuk utilitas bangunan?', 'options' => ['Panel surya (PLTS)', 'Generator diesel', 'Panas bumi (geothermal)', 'PLN saja'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan komponen-komponen sistem plumbing dalam bangunan! Bagaimana air bersih dan air kotor dikelola?'],
                    ['q' => 'Apa yang dimaksud sistem HVAC? Jelaskan komponen dan cara kerjanya pada gedung bertingkat!'],
                    ['q' => 'Jelaskan sistem proteksi kebakaran aktif dan pasif pada bangunan bertingkat!'],
                    ['q' => 'Jelaskan prinsip pencahayaan alami dan buatan dalam bangunan! Bagaimana mengintegrasikan keduanya?'],
                    ['q' => 'Bagaimana konsep green building mempengaruhi desain sistem utilitas bangunan?'],
                ],
            ],

            'Arsitektur Lingkungan' => [
                'pg' => [
                    ['q' => 'Orientasi bangunan yang optimal di iklim tropis adalah menghadap?', 'a' => ['Timur dan barat (menangkap matahari)', 'Utara dan selatan (menghindari sinar langsung)', 'Semua arah sama', 'Selatan saja'], 'correct' => 1],
                    ['q' => 'Ventilasi silang (cross ventilation) dicapai dengan?', 'a' => ['Jendela di satu sisi saja', 'Bukaan di sisi berlawanan yang memanfaatkan perbedaan tekanan', 'AC sentral saja', 'Atap kaca'], 'correct' => 1],
                    ['q' => 'Green roof (atap hijau) bermanfaat untuk?', 'a' => ['Menambah beban saja', 'Insulasi termal, manajemen air hujan, dan biodiversitas', 'Estetika saja', 'Mengurangi konstruksi'], 'correct' => 1],
                    ['q' => 'Rating system LEED digunakan untuk?', 'a' => ['Menilai desain arsitektur saja', 'Sertifikasi bangunan hijau berdasarkan kriteria keberlanjutan', 'Mengukur biaya', 'Penilaian estetika'], 'correct' => 1],
                    ['q' => 'Faktor matahari (solar heat gain) dapat dikurangi dengan?', 'a' => ['Menambah jendela', 'Shading devices (sun shading) dan kaca selektif', 'Memperbesar bangunan', 'Mengurangi dinding'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah strategi desain pasif untuk iklim tropis?', 'options' => ['Cross ventilation', 'Maksimalkan panas matahari', 'Shading dari sinar langsung', 'Tutup semua bukaan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah rating system bangunan hijau?', 'options' => ['LEED', 'ISO 9001', 'GREENSHIP (GBCI)', 'COBIT'], 'correct' => [0, 2]],
                    ['q' => 'Manakah material bangunan berkelanjutan?', 'options' => ['Bambu', 'Plastik non-daur ulang', 'Kayu bersertifikat FSC', 'Beton biasa saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip arsitektur tropis?', 'options' => ['Atap lebar melindungi dari hujan', 'Atap datar tanpa tritisan', 'Kolong bangunan untuk ventilasi', 'Dinding masif tanpa bukaan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi pengelolaan air di bangunan hijau?', 'options' => ['Rain water harvesting', 'Buang semua air hujan', 'Greywater recycling', 'Gunakan air tanah saja'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan prinsip-prinsip desain arsitektur tropis! Apa yang membedakannya dari arsitektur iklim lain?'],
                    ['q' => 'Apa yang dimaksud arsitektur hijau (green architecture)? Jelaskan kriteria LEED atau GREENSHIP!'],
                    ['q' => 'Jelaskan strategi desain pasif untuk mengurangi konsumsi energi bangunan di daerah tropis!'],
                    ['q' => 'Bagaimana ventilasi alami dirancang untuk memaksimalkan kenyamanan termal tanpa AC?'],
                    ['q' => 'Jelaskan konsep biophilic design dan manfaatnya bagi kesehatan penghuni bangunan!'],
                ],
            ],

            // MANAJEMEN (MNJ)
            'Manajemen Pemasaran' => [
                'pg' => [
                    ['q' => 'Bauran pemasaran (Marketing Mix) 4P terdiri dari?', 'a' => ['People, Place, Profit, Price', 'Product, Price, Place, Promotion', 'Plan, Price, Place, People', 'Product, Profit, People, Plan'], 'correct' => 1],
                    ['q' => 'Segmentasi pasar bertujuan untuk?', 'a' => ['Menjual ke semua orang', 'Membagi pasar ke kelompok yang memiliki kebutuhan serupa', 'Mengurangi harga', 'Memperluas produk'], 'correct' => 1],
                    ['q' => 'Brand equity (ekuitas merek) adalah?', 'a' => ['Nilai finansial merek saja', 'Nilai tambah yang diberikan merek kepada produk/layanan', 'Biaya branding', 'Anggaran iklan'], 'correct' => 1],
                    ['q' => 'Customer Lifetime Value (CLV) mengukur?', 'a' => ['Usia pelanggan', 'Total nilai yang diharapkan dari pelanggan selama hubungan bisnis', 'Frekuensi pembelian saja', 'Harga produk'], 'correct' => 1],
                    ['q' => 'STP dalam strategi pemasaran singkatan dari?', 'a' => ['Sales, Target, Profit', 'Segmentation, Targeting, Positioning', 'Strategy, Tactic, Plan', 'Sales, Tactics, Pricing'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah elemen dalam bauran pemasaran 7P?', 'options' => ['Product', 'Passion', 'People', 'Perfume'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi penetapan harga?', 'options' => ['Cost-plus pricing', 'Random pricing', 'Penetration pricing', 'No pricing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah media promosi digital?', 'options' => ['Social media ads', 'Koran cetak saja', 'Email marketing', 'Poster dinding saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis riset pemasaran?', 'options' => ['Riset kualitatif', 'Riset astrologi', 'Riset kuantitatif', 'Riset takhayul'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi distribusi?', 'options' => ['Distribusi intensif', 'Distribusi acak', 'Distribusi selektif', 'Distribusi nol'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep STP (Segmentation, Targeting, Positioning) dalam strategi pemasaran!'],
                    ['q' => 'Apa yang dimaksud bauran pemasaran 4P? Bagaimana evolusinya menjadi 7P?'],
                    ['q' => 'Jelaskan konsep brand equity dan bagaimana cara membangun ekuitas merek yang kuat!'],
                    ['q' => 'Apa yang dimaksud dengan pemasaran digital (digital marketing)? Jelaskan channel-channel utamanya!'],
                    ['q' => 'Bagaimana cara melakukan analisis kompetitor dalam perencanaan pemasaran? Jelaskan framework yang digunakan!'],
                ],
            ],

            'Manajemen Keuangan' => [
                'pg' => [
                    ['q' => 'Net Present Value (NPV) positif dalam investasi berarti?', 'a' => ['Proyek merugi', 'Proyek menghasilkan nilai lebih besar dari biaya modalnya', 'Proyek impas', 'Tidak ada arti khusus'], 'correct' => 1],
                    ['q' => 'Rasio likuiditas yang mengukur kemampuan membayar kewajiban jangka pendek?', 'a' => ['Debt-to-equity ratio', 'Current ratio', 'Return on equity', 'Price-earnings ratio'], 'correct' => 1],
                    ['q' => 'WACC (Weighted Average Cost of Capital) digunakan sebagai?', 'a' => ['Tingkat pertumbuhan perusahaan', 'Discount rate untuk menilai proyek investasi', 'Tingkat pajak', 'Laba perusahaan'], 'correct' => 1],
                    ['q' => 'Dividen dalam manajemen keuangan adalah?', 'a' => ['Utang perusahaan', 'Distribusi laba perusahaan kepada pemegang saham', 'Biaya operasional', 'Investasi baru'], 'correct' => 1],
                    ['q' => 'Leverage keuangan (financial leverage) berkaitan dengan?', 'a' => ['Penggunaan ekuitas saja', 'Penggunaan utang untuk memperbesar potensi return', 'Manajemen kas', 'Kontrol biaya'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah metode penilaian investasi?', 'options' => ['NPV (Net Present Value)', 'Brand value', 'IRR (Internal Rate of Return)', 'Logo value'], 'correct' => [0, 2]],
                    ['q' => 'Manakah laporan keuangan utama?', 'options' => ['Neraca (Balance Sheet)', 'Laporan cuaca', 'Laporan Laba Rugi', 'Laporan olahraga'], 'correct' => [0, 2]],
                    ['q' => 'Manakah rasio keuangan yang umum dianalisis?', 'options' => ['Rasio likuiditas', 'Rasio popularitas', 'Rasio profitabilitas', 'Rasio estetika'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sumber pendanaan (financing) perusahaan?', 'options' => ['Ekuitas (saham)', 'Barter', 'Utang (obligasi)', 'Donasi selalu'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik manajemen modal kerja?', 'options' => ['Cash management', 'Social media management', 'Inventory management', 'Event management'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep time value of money! Bagaimana cara menghitung present value dan future value?'],
                    ['q' => 'Apa yang dimaksud NPV dan IRR? Bagaimana keduanya digunakan dalam keputusan investasi?'],
                    ['q' => 'Jelaskan konsep struktur modal (capital structure)! Apa yang dimaksud dengan WACC?'],
                    ['q' => 'Jelaskan analisis laporan keuangan menggunakan rasio! Sebutkan jenis-jenis rasio dan interpretasinya!'],
                    ['q' => 'Apa yang dimaksud manajemen modal kerja? Jelaskan siklus konversi kas dan cara mengoptimalkannya!'],
                ],
            ],

            'Manajemen SDM' => [
                'pg' => [
                    ['q' => 'Manajemen SDM berfungsi untuk?', 'a' => ['Mengelola keuangan', 'Mengelola sumber daya manusia agar berkontribusi pada tujuan organisasi', 'Memasarkan produk', 'Mengelola operasi'], 'correct' => 1],
                    ['q' => 'Analisis jabatan (job analysis) menghasilkan?', 'a' => ['Anggaran HRD', 'Job description dan job specification', 'Jadwal training', 'Gaji karyawan'], 'correct' => 1],
                    ['q' => 'Performance appraisal bertujuan untuk?', 'a' => ['Menghukum karyawan', 'Mengevaluasi kinerja karyawan secara objektif', 'Menentukan kenaikan gaji saja', 'Memantau kehadiran'], 'correct' => 1],
                    ['q' => 'Kompetensi dalam manajemen SDM merujuk pada?', 'a' => ['Gaji karyawan', 'Kombinasi pengetahuan, keterampilan, dan perilaku yang dibutuhkan', 'Lama kerja saja', 'Jabatan saja'], 'correct' => 1],
                    ['q' => 'Employee turnover yang tinggi mengindikasikan?', 'a' => ['Perusahaan berkembang', 'Masalah dalam kepuasan, budaya, atau kompensasi', 'Tidak ada artinya', 'Perusahaan efisien'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah fungsi utama manajemen SDM?', 'options' => ['Rekrutmen dan seleksi', 'Produksi barang', 'Pelatihan dan pengembangan', 'Penjualan produk'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode rekrutmen?', 'options' => ['Job posting internal', 'Undian acak', 'Headhunting', 'Penunjukan tanpa seleksi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah pendekatan pengembangan karyawan?', 'options' => ['On-the-job training', 'Tidak ada training', 'Coaching dan mentoring', 'Belajar sendiri saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk kompensasi karyawan?', 'options' => ['Gaji pokok', 'Hukuman', 'Tunjangan', 'Pengurangan hak'], 'correct' => [0, 2]],
                    ['q' => 'Manakah hak karyawan yang dilindungi undang-undang di Indonesia?', 'options' => ['Hak cuti tahunan', 'Hak tidak bekerja', 'Hak pesangon', 'Hak tidak masuk kerja'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan proses rekrutmen dan seleksi karyawan! Apa perbedaan rekrutmen internal dan eksternal?'],
                    ['q' => 'Apa yang dimaksud pelatihan dan pengembangan (training & development)? Jelaskan jenis-jenis pelatihan!'],
                    ['q' => 'Jelaskan sistem manajemen kinerja (performance management)! Bagaimana menetapkan KPI karyawan?'],
                    ['q' => 'Apa yang dimaksud dengan kompensasi dan benefit? Jelaskan faktor-faktor yang mempengaruhi penetapan gaji!'],
                    ['q' => 'Bagaimana cara membangun budaya organisasi yang positif? Jelaskan peran HR dalam employee engagement!'],
                ],
            ],

            'Perilaku Organisasi' => [
                'pg' => [
                    ['q' => 'Teori motivasi Maslow menyatakan bahwa kebutuhan manusia tersusun secara?', 'a' => ['Acak', 'Hierarki dari kebutuhan dasar hingga aktualisasi diri', 'Sejajar semua sama penting', 'Dari paling tinggi ke dasar'], 'correct' => 1],
                    ['q' => 'Kepemimpinan transformasional berfokus pada?', 'a' => ['Penghargaan transaksional saja', 'Menginspirasi dan mengubah motivasi bawahan untuk tujuan lebih tinggi', 'Kontrol ketat', 'Hukuman kesalahan'], 'correct' => 1],
                    ['q' => 'Konflik dalam organisasi tidak selalu negatif karena?', 'a' => ['Konflik selalu buruk', 'Konflik fungsional dapat mendorong inovasi dan peningkatan kinerja', 'Konflik menguras energi saja', 'Konflik tidak ada manfaatnya'], 'correct' => 1],
                    ['q' => 'Groupthink dalam organisasi terjadi ketika?', 'a' => ['Anggota kelompok berpendapat berbeda-beda', 'Tekanan konformitas menekan pemikiran kritis', 'Kelompok terlalu kecil', 'Tidak ada pemimpin'], 'correct' => 1],
                    ['q' => 'Budaya organisasi (organizational culture) mempengaruhi?', 'a' => ['Hanya penampilan kantor', 'Perilaku, keputusan, dan kinerja seluruh anggota organisasi', 'Hanya seragam karyawan', 'Hanya slogan perusahaan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah teori motivasi yang valid?', 'options' => ["Maslow's Hierarchy", 'Theory X saja', 'Herzberg Two-Factor', 'Theory Z saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah gaya kepemimpinan?', 'options' => ['Transformasional', 'Invisible leadership', 'Transaksional', 'No leadership'], 'correct' => [0, 2]],
                    ['q' => 'Manakah faktor yang mempengaruhi kepuasan kerja?', 'options' => ['Kondisi kerja', 'Warna kantor saja', 'Hubungan dengan rekan', 'Desain logo'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis kekuasaan dalam organisasi?', 'options' => ['Kekuasaan posisional', 'Kekuasaan fisik', 'Kekuasaan personal', 'Kekuasaan supernatural'], 'correct' => [0, 2]],
                    ['q' => 'Manakah dimensi budaya organisasi (Schein)?', 'options' => ['Artefak', 'Nilai keuangan saja', 'Nilai-nilai', 'Keuntungan saja'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan teori motivasi Maslow dan Herzberg! Apa implikasi keduanya bagi manajer?'],
                    ['q' => 'Apa perbedaan kepemimpinan transformasional dan transaksional? Mana yang lebih efektif?'],
                    ['q' => 'Jelaskan dinamika kelompok dalam organisasi! Apa yang dimaksud groupthink dan bagaimana mencegahnya?'],
                    ['q' => 'Apa yang dimaksud budaya organisasi? Bagaimana budaya mempengaruhi kinerja?'],
                    ['q' => 'Jelaskan pendekatan manajemen konflik dalam organisasi! Kapan konflik bisa menjadi konstruktif?'],
                ],
            ],

            'Kewirausahaan' => [
                'pg' => [
                    ['q' => 'Lean Startup Methodology menekankan?', 'a' => ['Perencanaan panjang sebelum launch', 'Build-Measure-Learn cycle dengan minimum viable product', 'Pendanaan besar di awal', 'Meniru kompetitor'], 'correct' => 1],
                    ['q' => 'Business Model Canvas terdiri dari berapa blok?', 'a' => ['5 blok', '7 blok', '9 blok', '12 blok'], 'correct' => 2],
                    ['q' => 'Elevator pitch adalah?', 'a' => ['Presentasi panjang investor', 'Penjelasan singkat bisnis dalam waktu sangat terbatas (30-60 detik)', 'Negosiasi gaji', 'Rapat manajemen'], 'correct' => 1],
                    ['q' => 'Venture capital (VC) biasanya berinvestasi pada?', 'a' => ['Bisnis stabil mapan', 'Startup berpotensi tinggi dengan pertumbuhan cepat', 'Hanya properti', 'Hanya saham'], 'correct' => 1],
                    ['q' => 'Minimum Viable Product (MVP) adalah?', 'a' => ['Produk akhir yang sempurna', 'Versi produk dengan fitur minimum untuk validasi hipotesis pasar', 'Prototype tanpa fungsi', 'Produk termurah'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen Business Model Canvas?', 'options' => ['Value Proposition', 'Employee salary', 'Customer Segments', 'Office location'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sumber pendanaan startup?', 'options' => ['Bootstrapping', 'Magic money', 'Angel investor', 'Free money'], 'correct' => [0, 2]],
                    ['q' => 'Manakah karakteristik entrepreneur?', 'options' => ['Risk-taking', 'Risk avoidance always', 'Innovative thinking', 'Status quo always'], 'correct' => [0, 2]],
                    ['q' => 'Manakah analisis yang digunakan dalam perencanaan bisnis?', 'options' => ['SWOT Analysis', 'Zodiac Analysis', 'PESTLE Analysis', 'Horoscope Analysis'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tahapan perkembangan startup?', 'options' => ['Ideation', 'Death stage', 'Growth', 'No stage'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan metodologi Lean Startup! Apa yang dimaksud dengan Build-Measure-Learn cycle?'],
                    ['q' => 'Apa itu Business Model Canvas? Jelaskan 9 bloknya secara ringkas!'],
                    ['q' => 'Jelaskan tahapan pendanaan startup dari seed funding hingga IPO!'],
                    ['q' => 'Bagaimana cara melakukan validasi ide bisnis sebelum membangun produk penuh?'],
                    ['q' => 'Jelaskan perbedaan antara entrepreneur dan intrapreneur! Apa tantangan masing-masing?'],
                ],
            ],

            'Manajemen Operasi' => [
                'pg' => [
                    ['q' => 'Manajemen operasi berfokus pada?', 'a' => ['Keuangan perusahaan', 'Merancang, mengelola, dan meningkatkan proses penciptaan nilai', 'Pemasaran produk', 'Manajemen SDM'], 'correct' => 1],
                    ['q' => 'Capacity utilization mengukur?', 'a' => ['Kualitas produk', 'Seberapa besar kapasitas yang digunakan dibanding kapasitas maksimum', 'Biaya produksi', 'Jumlah karyawan'], 'correct' => 1],
                    ['q' => 'Service level agreement (SLA) dalam operasi layanan mengatur?', 'a' => ['Harga layanan saja', 'Standar kualitas dan waktu respon layanan yang disepakati', 'Jumlah karyawan', 'Lokasi kantor'], 'correct' => 1],
                    ['q' => 'Process improvement menggunakan siklus PDCA. P singkatan dari?', 'a' => ['Perform', 'Plan', 'Process', 'Produce'], 'correct' => 1],
                    ['q' => 'Outsourcing dalam manajemen operasi dilakukan ketika?', 'a' => ['Semua aktivitas lebih baik dioutsource', 'Aktivitas bukan core competency lebih efisien jika dilakukan pihak luar', 'Tidak ada tenaga kerja', 'Biaya tidak menjadi pertimbangan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah keputusan strategis dalam manajemen operasi?', 'options' => ['Desain produk/jasa', 'Desain seragam saja', 'Strategi lokasi', 'Warna bangunan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk dalam produktivitas operasi?', 'options' => ['Labor productivity', 'Popularity measure', 'Capital productivity', 'Color productivity'], 'correct' => [0, 2]],
                    ['q' => 'Manakah strategi peningkatan proses?', 'options' => ['PDCA Cycle', 'Status quo', 'Kaizen', 'Do nothing'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk trade-off dalam operasi?', 'options' => ['Cost vs quality', 'Night vs day', 'Speed vs cost', 'Hot vs cold'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tools untuk pemetaan proses?', 'options' => ['Value Stream Mapping', 'Mood board', 'SIPOC diagram', 'Inspiration board'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan ruang lingkup manajemen operasi dan keputusan-keputusan strategis yang terlibat!'],
                    ['q' => 'Apa yang dimaksud dengan produktivitas dalam manajemen operasi? Bagaimana cara mengukur dan meningkatkannya?'],
                    ['q' => 'Jelaskan konsep PDCA (Plan-Do-Check-Act) dalam peningkatan proses operasi!'],
                    ['q' => 'Bagaimana cara merancang tata letak fasilitas (facility layout) yang efisien?'],
                    ['q' => 'Jelaskan pertimbangan dalam keputusan make-or-buy (insourcing vs outsourcing)!'],
                ],
            ],

            // AKUNTANSI (AKT)
            'Akuntansi Keuangan' => [
                'pg' => [
                    ['q' => 'Persamaan dasar akuntansi adalah?', 'a' => ['Aset = Liabilitas + Ekuitas', 'Aset = Pendapatan - Beban', 'Liabilitas = Aset + Ekuitas', 'Ekuitas = Aset - Pendapatan'], 'correct' => 0],
                    ['q' => 'Laporan posisi keuangan (neraca) menunjukkan?', 'a' => ['Aliran kas', 'Posisi keuangan pada titik waktu tertentu', 'Kinerja selama periode', 'Perubahan ekuitas'], 'correct' => 1],
                    ['q' => 'Metode penyusutan garis lurus (straight-line) menghitung biaya penyusutan secara?', 'a' => ['Semakin besar setiap tahun', 'Sama setiap tahun', 'Semakin kecil setiap tahun', 'Tidak tentu'], 'correct' => 1],
                    ['q' => 'Prinsip akrual dalam akuntansi berarti?', 'a' => ['Transaksi dicatat saat kas diterima', 'Transaksi dicatat saat terjadi, bukan saat kas berpindah', 'Hanya mencatat pemasukan', 'Mencatat saat jatuh tempo saja'], 'correct' => 1],
                    ['q' => 'Goodwill dalam akuntansi timbul dari?', 'a' => ['Pembelian mesin', 'Akuisisi perusahaan lain di atas nilai aset neto', 'Kenaikan harga saham', 'Pembayaran utang'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah laporan keuangan utama (PSAK/IFRS)?', 'options' => ['Laporan Laba Rugi', 'Laporan cuaca', 'Neraca (Laporan Posisi Keuangan)', 'Laporan olahraga'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk aset lancar?', 'options' => ['Kas', 'Tanah', 'Piutang usaha', 'Mesin'], 'correct' => [0, 2]],
                    ['q' => 'Manakah metode penilaian persediaan?', 'options' => ['FIFO (First In First Out)', 'LIFO (Last In Last Out)', 'Average cost', 'Maximum cost'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prinsip akuntansi yang diakui?', 'options' => ['Prinsip accrual', 'Prinsip tebak-tebakan', 'Prinsip konsistensi', 'Prinsip acak'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk liabilitas jangka panjang?', 'options' => ['Obligasi jangka panjang', 'Utang usaha', 'Utang bank jangka panjang', 'Utang gaji'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan siklus akuntansi dari transaksi hingga penyusunan laporan keuangan!'],
                    ['q' => 'Apa yang dimaksud dengan prinsip accrual? Bagaimana perbedaannya dengan cash basis accounting?'],
                    ['q' => 'Jelaskan laporan laba rugi komprehensif! Apa perbedaan antara laba kotor, operasional, dan bersih?'],
                    ['q' => 'Bagaimana metode FIFO, LIFO, dan Average digunakan dalam penilaian persediaan? Apa dampaknya terhadap laporan keuangan?'],
                    ['q' => 'Jelaskan konsep penyusutan aset tetap! Bandingkan metode garis lurus dan metode saldo menurun!'],
                ],
            ],

            'Akuntansi Manajemen' => [
                'pg' => [
                    ['q' => 'Perbedaan utama akuntansi manajemen dengan akuntansi keuangan?', 'a' => ['Mengikuti PSAK', 'Untuk pihak eksternal', 'Untuk pengambilan keputusan internal', 'Diaudit eksternal'], 'correct' => 2],
                    ['q' => 'Biaya relevan dalam pengambilan keputusan adalah?', 'a' => ['Biaya historis saja', 'Biaya yang berbeda antar alternatif dan mempengaruhi keputusan', 'Biaya tetap saja', 'Semua biaya tanpa terkecuali'], 'correct' => 1],
                    ['q' => 'Break-even point (BEP) terjadi ketika?', 'a' => ['Pendapatan melebihi total biaya', 'Total pendapatan sama dengan total biaya (laba = 0)', 'Hanya biaya variabel tertutup', 'Hanya biaya tetap tertutup'], 'correct' => 1],
                    ['q' => 'Activity-Based Costing (ABC) lebih akurat dari traditional costing karena?', 'a' => ['Lebih sederhana', 'Mengalokasikan overhead berdasarkan aktivitas yang sebenarnya mengonsumsi sumber daya', 'Lebih murah', 'Mengabaikan overhead'], 'correct' => 1],
                    ['q' => 'Contribution margin adalah?', 'a' => ['Laba bersih', 'Selisih antara pendapatan dan biaya variabel', 'Biaya tetap', 'Margin keuntungan total'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis biaya berdasarkan perilakunya?', 'options' => ['Biaya tetap (fixed cost)', 'Biaya dekoratif', 'Biaya variabel', 'Biaya imajinasi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah teknik analisis biaya dalam akuntansi manajemen?', 'options' => ['Cost-Volume-Profit analysis', 'Color analysis', 'Break-even analysis', 'Shape analysis'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis anggaran (budget)?', 'options' => ['Anggaran penjualan', 'Anggaran imajinasi', 'Anggaran produksi', 'Anggaran harapan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk biaya produksi?', 'options' => ['Bahan baku langsung', 'Biaya pemasaran', 'Tenaga kerja langsung', 'Biaya administrasi'], 'correct' => [0, 2]],
                    ['q' => 'Manakah ukuran kinerja dalam balanced scorecard?', 'options' => ['Perspektif keuangan', 'Perspektif cuaca', 'Perspektif pelanggan', 'Perspektif astrologi'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan biaya tetap dan biaya variabel! Bagaimana keduanya berperilaku terhadap perubahan volume?'],
                    ['q' => 'Apa yang dimaksud analisis CVP (Cost-Volume-Profit)? Jelaskan cara menghitung Break-Even Point!'],
                    ['q' => 'Jelaskan konsep Activity-Based Costing (ABC)! Mengapa lebih akurat dari traditional costing?'],
                    ['q' => 'Apa yang dimaksud dengan anggaran (budgeting)? Jelaskan proses penyusunan anggaran induk (master budget)!'],
                    ['q' => 'Jelaskan konsep Balanced Scorecard sebagai alat pengukuran kinerja! Jelaskan empat perspektifnya!'],
                ],
            ],

            'Audit' => [
                'pg' => [
                    ['q' => 'Tujuan utama audit laporan keuangan adalah?', 'a' => ['Mendeteksi semua kecurangan', 'Memberikan opini atas kewajaran penyajian laporan keuangan', 'Menyusun laporan keuangan', 'Mengelola risiko bisnis'], 'correct' => 1],
                    ['q' => 'Opini Wajar Tanpa Pengecualian (WTP/Unqualified) berarti?', 'a' => ['Ada kesalahan material', 'Laporan keuangan disajikan wajar sesuai standar', 'Audit tidak lengkap', 'Ada pembatasan ruang lingkup'], 'correct' => 1],
                    ['q' => 'Risiko audit (audit risk) merupakan kombinasi dari?', 'a' => ['Risiko bisnis saja', 'Inherent risk × Control risk × Detection risk', 'Fraud risk saja', 'Business risk × Legal risk'], 'correct' => 1],
                    ['q' => 'Materialitas dalam audit digunakan untuk?', 'a' => ['Menentukan biaya audit', 'Menentukan ambang batas salah saji yang signifikan bagi pengguna', 'Mengatur tim audit', 'Membuat laporan'], 'correct' => 1],
                    ['q' => 'Internal control dalam audit mencakup?', 'a' => ['Kontrol keuangan saja', 'Control environment, risk assessment, control activities, information, monitoring', 'Kontrol operasional saja', 'Hanya pengendalian fisik'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis opini audit?', 'options' => ['Wajar Tanpa Pengecualian (WTP)', 'Opini sempurna', 'Tidak Memberikan Pendapat (TMP)', 'Opini baik'], 'correct' => [0, 2]],
                    ['q' => 'Manakah prosedur audit yang umum?', 'options' => ['Konfirmasi', 'Imajinasi', 'Inspeksi', 'Dugaan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen risiko audit?', 'options' => ['Inherent risk', 'Business risk', 'Control risk', 'Market risk'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis audit?', 'options' => ['Audit keuangan', 'Audit makanan', 'Audit operasional', 'Audit hiburan'], 'correct' => [0, 2]],
                    ['q' => 'Manakah standar audit yang berlaku di Indonesia?', 'options' => ['SPAP (Standar Profesional Akuntan Publik)', 'GAAP Amerika', 'ISA (International Standards on Auditing)', 'Standar informal'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tujuan audit laporan keuangan dan standar umum yang berlaku!'],
                    ['q' => 'Apa yang dimaksud dengan risiko audit? Jelaskan komponen inherent risk, control risk, dan detection risk!'],
                    ['q' => 'Jelaskan konsep materialitas dalam audit! Bagaimana auditor menetapkan batas materialitas?'],
                    ['q' => 'Jelaskan framework COSO untuk internal control! Apa saja komponen-komponennya?'],
                    ['q' => 'Apa perbedaan antara audit eksternal dan audit internal? Jelaskan peran masing-masing!'],
                ],
            ],

            'Perpajakan' => [
                'pg' => [
                    ['q' => 'PPh Pasal 21 dikenakan atas?', 'a' => ['Penghasilan bunga bank', 'Penghasilan dari pekerjaan atau jasa orang pribadi', 'Omzet penjualan', 'Dividen perusahaan'], 'correct' => 1],
                    ['q' => 'PPN (Pajak Pertambahan Nilai) di Indonesia berlaku tarif standar?', 'a' => ['5%', '10%', '11%', '12%'], 'correct' => 2],
                    ['q' => 'Self-assessment system dalam perpajakan berarti?', 'a' => ['Pajak dihitung negara', 'Wajib pajak menghitung, menyetor, dan melaporkan sendiri', 'Pajak dihitung bank', 'Pajak dipotong pemberi kerja saja'], 'correct' => 1],
                    ['q' => 'NPWP (Nomor Pokok Wajib Pajak) berfungsi sebagai?', 'a' => ['Nomor rekening pajak', 'Identitas wajib pajak dalam administrasi perpajakan', 'Nomor seri faktur', 'Kode pembayaran'], 'correct' => 1],
                    ['q' => 'Tax planning dalam manajemen perpajakan bertujuan untuk?', 'a' => ['Menghindari pajak secara ilegal', 'Meminimalkan beban pajak secara legal melalui perencanaan yang tepat', 'Menunda pembayaran saja', 'Memperbesar biaya perusahaan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis pajak berdasarkan pemungutnya?', 'options' => ['Pajak pusat', 'Pajak swasta', 'Pajak daerah', 'Pajak individu saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah pajak penghasilan yang berlaku di Indonesia?', 'options' => ['PPh Pasal 21', 'PPh Pasal 100', 'PPh Pasal 25', 'PPh Pasal 99'], 'correct' => [0, 2]],
                    ['q' => 'Manakah kewajiban Wajib Pajak di Indonesia?', 'options' => ['Mendaftarkan diri (NPWP)', 'Membayar pajak orang lain', 'Melaporkan SPT', 'Mengabaikan pajak'], 'correct' => [0, 2]],
                    ['q' => 'Manakah subjek pajak penghasilan (PPh)?', 'options' => ['Orang pribadi', 'Hewan peliharaan', 'Badan usaha', 'Tanah kosong saja'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk objek PPN?', 'options' => ['Penyerahan Barang Kena Pajak', 'Jual beli saham', 'Penyerahan Jasa Kena Pajak', 'Hibah antar keluarga'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan sistem self-assessment dalam perpajakan Indonesia! Apa kewajiban wajib pajak dalam sistem ini?'],
                    ['q' => 'Jelaskan mekanisme perhitungan PPh Pasal 21 untuk karyawan tetap! Apa yang dimaksud PTKP dan PKP?'],
                    ['q' => 'Apa yang dimaksud PPN? Jelaskan mekanisme pajak masukan dan pajak keluaran!'],
                    ['q' => 'Jelaskan perbedaan antara tax avoidance, tax evasion, dan tax planning!'],
                    ['q' => 'Jelaskan konsep transfer pricing dalam perpajakan internasional dan potensi penyalahgunaannya!'],
                ],
            ],

            'Sistem Informasi Akuntansi' => [
                'pg' => [
                    ['q' => 'SIA (Sistem Informasi Akuntansi) bertujuan untuk?', 'a' => ['Mengotomasi pemasaran', 'Mengumpulkan, memproses, dan melaporkan data keuangan secara efisien', 'Mengelola SDM', 'Mengoptimalkan logistik'], 'correct' => 1],
                    ['q' => 'Siklus pengeluaran (expenditure cycle) dalam SIA mencakup?', 'a' => ['Penjualan ke pelanggan', 'Pembelian dan pembayaran kepada pemasok', 'Penggajian karyawan saja', 'Pendapatan saja'], 'correct' => 1],
                    ['q' => 'Jejak audit (audit trail) dalam SIA penting karena?', 'a' => ['Mempercepat transaksi', 'Memungkinkan penelusuran setiap transaksi dari sumber ke laporan', 'Menghemat penyimpanan', 'Meningkatkan kecepatan'], 'correct' => 1],
                    ['q' => 'ERP mendukung SIA dengan cara?', 'a' => ['Mengotomasi marketing saja', 'Mengintegrasikan data keuangan dari seluruh fungsi bisnis dalam satu sistem', 'Memisahkan data keuangan', 'Menghapus jurnal manual'], 'correct' => 1],
                    ['q' => 'Pengendalian preventif dalam SIA mencakup?', 'a' => ['Audit setelah kejadian', 'Kontrol akses, otorisasi, dan validasi input untuk mencegah kesalahan', 'Laporan setelah kesalahan', 'Backup data saja'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah siklus bisnis dalam SIA?', 'options' => ['Siklus pendapatan', 'Siklus cuaca', 'Siklus pengeluaran', 'Siklus alam'], 'correct' => [0, 2]],
                    ['q' => 'Manakah komponen SIA?', 'options' => ['People (pengguna)', 'Flora', 'Data (transaksi)', 'Fauna'], 'correct' => [0, 2]],
                    ['q' => 'Manakah kontrol dalam SIA?', 'options' => ['Input controls', 'Color controls', 'Output controls', 'Smell controls'], 'correct' => [0, 2]],
                    ['q' => 'Manakah ancaman terhadap SIA?', 'options' => ['Fraud keuangan', 'Cuaca buruk', 'Hacking sistem', 'Bencana alam (banjir)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah software SIA yang umum digunakan?', 'options' => ['SAP FI/CO', 'Instagram', 'Accurate Online', 'TikTok'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan komponen-komponen SIA dan bagaimana mereka berinteraksi untuk menghasilkan informasi keuangan!'],
                    ['q' => 'Jelaskan siklus pendapatan dalam SIA! Apa saja aktivitas dan dokumen yang terlibat?'],
                    ['q' => 'Apa yang dimaksud dengan pengendalian internal dalam SIA? Jelaskan jenis-jenis pengendalian yang diterapkan!'],
	                ],
            ],
            //Ilmu Hukum
             'Hukum Perdata' => [
                'pg' => [
                    ['q' => 'Asas dalam perjanjian yang menyatakan bahwa perjanjian yang dibuat berlaku sebagai undang-undang bagi yang membuatnya disebut?', 'a' => ['Pacta sunt servanda', 'Asas konsensualisme', 'Asas kebebasan berkontrak', 'Asas personalitas'], 'correct' => 0],
                    ['q' => 'Menurut KUH Perdata, syarat sahnya suatu perjanjian diatur dalam pasal?', 'a' => ['1320', '1338', '1457', '1233'], 'correct' => 0],
                    ['q' => 'Perbuatan melanggar hukum dalam KUH Perdata diatur dalam Pasal?', 'a' => ['1365', '1266', '1338', '1444'], 'correct' => 0],
                    ['q' => 'Hak kebendaan yang memberikan kenikmatan sepenuhnya atas suatu benda disebut?', 'a' => ['Hak pakai', 'Hak milik', 'Hak gadai', 'Hak memungut hasil'], 'correct' => 1],
                    ['q' => 'Apabila debitur tidak memenuhi kewajiban dalam perjanjian, disebut dengan?', 'a' => ['Overmacht', 'Wanprestasi', 'Ganti rugi', 'Pembatalan'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk syarat sahnya perjanjian menurut Pasal 1320 KUH Perdata?', 'options' => ['Kesepakatan para pihak', 'Bentuk tertulis di notaris', 'Kecakapan untuk membuat perikatan', 'Objek yang halal'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah yang merupakan subjek hukum perdata?', 'options' => ['Orang (Natuurlijke persoon)', 'Hewan peliharaan', 'Badan hukum (Rechtspersoon)', 'Benda tak bergerak'], 'correct' => [0, 2]],
                    ['q' => 'Manakah bentuk wanprestasi yang umum terjadi?', 'options' => ['Terlambat memenuhi prestasi', 'Melakukan apa yang tidak boleh dilakukan', 'Sengaja merusak barang', 'Tidak memenuhi prestasi sama sekali'], 'correct' => [0, 3]],
                    ['q' => 'Manakah yang termasuk benda dalam pengertian hukum perdata?', 'options' => ['Benda bergerak', 'Benda tidak berwujud', 'Benda abstrak imajiner', 'Benda tidak bergerak'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah cara berakhirnya suatu perikatan?', 'options' => ['Pembayaran', 'Kesepakatan', 'Kompensasi cuaca', 'Pemusnahan barang yang terutang'], 'correct' => [0, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan empat syarat sahnya perjanjian menurut Pasal 1320 KUH Perdata dan akibat hukum jika salah satu syarat tidak terpenuhi!'],
                    ['q' => 'Apa yang dimaksud dengan wanprestasi? Sebutkan bentuk-bentuk wanprestasi dan upaya hukum yang dapat dilakukan oleh kreditur!'],
                    ['q' => 'Jelaskan perbedaan antara benda bergerak dan benda tidak bergerak beserta contoh dan signifikansinya dalam hukum perdata!'],
                    ['q' => 'Jelaskan konsep perbuatan melawan hukum (onrechtmatige daad) menurut Pasal 1365 KUH Perdata dan unsur-unsurnya!'],
                    ['q' => 'Bagaimana proses hapusnya perikatan berdasarkan ketentuan Kitab Undang-Undang Hukum Perdata?'],
                ],
            ],

            'Hukum Pidana' => [
                'pg' => [
                    ['q' => 'Asas yang menyatakan bahwa tiada suatu perbuatan dapat dipidana kecuali atas kekuatan aturan pidana dalam undang-undang yang telah ada sebelum perbuatan dilakukan disebut asas?', 'a' => ['Teritorial', 'Legalitas', 'Nasionalitas', 'Universal'], 'correct' => 1],
                    ['q' => 'Percobaan melakukan tindak pidana diatur dalam Kitab Undang-Undang Hukum Pidana (KUHP) pada Pasal?', 'a' => ['53', '55', '338', '340'], 'correct' => 0],
                    ['q' => 'Pelaku yang menyuruh melakukan tindak pidana disebut?', 'a' => ['Medeplegen', 'Doen plegen', 'Uitlokker', 'Pleger'], 'correct' => 1],
                    ['q' => 'Tindak pidana yang dilakukan dengan kesengajaan (dolus) berarti pelaku?', 'a' => ['Melakukan karena keliru', 'Menghendaki dan mengetahui perbuatan serta akibatnya', 'Tidak sengaja', 'Melakukan karena terpaksa'], 'correct' => 1],
                    ['q' => 'Alasan penghapus pidana yang berasal dari luar diri pelaku disebut?', 'a' => ['Noodweer (pembelaan terpaksa)', 'Overmacht (daya paksa)', 'Gila', 'Perintah undang-undang'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk dalam jenis pidana pokok menurut KUHP?', 'options' => ['Pidana mati', 'Pidana penjara', 'Pidana pengawasan', 'Pidana denda'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah yang termasuk alasan pembenar yang menghapus sifat melawan hukum dari perbuatan?', 'options' => ['Daya paksa (overmacht)', 'Pembelaan terpaksa (noodweer)', 'Menjalankan undang-undang', 'Sakit jiwa'], 'correct' => [1, 2]],
                    ['q' => 'Manakah bentuk penyertaan (deelneming) dalam tindak pidana?', 'options' => ['Melakukan sendiri (pleger)', 'Membantu (medeplichtige)', 'Menggerakkan (uitlokker)', 'Membela diri sendiri'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk unsur subjektif dari suatu tindak pidana?', 'options' => ['Niat (voornemen)', 'Akibat perbuatan', 'Kesalahan (schuld)', 'Sifat melawan hukum'], 'correct' => [0, 2]],
                    ['q' => 'Manakah jenis pidana tambahan menurut KUHP?', 'options' => ['Pencabutan hak-hak tertentu', 'Perampasan barang tertentu', 'Pidana kurungan', 'Pengumuman putusan hakim'], 'correct' => [0, 1, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan asas legalitas dalam hukum pidana Indonesia dan sebutkan pengecualiannya jika ada!'],
                    ['q' => 'Apa yang dimaksud dengan delik dolus (sengaja) dan delik culpa (kealpaan)? Berikan contoh untuk masing-masing!'],
                    ['q' => 'Uraikan bentuk-bentuk penyertaan (deelneming) dalam melakukan tindak pidana menurut KUHP!'],
                    ['q' => 'Jelaskan perbedaan antara alasan pembenar dan alasan pemaaf dalam hukum pidana, beserta contohnya!'],
                    ['q' => 'Jelaskan tahapan percobaan tindak pidana (poging) dan syarat-syarat pemidanaannya menurut Pasal 53 KUHP!'],
                ],
            ],

            'Hukum Tata Negara' => [
                'pg' => [
                    ['q' => 'Lembaga yang berwenang untuk menguji undang-undang terhadap Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 adalah?', 'a' => ['Mahkamah Agung', 'Mahkamah Konstitusi', 'Komisi Yudisial', 'DPR'], 'correct' => 1],
                    ['q' => 'Sistem pemerintahan yang dianut oleh Negara Kesatuan Republik Indonesia berdasarkan UUD 1945 adalah?', 'a' => ['Parlementer', 'Presidensial', 'Semipresidensial', 'Monarki konstitusional'], 'correct' => 1],
                    ['q' => 'Lembaga negara yang memegang kekuasaan membentuk undang-undang adalah?', 'a' => ['Presiden', 'DPR', 'MPR', 'DPD'], 'correct' => 1],
                    ['q' => 'Hak DPR untuk meminta keterangan kepada Pemerintah mengenai kebijakan pemerintah yang penting dan strategis disebut hak?', 'a' => ['Angket', 'Interpelasi', 'Petisi', 'Pendapat'], 'correct' => 1],
                    ['q' => 'Perubahan (amandemen) terhadap UUD 1945 dilakukan sebanyak berapa kali?', 'a' => ['2 kali', '3 kali', '4 kali', '5 kali'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk lembaga yudikatif di Indonesia?', 'options' => ['Mahkamah Agung', 'Presiden', 'Mahkamah Konstitusi', 'DPR'], 'correct' => [0, 2]],
                    ['q' => 'Manakah hak yang dimiliki oleh Dewan Perwakilan Rakyat (DPR)?', 'options' => ['Hak interpelasi', 'Hak angket', 'Hak veto', 'Hak menyatakan pendapat'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah bentuk susunan negara dan pemerintahan yang sah menurut UUD 1945?', 'options' => ['Negara kesatuan', 'Negara federal', 'Republik', 'Monarki absolut'], 'correct' => [0, 2]],
                    ['q' => 'Manakah tugas dan wewenang MPR setelah amandemen?', 'options' => ['Mengubah dan menetapkan UUD', 'Memilih Presiden dan Wakil Presiden', 'Melantik Presiden dan/atau Wakil Presiden', 'Menetapkan Garis-Garis Besar Haluan Negara'], 'correct' => [0, 2]],
                    ['q' => 'Manakah sumber hukum tata negara di Indonesia?', 'options' => ['UUD 1945', 'Yurisprudensi perdata', 'Konvensi ketatanegaraan', 'Hukum kebiasaan internasional'], 'correct' => [0, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan pembagian kekuasaan (Trias Politica) dalam sistem ketatanegaraan Republik Indonesia!'],
                    ['q' => 'Apa perbedaan mendasar antara sistem pemerintahan Presidensial dan Parlementer? Mengapa Indonesia memilih Presidensial?'],
                    ['q' => 'Uraikan wewenang dari Mahkamah Konstitusi sebagaimana diatur dalam UUD 1945!'],
                    ['q' => 'Jelaskan fungsi legislasi, pengawasan, dan anggaran yang dimiliki oleh DPR!'],
                    ['q' => 'Bagaimana prosedur perubahan UUD 1945 berdasarkan Pasal 37 UUD 1945?'],
                ],
            ],

            'Hukum Internasional' => [
                'pg' => [
                    ['q' => 'Menurut Statuta Mahkamah Internasional Pasal 38, yang bukan merupakan sumber hukum internasional adalah?', 'a' => ['Perjanjian internasional', 'Keputusan pengadilan', 'Pendapat para ahli hukum', 'Resolusi Dewan Keamanan PBB'], 'correct' => 3],
                    ['q' => 'Subjek hukum internasional yang memegang peranan paling utama adalah?', 'a' => ['Individu', 'Negara', 'Organisasi internasional', 'Perusahaan multinasional'], 'correct' => 1],
                    ['q' => 'Asas yang menyatakan bahwa hukum internasional berlaku terhadap semua negara tanpa memandang batas wilayah disebut asas?', 'a' => ['Teritorial', 'Kebangsaan', 'Universal', 'Kepentingan umum'], 'correct' => 2],
                    ['q' => 'Proses pengesahan suatu perjanjian internasional oleh suatu negara disebut?', 'a' => ['Signature', 'Ratification', 'Accession', 'Reservation'], 'correct' => 1],
                    ['q' => 'Organisasi internasional yang dibentuk untuk menjaga perdamaian dan keamanan dunia adalah?', 'a' => ['WTO', 'PBB (United Nations)', 'ASEAN', 'Uni Eropa'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk sumber hukum internasional menurut Statuta Mahkamah Internasional?', 'options' => ['Perjanjian internasional', 'Hukum kebiasaan internasional', 'Prinsip hukum umum', 'Hukum pidana lokal'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah subjek hukum internasional yang diakui?', 'options' => ['Negara', 'Tahta Suci (Vatikan)', 'Palang Merah Internasional', 'Individu sebagai pelaku bisnis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tahapan dalam pembuatan perjanjian internasional?', 'options' => ['Perundingan', 'Penandatanganan', 'Ratifikasi', 'Pemutusan sepihak'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah asas-asas yurisdiksi dalam hukum internasional?', 'options' => ['Asas teritorial', 'Asas nasionalitas aktif', 'Asas perlindungan', 'Asas diskriminasi'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah organ utama dari Perserikatan Bangsa-Bangsa (PBB)?', 'options' => ['Majelis Umum', 'Mahkamah Internasional', 'Dewan Keamanan', 'Organisasi Kesehatan Dunia (WHO)'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan sumber-sumber hukum internasional berdasarkan Pasal 38 Statuta Mahkamah Internasional!'],
                    ['q' => 'Bagaimana pengakuan (recognition) terhadap suatu negara dalam hukum internasional dan apa akibat hukumnya?'],
                    ['q' => 'Jelaskan perbedaan antara yurisdiksi teritorial dan yurisdiksi universal dalam hukum internasional!'],
                    ['q' => 'Apa itu ratifikasi? Mengapa proses ratifikasi penting bagi suatu negara dalam memberlakukan perjanjian internasional?'],
                    ['q' => 'Uraikan peran dan fungsi Mahkamah Internasional (International Court of Justice) dalam penyelesaian sengketa antarnegara!'],
                ],
            ],

            'Hukum Bisnis' => [
                'pg' => [
                    ['q' => 'Bentuk badan usaha yang modalnya terbagi atas saham-saham dan tanggung jawab pemegang saham terbatas pada nilai nominal sahamnya adalah?', 'a' => ['Firma', 'CV', 'Perseroan Terbatas (PT)', 'Koperasi'], 'correct' => 2],
                    ['q' => 'Undang-undang yang mengatur tentang Hak atas Kekayaan Intelektual berupa merek di Indonesia adalah?', 'a' => ['UU No. 28 Tahun 2014', 'UU No. 20 Tahun 2016', 'UU No. 13 Tahun 2016', 'UU No. 5 Tahun 1999'], 'correct' => 1],
                    ['q' => 'Larangan praktik monopoli dan persaingan usaha tidak sehat diatur oleh lembaga?', 'a' => ['KPK', 'KPPU', 'BPSK', 'OJK'], 'correct' => 1],
                    ['q' => 'Pernyataan kesanggupan untuk membayar sejumlah uang tertentu pada waktu yang telah ditentukan disebut?', 'a' => ['Cek', 'Bilyet giro', 'Promes (promissory note)', 'Akta otentik'], 'correct' => 2],
                    ['q' => 'Lembaga yang berwenang menyelesaikan sengketa antara konsumen dan pelaku usaha di luar pengadilan adalah?', 'a' => ['BPSK', 'Pengadilan Niaga', 'Kepolisian', 'Kementerian Perdagangan'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk bentuk persekutuan badan usaha bukan badan hukum?', 'options' => ['Firma', 'Perseroan Terbatas', 'Commanditaire Vennootschap (CV)', 'Perusahaan Umum (Perum)'], 'correct' => [0, 2]],
                    ['q' => 'Manakah yang termasuk Hak Kekayaan Intelektual (HKI)?', 'options' => ['Hak Cipta', 'Hak Paten', 'Rahasia Dagang', 'Hak Sewa'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah prinsip-prinsip dalam hukum perlindungan konsumen?', 'options' => ['Prinsip keamanan dan keselamatan', 'Prinsip kebebasan informasi', 'Prinsip pertanggungjawaban mutlak', 'Prinsip monopoli'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang dapat menyebabkan pailitnya suatu perusahaan?', 'options' => ['Memiliki dua atau lebih kreditur', 'Tidak membayar utang yang telah jatuh tempo', 'Meningkatnya aset perusahaan', 'Adanya keputusan pengadilan niaga'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah klausul yang dilarang dalam perjanjian standar/baku konsumen?', 'options' => ['Klausul pengalihan tanggung jawab', 'Klausul sepihak', 'Klausul harga', 'Klausul penyelesaian sengketa'], 'correct' => [0, 1]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara Firma dan Perseroan Terbatas (PT) dalam aspek tanggung jawab pemilik modal!'],
                    ['q' => 'Apa yang dimaksud dengan HAKI (Hak atas Kekayaan Intelektual)? Mengapa perlindungan HAKI penting dalam dunia bisnis?'],
                    ['q' => 'Uraikan prosedur pengajuan kepailitan dan penundaan kewajiban pembayaran utang (PKPU) berdasarkan UU Kepailitan!'],
                    ['q' => 'Jelaskan peran KPPU dalam menjaga iklim persaingan usaha yang sehat di Indonesia!'],
                    ['q' => 'Bagaimana perlindungan konsumen diatur dalam undang-undang terkait transaksi e-commerce?'],
                ],
            ],
            
            //Pendidikan Dokter 
             'Anatomi' => [
                'pg' => [
                    ['q' => 'Bidang imajiner yang membagi tubuh menjadi bagian depan dan belakang disebut bidang?', 'a' => ['Sagital', 'Koronal (Frontal)', 'Transversal', 'Median'], 'correct' => 1],
                    ['q' => 'Organ utama yang berfungsi sebagai sistem respirasi adalah?', 'a' => ['Jantung', 'Paru-paru', 'Hati', 'Lambung'], 'correct' => 1],
                    ['q' => 'Otot yang terletak di bagian depan paha dan berfungsi untuk ekstensi lutut adalah?', 'a' => ['Biceps femoris', 'Quadriceps femoris', 'Gastrocnemius', 'Deltoid'], 'correct' => 1],
                    ['q' => 'Jaringan yang berfungsi sebagai penyokong dan penghubung antar organ tubuh adalah?', 'a' => ['Epitel', 'Otot', 'Konektif/Penyambung', 'Saraf'], 'correct' => 2],
                    ['q' => 'Sistem saraf pusat (Central Nervous System) terdiri dari otak dan?', 'a' => ['Saraf kranial', 'Sumsum tulang belakang', 'Saraf simpatis', 'Saraf tepi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk organ sistem pencernaan?', 'options' => ['Lambung', 'Usus halus', 'Jantung', 'Hati'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah bagian penyusun rangka aksial?', 'options' => ['Tengkorak', 'Tulang belakang', 'Tulang paha', 'Tulang rusuk'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah yang termasuk jenis sendi berdasarkan strukturnya?', 'options' => ['Sendi fibrosa', 'Sendi kartilaginosa', 'Sendi sinovial', 'Sendi otot'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah lapisan kulit (integumen) utama?', 'options' => ['Epidermis', 'Hipodermis', 'Dermis', 'Endodermis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah ruang penyusun jantung?', 'options' => ['Atrium kanan', 'Ventrikel kiri', 'Aorta', 'Septum'], 'correct' => [0, 1]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan pembagian posisi anatomi tubuh manusia beserta terminologi arah dan bidangnya!'],
                    ['q' => 'Uraikan struktur sistem pernapasan manusia dari saluran napas atas hingga alveolus!'],
                    ['q' => 'Jelaskan perbedaan antara sistem saraf pusat dan sistem saraf tepi serta fungsinya masing-masing!'],
                    ['q' => 'Sebutkan empat jaringan utama penyusun tubuh manusia dan jelaskan fungsi dasarnya!'],
                    ['q' => 'Jelaskan anatomi makroskopis dari organ jantung dan aliran darah di dalamnya!'],
                ],
            ],

            'Fisiologi' => [
                'pg' => [
                    ['q' => 'Fungsi utama dari sel darah merah (eritrosit) adalah?', 'a' => ['Melawan infeksi', 'Membekukan darah', 'Mengangkut oksigen', 'Mengatur suhu tubuh'], 'correct' => 2],
                    ['q' => 'Hormon yang diproduksi oleh pankreas untuk menurunkan kadar gula darah adalah?', 'a' => ['Glukagon', 'Insulin', 'Adrenalin', 'Tiroksin'], 'correct' => 1],
                    ['q' => 'Proses mempertahankan kondisi internal yang stabil dalam tubuh disebut?', 'a' => ['Metabolisme', 'Homeostasis', 'Katabolisme', 'Respirasi'], 'correct' => 1],
                    ['q' => 'Organ utama tempat terjadinya penyerapan kembali (reabsorpsi) zat sisa pada ginjal adalah?', 'a' => ['Glomerulus', 'Tubulus kontortus proksimal', 'Lengkung Henle', 'Ureter'], 'correct' => 1],
                    ['q' => 'Bagian otak yang berfungsi mengatur keseimbangan dan koordinasi gerakan adalah?', 'a' => ['Serebrum', 'Serebelum', 'Medula oblongata', 'Talamus'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah fungsi dari sistem ekskresi manusia?', 'options' => ['Mengeluarkan keringat', 'Menyaring darah', 'Mengatur tekanan darah', 'Memompa darah'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah hormon yang berperan dalam sistem reproduksi wanita?', 'options' => ['Estrogen', 'Progesteron', 'Testosteron', 'FSH'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah yang termasuk organ aksesori sistem pencernaan?', 'options' => ['Hati', 'Pankreas', 'Kantung empedu', 'Usus besar'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi laju filtrasi glomerulus?', 'options' => ['Tekanan darah', 'Diameter arteriol', 'Kadar air tubuh', 'Suhu tubuh'], 'correct' => [0, 1]],
                    ['q' => 'Proses fisiologis apa saja yang terjadi saat tubuh berkeringat?', 'options' => ['Mendinginkan suhu tubuh', 'Mengeluarkan garam berlebih', 'Menaikkan tekanan darah', 'Membuang cairan'], 'correct' => [0, 1, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan mekanisme fisiologis bagaimana insulin dan glukagon bekerja sama mengatur kadar gula darah!'],
                    ['q' => 'Uraikan proses pembentukan urine di ginjal mulai dari filtrasi, reabsorpsi, hingga augmentasi!'],
                    ['q' => 'Bagaimana sistem saraf otonom (simpatis dan parasimpatis) merespons situasi stres dan relaksasi?'],
                    ['q' => 'Jelaskan fungsi fisiologis hemoglobin dalam proses transportasi oksigen dan karbon dioksida dalam darah!'],
                    ['q' => 'Jelaskan kerja refleks (refleks lengkung) pada sistem saraf dan pentingnya bagi kelangsungan hidup!'],
                ],
            ],

            'Biokimia' => [
                'pg' => [
                    ['q' => 'Monomer penyusun dari molekul protein adalah?', 'a' => ['Asam lemak', 'Glukosa', 'Asam amino', 'Nukleotida'], 'correct' => 2],
                    ['q' => 'Tempat utama berlangsungnya tahapan siklus Krebs di dalam sel adalah?', 'a' => ['Sitoplasma', 'Mitokondria', 'Nukleus', 'Retikulum endoplasma'], 'correct' => 1],
                    ['q' => 'Fungsi utama karbohidrat di dalam tubuh makhluk hidup adalah?', 'a' => ['Sumber energi utama', 'Pembentuk membran sel', 'Katalisator reaksi', 'Penyimpan informasi genetik'], 'correct' => 0],
                    ['q' => 'Senyawa organik yang bertindak sebagai katalis biologis untuk mempercepat reaksi adalah?', 'a' => ['Enzim', 'Vitamin', 'Hormon', 'Koenzim'], 'correct' => 0],
                    ['q' => 'Basa nitrogen yang hanya ditemukan pada molekul RNA dan bukan pada DNA adalah?', 'a' => ['Adenin', 'Guanin', 'Timin', 'Urasil'], 'correct' => 3],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk kelompok lipid?', 'options' => ['Trigliserida', 'Steroid', 'Fosfolipid', 'Selulosa'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi kerja enzim?', 'options' => ['Suhu', 'Derajat keasaman (pH)', 'Konsentrasi substrat', 'Warna substrat'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tahapan dalam proses respirasi sel?', 'options' => ['Glikolisis', 'Siklus Krebs', 'Transpor elektron', 'Fotosintesis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah komponen penyusun nukleotida?', 'options' => ['Gula pentosa', 'Basa nitrogen', 'Gugus fosfat', 'Asam amino'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah vitamin yang larut dalam lemak?', 'options' => ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'], 'correct' => [0, 2, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan struktur asam amino dan pembentukan ikatan peptida!'],
                    ['q' => 'Apa yang dimaksud dengan enzim? Jelaskan bagaimana mekanisme substrat berikatan pada sisi aktif enzim!'],
                    ['q' => 'Uraikan perbedaan antara DNA dan RNA baik dari segi struktur maupun fungsinya!'],
                    ['q' => 'Jelaskan tahapan proses glikolisis dan produk akhirnya!'],
                    ['q' => 'Jelaskan perbedaan antara asam lemak jenuh dan asam lemak tak jenuh, serta dampaknya terhadap kesehatan!'],
                ],
            ],

            'Patologi' => [
                'pg' => [
                    ['q' => 'Proses kematian sel yang terprogram atau biasa disebut "cell suicide" adalah?', 'a' => ['Nekrosis', 'Apoptosis', 'Atrofi', 'Hiperplasia'], 'correct' => 1],
                    ['q' => 'Peradangan (inflamasi) akut biasanya ditandai dengan 4 tanda utama (Celsus), yaitu rubor, kalor, dolor, dan?', 'a' => ['Tumor (pembengkakan)', 'Sepsis', 'Atrofi', 'Nekrosis'], 'correct' => 0],
                    ['q' => 'Karakteristik dari tumor ganas (malignant) antara lain?', 'a' => ['Tumbuh lambat', 'Batasnya jelas', 'Dapat bermetastasis (menyebar)', 'Berkapsul'], 'correct' => 2],
                    ['q' => 'Kondisi kematian jaringan lokal yang tidak mendapat suplai darah disebut?', 'a' => ['Edema', 'Nekrosis', 'Infark', 'Iskemik'], 'correct' => 2],
                    ['q' => 'Penyebab utama dari infeksi pada sindrom defisiensi imun (AIDS) adalah virus?', 'a' => ['Hepatitis B', 'HIV', 'Dengue', 'Influenza'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk tanda utama (gejala) peradangan akut?', 'options' => ['Kemerahan (rubor)', 'Panas (kalor)', 'Nyeri (dolor)', 'Kedinginan'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis adaptasi seluler?', 'options' => ['Hipertrofi', 'Hiperplasia', 'Metaplasia', 'Katabolisme'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah bentuk nekrosis yang dikenali?', 'options' => ['Nekrosis koagulatif', 'Nekrosis likuifaktif', 'Nekrosis kaseosa', 'Nekrosis seluler'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk proses penyembuhan luka?', 'options' => ['Fase inflamasi', 'Fase proliferasi', 'Fase remodeling', 'Fase nekrosis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi timbulnya penyakit (etiologi)?', 'options' => ['Genetika', 'Infeksi', 'Lingkungan', 'Astrologi'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara apoptosis dan nekrosis!'],
                    ['q' => 'Uraikan proses inflamasi atau peradangan akut mulai dari vasodilatasi hingga pembentukan pus!'],
                    ['q' => 'Jelaskan karakteristik dan perbedaan antara neoplasma jinak dan neoplasma ganas!'],
                    ['q' => 'Apa yang dimaksud dengan metastasis dan bagaimana sel kanker menyebar ke organ lain?'],
                    ['q' => 'Jelaskan patofisiologi terjadinya iskemia pada otot jantung dan akibatnya!'],
                ],
            ],

            'Farmakologi' => [
                'pg' => [
                    ['q' => 'Cabang farmakologi yang mempelajari efek tubuh terhadap obat (farmakokinetika) meliputi proses?', 'a' => ['Absorpsi, Distribusi, Metabolisme, Ekskresi', 'Reseptor dan agonis', 'Efek toksik', 'Dosis minimal'], 'correct' => 0],
                    ['q' => 'Rute pemberian obat yang memberikan efek paling cepat ke dalam sirkulasi darah adalah?', 'a' => ['Oral', 'Intravena (IV)', 'Topikal', 'Intramuskular'], 'correct' => 1],
                    ['q' => 'Obat yang bekerja dengan cara meniru atau mengaktifkan reseptor disebut?', 'a' => ['Antagonis', 'Agonis', 'Inhibitor', 'Placebo'], 'correct' => 1],
                    ['q' => 'Tempat utama terjadinya metabolisme obat di dalam tubuh manusia adalah?', 'a' => ['Ginjal', 'Hati (hepar)', 'Lambung', 'Paru-paru'], 'correct' => 1],
                    ['q' => 'Istilah untuk dosis yang menimbulkan efek toksik atau racun adalah?', 'a' => ['Dosis efektif', 'Dosis letal', 'Dosis toksik', 'Dosis pemeliharaan'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk proses farmakokinetik?', 'options' => ['Absorpsi', 'Distribusi', 'Ekskresi', 'Farmakodinamik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah rute pemberian obat yang umum digunakan?', 'options' => ['Oral', 'Intravena', 'Inhalasi', 'Laser'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi respons obat pada pasien?', 'options' => ['Usia', 'Berat badan', 'Genetika', 'Warna rambut'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah bentuk sediaan obat yang termasuk dalam sediaan cair?', 'options' => ['Sirup', 'Suspensi', 'Tablet', 'Larutan'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah jenis efek samping obat?', 'options' => ['Reaksi alergi', 'Efek toksik', 'Idiosinkrasi', 'Efek imajiner'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan empat proses utama dalam farmakokinetika (ADME)!'],
                    ['q' => 'Apa perbedaan antara agonis dan antagonis dalam farmakodinamika? Berikan contohnya!'],
                    ['q' => 'Uraikan rute pemberian obat secara oral dan faktor apa saja yang memengaruhi absorpsi obat di saluran cerna!'],
                    ['q' => 'Jelaskan peran enzim hati dalam metabolisme obat dan konsep first-pass effect!'],
                    ['q' => 'Apa yang dimaksud dengan indeks terapi? Mengapa hal tersebut penting dalam menentukan dosis obat?'],
                ],
            ],

            'Ilmu Klinik' => [
                'pg' => [
                    ['q' => 'Prosedur pengumpulan informasi riwayat penyakit pasien dengan cara wawancara disebut?', 'a' => ['Pemeriksaan fisik', 'Anamnesis', 'Pemeriksaan penunjang', 'Diagnosis'], 'correct' => 1],
                    ['q' => 'Persetujuan tindakan medis yang diberikan oleh pasien setelah mendapat penjelasan disebut?', 'a' => ['Informed consent', 'Rekam medis', 'Diagnosis', 'Terapi'], 'correct' => 0],
                    ['q' => 'Pemeriksaan fisik menggunakan stetoskop untuk mendengarkan suara organ dalam disebut?', 'a' => ['Inspeksi', 'Palpasi', 'Perkusi', 'Auskultasi'], 'correct' => 3],
                    ['q' => 'Dokumen yang berisi catatan lengkap mengenai kesehatan dan perawatan pasien disebut?', 'a' => ['Surat rujukan', 'Rekam medis', 'Resep dokter', 'Informed consent'], 'correct' => 1],
                    ['q' => 'Tindakan pencegahan terjadinya penyakit atau infeksi selama tindakan medis dikenal sebagai?', 'a' => ['Sterilisasi', 'Asepsis', 'Kuratif', 'Rehabilitasi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk metode dasar dalam pemeriksaan fisik?', 'options' => ['Inspeksi', 'Auskultasi', 'Palpasi', 'Refleksi'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah prinsip dasar etika kedokteran / profesi klinis?', 'options' => ['Beneficence (berbuat baik)', 'Non-maleficence (jangan merugikan)', 'Autonomy (otonomi)', 'Profitability (mencari untung)'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk pemeriksaan penunjang klinis?', 'options' => ['Pemeriksaan darah', 'Rontgen (X-ray)', 'USG', 'Wawancara pasien'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah komponen penting dalam informed consent?', 'options' => ['Risiko tindakan', 'Tujuan tindakan', 'Alternatif tindakan', 'Biaya tindakan'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis pelayanan kesehatan?', 'options' => ['Preventif', 'Kuratif', 'Rehabilitatif', 'Konstruksional'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tahapan yang dilakukan dalam manajemen klinis mulai dari anamnesis hingga penegakan diagnosis!'],
                    ['q' => 'Apa pentingnya informed consent dalam menjamin hak otonomi pasien?'],
                    ['q' => 'Uraikan 4 teknik pemeriksaan fisik dasar (inspeksi, palpasi, perkusi, auskultasi)!'],
                    ['q' => 'Jelaskan aspek kerahasiaan medis (medical secrecy) dan kewajiban klinisi dalam menjaganya!'],
                    ['q' => 'Apa perbedaan antara pelayanan kesehatan kuratif dan promotif? Berikan contohnya!'],
                ],
            ],

                //DKV
                 'Desain Grafis' => [
                'pg' => [
                    ['q' => 'Prinsip desain yang mengacu pada pembagian bobot visual secara sama atau seimbang disebut?', 'a' => ['Kontras', 'Kesatuan', 'Keseimbangan (Balance)', 'Irama'], 'correct' => 2],
                    ['q' => 'Format file gambar digital yang menggunakan grafik vektor dan tidak pecah saat diperbesar adalah?', 'a' => ['JPEG', 'PNG', 'SVG', 'GIF'], 'correct' => 2],
                    ['q' => 'Warna primer yang digunakan dalam proses pencetakan (printing) adalah?', 'a' => ['RGB', 'CMYK', 'HSV', 'LAB'], 'correct' => 1],
                    ['q' => 'Kerapatan jumlah piksel per inci pada gambar digital disebut dengan?', 'a' => ['Resolusi (DPI/PPI)', 'Dimensi', 'Skala', 'Proporsi'], 'correct' => 0],
                    ['q' => 'Jarak antar baris teks dalam desain grafis dikenal sebagai?', 'a' => ['Tracking', 'Kerning', 'Leading', 'Alignment'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk elemen dasar desain grafis?', 'options' => ['Garis', 'Bentuk (Shape)', 'Warna', 'Imajinasi'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk prinsip-prinsip desain?', 'options' => ['Keseimbangan', 'Irama (Rhythm)', 'Kontras', 'Kecepatan'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah format file gambar yang mendukung transparansi latar belakang?', 'options' => ['PNG', 'JPEG', 'GIF', 'SVG'], 'correct' => [0, 2, 3]],
                    ['q' => 'Manakah software yang digunakan untuk mengolah gambar berbasis vektor?', 'options' => ['Adobe Illustrator', 'CorelDRAW', 'Adobe Photoshop', 'Figma'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah jenis-jenis keseimbangan visual?', 'options' => ['Simetris', 'Asimetris', 'Radial', 'Vertikal'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan mendasar antara grafis berbasis vektor dan grafis berbasis raster!'],
                    ['q' => 'Sebutkan dan jelaskan prinsip-prinsip dasar dalam desain grafis!'],
                    ['q' => 'Mengapa mode warna RGB dan CMYK berbeda penggunaannya? Jelaskan fungsi masing-masing!'],
                    ['q' => 'Apa yang dimaksud dengan hierarki visual? Bagaimana cara menerapkannya dalam sebuah desain poster?'],
                    ['q' => 'Jelaskan fungsi dari elemen garis dan bentuk dalam menyampaikan pesan visual!'],
                ],
            ],

            'Tipografi' => [
                'pg' => [
                    ['q' => 'Kategori huruf yang memiliki garis-garis kecil atau kaki pada ujung huruf disebut?', 'a' => ['Sans-serif', 'Serif', 'Script', 'Display'], 'correct' => 1],
                    ['q' => 'Satuan ukuran tinggi huruf dalam tipografi adalah?', 'a' => ['Piksel', 'Inci', 'Point (pt)', 'Milimeter'], 'correct' => 2],
                    ['q' => 'Pengaturan jarak secara keseluruhan antara huruf di dalam satu kata atau kalimat disebut?', 'a' => ['Kerning', 'Leading', 'Tracking', 'Alignment'], 'correct' => 2],
                    ['q' => 'Anatomi huruf yang berupa garis vertikal atau bagian utama dari sebuah huruf disebut?', 'a' => ['Stem', 'Bowl', 'Serif', 'Ascender'], 'correct' => 0],
                    ['q' => 'Huruf yang tidak memiliki kait atau kaki pada ujungnya adalah?', 'a' => ['Serif', 'Sans-serif', 'Slab-serif', 'Monospace'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk klasifikasi huruf (typeface)?', 'options' => ['Serif', 'Sans-serif', 'Script', 'Vector'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah anatomi huruf (letterform) yang penting diketahui?', 'options' => ['Baseline', 'X-height', 'Ascender', 'Font size'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah hal yang memengaruhi keterbacaan (readability) teks?', 'options' => ['Pemilihan jenis huruf', 'Kontras warna teks dengan latar belakang', 'Ukuran huruf', 'Banyaknya gambar'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk satuan ukuran dalam tipografi?', 'options' => ['Point', 'Pica', 'Em', 'Centimeter'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang merupakan tujuan penggunaan hierarki tipografi?', 'options' => ['Menunjukkan bagian mana yang lebih penting', 'Membuat teks lebih menarik', 'Menghindari kebingungan pembaca', 'Mengurangi ukuran font'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara huruf Serif dan Sans-serif serta kapan waktu yang tepat untuk menggunakannya!'],
                    ['q' => 'Apa yang dimaksud dengan kerning dan tracking? Jelaskan perbedaannya!'],
                    ['q' => 'Uraikan elemen-elemen anatomi huruf seperti baseline, x-height, ascender, dan descender!'],
                    ['q' => 'Bagaimana tipografi yang baik dapat memengaruhi keterbacaan (readability) dan kemudahan dibaca (legibility)?'],
                    ['q' => 'Sebutkan jenis-jenis huruf yang termasuk kategori dekoratif atau script beserta karakteristiknya!'],
                ],
            ],

            'Ilustrasi' => [
                'pg' => [
                    ['q' => 'Jenis ilustrasi yang digunakan untuk menjelaskan suatu naskah atau cerita agar lebih menarik disebut?', 'a' => ['Ilustrasi komik', 'Ilustrasi vignet', 'Ilustrasi karya sastra', 'Ilustrasi medis'], 'correct' => 2],
                    ['q' => 'Teknik pewarnaan kering dalam ilustrasi dapat dilakukan menggunakan?', 'a' => ['Cat air', 'Pensil warna', 'Cat minyak', 'Tinta'], 'correct' => 1],
                    ['q' => 'Sketsa kasar yang dibuat berurutan untuk menggambarkan adegan dalam cerita disebut?', 'a' => ['Layout', 'Storyboard', 'Thumbnail', 'Vignette'], 'correct' => 1],
                    ['q' => 'Teknik perspektif yang menggunakan satu titik hilang di cakrawala disebut?', 'a' => ['Perspektif satu titik', 'Perspektif dua titik', 'Perspektif tiga titik', 'Perspektif isometrik'], 'correct' => 0],
                    ['q' => 'Ilustrasi bergaya karikatur biasanya bertujuan untuk?', 'a' => ['Menjelaskan fungsi alat', 'Melebih-lebihkan karakter wajah untuk tujuan humor/kritik', 'Memberikan informasi akurat', 'Membuat panduan medis'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk teknik dalam menggambar ilustrasi?', 'options' => ['Teknik arsir', 'Teknik dussel', 'Teknik pointilis', 'Teknik casting'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk media untuk ilustrasi manual?', 'options' => ['Kertas gambar', 'Tinta', 'Pensil', 'Digital tablet'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah gaya ilustrasi yang sering ditemukan dalam publikasi?', 'options' => ['Realistis', 'Karikatur', 'Abstrak', 'Programmer'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk elemen dasar dalam ilustrasi?', 'options' => ['Proporsi', 'Komposisi', 'Warna', 'Kecepatan'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah langkah awal dalam proses pembuatan ilustrasi?', 'options' => ['Menentukan tema/konsep', 'Membuat sketsa kasar', 'Mewarnai', 'Menambahkan teks'], 'correct' => [0, 1]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara ilustrasi dekoratif dan ilustrasi realis!'],
                    ['q' => 'Uraikan tahapan pembuatan storyboard dalam proses produksi animasi atau komik!'],
                    ['q' => 'Jelaskan fungsi dari teknik arsir dan dussel dalam menciptakan volume serta bayangan pada ilustrasi!'],
                    ['q' => 'Bagaimana prinsip perspektif diterapkan untuk memberikan kesan kedalaman pada gambar ilustrasi?'],
                    ['q' => 'Sebutkan dan jelaskan media digital yang sering digunakan oleh ilustrator saat ini!'],
                ],
            ],

            'Animasi' => [
                'pg' => [
                    ['q' => 'Prinsip animasi yang memberikan kesan kelenturan atau berat pada suatu objek adalah?', 'a' => ['Staging', 'Squash and Stretch', 'Solid Drawing', 'Timing'], 'correct' => 1],
                    ['q' => 'Standar jumlah frame per detik (FPS) untuk animasi agar terlihat halus adalah?', 'a' => ['12 FPS', '24 FPS', '60 FPS', '100 FPS'], 'correct' => 1],
                    ['q' => 'Teknik animasi yang menggunakan benda fisik yang digerakkan sedikit demi sedikit dan difoto adalah?', 'a' => ['Animasi 2D', 'Animasi 3D', 'Stop-motion', 'CGI'], 'correct' => 2],
                    ['q' => 'Gambar yang berada di antara dua keyframe utama untuk mengisi gerak disebut?', 'a' => ['In-betweens', 'Keyframe', 'Breakdown', 'Clean-up'], 'correct' => 0],
                    ['q' => 'Prinsip yang mengatur waktu atau ritme gerakan dalam animasi adalah?', 'a' => ['Spacing', 'Timing', 'Slow In and Slow Out', 'Arcs'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang merupakan prinsip dasar animasi (12 Principles of Animation)?', 'options' => ['Squash and Stretch', 'Anticipation', 'Exaggeration', 'Flash Animation'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis-jenis animasi yang banyak diproduksi?', 'options' => ['Animasi 2D', 'Animasi 3D', 'Animasi Clay', 'Animasi Musik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tahapan dalam pembuatan animasi?', 'options' => ['Pra-produksi', 'Produksi', 'Pasca-produksi', 'Logistik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah software yang umum digunakan untuk animasi 2D?', 'options' => ['Adobe Animate', 'Toon Boom Harmony', 'Autodesk Maya', 'Adobe After Effects'], 'correct' => [0, 1, 3]],
                    ['q' => 'Manakah yang termasuk fungsi utama keyframe?', 'options' => ['Menentukan posisi awal', 'Menentukan posisi akhir', 'Menentukan pose ekstrem gerakan', 'Mengatur warna background'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep prinsip animasi Squash and Stretch dan berikan contoh penerapannya pada sebuah bola!'],
                    ['q' => 'Apa perbedaan utama antara Keyframes dan In-betweens dalam animasi 2D?'],
                    ['q' => 'Uraikan tahapan pembuatan film animasi mulai dari naskah hingga tahap rendering!'],
                    ['q' => 'Jelaskan prinsip Slow In and Slow Out dan bagaimana penerapannya memengaruhi kehalusan gerakan!'],
                    ['q' => 'Apa perbedaan antara animasi tradisional dan animasi 3D berbasis komputer (CGI)?'],
                ],
            ],

            'Branding' => [
                'pg' => [
                    ['q' => 'Kumpulan kesan, persepsi, dan emosi yang dimiliki pelanggan terhadap suatu produk atau perusahaan disebut?', 'a' => ['Logo', 'Brand', 'Merek dagang', 'Iklan'], 'correct' => 1],
                    ['q' => 'Panduan yang mengatur penggunaan logo, warna, dan tipografi perusahaan adalah?', 'a' => ['Brand Guideline', 'Mood board', 'Storyboard', 'SOP'], 'correct' => 0],
                    ['q' => 'Posisi merek di benak konsumen dibandingkan dengan kompetitor disebut?', 'a' => ['Brand awareness', 'Brand positioning', 'Brand equity', 'Brand identity'], 'correct' => 1],
                    ['q' => 'Nilai tambah yang diberikan merek pada produk atau layanan disebut?', 'a' => ['Brand equity', 'Brand loyalty', 'Brand identity', 'Brand trust'], 'correct' => 0],
                    ['q' => 'Slogan atau kalimat singkat yang mewakili karakter merek disebut?', 'a' => ['Logo', 'Tagline', 'Headline', 'Copywriting'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk elemen visual dari sebuah brand?', 'options' => ['Logo', 'Warna khas', 'Font/Tipografi', 'Harga produk'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tujuan dari pembentukan strategi branding?', 'options' => ['Membangun loyalitas pelanggan', 'Meningkatkan kesadaran merek', 'Membedakan dengan kompetitor', 'Menurunkan kualitas produk'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tingkat kesadaran merek (brand awareness) yang ada?', 'options' => ['Brand recognition', 'Brand recall', 'Unaware', 'Brand equity'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk bentuk touchpoint antara merek dan konsumen?', 'options' => ['Kemasan produk', 'Iklan media sosial', 'Layanan pelanggan', 'Bahan baku mentah'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis-jenis strategi merek (brand strategy)?', 'options' => ['Individual brand', 'Family brand', 'Co-branding', 'Sub-branding'], 'correct' => [0, 1, 2, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara brand identity dan brand image!'],
                    ['q' => 'Apa yang dimaksud dengan Brand Positioning? Berikan contoh cara menentukan posisi tersebut di pasar!'],
                    ['q' => 'Uraikan isi dari brand guideline dan mengapa penting untuk konsistensi sebuah perusahaan!'],
                    ['q' => 'Jelaskan konsep Brand Equity dan bagaimana cara mengukurnya!'],
                    ['q' => 'Bagaimana cara membangun loyalitas merek melalui pengalaman pelanggan (customer experience)?'],
                ],
            ],

            //DI 
            'Desain Interior Dasar' => [
                'pg' => [
                    ['q' => 'Unsur desain interior yang dapat menciptakan ilusi ruang dan mengarahkan pandangan mata adalah?', 'a' => ['Tekstur', 'Garis', 'Warna', 'Bentuk'], 'correct' => 1],
                    ['q' => 'Pemisahan area dalam ruangan berdasarkan fungsinya disebut?', 'a' => ['Sirkulasi', 'Zoning', 'Layout', 'Clustering'], 'correct' => 1],
                    ['q' => 'Skema warna yang menggunakan warna-warna bertetangga dalam roda warna disebut?', 'a' => ['Komplementer', 'Monokromatik', 'Analogus', 'Triadik'], 'correct' => 2],
                    ['q' => 'Gambar potongan horizontal ruangan yang dilihat dari atas disebut?', 'a' => ['Tampak depan', 'Denah (floor plan)', 'Potongan vertikal', 'Perspektif'], 'correct' => 1],
                    ['q' => 'Prinsip desain interior yang mengatur keteraturan pengulangan elemen disebut?', 'a' => ['Keseimbangan', 'Proporsi', 'Ritme', 'Harmoni'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah elemen dasar desain interior?', 'options' => ['Garis', 'Bentuk', 'Tekstur', 'Suara'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah prinsip-prinsip desain interior yang diakui?', 'options' => ['Keseimbangan', 'Proporsi', 'Ritme', 'Kebetulan'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah tahapan dalam proses desain interior?', 'options' => ['Programming', 'Schematic design', 'Design development', 'Demolisi acak'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah gaya desain interior yang dikenal secara internasional?', 'options' => ['Minimalis', 'Skandinavian', 'Industrial', 'Baroque'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah pertimbangan utama dalam mendesain ruang residensial?', 'options' => ['Kebutuhan penghuni', 'Sirkulasi ruang', 'Pencahayaan alami', 'Nilai saham properti'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan elemen-elemen dasar desain interior dan bagaimana masing-masing berkontribusi pada suasana ruangan!'],
                    ['q' => 'Apa yang dimaksud dengan zoning dalam desain interior? Jelaskan cara penerapannya pada ruang hunian!'],
                    ['q' => 'Jelaskan prinsip-prinsip dasar desain interior (keseimbangan, proporsi, ritme, harmoni) beserta contohnya!'],
                    ['q' => 'Uraikan tahapan proses desain interior dari konsep hingga implementasi!'],
                    ['q' => 'Jelaskan perbedaan gaya desain interior minimalis dan industrial dari segi elemen dan karakter ruang!'],
                ],
            ],

            'Material Interior' => [
                'pg' => [
                    ['q' => 'Material lantai yang paling umum digunakan di iklim tropis karena tahan lembap adalah?', 'a' => ['Karpet wol', 'Parket kayu solid', 'Keramik/granit', 'Linoleum'], 'correct' => 2],
                    ['q' => 'Jenis finishing cat dengan tampilan paling mengkilap disebut?', 'a' => ['Matte', 'Satin', 'Semi-gloss', 'Gloss'], 'correct' => 3],
                    ['q' => 'Material dinding yang memiliki kemampuan penyerapan suara yang baik adalah?', 'a' => ['Kaca', 'Beton ekspos', 'Panel akustik', 'Keramik'], 'correct' => 2],
                    ['q' => 'Material plafon ringan yang umum digunakan pada bangunan modern adalah?', 'a' => ['Beton cor', 'Gypsum board', 'Granit', 'Marmer'], 'correct' => 1],
                    ['q' => 'Material interior yang berasal dari sumber terbarukan dan ramah lingkungan adalah?', 'a' => ['PVC', 'Aluminium', 'Bambu', 'Kaca tempered'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk kategori material lantai interior?', 'options' => ['Keramik', 'Parket kayu', 'Vinyl', 'Cat tembok'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah pertimbangan dalam memilih material interior?', 'options' => ['Daya tahan', 'Kemudahan perawatan', 'Estetika', 'Warna favorit desainer semata'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis finishing dinding interior yang umum?', 'options' => ['Cat', 'Wallpaper', 'Panel kayu', 'Beton bertulang'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah material yang termasuk kategori sustainable untuk interior?', 'options' => ['Bambu', 'Kayu bersertifikat FSC', 'Material daur ulang', 'Karpet plastik non-daur ulang'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk material plafon interior?', 'options' => ['Gypsum board', 'GRC board', 'Akustik tile', 'Granit'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan kriteria pemilihan material lantai untuk ruang komersial dan residensial!'],
                    ['q' => 'Apa perbedaan antara material alami dan material sintetis dalam desain interior? Berikan contoh masing-masing!'],
                    ['q' => 'Jelaskan jenis-jenis finishing dinding dan pengaruhnya terhadap suasana ruang!'],
                    ['q' => 'Bagaimana pemilihan material interior dapat mendukung konsep keberlanjutan (sustainable design)?'],
                    ['q' => 'Jelaskan karakteristik dan keunggulan bambu sebagai material interior alternatif yang modern!'],
                ],
            ],

            'Pencahayaan' => [
                'pg' => [
                    ['q' => 'Satuan yang digunakan untuk mengukur intensitas cahaya yang jatuh pada suatu permukaan adalah?', 'a' => ['Lumen', 'Candela', 'Lux', 'Watt'], 'correct' => 2],
                    ['q' => 'Jenis pencahayaan yang berfungsi sebagai sumber utama cahaya dalam suatu ruangan disebut?', 'a' => ['Accent lighting', 'Task lighting', 'Ambient lighting', 'Decorative lighting'], 'correct' => 2],
                    ['q' => 'Suhu warna lampu yang menghasilkan cahaya hangat berada pada kisaran?', 'a' => ['6500K', '5000K', '4000K', '2700-3000K'], 'correct' => 3],
                    ['q' => 'Pencahayaan yang digunakan untuk menonjolkan objek atau elemen dekoratif tertentu disebut?', 'a' => ['Ambient lighting', 'Task lighting', 'Accent lighting', 'General lighting'], 'correct' => 2],
                    ['q' => 'Keadaan tidak nyaman akibat cahaya yang terlalu terang atau kontras berlebih disebut?', 'a' => ['Reflektansi', 'Glare (silau)', 'Luminansi', 'Difusi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis pencahayaan buatan yang digunakan dalam desain interior?', 'options' => ['Ambient lighting', 'Task lighting', 'Accent lighting', 'Sunlight'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi kenyamanan visual dalam ruangan?', 'options' => ['Tingkat iluminansi', 'Silau (glare)', 'Distribusi cahaya', 'Warna furnitur semata'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis lampu yang umum digunakan dalam desain interior?', 'options' => ['LED', 'Fluorescent', 'Halogen', 'Obor tradisional'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah pertimbangan dalam merancang pencahayaan ruang kerja?', 'options' => ['Keseragaman cahaya', 'Minimalisasi silau', 'Suhu warna yang tepat', 'Ukuran meja'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah keunggulan penggunaan lampu LED dibandingkan lampu konvensional?', 'options' => ['Hemat energi', 'Umur lebih panjang', 'Menghasilkan sedikit panas', 'Selalu paling murah'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan tiga jenis pencahayaan (ambient, task, accent) dan fungsi masing-masing dalam desain interior!'],
                    ['q' => 'Bagaimana suhu warna (color temperature) memengaruhi suasana dan psikologi penghuni ruangan?'],
                    ['q' => 'Jelaskan cara mengintegrasikan pencahayaan alami dan buatan secara optimal dalam sebuah ruang interior!'],
                    ['q' => 'Apa yang dimaksud dengan layering light? Jelaskan cara menerapkannya dalam desain interior!'],
                    ['q' => 'Bagaimana pemilihan jenis dan jumlah lampu yang tepat dapat memengaruhi konsumsi energi bangunan?'],
                ],
            ],

            'Furniture Design' => [
                'pg' => [
                    ['q' => 'Prinsip paling mendasar dalam desain furnitur yang ergonomis adalah?', 'a' => ['Estetika yang menarik', 'Kesesuaian dengan dimensi tubuh manusia', 'Penggunaan material mahal', 'Ukuran yang besar'], 'correct' => 1],
                    ['q' => 'Sambungan furnitur tradisional yang mengunci tanpa menggunakan paku atau lem disebut?', 'a' => ['Dowel joint', 'Mortise and tenon', 'Biscuit joint', 'Pocket screw'], 'correct' => 1],
                    ['q' => 'Material furnitur yang paling tahan terhadap cuaca dan cocok untuk penggunaan outdoor adalah?', 'a' => ['MDF', 'Kayu jati/teak solid', 'Plywood biasa', 'Particleboard'], 'correct' => 1],
                    ['q' => 'Furnitur yang dapat difungsikan lebih dari satu kegunaan disebut?', 'a' => ['Modular furniture', 'Custom furniture', 'Multifunctional furniture', 'Built-in furniture'], 'correct' => 2],
                    ['q' => 'Proses penyelesaian permukaan furnitur untuk melindungi dan memperindah tampilan disebut?', 'a' => ['Konstruksi', 'Finishing', 'Joinery', 'Upholstery'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah material yang umum digunakan dalam pembuatan furnitur interior?', 'options' => ['Kayu solid', 'MDF (Medium Density Fiberboard)', 'Baja', 'Bambu'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah jenis sambungan (joint) yang digunakan dalam konstruksi furnitur kayu?', 'options' => ['Mortise and tenon', 'Dowel joint', 'Finger joint', 'Sambungan semen'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah pertimbangan utama dalam mendesain furnitur yang baik?', 'options' => ['Fungsi', 'Kenyamanan', 'Estetika', 'Popularitas merek semata'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis furnitur berdasarkan sistem pemasangannya?', 'options' => ['Freestanding', 'Built-in', 'Modular', 'Furnitur melayang'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah teknik finishing yang umum diterapkan pada furnitur?', 'options' => ['Pengecatan', 'Pelapisan veneer', 'Polishing/wax', 'Pengelasan besi'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan prinsip-prinsip desain furnitur yang baik dari aspek fungsi, estetika, dan konstruksi!'],
                    ['q' => 'Apa perbedaan antara furnitur freestanding, built-in, dan modular? Kapan masing-masing tepat digunakan?'],
                    ['q' => 'Jelaskan jenis-jenis sambungan (joint) dalam konstruksi furnitur kayu beserta kelebihan masing-masing!'],
                    ['q' => 'Bagaimana cara memilih material furnitur yang tepat berdasarkan kebutuhan ruangan dan anggaran?'],
                    ['q' => 'Apa yang dimaksud dengan furnitur multifungsi? Berikan contoh penerapannya dalam desain interior ruang sempit!'],
                ],
            ],

            'Ergonomi' => [
                'pg' => [
                    ['q' => 'Cabang ergonomi yang berfokus pada kesesuaian dimensi produk dengan ukuran tubuh manusia disebut?', 'a' => ['Ergonomi kognitif', 'Ergonomi antropometri/fisik', 'Ergonomi organisasi', 'Ergonomi lingkungan'], 'correct' => 1],
                    ['q' => 'Tinggi meja kerja standar yang ergonomis untuk posisi duduk adalah sekitar?', 'a' => ['60 cm', '72-75 cm', '90 cm', '100 cm'], 'correct' => 1],
                    ['q' => 'Persentil yang digunakan untuk mengakomodasi 90% populasi pengguna dalam desain adalah?', 'a' => ['P5 dan P50', 'P5 dan P95', 'P50 saja', 'P1 dan P99'], 'correct' => 1],
                    ['q' => 'Area kerja yang dapat dijangkau hanya dengan menggerakkan lengan bawah tanpa menggeser bahu disebut?', 'a' => ['Jangkauan maksimum', 'Jangkauan normal', 'Jangkauan optimal', 'Jangkauan lateral'], 'correct' => 1],
                    ['q' => 'Postur kerja yang menyebabkan kelelahan dan risiko cedera muskuloskeletal disebut postur?', 'a' => ['Netral', 'Canggung (awkward posture)', 'Tegak', 'Rileks'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah aspek yang dikaji ergonomi dalam konteks desain interior?', 'options' => ['Dimensi ruang dan furnitur', 'Sirkulasi dan aksesibilitas', 'Kenyamanan termal dan pencahayaan', 'Nilai estetika subjektif semata'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah prinsip ergonomi yang diterapkan dalam desain furnitur dan ruang?', 'options' => ['Sesuai ukuran tubuh pengguna', 'Mendukung postur netral', 'Mudah dijangkau tanpa usaha berlebih', 'Warna yang menarik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah data antropometri yang penting dalam desain interior?', 'options' => ['Tinggi duduk', 'Jangkauan tangan', 'Lebar bahu', 'Warna kulit'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah standar aksesibilitas yang perlu diperhatikan dalam desain interior publik?', 'options' => ['Lebar pintu minimum untuk kursi roda', 'Ketinggian pegangan tangga', 'Ramp untuk pengguna difabel', 'Warna dinding'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah kondisi lingkungan interior yang memengaruhi kenyamanan ergonomis penghuni?', 'options' => ['Suhu dan kelembapan ruangan', 'Tingkat kebisingan', 'Kualitas udara dalam ruangan', 'Warna favorit desainer'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep ergonomi dalam desain interior dan mengapa penerapannya penting bagi kesehatan penghuni!'],
                    ['q' => 'Bagaimana data antropometri digunakan dalam menentukan dimensi furnitur dan tata letak ruang?'],
                    ['q' => 'Jelaskan prinsip desain universal (universal design) dan penerapannya dalam interior yang aksesibel untuk semua kalangan!'],
                    ['q' => 'Apa yang dimaksud dengan kenyamanan termal dalam ruangan? Faktor apa saja yang memengaruhinya dan bagaimana solusi desainnya?'],
                    ['q' => 'Bagaimana ergonomi diterapkan dalam mendesain dapur (kitchen) agar efisien, nyaman, dan aman digunakan?'],
                ],
            ],

            //Psikologi (Psi)
              'Psikologi Umum' => [
                'pg' => [
                    ['q' => 'Tokoh yang dikenal sebagai bapak psikologi modern dan mendirikan laboratorium psikologi pertama adalah?', 'a' => ['Sigmund Freud', 'Wilhelm Wundt', 'John B. Watson', 'Jean Piaget'], 'correct' => 1],
                    ['q' => 'Aliran psikologi yang berfokus pada perilaku yang dapat diamati dan mengabaikan proses mental internal adalah?', 'a' => ['Psikoanalisis', 'Behaviorisme', 'Humanisme', 'Kognitivisme'], 'correct' => 1],
                    ['q' => 'Teori perkembangan kognitif yang membagi tahapan menjadi 4 fase dipelopori oleh?', 'a' => ['Erik Erikson', 'Jean Piaget', 'Ivan Pavlov', 'B.F. Skinner'], 'correct' => 1],
                    ['q' => 'Proses penerimaan dan penginterpretasian stimulus dari lingkungan oleh otak disebut?', 'a' => ['Sensasi', 'Persepsi', 'Atensi', 'Motivasi'], 'correct' => 1],
                    ['q' => 'Teori motivasi yang menggambarkan kebutuhan manusia dalam bentuk piramida dicetuskan oleh?', 'a' => ['Abraham Maslow', 'Carl Rogers', 'Albert Bandura', 'William James'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk aliran atau perspektif utama dalam psikologi?', 'options' => ['Behaviorisme', 'Psikoanalisis', 'Humanisme', 'Biologi'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah tahapan perkembangan kognitif menurut Jean Piaget?', 'options' => ['Sensorimotor', 'Praoperasional', 'Operasional konkrit', 'Psikoseksual'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah komponen penyusun kepribadian menurut Sigmund Freud?', 'options' => ['Id', 'Ego', 'Superego', 'Libido'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis memori berdasarkan durasi penyimpanannya?', 'options' => ['Sensory memory', 'Short-term memory', 'Long-term memory', 'Flash memory'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah proses belajar yang dipelajari dalam psikologi?', 'options' => ['Classical conditioning', 'Operant conditioning', 'Observational learning', 'Structural learning'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara aliran Behaviorisme dan Humanisme dalam melihat motivasi manusia!'],
                    ['q' => 'Uraikan tahapan perkembangan kognitif menurut Jean Piaget!'],
                    ['q' => 'Jelaskan teori struktur kepribadian menurut Sigmund Freud (Id, Ego, Superego) dan bagaimana ketiganya berinteraksi!'],
                    ['q' => 'Apa perbedaan antara sensasi dan persepsi? Berikan contoh bagaimana persepsi bisa memengaruhi tindakan!'],
                    ['q' => 'Uraikan teori hierarki kebutuhan Abraham Maslow dan aplikasinya!'],
                ],
            ],

            'Psikologi Sosial' => [
                'pg' => [
                    ['q' => 'Kecenderungan individu untuk mengubah sikap atau perilakunya agar sesuai dengan norma kelompok disebut?', 'a' => ['Kepatuhan (Obedience)', 'Konformitas (Conformity)', 'Otonomi', 'Prasangka'], 'correct' => 1],
                    ['q' => 'Proses di mana seseorang menyimpulkan penyebab dari perilaku orang lain disebut?', 'a' => ['Atribusi', 'Sosialisasi', 'Stereotip', 'Diskriminasi'], 'correct' => 0],
                    ['q' => 'Sikap negatif terhadap suatu kelompok dan anggotanya tanpa adanya bukti yang cukup disebut?', 'a' => ['Stereotip', 'Prasangka (Prejudice)', 'Diskriminasi', 'Konformitas'], 'correct' => 1],
                    ['q' => 'Perilaku yang secara sengaja ditujukan untuk merugikan orang lain disebut?', 'a' => ['Agresi', 'Altruisme', 'Kooperasi', 'Empati'], 'correct' => 0],
                    ['q' => 'Teori yang menyatakan bahwa prasangka timbul akibat persaingan memperebutkan sumber daya yang terbatas disebut?', 'a' => ['Teori Pembelajaran Sosial', 'Teori Realistik Konflik Kelompok', 'Teori Identitas Sosial', 'Teori Atribusi'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah komponen utama yang membentuk sikap (attitude)?', 'options' => ['Kognitif', 'Afektif', 'Perilaku (Behavioral)', 'Fisik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah fenomena pengaruh sosial yang dipelajari?', 'options' => ['Konformitas', 'Kepatuhan', 'Persuasi', 'Hipnotis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi perilaku prososial / altruisme?', 'options' => ['Empati', 'Norma sosial', 'Kehadiran orang lain (bystander effect)', 'Suhu udara'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis atribusi dalam teori atribusi?', 'options' => ['Atribusi internal (disposisional)', 'Atribusi eksternal (situasional)', 'Atribusi sosial', 'Atribusi biologis'], 'correct' => [0, 1]],
                    ['q' => 'Manakah bentuk prasangka atau diskriminasi sosial?', 'options' => ['Rasisme', 'Seksisme', 'Ageism', 'Konsumerisme'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan percobaan konformitas oleh Solomon Asch dan implikasinya terhadap perilaku manusia dalam kelompok!'],
                    ['q' => 'Apa itu prasangka dan bagaimana psikologi sosial menjelaskan cara menguranginya melalui kontak antarkelompok?'],
                    ['q' => 'Uraikan teori atribusi dan bagaimana kesalahan atribusi yang mendasar (fundamental attribution error) dapat terjadi!'],
                    ['q' => 'Jelaskan konsep bystander effect dan mengapa seseorang cenderung tidak menolong dalam keadaan darurat ketika banyak orang di sekitarnya!'],
                    ['q' => 'Apa perbedaan antara stereotip, prasangka, dan diskriminasi? Berikan contoh keterkaitannya!'],
                ],
            ],

            'Psikologi Klinis' => [
                'pg' => [
                    ['q' => 'Pedoman diagnostik gangguan mental yang paling banyak digunakan oleh psikolog klinis saat ini adalah?', 'a' => ['ICD dan DSM', 'MMPI', 'WISC', 'Rorschach'], 'correct' => 0],
                    ['q' => 'Terapi yang bertujuan mengubah pola pikir dan perilaku maladaptif menjadi adaptif adalah?', 'a' => ['Psikoanalisis', 'Terapi Perilaku Kognitif (CBT)', 'Terapi Humanistik', 'Terapi Gestalt'], 'correct' => 1],
                    ['q' => 'Proses pengumpulan data untuk memahami masalah pasien pada awal terapi disebut?', 'a' => ['Intervensi', 'Asesmen klinis', 'Evaluasi', 'Konseling'], 'correct' => 1],
                    ['q' => 'Gangguan kecemasan di mana seseorang mengalami kecemasan yang berlebihan secara terus-menerus terhadap berbagai aktivitas disebut?', 'a' => ['Fobia spesifik', 'Gangguan Panik', 'General Anxiety Disorder (GAD)', 'OCD'], 'correct' => 2],
                    ['q' => 'Asesmen proyektif yang menggunakan noda tinta untuk menganalisis kepribadian adalah tes?', 'a' => ['MMPI-2', 'Tes Rorschach', 'WAIS-IV', 'TAT'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk fungsi utama psikolog klinis?', 'options' => ['Asesmen', 'Psikoterapi', 'Psikoedukasi', 'Meracik obat'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah klasifikasi gangguan mental yang umum?', 'options' => ['Gangguan kecemasan', 'Gangguan mood', 'Gangguan kepribadian', 'Gangguan neurologis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah metode asesmen dalam psikologi klinis?', 'options' => ['Wawancara klinis', 'Observasi', 'Tes psikologi', 'X-ray medis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah pendekatan terapi yang dikenal dalam psikologi klinis?', 'options' => ['Psikoanalitik', 'Kognitif-Perilaku', 'Humanistik', 'Neurologis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah hal yang melanggar etika profesi psikologi klinis?', 'options' => ['Melanggar kerahasiaan pasien', 'Menjalin hubungan ganda', 'Memberikan diagnosis tanpa asesmen', 'Mendengarkan keluhan pasien'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan peran Terapi Perilaku Kognitif (CBT) dalam menangani gangguan kecemasan!'],
                    ['q' => 'Apa saja langkah-langkah yang dilakukan dalam asesmen klinis?'],
                    ['q' => 'Uraikan perbedaan antara psikolog klinis dan psikiater dalam menangani gangguan mental!'],
                    ['q' => 'Jelaskan kriteria dan gejala dari gangguan depresi mayor (Major Depressive Disorder)!'],
                    ['q' => 'Diskusikan pentingnya batas etika dan kerahasiaan dalam praktik psikologi klinis!'],
                ],
            ],

            'Psikologi Industri' => [
                'pg' => [
                    ['q' => 'Tingkat kepuasan seseorang terhadap pekerjaannya dikenal dengan istilah?', 'a' => ['Motivasi kerja', 'Keterikatan kerja (employee engagement)', 'Kepuasan kerja (job satisfaction)', 'Kinerja'], 'correct' => 2],
                    ['q' => 'Proses menemukan, menarik, dan menyeleksi kandidat karyawan yang kompeten disebut?', 'a' => ['Rekrutmen dan seleksi', 'Analisis jabatan', 'Pelatihan', 'Penilaian kinerja'], 'correct' => 0],
                    ['q' => 'Sikap dan keterlibatan emosional karyawan terhadap pekerjaannya di perusahaan disebut?', 'a' => ['Kepuasan kerja', 'Keterikatan (Engagement)', 'Stres kerja', 'Turnover'], 'correct' => 1],
                    ['q' => 'Tes yang dirancang untuk mengukur kemampuan intelektual umum calon karyawan adalah tes?', 'a' => ['Kepribadian', 'Kecerdasan (seperti IST, WAIS)', 'Minat dan bakat', 'Sikap kerja'], 'correct' => 1],
                    ['q' => 'Teori yang mengelompokkan faktor kepuasan dan ketidakpuasan kerja menjadi dua faktor dicetuskan oleh?', 'a' => ['Maslow', 'Herzberg', 'McClelland', 'Vroom'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk fungsi utama Manajemen SDM dan Psikologi Industri?', 'options' => ['Rekrutmen', 'Pelatihan', 'Evaluasi Kinerja', 'Perancangan Produk'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah metode penilaian kinerja yang sering digunakan?', 'options' => ['360-degree feedback', 'Key Performance Indicator (KPI)', 'Behaviorally Anchored Rating Scales', 'Tes proyektif'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah faktor yang memengaruhi motivasi karyawan di tempat kerja?', 'options' => ['Kompensasi', 'Lingkungan kerja', 'Gaya kepemimpinan', 'Warna seragam'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis tes psikologi yang sering digunakan untuk seleksi karyawan?', 'options' => ['Tes Inteligensi', 'Tes Kepribadian (DISC, MBTI)', 'Tes Kraepelin/Pauli', 'Tes medis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah penyebab utama terjadinya stres kerja?', 'options' => ['Beban kerja berlebih', 'Kurangnya dukungan sosial', 'Konflik peran', 'Ukuran kantor'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan teori dua faktor Herzberg (Hygiene Factors dan Motivator Factors) dalam konteks kepuasan kerja!'],
                    ['q' => 'Uraikan proses seleksi karyawan yang efektif dalam organisasi!'],
                    ['q' => 'Apa itu 360-degree feedback dan bagaimana metode ini membantu dalam penilaian kinerja karyawan?'],
                    ['q' => 'Diskusikan dampak stres kerja terhadap produktivitas dan bagaimana perusahaan dapat memitigasinya!'],
                    ['q' => 'Jelaskan pentingnya ergonomi kognitif dalam perancangan sistem kerja di industri!'],
                ],
            ],

            'Psikometri' => [
                'pg' => [
                    ['q' => 'Derajat sejauh mana suatu alat ukur mengukur apa yang seharusnya diukur disebut?', 'a' => ['Reliabilitas', 'Validitas', 'Objektivitas', 'Praktikalitas'], 'correct' => 1],
                    ['q' => 'Konsistensi atau kestabilan hasil dari suatu alat ukur disebut?', 'a' => ['Validitas', 'Reliabilitas', 'Norma', 'Objektivitas'], 'correct' => 1],
                    ['q' => 'Skala yang biasanya menggunakan lima pilihan jawaban seperti "Sangat Setuju" hingga "Sangat Tidak Setuju" adalah skala?', 'a' => ['Thurstone', 'Guttman', 'Likert', 'Semantic Differential'], 'correct' => 2],
                    ['q' => 'Statistik yang digunakan untuk menguji homogenitas atau konsistensi internal suatu alat ukur adalah?', 'a' => ['Koefisien Alpha Cronbach', 'Chi-Square', 'Uji-T', 'ANOVA'], 'correct' => 0],
                    ['q' => 'Prosedur untuk mengubah skor mentah menjadi skor yang dapat dibandingkan dengan populasi acuan disebut?', 'a' => ['Standardisasi norma', 'Koreksi', 'Validasi', 'Konversi'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah jenis-jenis validitas dalam psikometri?', 'options' => ['Validitas isi (content validity)', 'Validitas konstruk (construct validity)', 'Validitas kriteria (criterion validity)', 'Validitas biologis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis-jenis reliabilitas instrumen?', 'options' => ['Test-retest', 'Split-half', 'Internal consistency', 'External consistency'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah langkah dalam pengembangan instrumen pengukuran psikologi?', 'options' => ['Menentukan konstruk', 'Menulis aitem', 'Uji coba (try-out)', 'Mencetak alat'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah metode skala yang dikenal dalam psikometri?', 'options' => ['Skala Likert', 'Skala Guttman', 'Skala Thurstone', 'Skala Nominal'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang memengaruhi reliabilitas suatu alat tes?', 'options' => ['Panjang tes', 'Kondisi saat tes', 'Heterogenitas kelompok', 'Ukuran kertas tes'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan perbedaan antara validitas dan reliabilitas serta berikan contoh untuk masing-masing!'],
                    ['q' => 'Apa yang dimaksud dengan Alpha Cronbach? Bagaimana cara menginterpretasikan nilai Alpha Cronbach pada instrumen pengukuran?'],
                    ['q' => 'Uraikan tahapan pembuatan skala psikologi mulai dari spesifikasi tujuan hingga uji coba!'],
                    ['q' => 'Jelaskan konsep validitas konstruk dan bagaimana cara mengujinya menggunakan analisis faktor!'],
                    ['q' => 'Apa perbedaan antara tes kecepatan (speed test) dan tes kemampuan (power test) dalam pengukuran psikometri?'],
                ],
            ],

            //Ilmu Komunikasi
             'Public Relations' => [
                'pg' => [
                    ['q' => 'Fungsi manajemen yang membangun dan mempertahankan hubungan yang saling menguntungkan antara organisasi dan publiknya disebut?', 'a' => ['Periklanan', 'Pemasaran', 'Public Relations (PR)', 'Penjualan'], 'correct' => 2],
                    ['q' => 'Pernyataan tertulis yang ditujukan kepada media massa mengenai informasi atau peristiwa penting organisasi disebut?', 'a' => ['Press release', 'Brosur', 'Majalah internal', 'Flyer'], 'correct' => 0],
                    ['q' => 'Upaya untuk mengatasi situasi krisis yang dapat merusak reputasi perusahaan disebut?', 'a' => ['Manajemen krisis', 'Publisitas', 'Corporate Social Responsibility', 'Kampanye promosi'], 'correct' => 0],
                    ['q' => 'Program yang berfokus pada tanggung jawab sosial dan kepedulian perusahaan terhadap lingkungan/masyarakat disebut?', 'a' => ['Corporate Social Responsibility (CSR)', 'Media relation', 'Investor relation', 'Customer service'], 'correct' => 0],
                    ['q' => 'Model komunikasi PR yang paling ideal dan seimbang adalah model?', 'a' => ['Persuasi satu arah', 'Dua arah asimetris', 'Dua arah simetris', 'Publisitas murni'], 'correct' => 2],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk publik dalam ruang lingkup Public Relations?', 'options' => ['Media', 'Karyawan', 'Investor', 'Kompetitor'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang merupakan tugas dari seorang Public Relations?', 'options' => ['Membuat siaran pers', 'Mengelola acara perusahaan', 'Menulis pidato eksekutif', 'Menjual produk secara langsung'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah saluran komunikasi yang digunakan dalam kegiatan PR?', 'options' => ['Press conference', 'Media sosial', 'Newsletter perusahaan', 'Billboard iklan komersial'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah komponen penting dalam menangani krisis perusahaan?', 'options' => ['Transparansi', 'Respon cepat', 'Pusat informasi krisis', 'Mengabaikan media'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah bentuk tanggung jawab sosial (CSR) perusahaan?', 'options' => ['Pemberdayaan masyarakat', 'Pelestarian lingkungan', 'Pemberian beasiswa', 'Diskon harga produk'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan fungsi dan peran Public Relations dalam membangun citra positif perusahaan!'],
                    ['q' => 'Apa perbedaan antara periklanan (advertising) dan publisitas (publicity)?'],
                    ['q' => 'Uraikan langkah-langkah yang harus dilakukan oleh seorang praktisi PR saat menghadapi krisis perusahaan!'],
                    ['q' => 'Jelaskan konsep dan pentingnya program Corporate Social Responsibility (CSR) bagi perusahaan!'],
                    ['q' => 'Bagaimana media relations memengaruhi kredibilitas suatu organisasi di mata media massa?'],
                ],
            ],

            'Jurnalistik' => [
                'pg' => [
                    ['q' => 'Unsur-unsur pokok dalam penulisan berita yang baik sering dikenal dengan istilah?', 'a' => ['5W+1H', 'AIDA', 'STP', 'SMART'], 'correct' => 0],
                    ['q' => 'Tulisan yang berisi pendapat subjektif penulis mengenai suatu isu hangat yang sedang terjadi disebut?', 'a' => ['Berita langsung (straight news)', 'Tajuk rencana (editorial)', 'Feature', 'Iklan'], 'correct' => 1],
                    ['q' => 'Pemberitaan yang dilakukan dengan penyelidikan mendalam terhadap suatu kasus disebut?', 'a' => ['Jurnalistik investigasi', 'Berita foto', 'Wawancara khusus', 'Berita opini'], 'correct' => 0],
                    ['q' => 'Struktur penulisan berita di mana informasi terpenting diletakkan di awal paragraf disebut?', 'a' => ['Piramida terbalik', 'Kronologis', 'Piramida tegak', 'Struktur bebas'], 'correct' => 0],
                    ['q' => 'Pedoman moral dan etika yang harus dipatuhi oleh wartawan dalam menjalankan tugasnya adalah?', 'a' => ['Kode Etik Jurnalistik', 'UU Pers', 'SOP Perusahaan', 'Undang-undang penyiaran'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk jenis-jenis berita?', 'options' => ['Straight news', 'Feature', 'Editorial', 'Iklan baris'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah prinsip dasar kerja jurnalistik?', 'options' => ['Akurat', 'Berimbang (Cover both sides)', 'Objektif', 'Bersifat memihak'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah teknik reportase yang sering digunakan oleh wartawan?', 'options' => ['Wawancara', 'Observasi', 'Studi dokumen', 'Eksperimen medis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah bagian-bagian dari struktur berita piramida terbalik?', 'options' => ['Lead (teras berita)', 'Tubuh berita', 'Ekor berita', 'Kesimpulan akhir'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah peran media massa dalam jurnalisme?', 'options' => ['Menginformasikan', 'Mendidik', 'Menghibur', 'Memanipulasi opini'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan struktur penulisan berita dengan format piramida terbalik!'],
                    ['q' => 'Apa itu prinsip Cover Both Sides? Mengapa prinsip ini sangat penting dalam penulisan berita objektif?'],
                    ['q' => 'Uraikan perbedaan antara straight news dan feature!'],
                    ['q' => 'Jelaskan peran jurnalistik investigasi dalam membongkar suatu kasus kejahatan!'],
                    ['q' => 'Diskusikan pentingnya mematuhi Kode Etik Jurnalistik dalam kebebasan pers!'],
                ],
            ],

            'Komunikasi Massa' => [
                'pg' => [
                    ['q' => 'Teori yang menyatakan bahwa media massa tidak selalu memengaruhi apa yang harus dipikirkan, tetapi memengaruhi apa yang harus dipikirkan disebut?', 'a' => ['Teori Jarum Hipodermis', 'Teori Agenda Setting', 'Teori Kultivasi', 'Teori Uses and Gratifications'], 'correct' => 1],
                    ['q' => 'Komunikasi massa memiliki karakteristik khalayak yang?', 'a' => ['Homogen, sedikit, dan saling kenal', 'Heterogen, anonim, dan tersebar luas', 'Terbatas dan eksklusif', 'Hanya satu orang saja'], 'correct' => 1],
                    ['q' => 'Teori yang menyebutkan bahwa media massa membentuk persepsi penonton tentang realitas sosial jika menonton televisi dalam waktu lama adalah?', 'a' => ['Agenda Setting', 'Kultivasi', 'Jarum Hipodermis', 'Spiral Keheningan'], 'correct' => 1],
                    ['q' => 'Proses penyaringan pesan yang dilakukan oleh redaktur atau editor sebelum disiarkan disebut?', 'a' => ['Gatekeeping', 'Encoding', 'Decoding', 'Feedback'], 'correct' => 0],
                    ['q' => 'Umpan balik (feedback) dalam komunikasi massa umumnya bersifat?', 'a' => ['Langsung', 'Tertunda dan tidak langsung', 'Dua arah', 'Interaktif'], 'correct' => 1],
                ],
                'cb' => [
                    ['q' => 'Manakah karakteristik komunikasi massa?', 'options' => ['Sumber melembaga', 'Pesan bersifat umum', 'Khalayak heterogen', 'Feedback langsung'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah fungsi utama komunikasi massa menurut para ahli?', 'options' => ['Informasi', 'Edukasi', 'Hiburan', 'Promosi bisnis'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah teori efek komunikasi massa yang dikenal?', 'options' => ['Jarum Hipodermis', 'Uses and Gratifications', 'Kultivasi', 'Relativitas'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah elemen dalam model komunikasi massa?', 'options' => ['Sender', 'Message', 'Channel', 'Receiver'], 'correct' => [0, 1, 2, 3]],
                    ['q' => 'Manakah yang memengaruhi khalayak dalam komunikasi massa?', 'options' => ['Kredibilitas media', 'Isi pesan', 'Kebutuhan khalayak', 'Warna media'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan Teori Agenda Setting dan bagaimana media memengaruhi topik yang diperbincangkan di masyarakat!'],
                    ['q' => 'Apa perbedaan antara umpan balik (feedback) dalam komunikasi antarpribadi dan komunikasi massa?'],
                    ['q' => 'Uraikan peran gatekeeper dalam proses produksi media massa!'],
                    ['q' => 'Jelaskan Teori Kultivasi dan bagaimana pengaruh tayangan televisi terhadap pandangan hidup penontonnya!'],
                    ['q' => 'Diskusikan dampak konvergensi media terhadap perkembangan komunikasi massa saat ini!'],
                ],
            ],

            'Broadcasting' => [
                'pg' => [
                    ['q' => 'Penyiaran yang menggunakan gelombang frekuensi radio untuk mengirimkan suara kepada khalayak disebut?', 'a' => ['Televisi', 'Radio siaran', 'Internet', 'Surat kabar'], 'correct' => 1],
                    ['q' => 'Tahapan pra-produksi dalam program penyiaran meliputi?', 'a' => ['Editing dan mixing', 'Pembuatan naskah dan perencanaan anggaran', 'Penyebaran acara', 'Proses syuting'], 'correct' => 1],
                    ['q' => 'Format siaran televisi yang menampilkan informasi dan hiburan yang disiarkan langsung disebut?', 'a' => ['Siaran tunda (recorded)', 'Siaran langsung (live)', 'Program drama', 'Iklan'], 'correct' => 1],
                    ['q' => 'Alat yang berfungsi untuk mengatur tingkat suara (audio) dalam studio penyiaran disebut?', 'a' => ['Switcher', 'Audio Mixer', 'Kamera', 'Microphone'], 'correct' => 1],
                    ['q' => 'Komisi yang bertugas mengatur dan mengawasi penyelenggaraan penyiaran di Indonesia adalah?', 'a' => ['KPI', 'Dewan Pers', 'KPPU', 'OJK'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah yang termasuk tahapan produksi dalam broadcasting?', 'options' => ['Pra-produksi', 'Produksi', 'Pasca-produksi', 'Marketing'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah perangkat yang digunakan dalam studio televisi?', 'options' => ['Kamera video', 'Vision Switcher', 'Teleprompter', 'Peralatan cetak'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis program televisi?', 'options' => ['News', 'Talkshow', 'Variety Show', 'Majalah Dinding'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah media transmisi yang digunakan dalam penyiaran?', 'options' => ['Gelombang elektromagnetik', 'Kabel serat optik', 'Streaming internet', 'Surat fisik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah yang termasuk fungsi kru produksi dalam penyiaran?', 'options' => ['Sutradara', 'Kameramen', 'Editor', 'Presenter'], 'correct' => [0, 1, 2, 3]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan proses produksi program siaran televisi mulai dari tahap pra-produksi hingga pasca-produksi!'],
                    ['q' => 'Apa peran penting seorang produser dalam program siaran siaran langsung (live)?'],
                    ['q' => 'Uraikan perbedaan teknis antara siaran radio dan siaran televisi!'],
                    ['q' => 'Jelaskan regulasi penyiaran yang diatur oleh KPI, khususnya mengenai isi siaran dan batasan waktu iklan!'],
                    ['q' => 'Bagaimana perkembangan teknologi digital memengaruhi metode penyiaran konvensional?'],
                ],
            ],

            'Media Digital' => [
                'pg' => [
                    ['q' => 'Penerapan strategi untuk meningkatkan visibilitas situs web di halaman hasil mesin pencari disebut?', 'a' => ['SEM', 'SEO (Search Engine Optimization)', 'SMM', 'Content Marketing'], 'correct' => 1],
                    ['q' => 'Karakteristik media digital yang memungkinkan pengguna untuk berinteraksi dengan konten disebut?', 'a' => ['Interaktivitas', 'Linier', 'Statik', 'Massa'], 'correct' => 0],
                    ['q' => 'Proses penggabungan berbagai jenis media (teks, audio, video) ke dalam satu platform digital disebut?', 'a' => ['Konvergensi media', 'Diversifikasi', 'Fragmentasi', 'Evolusi'], 'correct' => 0],
                    ['q' => 'Metrik yang mengukur seberapa banyak pengguna yang melihat iklan atau konten digital adalah?', 'a' => ['Click-through rate (CTR)', 'Impressions', 'Bounce rate', 'Conversion rate'], 'correct' => 1],
                    ['q' => 'Etika yang harus diterapkan dalam berinteraksi di dunia digital dikenal sebagai?', 'a' => ['Cyber ethics / Netiquette', 'Etika profesi TI', 'Hukum tata negara', 'Etika bisnis'], 'correct' => 0],
                ],
                'cb' => [
                    ['q' => 'Manakah platform yang termasuk media sosial digital?', 'options' => ['Instagram', 'X (Twitter)', 'TikTok', 'Koran cetak'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah elemen dari strategi pemasaran digital?', 'options' => ['SEO', 'Media sosial', 'Email marketing', 'Billboard konvensional'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah jenis konten digital yang populer?', 'options' => ['Video singkat', 'Infografis', 'Podcast', 'Koran fisik'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah metrik keberhasilan dalam analisis media digital?', 'options' => ['Engagement rate', 'Follower growth', 'Reach', 'Berat kertas'], 'correct' => [0, 1, 2]],
                    ['q' => 'Manakah ancaman keamanan dalam penggunaan media digital?', 'options' => ['Cyberbullying', 'Penyebaran hoaks', 'Phishing', 'Kerusakan mesin'], 'correct' => [0, 1, 2]],
                ],
                'essay' => [
                    ['q' => 'Jelaskan konsep konvergensi media dan dampaknya pada industri media digital saat ini!'],
                    ['q' => 'Apa itu Search Engine Optimization (SEO) dan bagaimana penerapannya dalam mengoptimalkan konten?'],
                    ['q' => 'Uraikan perbedaan antara pemasaran melalui media sosial (SMM) dan mesin pencari (SEM)!'],
                    ['q' => 'Jelaskan pentingnya Netiquette dalam berinteraksi di platform media digital!'],
                    ['q' => 'Bagaimana data analitik digunakan untuk mengukur efektivitas suatu kampanye di media digital?'],
                ],
            ],

        ];
 
        return $data[$nama] ?? [];
    }

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

}