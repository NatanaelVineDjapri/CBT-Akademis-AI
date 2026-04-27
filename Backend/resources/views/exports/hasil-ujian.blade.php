<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, 'Helvetica Neue', sans-serif;
      background: white;
      color: #111827;
      font-size: 12px;
    }

    .header {
      background: #097797;
      padding: 28px 36px 24px;
    }
    .brand {
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 800;
      color: white;
      margin-bottom: 4px;
    }
    .header .subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
    }

    /* ── Meta ── */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 1px solid #e5e7eb;
    }
    .meta-table td {
      padding: 18px 24px;
      vertical-align: top;
      border-right: 1px solid #f0f4f8;
    }
    .meta-table td:last-child { border-right: none; }
    .meta-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    .meta-val {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
    }

    /* ── Stats ── */
    .stats-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 1px solid #e5e7eb;
    }
    .stats-table td {
      padding: 20px 24px;
      text-align: center;
      border-right: 1px solid #e5e7eb;
      background: white;
    }
    .stats-table td:last-child { border-right: none; }
    .s-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #9ca3af;
      margin-bottom: 6px;
    }
    .s-val {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
    }
    .s-sub { font-size: 10px; color: #9ca3af; margin-top: 4px; }
    .s-avg  { color: #097797; }
    .s-pass { color: #16a34a; }
    .s-pct  { color: #d97706; }

    /* ── Table ── */
    .table-wrap { padding: 24px 36px 20px; }
    .table-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9ca3af;
      margin-bottom: 12px;
    }
    table.main {
      width: 100%;
      border-collapse: collapse;
    }
    table.main thead th {
      background: #f8fafc;
      padding: 9px 10px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    table.main tbody td {
      padding: 10px 10px;
      font-size: 12px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
      vertical-align: middle;
    }
    .nim { font-size: 11px; color: #6b7280; }
    .grade-badge {
      display: inline-block;
      width: 26px;
      text-align: center;
      border-radius: 5px;
      font-weight: 800;
      font-size: 12px;
      padding: 5px 0;
    }
    .badge-lulus {
      background: #dcfce7;
      color: #15803d;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .badge-tidak {
      background: #fee2e2;
      color: #b91c1c;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .nilai-num {
      font-weight: 700;
      font-size: 13px;
      color: #111827;
      display: inline-block;
      width: 30px;
    }
    .bar-wrap {
      background: #e5e7eb;
      height: 5px;
      border-radius: 3px;
      margin-top: 4px;
    }
    .bar-fill {
      height: 5px;
      border-radius: 3px;
      background: #097797;
    }

    /* ── Footer ── */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
      padding: 14px 36px;
    }
    .footer-table { width: 100%; border-collapse: collapse; }
    .footer-table td { vertical-align: middle; }
    .brand-name { font-size: 12px; font-weight: 700; color: #097797; }
    .ts { font-size: 10px; color: #9ca3af; text-align: right; }
  </style>
</head>
<body>
  @php
    $logoPath = base_path('../Frontend/public/images/akademis-logo-1x1.png');
    $logo = file_exists($logoPath)
      ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
      : null;
  @endphp

  <!-- Header -->
  <div class="header">
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;">
          <div class="brand">CBT Akademis AI</div>
          <h1>Hasil Ujian</h1>
          <div class="subtitle">{{ $info['mata_kuliah'] }} &mdash; {{ $info['nama_ujian'] }}</div>
        </td>
        @if($logo)
        <td style="vertical-align:middle; text-align:right; width:80px;">
          <img src="{{ $logo }}" style="width:64px; height:64px; border-radius:12px; opacity:0.9;" />
        </td>
        @endif
      </tr>
    </table>
  </div>

  <!-- Meta -->
  <table class="meta-table">
    <tr>
      <td>
        <div class="meta-label">Tanggal</div>
        <div class="meta-val">{{ $info['tanggal'] }}</div>
      </td>
      <td>
        <div class="meta-label">Jenis Ujian</div>
        <div class="meta-val">{{ $info['jenis_ujian'] }}</div>
      </td>
      <td>
        <div class="meta-label">Total Peserta</div>
        <div class="meta-val">{{ $info['total_peserta'] }} Mahasiswa</div>
      </td>
      <td>
        <div class="meta-label">Total Soal</div>
        <div class="meta-val">{{ $info['total_soal'] }} Soal</div>
      </td>
    </tr>
  </table>

  <!-- Stats -->
  <table class="stats-table">
    <tr>
      <td>
        <div class="s-label">Rata-rata Nilai</div>
        <div class="s-val s-avg">{{ $stats['rata_rata'] }}</div>
        <div class="s-sub">dari 100</div>
      </td>
      <td>
        <div class="s-label">Total Lulus</div>
        <div class="s-val s-pass">{{ $stats['total_lulus'] }}</div>
        <div class="s-sub">mahasiswa</div>
      </td>
      <td>
        <div class="s-label">Kelulusan</div>
        <div class="s-val s-pct">{{ $stats['persen_lulus'] }}%</div>
        <div class="s-sub">dari total peserta</div>
      </td>
    </tr>
  </table>

  <!-- Table -->
  <div class="table-wrap">
    <div class="table-title">Daftar Nilai Peserta</div>
    <table class="main">
      <thead>
        <tr>
          <th style="width:30px">No</th>
          <th style="width:100px">NIM</th>
          <th>Nama Mahasiswa</th>
          <th style="width:120px">Nilai</th>
          <th style="width:60px; text-align:center">Grade</th>
          <th style="width:90px; text-align:center">Status</th>
        </tr>
      </thead>
      <tbody>
        @foreach($peserta as $i => $p)
        @php
          $gradeColors = [
            'A' => 'background:#dcfce7;color:#15803d;',
            'B' => 'background:#dbeafe;color:#1d4ed8;',
            'C' => 'background:#fef9c3;color:#a16207;',
            'D' => 'background:#ffedd5;color:#c2410c;',
            'E' => 'background:#fee2e2;color:#b91c1c;',
          ];
          $gradeStyle = $gradeColors[$p['grade'] ?? ''] ?? 'background:#f3f4f6;color:#6b7280;';
          $barWidth = $p['nilai'] !== null ? min($p['nilai'], 100) : 0;
        @endphp
        <tr>
          <td style="color:#9ca3af;font-size:11px">{{ $i + 1 }}</td>
          <td><span class="nim">{{ $p['nim'] }}</span></td>
          <td style="font-weight:500">{{ $p['nama'] }}</td>
          <td>
            <span class="nilai-num">{{ $p['nilai'] ?? '-' }}</span>
            @if($p['nilai'] !== null)
            <div class="bar-wrap">
              <div class="bar-fill" style="width:{{ $barWidth }}%"></div>
            </div>
            @endif
          </td>
          <td style="text-align:center">
            @if($p['grade'])
              <span class="grade-badge" style="{{ $gradeStyle }}">{{ $p['grade'] }}</span>
            @else
              <span style="color:#9ca3af">-</span>
            @endif
          </td>
          <td style="text-align:center">
            @if($p['nilai'] !== null)
              @if($p['lulus'])
                <span class="badge-lulus">Lulus</span>
              @else
                <span class="badge-tidak">Tidak Lulus</span>
              @endif
            @else
              <span style="color:#9ca3af">-</span>
            @endif
          </td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <table class="footer-table">
      <tr>
        <td><span class="brand-name">CBT Akademis AI</span></td>
        <td class="ts">Diekspor pada {{ now()->timezone('Asia/Jakarta')->format('d M Y, H:i') }} WIB</td>
      </tr>
    </table>
  </div>
</body>
</html>
