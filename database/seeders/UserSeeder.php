<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'muhammadindra226@gmail.com'],
            [
                'name' => 'Muhammad Indra Rahma',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        $staff = User::updateOrCreate(
            ['email' => 'adminkcp@co.id'],
            [
                'name' => 'Staff Site Kintap', //
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $staff->assignRole('staff');
    }
}
