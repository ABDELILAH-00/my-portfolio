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

// Public Routes Closure
$publicRoutes = function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/be3dol/login', [AuthController::class, 'login']);
    Route::post('/recover-password', [AuthController::class, 'recoverPassword']);
};

// Admin Routes Closure
$adminRoutes = function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index']);
    // Projects
    Route::get('projects', [AdminProjectController::class, 'index']);
    Route::post('projects', [AdminProjectController::class, 'store']);
    Route::put('projects/{id}', [AdminProjectController::class, 'update']);
    Route::delete('projects/{id}', [AdminProjectController::class, 'destroy']);
    Route::get('projects/{id}', [AdminProjectController::class, 'show']);

    // Skills
    Route::get('skills', [AdminSkillController::class, 'index']);
    Route::post('skills', [AdminSkillController::class, 'store']);
    Route::delete('skills/{id}', [AdminSkillController::class, 'destroy']);
    Route::post('skills/reorder', [AdminSkillController::class, 'reorder']);

    // Contacts
    Route::get('contacts', [AdminContactController::class, 'index']);
    Route::patch('contacts/{id}/read', [AdminContactController::class, 'markAsRead']);
    Route::delete('contacts/{id}', [AdminContactController::class, 'destroy']);

    // Auth & Identity
    Route::get('/user', [AuthController::class, 'user']);
    Route::patch('/password', [\App\Http\Controllers\Admin\ProfileController::class, 'updatePassword']);
    Route::patch('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'updateProfile']);
};

// --- BASE API ---
$publicRoutes();
Route::middleware(['admin.key', 'throttle:30,1'])->prefix('be3dol')->group($adminRoutes);
Route::middleware(['admin.key', 'throttle:30,1'])->prefix('x9f7-admin-core')->group($adminRoutes);

// --- V1 API ---
Route::prefix('v1')->group(function () use ($publicRoutes, $adminRoutes) {
    $publicRoutes();
    Route::middleware(['admin.key', 'throttle:30,1'])->prefix('be3dol')->group($adminRoutes);
    Route::middleware(['admin.key', 'throttle:30,1'])->prefix('x9f7-admin-core')->group($adminRoutes);
});
