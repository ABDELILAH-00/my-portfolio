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
        $skills = Skill::orderBy('sort_order', 'asc')->get();
        return response()->json(['status' => 'success', 'data' => $skills]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon_path' => 'required|string',
            'category' => 'required|string',
            'percentage' => 'nullable|integer|min:0|max:100',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'La validation a échoué',
                'errors' => $validator->errors()
            ], 422);
        }

        $skill = Skill::create($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Compétence créée avec succès',
            'data' => $skill
        ], 201);
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();

        return response()->json(['status' => 'success', 'message' => 'Compétence supprimée avec succès']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|integer|exists:skills,id',
            'skills.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->skills as $item) {
            Skill::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['status' => 'success', 'message' => 'Compétences réordonnées avec succès']);
    }
}
