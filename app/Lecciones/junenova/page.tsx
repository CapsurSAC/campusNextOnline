'use client';

import Link from 'next/link';

const clases = [
  { title: 'Greetings', href: '/Lecciones/june/clases/module1' },
  { title: 'Daily Expressions', href: '/Lecciones/june/clases/module2' },
  { title: 'Numbers and Dates', href: '/Lecciones/june/clases/module3' },
  { title: 'Classroom Language', href: '/Lecciones/june/clases/module4' },
];

export default function JuneMainPage() {
  return (
    <div className="ml-1 p-6 min-h-screen bg-slate-800 text-white">

      <h2 className="text-2xl font-semibold mb-4">Clases con JUNE</h2>
      <p className="mb-6 text-white/70">
        Selecciona una clase para conversar con tu asistente JUNE:
      </p>

      <div className="grid gap-4">
        {clases.map((clase) => (
          <Link key={clase.href} href={clase.href}>
            <div className="p-4 bg-white/10 hover:bg-white/20 rounded transition cursor-pointer">
              {clase.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
