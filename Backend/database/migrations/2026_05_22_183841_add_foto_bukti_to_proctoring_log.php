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
        Schema::table('proctoring_log', function (Blueprint $table) {
            $table->string('foto_bukti')->nullable()->after('waktu');
        });
    }

    public function down(): void
    {
        Schema::table('proctoring_log', function (Blueprint $table) {
            $table->dropColumn('foto_bukti');
        });
    }
};
