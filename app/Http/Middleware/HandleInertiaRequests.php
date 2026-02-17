<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(\Illuminate\Http\Request $request): array
    {
        $user = $request->user();

        // Cek Role Admin secara eksplisit
        // Kita gunakan hasRole('admin') agar Admin selalu punya akses (Super Admin)
        $isAdmin = $user ? $user->hasRole('admin') : false;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                
                // Pastikan struktur 'can' ini dikirimkan sebagai object yang utuh
                'can' => [
                    'view_dashboard' => $isAdmin || ($user && $user->can('view dashboard')),
                    'view_rainfall'  => $isAdmin || ($user && $user->can('view rainfall')),
                    'manage_users'   => $isAdmin || ($user && $user->can('manage users')),
                    'manage_roles'   => $isAdmin || ($user && $user->can('manage roles')),
                ],
            ],
            
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
