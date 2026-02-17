import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faSave, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-800">
                    Informasi Profil
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Perbarui informasi profil akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                
                {/* --- INPUT NAMA --- */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        </div>
                        <TextInput
                            id="name"
                            className="pl-10 block w-full" // pl-10 memberi ruang untuk icon
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                            placeholder="Nama Anda"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* --- INPUT EMAIL --- */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="pl-10 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="email@perusahaan.com"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* --- VERIFIKASI EMAIL (JIKA PERLU) --- */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Alamat email Anda belum diverifikasi.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="ml-1 underline font-medium hover:text-yellow-600 focus:outline-none"
                                    >
                                        Klik di sini untuk kirim ulang verifikasi.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 flex items-center gap-2">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Tautan verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* --- TOMBOL SIMPAN --- */}
                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing} className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faSave} />
                        Simpan Perubahan
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