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
        Schema::create('opsi_jawaban', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jenis_soal_id');
            $table->string('opsi'); // "A", "B", "C", "D"
            $table->text('teks');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('jenis_soal_id')->references('id')->on('jenis_soal')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opsi_jawaban');
    }
};
