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
        Schema::create('ujian_soal', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ujian_id');
            $table->unsignedBigInteger('soal_id');
            $table->unsignedBigInteger('section_id')->nullable();
            $table->integer('time_per_question')->nullable();
            $table->float('bobot');
            $table->integer('urutan');
            $table->timestamps();

            $table->foreign('ujian_id')->references('id')->on('ujian')->cascadeOnDelete();
            $table->foreign('soal_id')->references('id')->on('soal')->cascadeOnDelete();
            $table->foreign('section_id')->references('id')->on('section')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian_soal');
    }
};
