<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use ZipArchive;

class BackupStorage extends Command
{
    protected $signature = 'backup:storage';
    protected $description = 'Backup the public storage directory to a compressed archive';

    public function handle()
    {
        $filename = 'storage_backup_' . Carbon::now()->format('Y_m_d_H_i_s') . '.zip';
        $backupPath = storage_path('app/backups/storage/' . $filename);
        $sourcePath = storage_path('app/public');

        if (!Storage::disk('local')->exists('backups/storage')) {
            Storage::disk('local')->makeDirectory('backups/storage');
        }

        $zip = new ZipArchive();
        if ($zip->open($backupPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($sourcePath),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $name => $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($sourcePath) + 1);
                    $zip->addFile($filePath, $relativePath);
                }
            }
            $zip->close();

            $this->info("Storage successfully backed up to {$filename}");
            Log::info("Storage successfully backed up to {$filename}");
        } else {
            $this->error('Failed to create storage backup archive.');
            Log::channel('critical')->error('Failed to create storage backup archive.');
            return 1;
        }

        // Cleanup old storage backups
        $files = Storage::disk('local')->files('backups/storage');
        $now = Carbon::now();

        foreach ($files as $file) {
            if (str_ends_with($file, '.zip')) {
                $lastModified = Carbon::createFromTimestamp(Storage::disk('local')->lastModified($file));
                if ($now->diffInDays($lastModified) > 7) {
                    Storage::disk('local')->delete($file);
                    $this->info("Deleted old storage backup: {$file}");
                }
            }
        }

        return 0;
    }
}
