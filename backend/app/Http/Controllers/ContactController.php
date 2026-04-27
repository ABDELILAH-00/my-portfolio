<?php
namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Requests\ContactRequest;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        $ip = $request->ip();
        if (RateLimiter::tooManyAttempts('contact:'.$ip, 5)) {
            return response()->json(['status' => 'error', 'message' => 'Limite de requêtes dépassée. Veuillez réessayer plus tard.'], 429);
        }
        RateLimiter::hit('contact:'.$ip, 60);

        if ($request->filled('user_note_id')) {
            return response()->json(['status' => 'success', 'message' => 'Message envoyé avec succès !']);
        }

        $data = $request->validated();
        $data['message'] = strip_tags($data['message']);

        Contact::create($data);

        return response()->json(['status' => 'success', 'message' => 'Message envoyé avec succès !'], 201);
    }
}
