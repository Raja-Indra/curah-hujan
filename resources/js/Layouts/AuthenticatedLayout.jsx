import React, { useState } from "react";
import Sidebar from "@/Components/LayoutParts/Sidebar";
import Header from "@/Components/LayoutParts/Header";
import Footer from "@/Components/LayoutParts/Footer";

export default function AuthenticatedLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Overlay untuk mobile saat sidebar terbuka */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* --- AREA KONTEN UTAMA --- */}
            {/* Tambahkan 'md:ml-64' agar di laptop konten tergeser sesuai lebar sidebar */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full md:ml-64 transition-all duration-300">
                {/* HEADER */}
                <Header user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* MAIN CONTENT BODY */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50 w-full">
                    {children}
                </main>

                {/* FOOTER */}
                <Footer />
            </div>
        </div>
    );
}
