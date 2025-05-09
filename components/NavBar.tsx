'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';
import { ThemeSwitch } from './ThemeSwitch';
import { HeyGenLogo } from './Icons';
import { Menu } from 'lucide-react';

export default function NavBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <nav className="w-full h-16 bg-black text-white px-4 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-3">
        {/* Botón menú visible solo en móvil */}
        <button className="block md:hidden" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        
        {/* Logo alineado a la izquierda */}
        <Link href="/" aria-label="NextOnline" className="flex items-center">
          <HeyGenLogo />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Puedes agregar más cosas aquí si deseas */}
        <ThemeSwitch />
      </div>
    </nav>
  );
}