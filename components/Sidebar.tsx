'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  Music,
  FileText,
  UserCircle,
  LogOut,
  Volume2,
} from 'lucide-react';

export default function SidebarContent() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Perfil */}
        <div className="flex flex-col items-center mt-6">
          <Link href="/perfil">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white mb-2 cursor-pointer hover:brightness-110 transition">
              <Image
                src="/images/perfil.jpg"
                alt="Perfil"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </Link>
          
        <SidebarLink href="/perfil" icon={<UserCircle size={20} />} label="Mi perfil" />
        </div>

        {/* Navegación */}
        <nav className="flex flex-col mt-10 px-4 space-y-3">
          <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Inicio" />
          <SidebarLink href="/Lecciones" icon={<BookOpen size={20} />} label="Lecciones" />
          <SidebarLink href="/sonidos" icon={<Volume2 size={20} />} label="Sonidos" />
          <SidebarLink href="/musica" icon={<Music size={20} />} label="Aprende con Música" />
          <SidebarLink href="/evaluaciones" icon={<FileText size={20} />} label="Evaluaciones" />
        </nav>
      </div>

      {/* Acciones abajo */}
      <div className="flex flex-col px-4 pb-4 gap-2 mt-6 border-t border-white/10 pt-4">

        <button className="flex items-center gap-3 text-red-500 hover:text-white hover:bg-red-600 px-3 py-2 rounded transition">
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-slate-700 px-3 py-2 rounded transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
