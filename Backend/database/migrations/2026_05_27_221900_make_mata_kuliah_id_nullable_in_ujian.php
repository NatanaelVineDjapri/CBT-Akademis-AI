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
        Schema::table('ujian', function (Blueprint $table) {
            $table->dropForeign(['mata_kuliah_id']);
            $table->unsignedBigInteger('mata_kuliah_id')->nullable()->change();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliah')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ujian', function (Blueprint $table) {
            $table->dropForeign(['mata_kuliah_id']);
            $table->unsignedBigInteger('mata_kuliah_id')->nullable(false)->change();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliah')->cascadeOnDelete();
        });
    }
};
