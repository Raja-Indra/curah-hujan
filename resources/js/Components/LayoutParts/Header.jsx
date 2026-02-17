import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
// Opsional: Jika ingin icon chevron (panah bawah) pakai FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const { auth } = usePage().props;
    // State untuk mengatur buka/tutup menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-20 relative">
            
            {/* Judul Halaman (Kiri) */}
            <div className="flex items-center">
                <h2 className="text-gray-800 font-bold text-lg hidden md:block tracking-tight">
                    Sistem Monitoring
                </h2>
            </div>

            {/* --- AREA USER (KANAN) --- */}
            <div className="relative">
                
                {/* 1. TOMBOL PEMICU (TRIGGER) */}
                {/* Saat diklik, ubah state !isDropdownOpen (True/False) */}
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="flex items-center space-x-3 focus:outline-none group p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    
                    {/* Avatar Bulat */}
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
                        {auth.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Icon Panah Kecil */}
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                </button>

                {/* 2. MENU DROPDOWN (Muncul jika isDropdownOpen == true) */}
                {isDropdownOpen && (
                    <>
                        {/* Layar Transparan (Untuk menutup menu saat klik di luar area) */}
                        <div 
                            className="fixed inset-0 z-10 cursor-default" 
                            onClick={() => setIsDropdownOpen(false)}
                        ></div>

                        {/* Kotak Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 transform transition-all ease-out duration-100 origin-top-right">
                            
                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                    Akun Saya
                                </span>
                            </div>

                            {/* Menu Profile */}
                            <Link 
                                href={route('profile.edit')} 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setIsDropdownOpen(false)} // Tutup menu saat diklik
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
                                Profile User
                            </Link>
                            
                            <div className="border-t border-gray-100 my-1"></div>

                            {/* Menu Logout */}
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                                Logout (Keluar)
                            </Link>
                        </div>
                    </>
                )}

            </div>
        </header>
    );
}