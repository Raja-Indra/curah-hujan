import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faExclamationTriangle, faTimes, faKey } from '@fortawesome/free-solid-svg-icons';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-gray-800">
                    Hapus Akun
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. 
                    Silakan unduh data atau informasi apa pun yang ingin Anda simpan sebelum menghapus akun ini.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTrashAlt} />
                Hapus Akun Saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    
                    {/* Header Modal dengan Ikon Peringatan */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Anda yakin ingin menghapus akun?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Tindakan ini tidak dapat dibatalkan. Setelah akun dihapus, semua data Anda akan hilang selamanya.
                                Silakan masukkan password Anda untuk konfirmasi penghapusan permanen ini.
                            </p>
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faKey} className="text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-10 mt-1 block w-full sm:w-3/4" // Responsive width
                                isFocused
                                placeholder="Masukkan Password Anda"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTimes} />
                            Batal
                        </SecondaryButton>

                        <DangerButton className="flex items-center gap-2" disabled={processing}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                            Ya, Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}