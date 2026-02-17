<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        // 1. Ambil user beserta rolenya dengan pagination
        $users = User::with('roles')->latest()->paginate(10);
        
        // 2. Ambil list role untuk dropdown form
        $roles = Role::pluck('name');

        // 3. Kirim ke Inertia dengan menyertakan data 'auth'
        return Inertia::render('Users/Index', [
            'users' => $users,
            'available_roles' => $roles,
            
            // PENTING: Tambahkan array auth ini agar React tidak crash
            'auth' => [
                'user' => auth()->user(),
                'can' => [
                    'manage_users' => auth()->user()->can('manage users'),
                    'manage_roles' => auth()->user()->can('manage roles'),
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name' // Validasi role
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign Role Spatie
        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'User berhasil dibuat.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|exists:roles,name'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update password hanya jika diisi
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()]
            ]);
            $user->update(['password' => Hash::make($request->password)]);
        }

        // Sinkronisasi Role (Ganti role lama dengan yang baru)
        $user->syncRoles($request->role);

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Cegah hapus diri sendiri (opsional tapi disarankan)
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun sendiri.');
        }
        
        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}