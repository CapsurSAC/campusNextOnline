// components/CursoBreadcrumb.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CursoBreadcrumb() {
  const path = usePathname(); // ejemplo: /cursos/ingles-basico/sonidos
  const parts = path.split('/').filter(Boolean); // ['cursos', 'ingles-basico', 'sonidos']

  const breadcrumbs = parts.map((part, index) => {
    const href = '/' + parts.slice(0, index + 1).join('/');
    const isLast = index === parts.length - 1;
    const label = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitaliza

    return (
      <span key={href}>
        {!isLast ? (
          <>
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </>
        ) : (
          <span className="text-gray-700">{label}</span>
        )}
      </span>
    );
  });

  return <nav className="text-sm mb-4">{breadcrumbs}</nav>;
}
