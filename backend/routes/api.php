<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

// ─── Health Check ────────────────────────────────────────────
Route::get('/health', function () {
    $dbOk = false;
    $errorMsg = null;
    $tables = [];
    $dbName = null;
    
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbOk = true;
        $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
    } catch (\Exception $e) {
        $errorMsg = $e->getMessage();
    }

    return response()->json([
        'status' => 'ok',
        'db' => $dbOk ? 'connected' : 'error',
        'db_name' => $dbName,
        'db_error' => $errorMsg,
        'tables' => $tables,
        'cache' => config('cache.default'),
        'storage' => config('filesystems.default'),
        'queue' => config('queue.default'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

// ─── Public Routes ───────────────────────────────────────────
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/be3dol/login', [AuthController::class, 'login']);
Route::post('/recover-password', [AuthController::class, 'recoverPassword']);

// ─── Admin Routes (protected) ───────────────────────────────
Route::middleware(['admin.key', 'throttle:60,1'])->prefix('be3dol')->group(function () {
    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index']);

    // Projects CRUD
    Route::get('projects', [AdminProjectController::class, 'index']);
    Route::post('projects', [AdminProjectController::class, 'store']);
    Route::get('projects/{id}', [AdminProjectController::class, 'show']);
    Route::put('projects/{id}', [AdminProjectController::class, 'update']);
    Route::delete('projects/{id}', [AdminProjectController::class, 'destroy']);

    // Skills CRUD
    Route::get('skills', [AdminSkillController::class, 'index']);
    Route::post('skills', [AdminSkillController::class, 'store']);
    Route::delete('skills/{id}', [AdminSkillController::class, 'destroy']);
    Route::post('skills/reorder', [AdminSkillController::class, 'reorder']);

    // Contacts
    Route::get('contacts', [AdminContactController::class, 'index']);
    Route::patch('contacts/{id}/read', [AdminContactController::class, 'markAsRead']);
    Route::delete('contacts/{id}', [AdminContactController::class, 'destroy']);

    // Auth & Profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::patch('/password', [\App\Http\Controllers\Admin\ProfileController::class, 'updatePassword']);
    Route::patch('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'updateProfile']);
});
