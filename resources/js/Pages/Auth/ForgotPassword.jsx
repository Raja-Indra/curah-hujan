import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Tambahkan import hooks React

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // State untuk mengontrol tampilan dan hitung mundur
    const [isSent, setIsSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Effect untuk mengatur timer berjalan setiap 1 detik
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                // Ubah tampilan dan mulai hitung mundur 60 detik saat berhasil
                setIsSent(true);
                setCountdown(60);
            },
        });
    };

    const handleResend = () => {
        if (countdown === 0) {
            post(route('password.email'), {
                onSuccess: () => {
                    // Mulai ulang hitung mundur 60 detik jika dikirim ulang
                    setCountdown(60);
                },
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            {!isSent ? (
                // --- TAMPILAN 1: Form Input Email (Sebelum Dikirim) ---
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Lupa kata sandi Anda? Tidak masalah. Cukup beri tahu kami alamat email Anda dan kami akan mengirimkan email berisi tautan reset kata sandi yang akan memungkinkan Anda memilih yang baru.
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full mt-1"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Kirim Tautan Reset Kata Sandi
                            </PrimaryButton>
                        </div>
                    </form>
                </>
            ) : (
                // --- TAMPILAN 2: Pemberitahuan & Timer (Setelah Dikirim) ---
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        {/* Ikon Checklist Sukses */}
                        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="mb-2 text-xl font-bold text-gray-800">Tautan Terkirim!</h2>

                    <p className="mb-6 text-sm text-gray-600">
                        Kami telah mengirimkan instruksi reset kata sandi ke <span className="font-semibold text-gray-800">{data.email}</span>. Silakan periksa kotak masuk atau folder spam Anda.
                    </p>

                    <div className="flex flex-col space-y-3">
                        {/* Tombol Kirim Ulang (Otomatis nonaktif saat timer berjalan) */}
                        <PrimaryButton
                            onClick={handleResend}
                            disabled={countdown > 0 || processing}
                            className="justify-center w-full py-3"
                        >
                            {countdown > 0
                                ? `Kirim Ulang Tautan (${countdown}s)`
                                : 'Kirim Ulang Tautan'}
                        </PrimaryButton>

                        {/* Tombol Kembali ke Login */}
                        <Link
                            href={route('login')}
                            className="inline-flex items-center justify-center w-full py-3 text-base font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
