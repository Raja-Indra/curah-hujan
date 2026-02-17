import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faLock, faTrash, faIdCard } from '@fortawesome/free-solid-svg-icons';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null} // Kita buat header custom di dalam body
        >
            <Head title="Pengaturan Profil" />

            {/* --- CONTAINER FULL WIDTH --- */}
            <div className="w-full p-2 sm:p-4 space-y-4">
                
                {/* 1. HEADER HALAMAN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <FontAwesomeIcon icon={faUserCog} size="lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Pengaturan Akun</h2>
                        <p className="text-sm text-gray-500">Kelola informasi profil dan keamanan akun Anda</p>
                    </div>
                </div>

                {/* 2. AREA FORM (GRID LAYOUT) */}
                {/* Di HP: Stack ke bawah (1 kolom). Di Laptop: Sejajar (2 kolom) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Form: Update Info Profil */}
                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 text-gray-700">
                            <FontAwesomeIcon icon={faIdCard} className="text-blue-500" />
                            <h3 className="font-bold text-lg">Informasi Profil</h3>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Form: Update Password */}
                    <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-2 text-gray-700">
                            <FontAwesomeIcon icon={faLock} className="text-orange-500" />
                            <h3 className="font-bold text-lg">Ganti Password</h3>
                        </div>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>

                {/* 3. AREA BAHAYA (DELETE ACCOUNT) - Full Width */}
                <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-4 border-b border-red-100 pb-2 text-red-600">
                        <FontAwesomeIcon icon={faTrash} />
                        <h3 className="font-bold text-lg">Hapus Akun</h3>
                    </div>
                    <div className="max-w-xl">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}