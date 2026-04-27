<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $contacts]);
    }

    public function markAsRead($id)
    {
        $contact = Contact::find($id);
        if (!$contact) return response()->json(['status' => 'error', 'message' => 'Message non trouvé'], 404);

        $contact->update(['read' => true]);
        return response()->json(['status' => 'success', 'data' => $contact]);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        if (!$contact) return response()->json(['status' => 'error', 'message' => 'Message non trouvé'], 404);

        $contact->delete();
        return response()->json(['status' => 'success', 'message' => 'Message supprimé avec succès']);
    }
}
