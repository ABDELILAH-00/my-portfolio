<?php
// --- CONFIGURATION CORS POUR INFINITYFREE ---
header("Access-Control-Allow-Origin: https://abdelilahportfolio.netlify.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-ADMIN-KEY, X-SIGNATURE, X-TIMESTAMP, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true"); // INDISPENSABLE POUR LE COOKIE __TEST

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}
// --------------------------------------------

// CORS Handling for InfinityFree/Shared Hosting
header("Access-Control-Allow-Origin: https://abdelilahportfolio.netlify.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-ADMIN-KEY, X-SIGNATURE, X-TIMESTAMP, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
