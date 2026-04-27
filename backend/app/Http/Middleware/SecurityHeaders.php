<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (method_exists($response, 'header')) {
            if (isset($response->headers) && method_exists($response->headers, 'remove')) {
                $response->headers->remove('X-Powered-By');
                $response->headers->remove('Server');
            }
            $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            $response->header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:");
            $response->header('X-Frame-Options', 'SAMEORIGIN');
            $response->header('X-Content-Type-Options', 'nosniff');
            $response->header('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
            $response->header('Connection', 'close');
        }

        return $response;
    }
}
