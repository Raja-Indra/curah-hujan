import React from 'react';
import Sidebar from '@/Components/LayoutParts/Sidebar';
import Header from '@/Components/LayoutParts/Header';
import Footer from '@/Components/LayoutParts/Footer';

export default function AuthenticatedLayout({ user, header, children }) {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* SIDEBAR (Posisi Fixed di Kiri) */}
            <Sidebar />

            {/* --- AREA KONTEN UTAMA --- */}
            {/* PERBAIKAN DISINI: */}
            {/* Tambahkan 'md:ml-64'. Artinya: Di layar laptop (md), geser konten ke kanan 64 unit (sesuai lebar sidebar) */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full md:ml-64 transition-all duration-300">
                
                {/* HEADER */}
                <Header user={user} />

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