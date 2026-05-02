<?php
namespace App\Http\Controllers;

use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('sort_order', 'asc')->get();

        return response()->json($skills);
    }
}
