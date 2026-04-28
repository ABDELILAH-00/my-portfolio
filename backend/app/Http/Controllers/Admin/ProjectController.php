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
        $project = Project::find($id);
        if (!$project) return response()->json(['status' => 'error', 'message' => 'Projet non trouvé'], 404);
        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']);
        $data['thumbnail'] = $this->handleImageUpload($request->input('thumbnail'));
        
        $project = Project::create($data);
        Cache::forget('public_projects');
        return response()->json(['status' => 'success', 'message' => 'Projet créé avec succès', 'data' => $project], 201);
    }

    public function update(UpdateProjectRequest $request, $id)
    {
        $project = Project::find($id);
        if (!$project) return response()->json(['status' => 'error', 'message' => 'Projet non trouvé'], 404);

        $data = $request->validated();
        if (isset($data['title'])) $data['slug'] = Str::slug($data['title']);

        if ($request->filled('thumbnail')) {
            $newThumbnail = $this->handleImageUpload($request->input('thumbnail'), $project->thumbnail);
            $data['thumbnail'] = $newThumbnail;
        }

        $project->update($data);
        Cache::forget('public_projects');
        return response()->json(['status' => 'success', 'message' => 'Projet mis à jour avec succès', 'data' => $project]);
    }

    public function destroy($id)
    {
        $project = Project::find($id);
        if (!$project) return response()->json(['status' => 'error', 'message' => 'Projet non trouvé'], 404);

        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        $project->delete();
        Cache::forget('public_projects');
        return response()->json(['status' => 'success', 'message' => 'Projet supprimé avec succès']);
    }

    private function handleImageUpload($thumbnail, $oldThumbnail = null)
    {
        if (!$thumbnail || !str_starts_with($thumbnail, 'data:image')) {
            return $thumbnail; 
        }

        if ($oldThumbnail) {
            Storage::disk('public')->delete($oldThumbnail);
        }

        @list($type, $file_data) = explode(';', $thumbnail);
        @list(, $file_data) = explode(',', $file_data);
        
        $decodedData = base64_decode($file_data);
        if (!$decodedData) {
            abort(422, 'Données d\'image invalides.');
        }

        if (strlen($decodedData) > 5242880) { // 5MB limit
            abort(422, 'La taille de l\'image dépasse la limite de 5 Mo.');
        }

        $imageInfo = @getimagesizefromstring($decodedData);
        if (!$imageInfo) {
            abort(422, 'Contenu d\'image invalide.');
        }

        $imageName = (string) Str::uuid() . '.webp';
        Storage::disk('public')->put('projects/' . $imageName, $decodedData);

        return 'projects/' . $imageName;
    }
}
