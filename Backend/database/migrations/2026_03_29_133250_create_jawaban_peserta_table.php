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
        Schema::create('jawaban_peserta', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('peserta_ujian_id');
            $table->unsignedBigInteger('ujian_soal_id');
            $table->text('jawaban')->nullable();
            $table->float('nilai')->nullable();
            $table->boolean('is_manual_graded')->default(false);
            $table->float('ai_skor')->nullable();
            $table->text('ai_feedback')->nullable();
            $table->float('final_nilai')->nullable();
            $table->timestamps();

            $table->foreign('peserta_ujian_id')->references('id')->on('peserta_ujian')->cascadeOnDelete();
            $table->foreign('ujian_soal_id')->references('id')->on('ujian_soal')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_peserta');
    }
};
