<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class RestoreDatabase extends Command
{
    protected $signature = 'restore:db {--dry-run : Simulate execution without running mysql}';
    protected $description = 'Restore the database from the latest PHP gzip backup safely';

    public function handle()
    {
        try {
            $isDryRun = $this->option('dry-run');

            $clientPath = config('database.connections.mysql.client_path');
            if (!$clientPath) {
                $paths = [
                    'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe',
                    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
                    'C:\\xampp\\mysql\\bin\\mysql.exe',
                    '/usr/bin/mysql',
                    '/usr/local/bin/mysql'
                ];
                foreach ($paths as $p) {
                    if (file_exists($p)) {
                        $clientPath = $p;
                        break;
                    }
                }
            }

            if (!$clientPath || !file_exists($clientPath)) {
                $this->line(json_encode([
                    'status' => 'error',
                    'message' => 'mysql client not found. Please configure MYSQL_CLIENT_PATH.'
                ]));
                return 1;
            }

            $files = Storage::disk('local')->files('backups/db');
            $backupFiles = array_filter($files, fn($file) => str_ends_with($file, '.sql.gz'));

            if (empty($backupFiles)) {
                $this->line(json_encode([
                    'status' => 'error',
                    'message' => 'No backup files found'
                ]));
                return 1;
            }

            // Sort to get the most recent
            usort($backupFiles, function ($a, $b) {
                return Storage::disk('local')->lastModified($b) <=> Storage::disk('local')->lastModified($a);
            });

            $latestBackup = storage_path('app/' . $backupFiles[0]);

            if ($isDryRun) {
                $this->line(json_encode([
                    'status' => 'success',
                    'message' => 'Dry run successful. Detected client: ' . $clientPath . ' | Latest backup: ' . $latestBackup
                ]));
                return 0;
            }

            $dbHost = config('database.connections.mysql.host');
            $dbPort = config('database.connections.mysql.port');
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');

            // Decompress the gz file to a temporary SQL file safely via PHP
            $gz = gzopen($latestBackup, 'rb');
            $tempSqlPath = storage_path('app/backups/db/temp_restore_' . time() . '.sql');
            $out = fopen($tempSqlPath, 'wb');
            while (!gzeof($gz)) {
                fwrite($out, gzread($gz, 4096));
            }
            fclose($out);
            gzclose($gz);

            // Execute restore using Symfony Process and input streaming
            $process = new Process([
                $clientPath,
                '--host=' . $dbHost,
                '--port=' . $dbPort,
                '--user=' . $dbUser,
                '--password=' . $dbPass,
                $dbName
            ]);
            
            $process->setTimeout(300);
            $process->setInput(fopen($tempSqlPath, 'r'));
            $process->run();

            // Cleanup the temp file regardless of success or failure
            @unlink($tempSqlPath);

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            Log::info("Database restored from {$backupFiles[0]}");

            $this->line(json_encode([
                'status' => 'success',
                'message' => 'Restore completed successfully'
            ]));

            return 0;

        } catch (\Exception $e) {
            Log::channel('critical')->error("Database restore failed: " . $e->getMessage());
            $this->line(json_encode([
                'status' => 'error',
                'message' => 'Restore failed'
            ]));
            return 1;
        }
    }
}
