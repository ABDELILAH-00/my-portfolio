<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Automated Daily Infrastructure Maintenance
Schedule::command('backup:db')->dailyAt('02:00')->withoutOverlapping();
Schedule::command('backup:storage')->dailyAt('02:30')->withoutOverlapping();
Schedule::command('cleanup:orphans')->dailyAt('03:00')->withoutOverlapping();
Schedule::command('sanctum:prune-expired')->daily()->withoutOverlapping();
