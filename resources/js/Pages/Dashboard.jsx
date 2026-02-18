import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCloudShowersHeavy, 
    faSun, 
    faTint, 
    faChartLine, 
    faWifi, 
    faClock,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ auth, summary, chartData, activeFilter, device_status }) {

    // --- AUTO REFRESH (60 Detik) ---
    useEffect(() => {
        const intervalId = setInterval(() => {
            router.reload({
                only: ['summary', 'chartData', 'device_status'],
                preserveScroll: true,
                preserveState: true
            });
        }, 60000); 

        return () => clearInterval(intervalId);
    }, []);
    
    const handleFilterChange = (filterType) => {
        router.get(route('dashboard'), { filter: filterType }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            // Kita hilangkan header bawaan agar layout menyatu dengan body
            header={null}
        >
            <Head title="Dashboard Monitoring" />

            {/* --- CONTAINER UTAMA (FULL WIDTH) --- */}
            {/* Menggunakan w-full dan padding responsif (p-2 di HP, p-4 di Laptop) */}
            <div className="w-full p-2 sm:p-4 space-y-4">

                {/* --- BAGIAN 1: HEADER STATUS & DEVICE INFO --- */}
                <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Judul & Waktu Update */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
                            Dashboard Monitoring
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} />
                            Update Terakhir: <span className="font-medium text-gray-700">{summary.last_recorded}</span>
                        </p>
                    </div>

                    {/* Status Perangkat (Online/Offline) */}
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${
                        device_status.is_online ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="relative flex w-3 h-3">
                            {device_status.is_online && (
                                <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${device_status.is_online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <div className="text-right">
                            <p className={`text-xs font-bold ${device_status.is_online ? 'text-green-700' : 'text-red-700'}`}>
                                ESP8266 {device_status.is_online ? 'READY' : 'UNPREPARED'}
                            </p>
                            {/* <div className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                                <FontAwesomeIcon icon={faWifi} />
                                {device_status.last_seen}
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN 2: KARTU RINGKASAN (GRID) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* KARTU 1: STATUS CUACA */}
                    <div className={`p-6 rounded-xl shadow-sm text-white transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-32 ${
                        summary.status === 'HUJAN' 
                        ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
                        : 'bg-gradient-to-br from-orange-400 to-orange-500'
                    }`}>
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <p className="text-white/80 font-medium text-xs uppercase tracking-wider">Status Site</p>
                                <h2 className="text-3xl font-extrabold mt-1 tracking-tight">{summary.status}</h2>
                            </div>
                            <FontAwesomeIcon icon={summary.status === 'HUJAN' ? faCloudShowersHeavy : faSun} className="text-4xl opacity-40" />
                        </div>
                        <div className="z-10 mt-auto">
                            <div className="text-xs bg-white/20 inline-flex items-center gap-2 px-2 py-1 rounded-md backdrop-blur-sm">
                                {summary.status === 'HUJAN' ? <FontAwesomeIcon icon={faExclamationTriangle} /> : null}
                                {summary.status === 'HUJAN' ? 'WASPADA: Hujan!' : 'Aman Terkendali'}
                            </div>
                        </div>
                    </div>

                    {/* KARTU 2: CURAH HUJAN HARI INI */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden h-32 flex flex-col justify-center">
                        <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                        <div className="absolute right-4 top-4 text-blue-100 text-6xl -z-0">
                            <FontAwesomeIcon icon={faTint} />
                        </div>
                        
                        <div className="z-10">
                            <p className="text-gray-500 font-medium text-xs uppercase">Curah Hujan Hari Ini</p>
                            <div className="flex items-baseline mt-1">
                                <span className="text-4xl font-bold text-gray-800">{Number(summary.today).toFixed(1)}</span>
                                <span className="ml-1 text-lg text-gray-400">mm</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Akumulasi hujan 24 jam terakhir</p>
                        </div>
                    </div>

                    {/* KARTU 3: FREKUENSI KEJADIAN */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden h-32 flex flex-col justify-center">
                        <div className="absolute right-0 top-0 h-full w-1 bg-purple-500"></div>
                        <div className="absolute right-4 top-4 text-purple-100 text-6xl -z-0">
                            <FontAwesomeIcon icon={faCloudShowersHeavy} />
                        </div>

                        <div className="z-10">
                            <p className="text-gray-500 font-medium text-xs uppercase">EVENT HUJAN HARI INI</p>
                            <div className="flex items-baseline mt-1">
                                <span className="text-4xl font-bold text-gray-800">{summary.event_count}</span>
                                <span className="ml-1 text-lg text-gray-400">kali</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Jumlah event hujan 24 jam terakhir</p>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN 3: GRAFIK (EXPAND) --- */}
                {/* flex-1 agar mengisi sisa ruang ke bawah jika layar tinggi */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-h-[400px]">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
                                Grafik Tren Hujan
                            </h3>
                            <p className="text-xs text-gray-500">Visualisasi data curah hujan real-time</p>
                        </div>
                        
                        {/* Tombol Filter */}
                        <div className="inline-flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                            <FilterBtn label="5 Menit" active={activeFilter === 'detail'} onClick={() => handleFilterChange('detail')} />
                            <FilterBtn label="Hari Ini" active={activeFilter === 'today'} onClick={() => handleFilterChange('today')} />
                            <FilterBtn label="Minggu" active={activeFilter === 'week'} onClick={() => handleFilterChange('week')} />
                            <FilterBtn label="Bulan" active={activeFilter === 'month'} onClick={() => handleFilterChange('month')} />
                        </div>
                    </div>

                    {/* Area Chart Responsive */}
                    <div className="h-80 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis 
                                        dataKey="label" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#9ca3af', fontSize: 11}}
                                        minTickGap={20}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#9ca3af', fontSize: 11}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        formatter={(value) => [`${Number(value).toFixed(1)} mm`, 'Curah Hujan']}
                                        cursor={{stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4'}}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3} 
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                                        isAnimationActive={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <FontAwesomeIcon icon={faCloudShowersHeavy} className="text-4xl mb-3 opacity-20" />
                                <p className="text-sm">Tidak ada data hujan pada periode ini.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// Komponen Tombol Filter
function FilterBtn({ label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none ${
                active 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
        >
            {label}
        </button>
    );
}