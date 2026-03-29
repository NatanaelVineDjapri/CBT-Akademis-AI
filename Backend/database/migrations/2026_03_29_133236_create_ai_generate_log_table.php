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
        Schema::create('ai_generate_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bank_soal_id');
            $table->unsignedBigInteger('user_id');
            $table->string('tipe_soal'); // pilihan_ganda, checklist, essay
            $table->integer('jumlah');
            $table->text('prompt');
            $table->string('status')->default('pending'); // pending, success, failed
            $table->timestamps();

            $table->foreign('bank_soal_id')->references('id')->on('bank_soal')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_generate_log');
    }
};
