<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rainfall extends Model
{
    use HasFactory;

    // Izinkan semua kolom diisi
    protected $guarded = [];
}