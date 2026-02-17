import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
            <p className="text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} PT Darma Henwa - Kintap Coal Project. All rights reserved.
            </p>
        </footer>
    );
}