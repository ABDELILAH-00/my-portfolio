<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'percentage', 'category', 'icon_path', 'sort_order'];

    protected static function booted()
    {
        static::saved(function () {
            \App\Utils\DataBaker::bake();
        });
        static::deleted(function () {
            \App\Utils\DataBaker::bake();
        });
    }
}
