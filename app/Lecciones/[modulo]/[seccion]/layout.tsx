'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function SeccionLayout({ children }: { children: ReactNode }) {
  const { modulo } = useParams();
  const pathname = usePathname();

  const tabs = [
    { label: 'Videos de clase', href: `/Lecciones/${modulo}/videos/lesson1` },
    { label: 'Diapositivas', href: `/Lecciones/${modulo}/diapositivas/lesson1` },
    { label: 'Recursos', href: `/Lecciones/${modulo}/recursos/lesson1` },
    { label: 'Clase en vivo con JUNE', href: `/Lecciones/${modulo}/june/lesson1` },
  ];

  return (
    <div className="min-h-screen bg-slate-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">Lecciones del {modulo}</h1>

      <div className="flex gap-4 mb-6">
        {tabs.map(({ label, href }) => (
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

      {children}
    </div>
  );
}
