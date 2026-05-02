<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'percentage', 'category', 'icon_path', 'sort_order'];

    protected $casts = [
        'percentage' => 'integer',
        'sort_order' => 'integer',
    ];
}
