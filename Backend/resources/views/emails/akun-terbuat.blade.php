<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px 0; }
        .kredensial { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 15px 0; }
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
            <p>Akun kamu di <strong>CBT Akademis AI</strong> telah berhasil dibuat. Berikut kredensial login kamu:</p>
            <div class="kredensial">
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Password:</strong> {{ $password }}</p>
            </div>
            <p>Silakan login dan segera ganti password kamu!</p>
            <p>Jaga kerahasiaan kredensial ini dan jangan bagikan ke siapapun.</p>
        </div>
        <div class="footer">
            <p>© 2026 CBT Akademis AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>