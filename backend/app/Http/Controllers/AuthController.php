<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $key = $request->input('password'); // We'll treat the password field as the access key
        $secret = config('admin.secret_key');

        if (!$key || !is_string($secret) || !is_string($key) || !hash_equals($secret, $key)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Clé d\'accès invalide'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'token' => $secret,
            'user' => [
                'name' => 'Administrateur',
                'role' => 'propriétaire'
            ]
        ]);
    }

    public function user()
    {
        return response()->json([
            'name' => 'Administrateur',
            'role' => 'propriétaire'
        ]);
    }

    public function recoverPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'matricule' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $adminEmail = config('admin.email', 'admin@example.com');
        $adminMatricule = config('admin.matricule', 'SGG2026');

        if ($request->email !== $adminEmail || $request->matricule !== $adminMatricule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Identifiants de récupération invalides'
            ], 403);
        }

        $newKey = $request->password;
        
        // Update .env file
        $path = base_path('.env');
        if (file_exists($path)) {
            $content = file_get_contents($path);
            $oldKey = config('admin.secret_key');
            $content = str_replace("ADMIN_SECRET_KEY=$oldKey", "ADMIN_SECRET_KEY=$newKey", $content);
            file_put_contents($path, $content);
            
            // Clear config cache to apply changes immediately in production
            \Illuminate\Support\Facades\Artisan::call('config:clear');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès'
        ]);
    }
}
