<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityFeatureTest extends TestCase
{
    public function test_admin_auth_rejection_without_key()
    {
        $response = $this->get('/api/admin/projects');
        $response->assertStatus(403);
    }

    public function test_admin_auth_rejection_with_invalid_key()
    {
        $response = $this->withHeaders([
            'X-ADMIN-KEY' => 'invalid-key'
        ])->get('/api/admin/projects');
        
        $response->assertStatus(403);
    }

    public function test_hidden_route_protection()
    {
        $response = $this->get('/api/x9f7-admin-core/projects');
        $response->assertStatus(403);
    }

    public function test_security_headers_are_present()
    {
        $response = $this->get('/api/projects');
        
        $response->assertHeader('Strict-Transport-Security');
        $response->assertHeader('Content-Security-Policy');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Permissions-Policy');
    }

    public function test_x_powered_by_header_is_removed()
    {
        $response = $this->get('/api/projects');
        $response->assertHeaderMissing('X-Powered-By');
    }
}
