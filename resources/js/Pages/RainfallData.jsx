import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileExcel,
    faCloudShowersHeavy,
    faCalendarAlt,
    faTable,
} from "@fortawesome/free-solid-svg-icons";

export default function RainfallData({ auth, rainfalls, filters }) {
    // --- STATE MANAGEMENT ---
    const [startDate, setStartDate] = useState(
        filters?.start_date || new Date().toISOString().split("T")[0],
    );
    const [endDate, setEndDate] = useState(
        filters?.end_date || new Date().toISOString().split("T")[0],
    );
    const [perPage, setPerPage] = useState(filters?.per_page || 20);

    // --- FUNGSI GANTI JUMLAH DATA (Per Page) ---
    const handlePerPageChange = (e) => {
        const newValue = e.target.value;
        setPerPage(newValue);

        router.get(
            route("rainfall.data"),
            {
                per_page: newValue,
                start_date: startDate,
                end_date: endDate,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    // --- FUNGSI EXPORT ---
    const handleExport = () => {
        const url = `/rainfall-data/export?start_date=${startDate}&end_date=${endDate}`;
        window.location.href = url;
    };

    return (
        <AuthenticatedLayout user={auth?.user} header={null}>
            <Head title="Data Riwayat Hujan" />

            {/* --- CONTAINER UTAMA (PERBAIKAN LAYOUT DISINI) --- */}
            {/* 1. w-full: Memaksa lebar penuh (menempel kiri-kanan).
                2. p-2 sm:p-4: Padding tipis saja (agar tidak terlalu mepet, tapi tetap 'full').
                3. flex flex-col h-full: Agar konten mengisi tinggi layar.
            */}
            <div className="w-full h-full p-2 sm:p-4 flex flex-col space-y-4">
                {/* KARTU KONTEN */}
                {/* flex-1 agar mengisi sisa ruang ke bawah */}
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex flex-col flex-1">
                    {/* --- HEADER ATAS --- */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* KIRI: Judul Tabel */}
                        <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                                <FontAwesomeIcon
                                    icon={faCloudShowersHeavy}
                                    size="lg"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                    Data Riwayat
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Laporan sensor realtime
                                </p>
                            </div>
                        </div>

                        {/* KANAN: Filter & Export */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            {/* Filter Tanggal */}
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden w-full sm:w-auto shadow-sm">
                                <div className="px-3 py-2 bg-gray-100 border-r border-gray-300 text-gray-500">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="border-none focus:ring-0 text-xs sm:text-sm py-2 px-2 w-full sm:w-32 text-gray-600"
                                />
                                <span className="bg-gray-100 border-x border-gray-300 px-2 py-2 text-xs text-gray-500">
                                    -
                                </span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-none focus:ring-0 text-xs sm:text-sm py-2 px-2 w-full sm:w-32 text-gray-600"
                                />
                            </div>

                            {/* Tombol Export */}
                            <button
                                onClick={handleExport}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm transition-all text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <FontAwesomeIcon icon={faFileExcel} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {/* --- TABEL DATA (ISI PENUH) --- */}
                    <div className="overflow-x-auto w-full flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                        Waktu (WITA)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                        Constanta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                        Curah Hujan
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                        Tip Count
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                                        Event ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rainfalls.data.length > 0 ? (
                                    rainfalls.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                {new Date(
                                                    item.recorded_at,
                                                ).toLocaleString("id-ID", {
                                                    timeZone: "Asia/Makassar",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.constant}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        item.rainfall > 0
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {item.rainfall} mm
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.cycle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                #{item.event_id}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- FOOTER PAGINATION --- */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Kiri: Limit & Info */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="text-xs text-gray-500 text-center sm:text-left">
                                Show{" "}
                                <span className="font-bold">
                                    {rainfalls.from}-{rainfalls.to}
                                </span>{" "}
                                of {rainfalls.total}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                                    <FontAwesomeIcon icon={faTable} size="xs" />
                                </div>
                                <select
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                    className="pl-7 pr-8 py-1 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                                >
                                    <option value="10">10 Baris</option>
                                    <option value="20">20 Baris</option>
                                    <option value="50">50 Baris</option>
                                    <option value="100">100 Baris</option>
                                </select>
                            </div>
                        </div>

                        {/* Kanan: Pagination */}
                        <div className="flex space-x-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                            {rainfalls.links.map((link, index) => {
                                const isLinkActive = link.active;
                                const isLinkDisabled = !link.url;
                                const baseClasses =
                                    "px-2 sm:px-3 py-1 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap";

                                if (isLinkDisabled) {
                                    return (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`${baseClasses} bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed`}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        data={{
                                            per_page: perPage,
                                            start_date: startDate,
                                            end_date: endDate,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`${baseClasses} ${isLinkActive ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300"}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
