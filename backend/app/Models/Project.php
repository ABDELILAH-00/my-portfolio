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

    protected $casts = [
        'tech_stack' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['thumbnail_url'];

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) return null;

        // External URLs (Cloudinary, Unsplash, etc.): return as-is
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }

        // Local storage path
        if (str_starts_with($this->thumbnail, '/storage')) {
            return $this->thumbnail;
        }

        return '/storage/' . $this->thumbnail;
    }
}
