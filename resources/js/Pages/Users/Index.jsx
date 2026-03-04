import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster, toast } from "react-hot-toast";
import {
    faUsers,
    faPlus,
    faEdit,
    faTrash,
    faSearch,
    faCrown,
    faUserCircle,
    faIdCard,
    faCheckCircle,
    faEnvelope,
    faEye,
} from "@fortawesome/free-solid-svg-icons";

export default function UserIndex({
    auth = { user: {} },
    users,
    available_roles,
}) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);

    const openViewModal = (user) => {
        setViewData(user);
        setShowViewModal(true);
    };

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        type: "", // 'add', 'update', atau 'delete'
        data: null,
    });

    // Form Inertia
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "staff",
    });

    const openAddModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        clearErrors();
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.roles[0]?.name || "staff",
        });
        setShowModal(true);
    };

    // --- BUKA MODAL KONFIRMASI SIMPAN/UPDATE ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmDialog({
            isOpen: true,
            type: isEditing ? "update" : "add",
            data: null,
        });
    };

    // --- BUKA MODAL KONFIRMASI HAPUS ---
    const handleDelete = (user) => {
        setConfirmDialog({
            isOpen: true,
            type: "delete",
            data: user,
        });
    };

    // --- EKSEKUSI AKSI KE BACKEND ---
    const executeAction = () => {
        if (confirmDialog.type === "delete") {
            destroy(route("users.destroy", confirmDialog.data.id), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    toast.success("Data user berhasil dihapus!");
                },
                preserveScroll: true,
            });
        } else if (confirmDialog.type === "update") {
            put(route("users.update", data.id), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    setShowModal(false);
                    reset();
                    toast.success("Informasi user berhasil diperbarui!");
                },
                preserveScroll: true,
            });
        } else if (confirmDialog.type === "add") {
            post(route("users.store"), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    setShowModal(false);
                    reset();
                    toast.success("User baru berhasil ditambahkan!");
                },
            });
        }
    };

    // Filter Pencarian di Frontend
    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AuthenticatedLayout user={auth?.user} header={null}>
            <Head title="Manajemen User" />

            {/* CONTAINER UTAMA (FULL WIDTH) */}
            <div className="w-full p-2 sm:p-4 h-full flex flex-col">
                {/* KARTU UTAMA */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col flex-1 overflow-hidden">
                    {/* 1. HEADER (Judul + Search + Tombol) */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        {/* Judul & Icon */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm border border-blue-200">
                                <FontAwesomeIcon icon={faUsers} size="lg" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                                    Daftar Pengguna
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Kelola akun dan hak akses staff
                                </p>
                            </div>
                        </div>

                        {/* Search & Tombol */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari Nama atau Email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 block w-full rounded-lg border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-shadow shadow-sm"
                                />
                            </div>

                            <PrimaryButton
                                onClick={openAddModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                User Baru
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* 2. TABEL USER */}
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        User Profile
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Role Access
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        // Cek apakah user ini admin
                                        const isAdmin = user.roles.some(
                                            (r) => r.name === "admin",
                                        );

                                        return (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 transition-colors group"
                                            >
                                                {/* Kolom Nama & Email */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {/* Avatar */}
                                                        <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4 shadow-sm border bg-blue-50 text-blue-500 border-blue-100">
                                                            <span className="font-bold text-sm">
                                                                {user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faEnvelope
                                                                    }
                                                                    className="text-gray-400"
                                                                />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Kolom Role */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.roles.map(
                                                        (role, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold rounded-full border ${
                                                                    role.name ===
                                                                    "admin"
                                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                                        : "bg-green-50 text-green-700 border-green-200"
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${role.name === "admin" ? "bg-purple-500" : "bg-green-500"}`}
                                                                ></span>
                                                                {role.name.toUpperCase()}
                                                            </span>
                                                        ),
                                                    )}
                                                </td>

                                                {/* Kolom Tanggal */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </td>

                                                {/* Kolom Aksi (SEKARANG SELALU MUNCUL) */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {/* Ubah Disini: Menghapus class opacity-0 dan group-hover:opacity-100 */}
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() =>
                                                                openViewModal(
                                                                    user,
                                                                )
                                                            }
                                                            className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded-lg hover:bg-blue-100 border border-transparent hover:border-blue-200"
                                                            title="Lihat User"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEye}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user,
                                                                )
                                                            }
                                                            className="text-amber-500 hover:text-amber-700 transition-colors bg-amber-50 p-2 rounded-lg hover:bg-amber-100 border border-transparent hover:border-amber-200"
                                                            title="Edit User"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEdit}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user,
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-lg hover:bg-red-100 border border-transparent hover:border-red-200"
                                                            title="Hapus User"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    /* Empty State */
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                                    <FontAwesomeIcon
                                                        icon={faUserCircle}
                                                        size="2x"
                                                        className="opacity-50"
                                                    />
                                                </div>
                                                <p className="text-gray-900 font-medium">
                                                    User tidak ditemukan.
                                                </p>
                                                <p className="text-sm">
                                                    Coba kata kunci pencarian
                                                    lain.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Placeholder */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            Menampilkan {filteredUsers.length} dari{" "}
                            {users.total} pengguna
                        </p>
                    </div>
                </div>

                {/* MODAL FORM (ADD/EDIT) */}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                {isEditing
                                    ? "Edit Informasi User"
                                    : "Tambah User Baru"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="rotate-45"
                                    size="lg"
                                />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Nama */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
                                />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FontAwesomeIcon icon={faUserCircle} />
                                    </div>
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="pl-10 block w-full"
                                        placeholder="Nama"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Alamat Email"
                                />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="pl-10 block w-full"
                                        placeholder="user@gmail.com"
                                        required
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Role Selection */}
                            <div>
                                <InputLabel value="Role / Jabatan" className="mb-3" />
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {available_roles.map((role) => {
                                        // Cek apakah role ini sedang dipilih
                                        const isSelected = data.role === role;
                                        
                                        return (
                                            <button
                                                type="button" // Sangat penting agar tidak mensubmit form
                                                key={role}
                                                onClick={() => setData("role", role)}
                                                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-sm transition-all duration-200 focus:outline-none overflow-hidden ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500 shadow-sm"
                                                        : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-gray-50 hover:text-gray-700"
                                                }`}
                                            >
                                                {/* Ikon disamaratakan menggunakan faIdCard untuk semua role */}
                                                <FontAwesomeIcon
                                                    icon={faIdCard}
                                                    className={`mb-2 text-xl transition-colors ${
                                                        isSelected ? "text-blue-600" : "text-gray-400"
                                                    }`}
                                                />
                                                
                                                <span className="font-bold capitalize tracking-wide text-[13px]">
                                                    {role}
                                                </span>
                                                
                                                {/* Indikator Checkmark di pojok kanan atas saat dipilih */}
                                                <div className={`absolute top-2 right-2 transition-opacity duration-200 ${isSelected ? "opacity-100 text-blue-600" : "opacity-0"}`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value={
                                            isEditing
                                                ? "Password (Opsional)"
                                                : "Password"
                                        }
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="******"
                                        required={!isEditing}
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="******"
                                        required={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="mt-8 flex justify-end gap-3">
                            <SecondaryButton
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </SecondaryButton>
                            <PrimaryButton
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {isEditing ? "Simpan Perubahan" : "Buat User"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />

            {/* 2. MODAL KONFIRMASI */}
            <Modal
                show={confirmDialog.isOpen}
                onClose={() =>
                    setConfirmDialog({ isOpen: false, type: "", data: null })
                }
                maxWidth="sm"
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                        {confirmDialog.type === "delete"
                            ? "Konfirmasi Hapus User"
                            : confirmDialog.type === "update"
                              ? "Simpan Perubahan?"
                              : "Buat User Baru?"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        {confirmDialog.type === "delete"
                            ? `Apakah Anda yakin ingin menghapus akun pengguna "${confirmDialog.data?.name}" secara permanen? Tindakan ini tidak dapat dibatalkan.`
                            : "Apakah Anda yakin data pengguna yang dimasukkan sudah benar dan ingin menyimpannya ke dalam sistem?"}
                    </p>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() =>
                                setConfirmDialog({
                                    isOpen: false,
                                    type: "",
                                    data: null,
                                })
                            }
                        >
                            Batal
                        </SecondaryButton>

                        <PrimaryButton
                            onClick={executeAction}
                            disabled={processing}
                            className={
                                confirmDialog.type === "delete"
                                    ? "bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900"
                                    : "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900"
                            }
                        >
                            {processing
                                ? "Memproses..."
                                : confirmDialog.type === "delete"
                                  ? "Ya, Hapus!"
                                  : "Ya, Simpan!"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* MODAL VIEW USER */}
            <Modal show={showViewModal} onClose={() => setShowViewModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Detail Informasi User
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowViewModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="rotate-45"
                                size="lg"
                            />
                        </button>
                    </div>

                    {viewData && (
                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Nama Lengkap" />
                                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {viewData.name}
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Alamat Email" />
                                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {viewData.email}
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Role / Jabatan" />
                                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 capitalize">
                                    {viewData.roles.map((r) => r.name).join(", ")}
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Tanggal Bergabung" />
                                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {new Date(viewData.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={() => setShowViewModal(false)}>
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
