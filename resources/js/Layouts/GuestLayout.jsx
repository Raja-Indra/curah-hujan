import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center min-h-screen pt-6 bg-gray-100 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex items-center justify-center">
                    {/* Pengganti Logo Laravel menjadi Teks */}
                    <span className="text-4xl font-extrabold tracking-tighter">
                        <span className="text-blue-600">KCP</span>
                        <span className="text-gray-800 ms-2">RAINFALLS</span>
                    </span>
                </Link>
            </div>

            <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
