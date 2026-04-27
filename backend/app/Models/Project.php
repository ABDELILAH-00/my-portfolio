<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 'slug', 'category', 'description', 
        'github_url', 'live_url', 'tech_stack', 'thumbnail', 
        'featured', 'published', 'sort_order'
    ];

    protected static function booted()
    {
        static::saved(function () {
            \App\Utils\DataBaker::bake();
        });
        static::deleted(function () {
            \App\Utils\DataBaker::bake();
        });
    }

    protected $casts = [
        'tech_stack' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['thumbnail_url'];

    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) return null;
        
        // Handle legacy paths that already have /storage/
        if (str_starts_with($this->thumbnail, '/storage')) {
            return url($this->thumbnail);
        }
        
        // New relative path approach
        return asset('storage/' . $this->thumbnail);
    }
}
