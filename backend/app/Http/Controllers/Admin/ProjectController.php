<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $projects]);
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(4);

        if ($request->filled('thumbnail')) {
            $data['thumbnail'] = $this->handleImageUpload($request->input('thumbnail'));
        }

        $project = Project::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Projet créé avec succès',
            'data' => $project->fresh()
        ], 201);
    }

    public function update(UpdateProjectRequest $request, $id)
    {
        $project = Project::findOrFail($id);
        $data = $request->validated();

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(4);
        }

        if ($request->filled('thumbnail') && str_starts_with($request->input('thumbnail'), 'data:image')) {
            $data['thumbnail'] = $this->handleImageUpload($request->input('thumbnail'), $project->thumbnail);
        }

        $project->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Projet mis à jour avec succès',
            'data' => $project->fresh()
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Delete local thumbnail if it's not a URL
        if ($project->thumbnail && !str_starts_with($project->thumbnail, 'http')) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        $project->delete();

        return response()->json(['status' => 'success', 'message' => 'Projet supprimé avec succès']);
    }

    private function handleImageUpload(string $thumbnail, ?string $oldThumbnail = null): string
    {
        if (!str_starts_with($thumbnail, 'data:image')) {
            return $thumbnail;
        }

        // Just return the base64 string directly so it is saved in the database.
        // This is the most bulletproof solution for ephemeral Docker environments.
        return $thumbnail;
    }
}
