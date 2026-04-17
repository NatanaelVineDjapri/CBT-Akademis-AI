<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorController extends Controller
{
    public function setup(Request $request)
    {
        $user     = $request->user();
        $google2fa = new Google2FA();

        if (!$user->google2fa_secret) {
            $secret = $google2fa->generateSecretKey();
            $user->update(['google2fa_secret' => $secret]);
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->google2fa_secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrSvg  = $writer->writeString($qrCodeUrl);

        return response()->json([
            'secret'  => $user->google2fa_secret,
            'qr_code' => base64_encode($qrSvg),
        ]);
    }

    public function enable(Request $request)
    {
        $request->validate(['code' => 'required|digits:6'], [
            'code.required' => 'Kode 2FA wajib diisi!',
            'code.digits'   => 'Kode 2FA harus 6 digit!',
        ]);

        $user      = $request->user();
        $google2fa = new Google2FA();
        $valid     = $google2fa->verifyKey($user->google2fa_secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Kode 2FA salah!'], 422);
        }

        $user->update(['google2fa_enabled' => true]);

        return response()->json(['message' => '2FA berhasil diaktifkan!']);
    }

    public function disable(Request $request)
    {
        $request->validate(['code' => 'required|digits:6'], [
            'code.required' => 'Kode 2FA wajib diisi!',
            'code.digits'   => 'Kode 2FA harus 6 digit!',
        ]);

        $user      = $request->user();
        $google2fa = new Google2FA();
        $valid     = $google2fa->verifyKey($user->google2fa_secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Kode 2FA salah!'], 422);
        }

        $user->update([
            'google2fa_enabled' => false,
            'google2fa_secret'  => null,
        ]);

        return response()->json(['message' => '2FA berhasil dinonaktifkan!']);
    }
}