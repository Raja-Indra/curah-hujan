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

        // 2. Buat User Admin Default (Ganti email sesuai akun login Anda saat ini jika mau)
        // Kita cari user pertama (Anda) dan jadikan admin
        $user = User::first();
        if($user) {
            $user->assignRole('admin');
        }
    }
}