<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Support\Facades\Log;

class CleanupOrphans extends Command
{
    protected $signature = 'cleanup:orphans';
    protected $description = 'Delete orphaned images in public storage that have no database record';

    public function handle()
    {
        $this->info('Starting orphan file cleanup...');
        
        $deletedCount = 0;

        // Cleanup Projects
        $projectThumbnails = Project::whereNotNull('thumbnail')->pluck('thumbnail')->map(function ($path) {
            return str_replace('projects/', '', ltrim($path, '/storage/'));
        })->toArray();

        $projectFiles = Storage::disk('public')->files('projects');
        foreach ($projectFiles as $file) {
            $filename = basename($file);
            if (!in_array($filename, $projectThumbnails)) {
                Storage::disk('public')->delete($file);
                $this->line("Deleted orphaned project image: {$filename}");
                $deletedCount++;
            }
        }

        // Cleanup Skills
        $skillIcons = Skill::whereNotNull('icon_path')->pluck('icon_path')->map(function ($path) {
            return str_replace('skills/', '', ltrim($path, '/storage/'));
        })->toArray();

        $skillFiles = Storage::disk('public')->files('skills');
        foreach ($skillFiles as $file) {
            $filename = basename($file);
            if (!in_array($filename, $skillIcons)) {
                Storage::disk('public')->delete($file);
                $this->line("Deleted orphaned skill image: {$filename}");
                $deletedCount++;
            }
        }

        $this->info("Orphan cleanup complete. Deleted {$deletedCount} files.");
        Log::info("Orphan file cleanup ran. Deleted {$deletedCount} files.");

        return 0;
    }
}
