<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reset cache permission
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Daftar Permission (Sesuaikan dengan fitur aplikasi kita)
        $permissions = [
            // Dashboard
            'view dashboard',
            
            // Data Hujan
            'view rainfall',
            'export rainfall',
            
            // User Management
            'manage users', // Create, Edit, Delete User
            
            // Role Management
            'manage roles', // Create, Edit, Delete Role
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 3. Assign Permission ke Role Admin (Otomatis dapat semua)
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions($permissions);
        }

        // 4. Assign Permission Default ke Staff (Hanya lihat data)
        $staffRole = Role::where('name', 'staff')->first();
        if ($staffRole) {
            $staffRole->syncPermissions(['view dashboard', 'view rainfall']);
        }
    }
}