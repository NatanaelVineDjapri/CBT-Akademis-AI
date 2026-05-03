<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        if (Cache::get('maintenance_mode', false) && $request->user()?->role !== 'admin_akademis_ai') {
            return response()->json([
                'message' => 'Sistem sedang dalam pemeliharaan. Silakan coba lagi nanti.',
            ], 503);
        }

        return $next($request);
    }
}
