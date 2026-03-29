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
        Schema::create('ujian_setting', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ujian_id');
            $table->boolean('randomize_soal')->default(false);
            $table->integer('max_attempt')->default(1);
            $table->float('passing_grade')->default(60);
            $table->boolean('proctoring_aktif')->default(false);
            $table->string('pembagian_durasi')->nullable();
            $table->timestamps();

            $table->foreign('ujian_id')->references('id')->on('ujian')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian_setting');
    }
};
