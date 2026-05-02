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
        $signature = $request->header('X-SIGNATURE');
        $timestamp = $request->header('X-TIMESTAMP');
        $secret = config('admin.secret_key');

        if (!$key || !is_string($secret) || !is_string($key) || !hash_equals($secret, $key)) {
            \Illuminate\Support\Facades\Log::warning('Unauthorized admin access attempt', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
            ]);
            return response()->json(['status' => 'error', 'message' => 'Accès interdit'], 403);
        }

        return $next($request);
    }
}
