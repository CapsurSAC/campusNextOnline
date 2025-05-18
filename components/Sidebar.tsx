'use client';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Music,
  FileText,
  UserCircle,
  LogOut,
  Volume2,
  Award,
} from 'lucide-react';

export default function SidebarContent() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full justify-between bg-slate-900 text-white">
      {/* Superior: perfil + menú */}
      <div className="flex flex-col items-center pt-6">
        {/* Foto */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white mb-2">
          <Image
            src="/images/perfil.jpg"
            alt="Foto de perfil"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        {/* Nombre y rol */}
        {user && (
          <div className="text-center mb-2">
            <p className="text-sm font-semibold">{user.nombre || user.email}</p>
            <p className="text-xs text-white/60 uppercase">{user.rol}</p>
          </div>
        )}

        {/* Ver perfil */}
        <Link
          href="/perfil"
          className="text-xs text-blue-400 hover:underline mb-4 flex items-center gap-1"
        >
          <UserCircle size={16} />
          Ver perfil
        </Link>

        {/* Menú de navegación */}
        <nav className="flex flex-col mt-6 w-full px-4 space-y-3">
          <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Inicio" />
          <SidebarLink href="/Lecciones" icon={<BookOpen size={20} />} label="Lecciones" />
          <SidebarLink href="/sonidos" icon={<Volume2 size={20} />} label="Sonidos" />
          <SidebarLink href="/musica" icon={<Music size={20} />} label="Aprende con Música" />
          <SidebarLink href="/evaluaciones" icon={<FileText size={20} />} label="Evaluaciones" />
          <SidebarLink href="/certificado" icon={<Award size={20} />} label="Certificado" />
        </nav>
      </div>

      {/* Inferior: logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-white hover:bg-red-600 px-3 py-2 rounded transition w-full justify-start"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
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
