// app/Lecciones/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const subRoutes = [
  { label: 'Videos de clase', href: '/Lecciones/modulo3/videos' },
  { label: 'Diapositivas', href: '/Lecciones/modulo3/diapositivas' },
  { label: 'Recursos', href: '/Lecciones/modulo3/recursos' },
  { label: 'Clase en vivo con JUNE', href: '/Lecciones/modulo3/june' },
];

export default function LeccionesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="ml-1 p-6 min-h-screen bg-slate-800 text-white">
      <h1 className="text-3xl font-bold mb-4">Lecciones</h1>

      <div className="flex gap-4 mb-6">
        {subRoutes.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 rounded ${
              pathname === href
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div>{children}</div>
    </div>
  );
}
