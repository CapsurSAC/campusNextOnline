'use client';

import SidebarContent from './Sidebar';
import NavBar from './NavBar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthRoute =
  pathname === '/login' || pathname === '/registro' || pathname === '/demo';

if (isAuthRoute) return <>{children}</>;


  return (
    <>
      {/* Navbar superior */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar onToggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="pt-16 flex min-h-screen">
        {/* SIDEBAR MOBILE */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="w-60 bg-slate-900 text-white shadow-lg pt-16 relative">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:flex w-60 flex-col bg-slate-900 text-white border-r border-white/10">
          <SidebarContent />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 px-6 py-8 bg-slate-900 text-white">{children}</main>
      </div>
    </>
  );
}
