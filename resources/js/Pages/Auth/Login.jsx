import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

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

                {/* <div className="block mt-5">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600 select-none ms-2">
                            Ingat Saya
                        </span>
                    </label>
                </div> */}

                {/* Tombol Masuk dibuat lebar penuh (w-full) agar lebih responsif dan modern */}
                <div className="mt-8">
                    <PrimaryButton
                        className="justify-center w-full py-3 text-base"
                        disabled={processing}
                    >
                        Masuk
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
