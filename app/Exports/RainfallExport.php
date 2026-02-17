<?php

namespace App\Exports;

use App\Models\Rainfall;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;
use Carbon\Carbon;

class RainfallExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $startDate;
    protected $endDate;

    // Terima filter dari Controller
    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        $query = Rainfall::query();

        // Terapkan Filter Tanggal jika ada
        if ($this->startDate && $this->endDate) {
            // Tambahkan jam 00:00:00 dan 23:59:59 agar filter akurat
            $query->whereBetween('recorded_at', [
                $this->startDate . ' 00:00:00', 
                $this->endDate . ' 23:59:59'
            ]);
        }

        return $query->orderBy('recorded_at', 'desc');
    }

    // Judul Kolom di Excel
    public function headings(): array
    {
        return [
            'Waktu (WITA)',
            'Curah Hujan (mm)',
            'Jumlah Tip',
            'Event ID',
        ];
    }

    // Format Data per Baris
    public function map($row): array
    {
        return [
            // Ubah waktu database ke WITA
            Carbon::parse($row->recorded_at)->timezone('Asia/Makassar')->format('d-m-Y H:i:s'),
            $row->rainfall,
            $row->cycle,
            $row->event_id,
        ];
    }
}