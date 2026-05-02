<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pmb_penerimaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('universitas_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('tahun');
            $table->unsignedInteger('total_pendaftar')->default(0);
            $table->unsignedInteger('total_diterima')->default(0);
            $table->timestamps();

            $table->unique(['universitas_id', 'tahun']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pmb_penerimaan');
    }
};
