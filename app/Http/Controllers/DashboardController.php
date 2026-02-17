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
        // 1. Ambil Filter Waktu
        $filter = $request->input('filter', 'today');
        
        // 2. Data Terakhir
        $latest = Rainfall::latest('recorded_at')->first();
        
        $isOnline = false;
        $lastSeen = '-';
        
        if ($latest) {
            $lastTime = Carbon::parse($latest->recorded_at);
            $isOnline = $lastTime->diffInMinutes(now()) <= 5;
            $lastSeen = $lastTime->diffForHumans();
        }

        // 3. Summary Hari Ini
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();
        
        $todayRainfall = Rainfall::whereBetween('recorded_at', [$todayStart, $todayEnd])->sum('rainfall');
        $todayEvents = Rainfall::whereBetween('recorded_at', [$todayStart, $todayEnd])
                        ->distinct('event_id')
                        ->count('event_id');

        $statusCuaca = 'CERAH';
        if ($latest && $latest->rainfall > 0 && Carbon::parse($latest->recorded_at)->diffInMinutes(now()) <= 15) {
            $statusCuaca = 'HUJAN';
        }

        // 4. Grafik
        $query = Rainfall::query();
        
        if ($filter === 'today') {
            $query->whereDate('recorded_at', Carbon::today());
        } elseif ($filter === 'week') {
            $query->whereBetween('recorded_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        } elseif ($filter === 'month') {
            $query->whereMonth('recorded_at', Carbon::now()->month);
        } else {
            $query->limit(20);
        }

        $chartData = $query->orderBy('recorded_at', 'asc')
                           ->get()
                           ->map(function ($row) {
                               return [
                                   'label' => Carbon::parse($row->recorded_at)->format('H:i'),
                                   'value' => $row->rainfall
                               ];
                           });

        // 5. Render Inertia
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'summary' => [
                'last_recorded' => $latest ? Carbon::parse($latest->recorded_at)->format('d M Y H:i:s') : 'Belum ada data',
                'status' => $statusCuaca,
                'today' => $todayRainfall,
                'event_count' => $todayEvents
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