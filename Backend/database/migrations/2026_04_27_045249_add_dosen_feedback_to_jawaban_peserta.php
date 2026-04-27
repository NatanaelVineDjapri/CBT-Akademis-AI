<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jawaban_peserta', function (Blueprint $table) {
            $table->text('dosen_feedback')->nullable()->after('ai_feedback');
        });
    }

    public function down(): void
    {
        Schema::table('jawaban_peserta', function (Blueprint $table) {
            $table->dropColumn('dosen_feedback');
        });
    }
};
