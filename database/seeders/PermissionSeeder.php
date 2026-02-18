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
    }
}
