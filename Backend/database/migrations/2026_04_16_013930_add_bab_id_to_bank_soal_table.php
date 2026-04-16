<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_soal', function (Blueprint $table) {
            $table->unsignedBigInteger('bab_id')->nullable()->after('mata_kuliah_id');
            $table->foreign('bab_id')->references('id')->on('bab')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bank_soal', function (Blueprint $table) {
            $table->dropForeign(['bab_id']);
            $table->dropColumn('bab_id');
        });
    }
};
