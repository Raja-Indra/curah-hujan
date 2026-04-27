import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, 
    faCloudShowersHeavy, 
    faUsers, 
    faUserShield,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ isOpen, setIsOpen }) {
    // 1. Ambil Props dari Inertia
    const { url, props } = usePage();
    
    // 2. Definisi Variable Auth
    const { auth } = props;
    
    // 3. Definisi Variable Can (Izin), pakai fallback {} biar gak error kalau kosong
    const can = auth?.can || {};

    const isActive = (route) => url.startsWith(route);

    const closeSidebar = () => {
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <aside className={`w-64 bg-white text-gray-600 min-h-screen flex flex-col border-r border-gray-200 transition-transform duration-300 fixed left-0 top-0 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 bg-white">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCloudShowersHeavy} className="text-blue-600 text-xl" />
                    <h1 className="text-xl font-extrabold tracking-wider text-blue-600">
                        KINTAP<span className="text-gray-800">IOT</span>
                    </h1>
                </div>
                {/* Tombol Close untuk Mobile */}
                <button 
                    className="md:hidden text-gray-400 hover:text-red-500 focus:outline-none"
                    onClick={closeSidebar}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-4">Main Menu</div>
                
                {can.view_dashboard && (
                    <NavLink href="/dashboard" active={isActive('/dashboard')} icon={faChartPie} onClick={closeSidebar}>
                        Dashboard
                    </NavLink>
                )}
                
                {can.view_rainfall && (
                    <NavLink href="/rainfall-data" active={isActive('/rainfall-data')} icon={faCloudShowersHeavy} onClick={closeSidebar}>
                        Data Hujan
                    </NavLink>
                )}

                {(can.manage_users || can.manage_roles) && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase">
                            Administrasi
                        </div>

                        {can.manage_users && (
                            <NavLink href="/users" active={isActive('/users')} icon={faUsers} onClick={closeSidebar}>
                                Users
                            </NavLink>
                        )}

                        {can.manage_roles && (
                            <NavLink href="/roles" active={isActive('/roles')} icon={faUserShield} onClick={closeSidebar}>
                                Roles & Akses
                            </NavLink>
                        )}
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400 bg-gray-50">
                &copy; PT Darma Henwa
            </div>
        </aside>
    );
}

// Komponen NavLink
function NavLink({ href, active, icon, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
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
