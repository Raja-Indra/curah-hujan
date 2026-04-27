import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faUser,
    faSignOutAlt,
    faBars,
} from "@fortawesome/free-solid-svg-icons";

export default function Header({ toggleSidebar }) {
    const { auth } = usePage().props;
    // State untuk mengatur buka/tutup menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="relative z-20 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
            {/* Judul Halaman & Tombol Mobile (Kiri) */}
            <div className="flex items-center">
                {/* Tombol Hamburger untuk Mobile */}
                <button 
                    onClick={toggleSidebar}
                    className="mr-4 text-gray-500 transition-colors hover:text-blue-600 focus:outline-none md:hidden"
                >
                    <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>

                <h2 className="hidden text-lg font-bold tracking-tight text-gray-800 md:block">
                    Sistem Monitoring Curah Hujan KCP
                </h2>
            </div>

            {/* --- AREA USER (KANAN) --- */}
            <div className="relative">
                {/* 1. TOMBOL PEMICU (TRIGGER) */}
                {/* Saat diklik, ubah state !isDropdownOpen (True/False) */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-1 space-x-3 transition-colors rounded-lg focus:outline-none group hover:bg-gray-50"
                >
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-bold text-gray-700 transition-colors group-hover:text-blue-600">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            {/* Cek apakah roles ada isinya, jika ada ambil yang pertama. Jika tidak, tampilkan 'User' */}
                            {auth.user.roles && auth.user.roles.length > 0
                                ? auth.user.roles[0].name.replace(/_/g, " ")
                                : "User"}
                        </p>
                    </div>

                    {/* Avatar Bulat */}
                    <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-600 transition-all bg-blue-100 border border-blue-200 rounded-full ring-2 ring-transparent group-hover:ring-blue-200">
                        {auth.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Icon Panah Kecil */}
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
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
                        <div className="absolute right-0 z-20 w-48 py-2 mt-2 transition-all duration-100 ease-out origin-top-right transform bg-white border border-gray-100 shadow-xl rounded-xl">
                            <div className="px-4 py-2 mb-1 border-b border-gray-100">
                                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Akun Saya
                                </span>
                            </div>

                            {/* Menu Profile */}
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsDropdownOpen(false)} // Tutup menu saat diklik
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-3 text-gray-400"
                                />
                                Profile User
                            </Link>

                            <div className="my-1 border-t border-gray-100"></div>

                            {/* Menu Logout */}
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    className="mr-3"
                                />
                                Logout (Keluar)
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
