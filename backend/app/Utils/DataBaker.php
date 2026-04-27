<?php

namespace App\Utils;

use App\Models\Skill;
use App\Models\Project;

class DataBaker
{
    public static function bake()
    {
        \Illuminate\Support\Facades\Log::info('DataBaker: Starting bake...');
        $skills = Skill::all();
        $projects = Project::all();

        $content = "
export const skillsData = " . json_encode($skills) . ";
export const projectsData = " . json_encode($projects) . ";
";

        $jsonContent = json_encode([
            'skills' => $skills,
            'projects' => $projects,
            'updated_at' => now()->toIso8601String()
        ]);

        $path = base_path('../src/data/master_data.js');
        $jsonPath = public_path('api/live_data.json');
        
        if (file_put_contents($path, $content) && file_put_contents($jsonPath, $jsonContent)) {
            \Illuminate\Support\Facades\Log::info('DataBaker: Successfully baked data to ' . $path . ' and ' . $jsonPath);
        } else {
            \Illuminate\Support\Facades\Log::error('DataBaker: Failed to write to bake paths');
        }
    }
}
