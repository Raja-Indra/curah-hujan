<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RainfallController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController; 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- HALAMAN DEPAN ---
Route::get('/', function () {
    return redirect()->route('login');
});

// --- GROUP 1: SEMUA USER YANG SUDAH LOGIN ---
Route::middleware(['auth', 'verified'])->group(function () {

    // 1. DASHBOARD (Bisa diakses jika punya izin 'view dashboard')
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('can:view dashboard') 
        ->name('dashboard');

    // 2. DATA HUJAN (Bisa diakses jika punya izin 'view rainfall')
    Route::get('/rainfall-data', [RainfallController::class, 'index'])
        ->middleware('can:view rainfall')
        ->name('rainfall.data');
        
    Route::get('/rainfall-data/export', [RainfallController::class, 'export'])
        ->middleware('can:export rainfall')
        ->name('rainfall.export');

    // 3. PROFILE (Bisa diakses semua user yang login untuk edit akun sendiri)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    // --- GROUP 2: KHUSUS ADMIN (Hanya yang punya izin 'manage users') ---
    // Pindahkan Users dan Roles ke dalam sini agar user biasa tidak bisa "nembak" URL
    // Grup khusus untuk halaman Users
    Route::middleware(['can:manage users'])->group(function () {
        Route::resource('users', UserController::class);
    });

    // Grup khusus untuk halaman Roles
    // Pastikan nama permission 'manage roles' ini sama persis dengan yang ada di database Anda
    Route::middleware(['can:manage roles'])->group(function () {
        Route::resource('roles', RoleController::class);
    });

});

require __DIR__.'/auth.php';