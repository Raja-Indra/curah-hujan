<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rainfall;

class RainfallController extends Controller
{
    public function store(Request $request)
    {
        // Validasi data dari ESP8266
        $validated = $request->validate([
            'rainfall' => 'required|numeric',
            'constant' => 'required|numeric',
            'cycle' => 'required|integer',
            'event_id' => 'required',
            'recorded_at' => 'nullable|date',
        ]);

        // Simpan ke database
        $rainfall = Rainfall::create([
            'rainfall' => $validated['rainfall'],
            'constant' => $validated['constant'],
            'cycle' => $validated['cycle'],
            'event_id' => $validated['event_id'],
            // Gunakan waktu dari alat jika ada, jika tidak pakai waktu server
            'recorded_at' => $validated['recorded_at'] ?? now(),
        ]);

        return response()->json(['message' => 'Data saved', 'data' => $rainfall], 201);
    }
}