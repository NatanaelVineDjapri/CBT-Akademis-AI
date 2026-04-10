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
            $table->string('password');
            $table->string('role');
            $table->string('nim')->nullable();
            $table->string('nidn')->nullable();
            $table->string('no_telp')->nullable();
            $table->text('alamat')->nullable();
            $table->integer('tahun_masuk')->nullable();
            $table->unsignedBigInteger('universitas_id')->nullable(); // ← tambah ini
            $table->unsignedBigInteger('prodi_id')->nullable();
            $table->boolean('is_temporary')->default(false);
            $table->string('foto')->nullable();
            $table->string('status')->default('Aktif')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->timestamps();

            $table->foreign('universitas_id')->references('id')->on('universitas')->nullOnDelete(); // ← fix ini
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
