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
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

        .badge {
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

        .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 24px 0;
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
            <p class="greeting">Halo, {{ $namaPenerima }}!</p>
            <span class="badge">📚 Bank Soal Baru</span>

            <p class="subtitle">
                <strong style="color: #111827;">{{ $namaPengirim }}</strong>
                baru saja membagikan sebuah bank soal ke kamu di CBT Akademis AI.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                    <td style="background:#e0f2f7; border:1.5px solid #097797; border-radius:12px; padding:14px 18px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align:middle; text-align:center;">
                                    <span style="font-size:13px; color:#097797; font-weight:600;">Judul Bank
                                        Soal</span><br>
                                    <span
                                        style="font-size:16px; font-weight:700; color:#065f73;">{{ $namaBankSoal }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <p class="subtitle">
                Silakan login ke aplikasi untuk mulai mengakses bank soal tersebut.
            </p>

            <hr class="divider">

            <p style="font-size:12px; color:#9ca3af; margin:0;">
                Jika kamu merasa tidak mengenal pengirim ini, kamu bisa mengabaikan email ini.
            </p>
        </div>

        <div class="footer">
            <p style="font-size:12px; color:#9ca3af; margin:0;">© 2026 CBT Akademis AI. All rights reserved.</p>
        </div>

    </div>
</body>

</html>