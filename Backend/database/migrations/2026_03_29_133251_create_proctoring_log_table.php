<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proctoring_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peserta_ujian_id');
            $table->string('tipe_pelanggaran');
            $table->float('risk_score')->nullable();
            $table->timestamp('waktu');
            $table->timestamps();

            $table->foreign('peserta_ujian_id')->references('id')->on('peserta_ujian')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proctoring_log');
    }
};
