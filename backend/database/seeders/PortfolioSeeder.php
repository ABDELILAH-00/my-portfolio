<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Skill;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'Javascript', 'icon_path' => 'javascript/javascript-original.svg', 'category' => 'Main Tech', 'sort_order' => 1],
            ['name' => 'Typescript', 'icon_path' => 'typescript/typescript-original.svg', 'category' => 'Main Tech', 'sort_order' => 2],
            ['name' => 'React', 'icon_path' => 'react/react-original.svg', 'category' => 'Main Tech', 'sort_order' => 3],
            ['name' => 'PHP', 'icon_path' => 'php/php-original.svg', 'category' => 'Main Tech', 'sort_order' => 4],
            ['name' => 'Laravel', 'icon_path' => 'laravel/laravel-original.svg', 'category' => 'Main Tech', 'sort_order' => 5],
            ['name' => 'Tailwind', 'icon_path' => 'tailwindcss/tailwindcss-original.svg', 'category' => 'Main Tech', 'sort_order' => 6],
            ['name' => 'Bootstrap', 'icon_path' => 'bootstrap/bootstrap-original.svg', 'category' => 'Main Tech', 'sort_order' => 7],
            ['name' => 'Mysql', 'icon_path' => 'mysql/mysql-original.svg', 'category' => 'Main Tech', 'sort_order' => 8],
            ['name' => 'MongoDB', 'icon_path' => 'mongodb/mongodb-original.svg', 'category' => 'Main Tech', 'sort_order' => 9],
            ['name' => 'Git', 'icon_path' => 'git/git-original.svg', 'category' => 'Main Tech', 'sort_order' => 10],
            ['name' => 'GitHub', 'icon_path' => 'github/github-original.svg', 'category' => 'Main Tech', 'sort_order' => 11],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        Project::create([
            'title' => 'SGG Conges',
            'slug' => 'sgg-conges',
            'category' => 'Full Stack',
            'description' => 'A comprehensive leave management system for the Secretariat General of Government.',
            'tech_stack' => ['Laravel', 'React', 'Tailwind CSS', 'MySQL'],
            'featured' => true,
            'published' => true,
            'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
            'sort_order' => 1,
        ]);
    }
}
