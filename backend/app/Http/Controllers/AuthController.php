<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $password = $request->input('password');
        
        // 1. Try checking the database first (if password was changed)
        $user = \App\Models\User::first();
        if ($user && \Illuminate\Support\Facades\Hash::check($password, $user->password)) {
            return response()->json([
                'status' => 'success',
                'token' => 'admin-token',
                'user' => [
                    'name' => 'Administrateur',
                    'role' => 'propriétaire'
                ]
            ]);
        }

        // 2. Fallback to the environment secret key (initial state)
        $secret = config('admin.secret_key');
        if ($secret && $password && hash_equals($secret, $password)) {
            return response()->json([
                'status' => 'success',
                'token' => 'admin-token',
                'user' => [
                    'name' => 'Administrateur',
                    'role' => 'propriétaire'
                ]
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Clé d\'accès invalide'
        ], 401);
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

        try {
            $user = \App\Models\User::first();
            if (!$user) {
                $user = new \App\Models\User();
                $user->name = 'Administrateur';
                $user->email = $adminEmail;
            }
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Mot de passe mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }
}
