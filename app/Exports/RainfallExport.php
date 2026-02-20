<?php

namespace App\Exports;

use App\Models\Rainfall;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\ShouldAutoSize; 
use Maatwebsite\Excel\Concerns\WithStyles;     
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border; 

use Carbon\Carbon;

class RainfallExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        $query = Rainfall::query();

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('recorded_at', [
                $this->startDate . ' 00:00:00', 
                $this->endDate . ' 23:59:59'
            ]);
        }

        return $query->orderBy('recorded_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'Waktu',
            'Constanta (mm)',
            'Curah Hujan (mm)',
            'Jumlah Tip',
            'Event',
        ];
    }

    public function map($row): array
    {
        return [
            Carbon::parse($row->recorded_at)->locale('id')->isoFormat('D MMMM YYYY HH:mm:ss'),
            $row->constant == 0 ? '0' : $row->constant, 
            $row->rainfall == 0 ? '0' : $row->rainfall,
            $row->cycle == 0 ? '0' : $row->cycle,
            $row->event_id == 0 ? '0' : $row->event_id,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Mendapatkan baris terakhir yang memiliki data
        $highestRow = $sheet->getHighestRow();
        
        // Menentukan area tabel (dari kolom A baris 1, sampai kolom E baris terakhir)
        $tableRange = 'A1:E' . $highestRow;

        return [
            // Baris 1 (Headings) huruf tebal
            1 => ['font' => ['bold' => true]],
            
            // Rata Tengah (Center) untuk Kolom A sampai E
            'A:E' => [
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],

            // Menambahkan Border ke seluruh area tabel
            $tableRange => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['argb' => '000000'], // Warna border hitam
                    ],
                ],
            ],
        ];
    }
}