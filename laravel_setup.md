# Laravel Backend Setup Instructions

Since the existing Laravel backend was not in this workspace, follow these steps to integrate the new API endpoints requested.

## 1. Routes (`routes/api.php`)

```php
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ProfileController;

// Public Endpoints
Route::get('/projects', [ProjectController::class, 'publicIndex']);
Route::get('/skills', [SkillController::class, 'publicIndex']);
Route::post('/contact', [ContactController::class, 'store']);

// Admin Protected Endpoints
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::patch('projects/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured']);
    Route::post('projects/upload-image', [ProjectController::class, 'uploadImage']);
    
    // Contacts
    Route::apiResource('contacts', ContactController::class)->only(['index', 'destroy']);
    Route::patch('contacts/{contact}/read', [ContactController::class, 'markAsRead']);
    
    // Skills
    Route::apiResource('skills', SkillController::class);
    Route::post('skills/reorder', [SkillController::class, 'reorder']);
    
    // Profile
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::post('profile/upload-photo', [ProfileController::class, 'uploadPhoto']);
    Route::post('profile/upload-resume', [ProfileController::class, 'uploadResume']);
});
```

## 2. Model Additions

**`Project.php`**
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'title', 'slug', 'category', 'description', 'long_description',
        'github_url', 'live_url', 'tech_stack', 'thumbnail',
        'featured', 'published', 'sort_order'
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
```

**`Contact.php`**
```php
class Contact extends Model
{
    protected $fillable = ['name', 'email', 'subject', 'message', 'read'];
    
    protected $casts = [
        'read' => 'boolean'
    ];
}
```

## 3. Storage Setup
Run the following in your Laravel project to create symlinks:
```bash
php artisan storage:link
```
Images will be stored under `storage/app/public/projects/`. Ensure your `FILESYSTEM_DISK` is set to `public`.
