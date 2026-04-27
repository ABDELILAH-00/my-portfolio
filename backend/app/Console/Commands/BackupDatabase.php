<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackupDatabase extends Command
{
    protected $signature = 'backup:db {--dry-run : Simulate execution without running mysqldump}';
    protected $description = 'Backup the database safely and compress using PHP gzip';

    public function handle()
    {
        try {
            $isDryRun = $this->option('dry-run');

            $dumpPath = config('database.connections.mysql.dump_path');
            if (!$dumpPath) {
                $paths = [
                    'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe',
                    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
                    'C:\\xampp\\mysql\\bin\\mysqldump.exe',
                    '/usr/bin/mysqldump',
                    '/usr/local/bin/mysqldump'
                ];
                foreach ($paths as $p) {
                    if (file_exists($p)) {
                        $dumpPath = $p;
                        break;
                    }
                }
            }

            if (!$dumpPath || !file_exists($dumpPath)) {
                $this->line(json_encode([
                    'status' => 'error',
                    'message' => 'mysqldump not found. Please configure MYSQL_DUMP_PATH.'
                ]));
                return 1;
            }

            if ($isDryRun) {
                $this->line(json_encode([
                    'status' => 'success',
                    'message' => 'Dry run successful. Detected dump path: ' . $dumpPath
                ]));
                return 0;
            }

            $filename = 'backup_' . Carbon::now()->format('Y_m_d_H_i_s') . '.sql.gz';
            
            if (!Storage::disk('local')->exists('backups/db')) {
                Storage::disk('local')->makeDirectory('backups/db');
            }

            $dbHost = config('database.connections.mysql.host');
            $dbPort = config('database.connections.mysql.port');
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');

            $process = new Process([
                $dumpPath,
                '--host=' . $dbHost,
                '--port=' . $dbPort,
                '--user=' . $dbUser,
                '--password=' . $dbPass,
                $dbName
            ]);
            
            // Allow up to 5 minutes for large dumps
            $process->setTimeout(300);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            // Cross-platform compression via PHP native gzip
            $sqlData = $process->getOutput();
            $compressedData = gzencode($sqlData, 9);
            
            Storage::disk('local')->put('backups/db/' . $filename, $compressedData);

            Log::info("Database successfully backed up to {$filename}");

            // Cleanup old backups
            $files = Storage::disk('local')->files('backups/db');
            $now = Carbon::now();

            foreach ($files as $file) {
                if (str_ends_with($file, '.sql.gz')) {
                    $lastModified = Carbon::createFromTimestamp(Storage::disk('local')->lastModified($file));
                    if ($now->diffInDays($lastModified) > 7) {
                        Storage::disk('local')->delete($file);
                    }
                }
            }

            $this->line(json_encode([
                'status' => 'success',
                'message' => 'Backup completed successfully'
            ]));

            return 0;

        } catch (\Exception $e) {
            Log::channel('critical')->error("Database backup failed: " . $e->getMessage());
            $this->line(json_encode([
                'status' => 'error',
                'message' => 'Backup failed'
            ]));
            return 1;
        }
    }
}
