<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Project;
use Illuminate\Support\Facades\Log;

class CleanupOrphanFiles extends Command
{
    protected $signature = 'cleanup:orphans {--dry-run : Only show files that would be deleted}';
    protected $description = 'Delete orphaned project images in public storage that have no database record';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $this->info($isDryRun ? 'Starting orphan cleanup [DRY RUN]...' : 'Starting orphan cleanup...');
        
        $deletedCount = 0;

        // Cleanup Projects (User requested: Scan storage/app/public/projects)
        $projectThumbnails = Project::whereNotNull('thumbnail')->pluck('thumbnail')->map(function ($path) {
            return str_replace('projects/', '', ltrim($path, '/storage/'));
        })->toArray();

        $projectFiles = Storage::disk('public')->files('projects');
        foreach ($projectFiles as $file) {
            $filename = basename($file);
            if (!in_array($filename, $projectThumbnails)) {
                if ($isDryRun) {
                    $this->line("[DRY RUN] Would delete orphaned project image: {$filename}");
                } else {
                    Storage::disk('public')->delete($file);
                    $this->line("Deleted orphaned project image: {$filename}");
                }
                $deletedCount++;
            }
        }

        $this->info($isDryRun ? "Orphan cleanup [DRY RUN] complete. Found {$deletedCount} files." : "Orphan cleanup complete. Deleted {$deletedCount} files.");
        
        if (!$isDryRun) {
            Log::info("Orphan file cleanup ran. Deleted {$deletedCount} files.");
        }

        return 0;
    }
}
