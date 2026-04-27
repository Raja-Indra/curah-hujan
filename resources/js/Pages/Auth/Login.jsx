import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Tambahkan import Link di sini

export default function Login({ status }) {
    // canResetPassword sudah dihapus dari parameter karena tidak dipakai lagi
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* Tambahan Judul & Sub-judul agar lebih profesional */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Selamat Datang
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Sistem Pemantauan Curah Hujan KCP
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full py-2.5"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-5">
                    <InputLabel htmlFor="password" value="Kata Sandi" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full py-2.5"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Wrapper untuk tombol menggunakan flex-col dan gap agar rapi */}
                <div className="flex flex-col mt-8 space-y-3">
                    <PrimaryButton
                        className="justify-center w-full py-3 text-base"
                        disabled={processing}
                    >
                        Masuk
                    </PrimaryButton>

                    {/* Tombol Lupa Password */}
                    <Link
                        href={route('password.request')}
                        className="inline-flex items-center justify-center w-full py-3 text-base font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                    >
                        Kata Sandi yang Terlupakan?
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
