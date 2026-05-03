<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function getMaintenanceStatus()
    {
        return response()->json([
            'maintenance' => (bool) Cache::get('maintenance_mode', false),
        ]);
    }

    public function toggleMaintenance()
    {
        $current = (bool) Cache::get('maintenance_mode', false);
        $next    = !$current;

        Cache::put('maintenance_mode', $next, now()->addYear());

        return response()->json([
            'maintenance' => $next,
            'message'     => $next ? 'Maintenance mode diaktifkan.' : 'Maintenance mode dinonaktifkan.',
        ]);
    }
}
