<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'tech_stack' => 'nullable|array',
            'github_url' => 'nullable|string',
            'live_url' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'published' => 'boolean'
        ];
    }
}
