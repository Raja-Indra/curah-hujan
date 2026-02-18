<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Permission dibuat paling awal (agar Role bisa mengambilnya)
            PermissionSeeder::class,

            // 2. Role dibuat dan di-assign Permission
            RoleSeeder::class,

            // 3. User dibuat terakhir dan di-assign Role
            UserSeeder::class,
        ]);
    }
}
