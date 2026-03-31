<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AkunTerbuatMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nama;
    public string $email;
    public string $password;

    public function __construct(string $nama, string $email, string $password)
    {
        $this->nama     = $nama;
        $this->email    = $email;
        $this->password = $password;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Akun CBT Akademis AI Kamu Telah Dibuat!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.akun-terbuat',
        );
    }
}