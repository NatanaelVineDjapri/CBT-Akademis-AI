<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function signature(Request $request)
    {
        $timestamp = time();
        $publicId  = 'users/user_' . $request->user()->id;

        $params = [
            'invalidate' => 'true',
            'overwrite'  => 'true',
            'public_id'  => $publicId,
            'timestamp'  => $timestamp,
        ];

        ksort($params);
        $stringToSign = collect($params)->map(fn($v, $k) => "$k=$v")->implode('&');
        $stringToSign .= env('CLOUDINARY_API_SECRET');

        return response()->json([
            'signature'  => sha1($stringToSign),
            'timestamp'  => $timestamp,
            'public_id'  => $publicId,
            'api_key'    => env('CLOUDINARY_API_KEY'),
            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        ]);
    }
}
