<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class UsersExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    protected Collection $users;
    protected array $columns;

    private const COLUMN_LABELS = [
        'nama'        => 'Nama',
        'email'       => 'Email',
        'role'        => 'Role',
        'nim'         => 'NIM',
        'nidn'        => 'NIDN',
        'prodi'       => 'Program Studi',
        'tahun_masuk' => 'Angkatan',
        'no_telp'     => 'No. Telepon',
        'alamat'      => 'Alamat',
    ];

    private const ROLE_LABELS = [
        'dosen'                  => 'Dosen',
        'mahasiswa'              => 'Mahasiswa',
        'peserta_mahasiswa_baru' => 'Peserta PMB',
        'admin_universitas'      => 'Admin Universitas',
        'admin_akademis_ai'      => 'Admin Akademis AI',
    ];

    public function __construct(Collection $users, array $columns)
    {
        $this->users   = $users;
        $this->columns = $columns;
    }

    public function collection(): Collection
    {
        return $this->users->map(function ($u, $i) {
            $row = ['No' => $i + 1];
            foreach ($this->columns as $col) {
                $value = $u[$col] ?? null;
                if ($col === 'role') {
                    $value = self::ROLE_LABELS[$value] ?? $value;
                }
                $row[self::COLUMN_LABELS[$col] ?? $col] = $value ?? '-';
            }
            return $row;
        });
    }

    public function headings(): array
    {
        $headers = ['No'];
        foreach ($this->columns as $col) {
            $headers[] = self::COLUMN_LABELS[$col] ?? $col;
        }
        return $headers;
    }

    public function title(): string
    {
        return 'Data User';
    }

    public function styles(Worksheet $sheet): array
    {
        $lastCol = $sheet->getHighestColumn();
        $lastRow = $sheet->getHighestRow();

        // Header row style
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 10],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF097797']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF097797']]],
        ]);

        // Data rows
        if ($lastRow > 1) {
            $sheet->getStyle("A2:{$lastCol}{$lastRow}")->applyFromArray([
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFE5E7EB']]],
            ]);

            // Zebra striping
            for ($row = 2; $row <= $lastRow; $row++) {
                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:{$lastCol}{$row}")
                        ->getFill()->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()->setARGB('FFF8FAFC');
                }
            }

            // No column centered
            $sheet->getStyle("A2:A{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        $sheet->getRowDimension(1)->setRowHeight(22);

        return [];
    }

    public function columnWidths(): array
    {
        $widths = ['A' => 5]; // No column

        $colWidths = [
            'nama'        => 28,
            'email'       => 32,
            'role'        => 16,
            'nim'         => 14,
            'nidn'        => 14,
            'prodi'       => 30,
            'tahun_masuk' => 10,
            'no_telp'     => 15,
            'alamat'      => 36,
        ];

        $letters = range('B', 'Z');
        foreach ($this->columns as $i => $col) {
            if (isset($letters[$i])) {
                $widths[$letters[$i]] = $colWidths[$col] ?? 18;
            }
        }

        return $widths;
    }
}
