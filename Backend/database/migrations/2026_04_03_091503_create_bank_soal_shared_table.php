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
        Schema::create('bank_soal_shared', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bank_soal_id');
            $table->unsignedBigInteger('user_id')->nullable(); // nullable kalau via link
            $table->string('token')->unique()->nullable();     // untuk akses via link
            $table->dateTime('expired_at')->nullable();        // expired link
            $table->timestamps();

            $table->foreign('bank_soal_id')->references('id')->on('bank_soal')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_soal_shared');
    }
};
