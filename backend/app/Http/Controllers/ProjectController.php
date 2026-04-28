<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Cache::remember('public_projects', 3600, function () {
            return Project::where('published', true)
                ->orderBy('sort_order', 'asc')
                ->orderBy('created_at', 'desc')
                ->get();
        });
            
        return response()->json(['status' => 'success', 'data' => $projects]);
    }
}
