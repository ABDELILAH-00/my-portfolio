<?php
namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Support\Facades\Cache;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Cache::remember('public_skills', 3600, function () {
            return Skill::orderBy('sort_order', 'asc')->get();
        });
        
        return response()->json(['status' => 'success', 'data' => $skills]);
    }
}
