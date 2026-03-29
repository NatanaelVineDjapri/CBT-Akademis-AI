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
        Schema::create('section', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ujian_id');
            $table->string('nama_section');
            $table->integer('time_per_section')->nullable();
            $table->string('jenis_soal'); // pilihan_ganda, checklist, essay
            $table->integer('urutan');
            $table->float('bobot');
            $table->timestamps();

            $table->foreign('ujian_id')->references('id')->on('ujian')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section');
    }
};
