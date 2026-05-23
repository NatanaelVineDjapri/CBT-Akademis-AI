<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WebRtcSignal implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int   $pesertaUjianId;
    public array $payload;

    public function __construct(int $pesertaUjianId, array $payload)
    {
        $this->pesertaUjianId = $pesertaUjianId;
        $this->payload        = $payload;
    }

    public function broadcastOn(): Channel
    {
        return new Channel("proctoring-signal.{$this->pesertaUjianId}");
    }

    public function broadcastAs(): string
    {
        return 'webrtc-signal';
    }

    public function broadcastWith(): array
    {
        return $this->payload;
    }
}
