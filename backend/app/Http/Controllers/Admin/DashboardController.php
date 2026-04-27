<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Contact;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'overview' => [
                    'projects' => Project::count(),
                    'unread_messages' => Contact::where('read', false)->count(),
                    'total_messages' => Contact::count(),
                ],
                'recent' => [
                    'messages' => Contact::orderBy('created_at', 'desc')->limit(5)->get()
                ]
            ]
        ]);
    }
}
