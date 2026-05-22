<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PelanggaranMasuk implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('ujian.' . $this->data['ujian_id']);
    }

    public function broadcastAs(): string
    {
        return 'pelanggaran-masuk';
    }
}
