<?php
namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Support\Facades\Cache;

class SkillController extends Controller
{
    public function index()
    {
        // Removed File Cache to prevent Windows IIS/Serve Deadlocks
        $skills = Skill::orderBy('sort_order', 'asc')->get();
        
        return response()->json(['status' => 'success', 'data' => $skills]);
    }
}
