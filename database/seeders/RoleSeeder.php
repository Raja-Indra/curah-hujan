<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Role
        $adminRole = Role::create(['name' => 'admin']);
        $staffRole = Role::create(['name' => 'staff']);

        // 2. Assign Permission ke Role
        // Admin dapat semua permission
        $adminRole->givePermissionTo(Permission::all());

        // Staff hanya dapat permission view
        $staffRole->givePermissionTo(['view dashboard', 'view rainfall']);
    }
}