<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;

class ProjectController extends Controller
{
    public function index()
    {
        // Removed File Cache to prevent Windows IIS/Serve Deadlocks
        $projects = Project::where('published', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['status' => 'success', 'data' => $projects]);
    }
}
