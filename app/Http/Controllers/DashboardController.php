<?php

namespace App\Http\Controllers;

use App\Models\Rainfall;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil Filter Waktu (Default: today)
        $filter = $request->input('filter', 'today');
        
        // 2. Data Terakhir untuk Status Online
        $latest = Rainfall::latest('recorded_at')->first();
        
        $isOnline = false;
        $lastSeen = '-';
        
        if ($latest) {
            $lastTime = Carbon::parse($latest->recorded_at);
            // Toleransi 6 menit (Alat kirim tiap 5 menit + 1 menit delay jaringan)
            $isOnline = $lastTime->diffInMinutes(now()) <= 6;
            $lastSeen = $lastTime->diffForHumans();
        }

        // 3. Summary Hari Ini
        $todayRainfall = Rainfall::whereDate('recorded_at', Carbon::today())->sum('rainfall');
        
        // Menggunakan max() karena event_id dari ESP8266 sudah berupa angka counter harian (1, 2, 3...)
        $todayEvents = Rainfall::whereDate('recorded_at', Carbon::today())->max('event_id') ?? 0;

        // Logika Status Cuaca
        $statusCuaca = 'AMAN TERKENDALI'; // Sesuaikan dengan text di React
        if ($latest && $latest->rainfall > 0 && Carbon::parse($latest->recorded_at)->diffInMinutes(now()) <= 10) {
            $statusCuaca = 'HUJAN';
        }

        // 4. Logika Grafik Berdasarkan Filter
        $chartData = [];

        if ($filter === 'detail') {
            // Tampilkan data mentah 2 Jam terakhir per interval pengiriman
            $chartData = Rainfall::where('recorded_at', '>=', Carbon::now()->subHours(2))
                ->orderBy('recorded_at', 'asc')
                ->get()
                ->map(function ($row) {
                    return [
                        'label' => Carbon::parse($row->recorded_at)->format('H:i'),
                        'value' => (float) $row->rainfall
                    ];
                });
        } elseif ($filter === 'today') {
            // Hari ini: Kelompokkan curah hujan per Jam
            $chartData = Rainfall::whereDate('recorded_at', Carbon::today())
                ->selectRaw('HOUR(recorded_at) as hour, SUM(rainfall) as total')
                ->groupBy('hour')
                ->orderBy('hour', 'asc')
                ->get()
                ->map(function ($row) {
                    return [
                        'label' => str_pad($row->hour, 2, '0', STR_PAD_LEFT) . ':00',
                        'value' => (float) $row->total
                    ];
                });
        } elseif ($filter === 'week') {
            // Minggu ini: Kelompokkan curah hujan per Hari (7 Hari Terakhir)
            $chartData = Rainfall::where('recorded_at', '>=', Carbon::now()->subDays(6)->startOfDay())
                ->selectRaw('DATE(recorded_at) as date, SUM(rainfall) as total')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get()
                ->map(function ($row) {
                    return [
                        'label' => Carbon::parse($row->date)->format('d M'),
                        'value' => (float) $row->total
                    ];
                });
        } elseif ($filter === 'month') {
            // Bulan ini: Kelompokkan curah hujan per Tanggal
            $chartData = Rainfall::whereMonth('recorded_at', Carbon::now()->month)
                ->whereYear('recorded_at', Carbon::now()->year)
                ->selectRaw('DAY(recorded_at) as day, SUM(rainfall) as total')
                ->groupBy('day')
                ->orderBy('day', 'asc')
                ->get()
                ->map(function ($row) {
                    return [
                        'label' => 'Tgl ' . $row->day,
                        'value' => (float) $row->total
                    ];
                });
        }

        // 5. Render Inertia
        return Inertia::render('Dashboard', [
            'summary' => [
                'last_recorded' => $latest ? Carbon::parse($latest->recorded_at)->format('d M Y H:i:s') : 'Belum ada data',
                'status' => $statusCuaca,
                'today' => (float) $todayRainfall,
                'event_count' => (int) $todayEvents
            ],
            'device_status' => [
                'is_online' => $isOnline,
                'last_seen' => $lastSeen
            ],
            'chartData' => $chartData,
            'activeFilter' => $filter
        ]);
    }
}