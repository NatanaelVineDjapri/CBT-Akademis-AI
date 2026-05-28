<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function getMaintenanceStatus()
    {
        return response()->json([
            'maintenance' => (bool) Cache::get('maintenance_mode', false),
        ]);
    }

    public function toggleMaintenance(Request $request)
    {
        $current = (bool) Cache::get('maintenance_mode', false);
        $next    = !$current;

        Cache::put('maintenance_mode', $next, now()->addYear());

        MaintenanceLog::create([
            'user_id' => $request->user()->id,
            'action'  => $next ? 'activated' : 'deactivated',
        ]);

        return response()->json([
            'maintenance' => $next,
            'message'     => $next ? 'Maintenance mode diaktifkan.' : 'Maintenance mode dinonaktifkan.',
        ]);
    }

    public function getMaintenanceLogs(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        $logs = MaintenanceLog::with('user:id,nama,email')
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data'      => $logs->map(fn($l) => [
                'id'         => $l->id,
                'action'     => $l->action,
                'user_nama'  => $l->user?->nama,
                'user_email' => $l->user?->email,
                'created_at' => $l->created_at->format('d M Y, H:i'),
            ]),
            'last_page' => $logs->lastPage(),
            'total'     => $logs->total(),
        ]);
    }
}
