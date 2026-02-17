<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
// Pastikan menggunakan model dari Spatie secara konsisten
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        // Menggunakan get() atau paginate() sesuai kebutuhan
        $roles = Role::with('permissions')->withCount('permissions')->latest()->paginate(10);
        $permissions = Permission::all();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'all_permissions' => $permissions,
            'auth' => [
                'user' => auth()->user(),
                'can' => [
                    'manage_roles' => auth()->user()->can('manage roles'),
                    'manage_users' => auth()->user()->can('manage users'),
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array'
        ]);

        // Gunakan DB Transaction agar aman jika sync permission gagal
        DB::transaction(function () use ($request) {
            $role = Role::create([
                'name' => strtolower($request->name),
                'guard_name' => 'web' // Tegaskan guard_name untuk menghindari error
            ]);
            
            if ($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            }
        });

        return redirect()->back()->with('success', 'Role berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $role = \Spatie\Permission\Models\Role::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255', \Illuminate\Validation\Rule::unique('roles')->ignore($role->id)],
            'permissions' => 'array'
        ]);

        if ($role->name === 'admin') {
            return redirect()->back()->with('error', 'Role Admin tidak bisa diubah.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $role) {
            $role->update([
                'name' => strtolower($request->name),
                'guard_name' => 'web'
            ]);

            $role->syncPermissions($request->permissions ?? []);
        });

        return redirect()->route('roles.index')->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $role = \Spatie\Permission\Models\Role::findOrFail($id);

        if ($role->name === 'admin') {
            return redirect()->route('roles.index')->with('error', 'Role Admin tidak bisa dihapus.');
        }

        $role->delete();

        // Paksa kembali ke halaman index
        return redirect()->route('roles.index')->with('success', 'Role berhasil dihapus.');
    }
}