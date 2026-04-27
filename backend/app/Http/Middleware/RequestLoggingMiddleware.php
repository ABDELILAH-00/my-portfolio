<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestLoggingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $executionTime = round((microtime(true) - $startTime) * 1000);
        $statusCode = $response->getStatusCode();

        if ($statusCode >= 400 || $executionTime > 500) {
            Log::info('Request Processed', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'status' => $statusCode,
                'execution_time_ms' => $executionTime,
                'ip' => $request->ip()
            ]);
        }

        return $response;
    }
}
