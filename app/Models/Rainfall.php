<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rainfall extends Model
{
    use HasFactory;
    protected $table = 'rainfalls';

    protected $fillable = [
        'rainfall',    // Curah hujan (mm)
        'constant',    // Nilai pertip
        'cycle',       // Jumlah tip/cyclus
        'event_id',    // ID Kejadian
        'recorded_at', // Waktu pencatatan
    ];

    public $timestamps = true; 
}