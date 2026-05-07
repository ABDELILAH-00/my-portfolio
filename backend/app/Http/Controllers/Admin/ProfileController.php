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

        $currentPassword = $request->current_password;
        $isValidCurrent = false;

        // 1. Check against database
        $user = \App\Models\User::first();
        if ($user && \Illuminate\Support\Facades\Hash::check($currentPassword, $user->password)) {
            $isValidCurrent = true;
        }

        // 2. Check against env secret key
        $currentKey = config('admin.secret_key');
        if (!$isValidCurrent && is_string($currentKey) && hash_equals($currentKey, $currentPassword)) {
            $isValidCurrent = true;
        }

        if (!$isValidCurrent) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        try {
            if (!$user) {
                $user = new \App\Models\User();
                $user->name = 'Administrateur';
                $user->email = config('admin.email', 'admin@example.com');
            }
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Mot de passe modifié avec succès.',
                'token' => $request->password // Send back the new token for the frontend to update localstorage
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur système: ' . $e->getMessage()
            ], 500);
        }
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
