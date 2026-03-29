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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('role'); // admin, dosen, peserta
            $table->string('nim')->nullable();
            $table->string('nidn')->nullable();
            $table->string('no_telp')->nullable();
            $table->text('alamat')->nullable();
            $table->integer('tahun_masuk')->nullable();
            $table->unsignedBigInteger('prodi_id')->nullable();
            $table->boolean('is_temporary')->default(false);
            $table->dateTime('expired_at')->nullable();
            $table->timestamps();

            $table->foreign('prodi_id')->references('id')->on('prodi')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
