<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f0f4f8;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            background: white;
            max-width: 520px;
            margin: auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            padding: 36px 40px 28px;
            text-align: center;
            border-bottom: 1px solid #f0f4f8;
        }
        .header img {
            height: 44px;
            width: auto;
        }
        .body {
            padding: 36px 40px 28px;
            text-align: center;
        }
        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 6px;
        }
        .role-badge {
            display: inline-block;
            background: #e0f2f7;
            color: #097797;
            font-size: 13px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 999px;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: 15px;
            color: #6b7280;
            margin: 0 0 28px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background: #097797;
            color: white !important;
            text-decoration: none;
            padding: 15px 48px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.3px;
            margin-bottom: 28px;
        }
        .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
        }
        .fallback {
            font-size: 12px;
            color: #9ca3af;
            margin: 0 0 6px;
        }
        .link {
            font-size: 11px;
            color: #097797;
            word-break: break-all;
            text-decoration: none;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
            padding: 20px 40px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ $message->embed($logoPath) }}" alt="akademis.ai">
        </div>

        <div class="body">
            <p class="greeting">Halo, {{ $nama }}!</p>
            <span class="role-badge">
                {{ $roleLabel }}{{ $universitasKode ? ' ' . $universitasKode : '' }}
            </span>
            <p class="subtitle">Kami menerima permintaan untuk mereset password akun CBT Akademis AI kamu.</p>

            <a href="{{ $resetLink }}" class="btn">Reset Password</a>

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background:#fff7ed; border:1.5px solid #fb923c; border-radius:12px; padding:14px 18px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align:middle; text-align:center;">
                                    <span style="font-size:14px; font-weight:700; color:#c2410c;">Link berlaku 60 menit</span><br>
                                    <span style="font-size:12px; color:#9a3412; line-height:1.5;">Setelah 60 menit, link akan kadaluarsa dan kamu perlu meminta ulang.</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <hr class="divider">

            <p class="fallback">Jika tombol tidak berfungsi, salin link berikut ke browser:</p>
            <a href="{{ $resetLink }}" class="link">{{ $resetLink }}</a>
        </div>

        <div class="footer">
            <p style="font-size:12px; color:#9ca3af; margin:0;">Jika kamu tidak meminta reset password, abaikan email ini.</p>
            <p style="font-size:12px; color:#9ca3af; margin:8px 0 0;">© 2026 CBT Akademis AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
