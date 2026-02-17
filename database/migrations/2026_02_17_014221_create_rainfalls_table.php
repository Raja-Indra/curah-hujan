<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rainfalls', function (Blueprint $table) {
            $table->id();
            // Waktu dari RTC/NTP (untuk grafik historis)
            $table->dateTime('recorded_at'); 
            // Data teknis alat
            $table->decimal('constant', 8, 5); 
            $table->integer('cycle'); 
            $table->decimal('rainfall', 8, 2); 
            $table->integer('event_id'); 
            // Waktu masuk server (created_at) -> PENTING untuk status Online/Offline
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rainfalls');
    }
};
