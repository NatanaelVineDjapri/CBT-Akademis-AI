<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nama;
    public string $resetLink;
    public string $roleLabel;
    public ?string $universitasKode;

    public function __construct(string $nama, string $resetLink, string $roleLabel, ?string $universitasKode = null)
    {
        $this->nama           = $nama;
        $this->resetLink      = $resetLink;
        $this->roleLabel      = $roleLabel;
        $this->universitasKode = $universitasKode;
    }

    public function build(): static
    {
        return $this->subject('Reset Password CBT Akademis AI')
            ->view('emails.reset-password')
            ->with([
                'logoPath' => public_path('images/logo-email.png'),
            ]);
    }
}
