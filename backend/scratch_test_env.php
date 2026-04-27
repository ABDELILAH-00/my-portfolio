<?php
// Scratch script to test .env update logic safely
$envPath = __DIR__ . '/backend/.env';
if (!file_exists($envPath)) {
    echo "ENV NOT FOUND AT: $envPath\n";
    exit(1);
}

function testUpdateEnv($path, $key, $value) {
    $content = file_get_contents($path);
    if (preg_match("/^{$key}=/m", $content)) {
        $content = preg_replace(
            "/^{$key}=(.*)/m",
            "{$key}={$value}",
            $content
        );
    } else {
        $content .= "\n{$key}={$value}";
    }
    return file_put_contents($path, $content);
}

// Just testing the logic on a mock string first
$mockEnv = "APP_NAME=Laravel\nADMIN_SECRET_KEY=old_secret\nOTHER=value";
$newEnv = preg_replace("/^ADMIN_SECRET_KEY=(.*)/m", "ADMIN_SECRET_KEY=new_secret", $mockEnv);
echo "New ENV Mock:\n$newEnv\n";
if (strpos($newEnv, 'ADMIN_SECRET_KEY=new_secret') !== false) {
    echo "TEST PASSED\n";
} else {
    echo "TEST FAILED\n";
}
