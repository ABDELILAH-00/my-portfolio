<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminKeyAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('X-ADMIN-KEY');
        $secret = config('admin.secret_key');

        if (!$key || !is_string($key)) {
            return response()->json(['status' => 'error', 'message' => 'Accès interdit'], 401);
        }

        $isValid = false;

        // 1. Check against database
        $user = \App\Models\User::first();
        if ($user && \Illuminate\Support\Facades\Hash::check($key, $user->password)) {
            $isValid = true;
        }

        // 2. Check against env secret key
        if (!$isValid && is_string($secret) && hash_equals($secret, $key)) {
            $isValid = true;
        }

        if (!$isValid) {
            \Illuminate\Support\Facades\Log::warning('Unauthorized admin access attempt', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
            ]);
            return response()->json(['status' => 'error', 'message' => 'Accès interdit'], 401);
        }

        return $next($request);
    }
}
