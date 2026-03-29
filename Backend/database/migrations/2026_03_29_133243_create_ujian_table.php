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
        Schema::create('ujian', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('mata_kuliah_id');
            $table->string('nama_ujian');
            $table->string('jenis_ujian'); // pmb, perkuliahan, non_akademik
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->integer('durasi_menit');
            $table->string('kode_akses')->unique();
            $table->boolean('is_kode_aktif')->default(true);
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliah')->cascadeOnDelete();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian');
    }
};
