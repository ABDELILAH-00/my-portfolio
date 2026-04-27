<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class ProfileController extends Controller
{
    /**
     * Update the admin password (secret key).
     */
    public function updatePassword(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'La validation a échoué.',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentKey = config('admin.secret_key');

        if (!$request->current_password || !is_string($currentKey) || !is_string($request->current_password) || !hash_equals($currentKey, $request->current_password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'La clé d\'accès actuelle est incorrecte.'
            ], 422);
        }

        $newKey = $request->password;

        if ($this->updateEnv('ADMIN_SECRET_KEY', $newKey)) {
            // We don't call config:clear here because it can cause timeouts (502) on slow disks.
            // The user will just need to use the new key for future logins.
            return response()->json([
                'status' => 'success',
                'message' => 'La clé d\'accès administrative a été modifiée avec succès.',
                'token' => $newKey
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Erreur système : Impossible d\'écrire la configuration.'
        ], 500);
    }

    /**
     * Update profile identity (Name/Email).
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Identité mise à jour avec succès.'
        ]);
    }

    /**
     * Helper to update .env variable.
     */
    private function updateEnv($key, $value)
    {
        $path = base_path('.env');

        if (!file_exists($path)) return false;

        $content = file_get_contents($path);
        
        // Use a more reliable way to update the key
        if (strpos($content, "{$key}=") !== false) {
            $content = preg_replace("/^{$key}=.*/m", "{$key}=\"{$value}\"", $content);
        } else {
            $content .= "\n{$key}=\"{$value}\"";
        }

        return file_put_contents($path, $content, LOCK_EX) !== false;
    }
}
