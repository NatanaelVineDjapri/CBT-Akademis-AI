<?php

namespace App\Mail;

use App\Models\BankSoal;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BankSoalSharedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $namaPenerima;
    public string $namaPengirim;
    public string $namaBankSoal;

    public function __construct(User $targetUser, User $pengirim, BankSoal $bankSoal)
    {
        $this->namaPenerima  = $targetUser->nama;
        $this->namaPengirim  = $pengirim->nama;
        $this->namaBankSoal = $bankSoal->nama; 
    }

    public function build(): static
    {
        return $this->subject('Bank Soal Dibagikan ke Kamu!')
            ->view('emails.bank-soal-shared')
            ->with([
                'logoPath' => public_path('images/logo-email.png'),
            ]);
    }
}