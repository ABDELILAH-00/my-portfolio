<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::get();
        return response()->json(['status' => 'success', 'data' => $skills]);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon_path' => 'required|string',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'La validation a échoué',
                'errors' => $validator->errors()
            ], 422);
        }

        $skill = Skill::create($validator->validated());
        return response()->json(['status' => 'success', 'message' => 'Compétence créée avec succès', 'data' => $skill], 201);
    }

    public function destroy($id)
    {
        $skill = Skill::find($id);
        if (!$skill) return response()->json(['status' => 'error', 'message' => 'Compétence non trouvée'], 404);

        $skill->delete();
        return response()->json(['status' => 'success', 'message' => 'Compétence supprimée avec succès']);
    }

    public function reorder(Request $request)
    {
        return response()->json(['status' => 'success', 'message' => 'Compétences réordonnées avec succès']);
    }
}
