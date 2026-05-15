<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->tinyInteger('semester')->nullable()->after('prodi_id'); // 1–8
            $table->tinyInteger('sks')->nullable()->after('semester');
        });

        Schema::table('prodi', function (Blueprint $table) {
            $table->tinyInteger('krs_mulai_semester')->default(1)->after('nim_prefix');
        });
    }

    public function down(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->dropColumn(['semester', 'sks']);
        });

        Schema::table('prodi', function (Blueprint $table) {
            $table->dropColumn('krs_mulai_semester');
        });
    }
};
