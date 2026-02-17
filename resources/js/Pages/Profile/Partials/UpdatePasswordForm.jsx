import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faLock, faSave, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-800">
                    Ganti Password
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                
                {/* --- PASSWORD SAAT INI --- */}
                <div>
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" />
                    
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faKey} className="text-gray-400" />
                        </div>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="pl-10 block w-full" // pl-10 untuk ruang icon
                            autoComplete="current-password"
                            placeholder="Masukan password lama..."
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                {/* --- PASSWORD BARU --- */}
                <div>
                    <InputLabel htmlFor="password" value="Password Baru" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="pl-10 block w-full"
                            autoComplete="new-password"
                            placeholder="Password baru minimal 8 karakter"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* --- KONFIRMASI PASSWORD --- */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="pl-10 block w-full"
                            autoComplete="new-password"
                            placeholder="Ulangi password baru"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* --- TOMBOL SIMPAN --- */}
                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing} className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faSave} />
                        Simpan Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Berhasil Disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}