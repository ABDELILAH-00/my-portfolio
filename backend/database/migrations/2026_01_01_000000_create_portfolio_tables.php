<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique()->index();
            $table->string('category')->default('Full Stack');
            $table->text('description');
            $table->json('tech_stack')->nullable();
            $table->string('github_url')->nullable();
            $table->string('live_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(true)->index();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon_path');
            $table->string('category')->default('Main Tech');
            $table->integer('percentage')->default(100);
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('projects');
    }
};
