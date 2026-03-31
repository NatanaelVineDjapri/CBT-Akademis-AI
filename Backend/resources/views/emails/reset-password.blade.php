<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px 0; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 15px 0; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 10px 15px; font-size: 13px; color: #92400e; }
        .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>CBT Akademis AI</h2>
        </div>
        <div class="content">
            <p>Halo, <strong>{{ $nama }}</strong>!</p>
            <p>Kami menerima permintaan reset password untuk akun kamu. Klik tombol di bawah untuk melanjutkan:</p>
            <div style="text-align: center;">
                <a href="{{ $resetLink }}" class="btn">Reset Password</a>
            </div>
            <div class="warning">
                ⚠️ Link ini hanya berlaku selama <strong>60 menit</strong>. Jika kamu tidak merasa melakukan permintaan ini, abaikan email ini.
            </div>
        </div>
        <div class="footer">
            <p>© 2026 CBT Akademis AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>