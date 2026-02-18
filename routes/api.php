<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RainfallController;

// Route Test (Bisa dibuka di browser: http://IP_LAPTOP:8000/api/test)
Route::get('/test', function () {
    return response()->json(['message' => 'API Berjalan!']);
});

// --- ROUTE UTAMA DARI ESP8266 ---
Route::post('/rainfall', [RainfallController::class, 'store']);