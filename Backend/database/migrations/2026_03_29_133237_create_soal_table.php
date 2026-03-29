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
        Schema::create('soal', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bank_soal_id');
            $table->unsignedBigInteger('mata_kuliah_id');
            $table->unsignedBigInteger('bab_id')->nullable();
            $table->unsignedBigInteger('ai_generate_log_id')->nullable();
            $table->text('deskripsi');
            $table->string('tingkat_kesulitan'); // rendah, sedang, sulit
            $table->boolean('ai_generated')->default(false);
            $table->timestamps();

            $table->foreign('bank_soal_id')->references('id')->on('bank_soal')->cascadeOnDelete();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliah')->cascadeOnDelete();
            $table->foreign('bab_id')->references('id')->on('bab')->nullOnDelete();
            $table->foreign('ai_generate_log_id')->references('id')->on('ai_generate_log')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soal');
    }
};
