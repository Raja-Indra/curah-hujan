import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, 
    faCloudShowersHeavy, 
    faUsers, 
    faUserShield
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    // 1. Ambil Props dari Inertia
    const { url, props } = usePage();
    
    // 2. Definisi Variable Auth (INI YANG TADI KURANG)
    const { auth } = props;
    
    // 3. Definisi Variable Can (Izin), pakai fallback {} biar gak error kalau kosong
    const can = auth?.can || {};

    // --- DEBUGGING (CEK CONSOLE BROWSER SETELAH SAVE INI) ---
    console.log("=== DEBUG SIDEBAR ===");
    console.log("1. User Login:", auth?.user?.name);
    console.log("2. Role User:", auth?.user?.roles);
    console.log("3. PERMISSION (CAN):", can); // <--- KITA CARI INI
    console.log("=====================");
    // -------------------------------------------------------

    const isActive = (route) => url.startsWith(route);

    return (
        <aside className="w-64 bg-white text-gray-600 min-h-screen flex flex-col border-r border-gray-200 hidden md:flex transition-all duration-300 fixed left-0 top-0 z-30">
            
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-white">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCloudShowersHeavy} className="text-blue-600 text-xl" />
                    <h1 className="text-xl font-extrabold tracking-wider text-blue-600">
                        KINTAP<span className="text-gray-800">IOT</span>
                    </h1>
                </div>
            </div>

            {/* Menu Items */}
            {/* HAPUS SEMUA LOGIKA 'can.xxx &&' UNTUK SEMENTARA */}
<nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
    <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-4">Main Menu</div>
    
    <NavLink href="/dashboard" active={isActive('/dashboard')} icon={faChartPie}>
        Dashboard
    </NavLink>
    
    <NavLink href="/rainfall-data" active={isActive('/rainfall-data')} icon={faCloudShowersHeavy}>
        Data Hujan
    </NavLink>

    <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase">
        Administrasi
    </div>

    <NavLink href="/users" active={isActive('/users')} icon={faUsers}>
        Users
    </NavLink>

    <NavLink href="/roles" active={isActive('/roles')} icon={faUserShield}>
        Roles & Akses
    </NavLink>
</nav>

            <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400 bg-gray-50">
                &copy; PT Darma Henwa
            </div>
        </aside>
    );
}

// Komponen NavLink
function NavLink({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                active 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <div className={`mr-3 text-lg w-6 flex justify-center transition-transform group-hover:scale-110 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                <FontAwesomeIcon icon={icon} />
            </div>
            {children}
        </Link>
    );
}