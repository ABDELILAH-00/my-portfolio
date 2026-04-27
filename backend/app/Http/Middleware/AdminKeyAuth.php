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

        // Verify cryptographic signature for mutations
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            if (!$signature || !$timestamp) {
                return response()->json(['status' => 'error', 'message' => 'Signature cryptographique manquante'], 403);
            }

            // Anti-replay: Reject requests with more than 300 seconds of drift
            if (abs(time() - (int)$timestamp) > 300) {
                \Illuminate\Support\Facades\Log::warning('Admin API timestamp drift rejected', [
                    'ip' => $request->ip(),
                    'timestamp' => $timestamp
                ]);
                return response()->json(['status' => 'error', 'message' => 'Requête expirée ou dérive d\'horloge trop élevée'], 403);
            }

            $payload = $request->getContent();
            $message = $timestamp . $payload;
            $expectedSignature = hash_hmac('sha256', $message, $secret);

            // Anti-replay: Prevent duplicate signed requests using atomic Cache::add
            if (!\Illuminate\Support\Facades\Cache::add('admin_sig_' . $signature, true, 600)) {
                \Illuminate\Support\Facades\Log::warning('Admin API duplicate signature replay rejected', [
                    'ip' => $request->ip()
                ]);
                return response()->json(['status' => 'error', 'message' => 'Signature de requête en double rejetée'], 403);
            }

            if (!is_string($expectedSignature) || !is_string($signature) || !hash_equals($expectedSignature, $signature)) {
                \Illuminate\Support\Facades\Log::warning('Admin API signature validation failed', [
                    'ip' => $request->ip()
                ]);
                // If signature validation fails, remove the newly added nonce so the user isn't locked out of retrying legitimately
                \Illuminate\Support\Facades\Cache::forget('admin_sig_' . $signature);
                return response()->json(['status' => 'error', 'message' => 'Signature cryptographique invalide'], 403);
            }
        }

        return $next($request);
    }
}
