<?php

namespace App\Http\Controllers;

use App\Models\Rainfall;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Exports\RainfallExport;
use Maatwebsite\Excel\Facades\Excel;

class RainfallController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil filter dari request
        $start_date = $request->start_date ?? now()->toDateString();
        $end_date = $request->end_date ?? now()->toDateString();
        $per_page = $request->per_page ?? 20;

        // 2. Query data berdasarkan rentang tanggal
        $rainfalls = \App\Models\Rainfall::whereBetween('recorded_at', [$start_date . ' 00:00:00', $end_date . ' 23:59:59'])
            ->latest()
            ->paginate($per_page)
            ->withQueryString();

        return Inertia::render('RainfallData', [
            'rainfalls' => $rainfalls,
            'filters' => $request->only(['start_date', 'end_date', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi data dari ESP8266
        $validated = $request->validate([
            'recorded_at' => 'required|date', // Format YYYY-MM-DD HH:MM:SS
            'constant'    => 'required|numeric',
            'cycle'       => 'required|integer',
            'rainfall'    => 'required|numeric',
            'event_id'    => 'required|integer',
        ]);

        // 2. Simpan ke Database Local
        Rainfall::create($validated);

        // 3. Beri respon sukses ke ESP8266
        return response()->json(['message' => 'Data saved successfully'], 201);
    }

    public function export(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Nama file otomatis ada tanggalnya
        $fileName = 'laporan-hujan-' . date('Y-m-d-His') . '.xlsx';

        return Excel::download(new RainfallExport($startDate, $endDate), $fileName);
    }
}