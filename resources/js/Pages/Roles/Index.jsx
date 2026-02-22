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
    faUserShield,
    faPlus,
    faEdit,
    faTrash,
    faShieldAlt,
    faCheckCircle,
    faLock,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function RoleIndex({ auth = {}, roles, all_permissions }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        type: "", // 'add', 'update', atau 'delete'
        data: null, // Menyimpan data role jika sedang menghapus
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
        permissions: [], // Array kosong untuk menampung nama permission
    });

    // --- LOGIKA CHECKBOX ---
    const handlePermissionChange = (permissionName) => {
        let newPermissions = [...data.permissions];

        if (newPermissions.includes(permissionName)) {
            // Jika sudah ada -> Hapus (Uncheck)
            newPermissions = newPermissions.filter((p) => p !== permissionName);
        } else {
            // Jika belum ada -> Tambah (Check)
            newPermissions.push(permissionName);
        }

        setData("permissions", newPermissions);
    };

    const openAddModal = () => {
        setIsEditing(false);
        reset(); // Reset form (permissions jadi kosong)
        clearErrors();
        setShowModal(true);
    };

    // 1. Pastikan ID masuk ke state dengan benar
    const openEditModal = (role) => {
        console.log("Membuka role untuk diedit:", role); // Tambahkan ini untuk cek di F12
        setIsEditing(true);
        clearErrors();

        const currentPermissions = role.permissions.map((p) => p.name);

        setData({
            id: role.id, // <--- Pastikan database mengirim field 'id'
            name: role.name,
            permissions: currentPermissions,
        });
        setShowModal(true);
    };

    // 2. Perbaiki pengiriman parameter pada route
    // Membuka modal konfirmasi untuk Tambah/Update
    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmDialog({
            isOpen: true,
            type: isEditing ? "update" : "add",
            data: null,
        });
    };

    // Membuka modal konfirmasi untuk Hapus
    const handleDelete = (role) => {
        if (role.name === "admin") {
            toast.error("Akses Ditolak: Role Admin tidak boleh dihapus!");
            return;
        }
        setConfirmDialog({
            isOpen: true,
            type: "delete",
            data: role,
        });
    };

    const executeAction = () => {
        // --- JIKA HAPUS DATA ---
        if (confirmDialog.type === "delete") {
            destroy(route("roles.destroy", confirmDialog.data.id), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    toast.success("Data role berhasil dihapus!");
                },
                preserveScroll: true,
            });
        }
        // --- JIKA UPDATE DATA ---
        else if (confirmDialog.type === "update") {
            // Ubah 'post' menjadi 'put', dan hapus baris _method: "put"
            put(route("roles.update", data.id), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    setShowModal(false);
                    reset();
                    toast.success("Data role berhasil diperbarui!");
                },
                preserveScroll: true,
            });
        }
        // --- JIKA TAMBAH DATA ---
        else if (confirmDialog.type === "add") {
            post(route("roles.store"), {
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false, type: "", data: null });
                    setShowModal(false);
                    reset();
                    toast.success("Role baru berhasil ditambahkan!");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user} header={null}>
            <Head title="Manajemen Role" />

            <div className="w-full p-2 sm:p-4 h-full flex flex-col">
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col flex-1 overflow-hidden">
                    {/* HEADER */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shadow-sm border border-purple-200">
                                <FontAwesomeIcon
                                    icon={faUserShield}
                                    size="lg"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                                    Role & Hak Akses
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Kelola struktur jabatan pengguna
                                </p>
                            </div>
                        </div>

                        <PrimaryButton
                            onClick={openAddModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Tambah Role Baru
                        </PrimaryButton>
                    </div>

                    {/* TABEL */}
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Nama Role
                                    </th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Guard
                                    </th> */}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Permissions (Hak Akses)
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roles.data.length > 0 ? (
                                    roles.data.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 border bg-purple-100 text-purple-600 border-purple-200">
                                                        <FontAwesomeIcon
                                                            icon={faShieldAlt}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-gray-900 capitalize block">
                                                            {role.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200 font-mono">
                                                    {role.guard_name}
                                                </code>
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.length >
                                                    0 ? (
                                                        <>
                                                            {role.permissions
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        perm,
                                                                        idx,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200"
                                                                        >
                                                                            {
                                                                                perm.name
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            {role.permissions
                                                                .length > 3 && (
                                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                                                                    +
                                                                    {role
                                                                        .permissions
                                                                        .length -
                                                                        3}{" "}
                                                                    lainnya
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">
                                                            Tidak ada akses
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {role.name !== "admin" ? (
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    role,
                                                                )
                                                            }
                                                            className="text-amber-500 hover:text-amber-700 transition-colors bg-amber-50 p-2 rounded-lg hover:bg-amber-100 border border-transparent hover:border-amber-200"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEdit}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role,
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-lg hover:bg-red-100 border border-transparent hover:border-red-200"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic pr-2 flex items-center justify-end gap-1">
                                                        <FontAwesomeIcon
                                                            icon={faLock}
                                                        />
                                                        Locked
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
                                            Belum ada role tambahan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM */}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                {isEditing
                                    ? "Edit Role & Akses"
                                    : "Tambah Role Baru"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Nama Role */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Role (Jabatan)"
                                />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FontAwesomeIcon icon={faUserShield} />
                                    </div>
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="pl-10 block w-full capitalize"
                                        placeholder="Contoh: Manager"
                                        required
                                        isFocused
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* PILIHAN PERMISSION (CHECKBOX GRID) */}
                            <div>
                                <InputLabel
                                    value="Hak Akses (Permissions)"
                                    className="mb-3"
                                />

                                {/* Grid Checkbox */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-60 overflow-y-auto custom-scrollbar">
                                    {all_permissions.map((perm) => {
                                        const isChecked =
                                            data.permissions.includes(
                                                perm.name,
                                            );
                                        return (
                                            <label
                                                key={perm.id}
                                                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                    isChecked
                                                        ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200"
                                                        : "bg-white border-gray-200 hover:border-blue-300"
                                                }`}
                                            >
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 h-4 w-4"
                                                        value={perm.name}
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            handlePermissionChange(
                                                                perm.name,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <span
                                                    className={`text-sm capitalize select-none ${isChecked ? "text-blue-800 font-medium" : "text-gray-700"}`}
                                                >
                                                    {perm.name.replace(
                                                        /_/g,
                                                        " ",
                                                    )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className="text-green-500"
                                    />
                                    Centang fitur yang diperbolehkan untuk
                                    jabatan ini.
                                </p>
                            </div>
                        </div>

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
                                {isEditing ? "Simpan Perubahan" : "Simpan Role"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
            {/* LETAKKAN TOASTER DI SINI (Untuk Notifikasi Pojok Layar) */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000, // Hilang otomatis dalam 3 detik
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />

            {/* MODAL KONFIRMASI KUSTOM (Ganti SweetAlert) */}
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
                            ? "Konfirmasi Hapus Data"
                            : confirmDialog.type === "update"
                              ? "Simpan Perubahan?"
                              : "Tambah Role Baru?"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        {confirmDialog.type === "delete"
                            ? `Apakah Anda yakin ingin menghapus role "${confirmDialog.data?.name}" secara permanen? Data yang dihapus tidak dapat dikembalikan.`
                            : "Apakah Anda yakin ingin menyimpan pengaturan role dan hak akses ini ke dalam sistem?"}
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
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
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
        </AuthenticatedLayout>
    );
}
