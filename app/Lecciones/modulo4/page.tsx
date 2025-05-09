// app/Lecciones/modulo-1/page.tsx
'use client';

import { FiVideo, FiFileText, FiLink, FiMic } from 'react-icons/fi';
import { FiBook } from 'react-icons/fi';

export default function Modulo1Inicio() {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiBook size={24} />
        Bienvenido al Módulo 4: Comunicación Activa
      </h2>

      <div className="bg-white/10 p-6 rounded-xl space-y-4 shadow backdrop-blur">
      <p className="text-white/80">
  Aquí llevarás tu inglés al siguiente nivel con vocabulario más complejo, estructuras conversacionales extendidas y estrategias para expresarte con mayor fluidez y confianza.
</p>


        <ul className="list-none space-y-3">
          <li className="flex items-center gap-3">
            <FiVideo size={20} />
            <span><strong>Videos de clase:</strong> Aprende con explicaciones visuales.</span>
          </li>
          <li className="flex items-center gap-3">
            <FiFileText size={20} />
            <span><strong>Diapositivas:</strong> Accede a los contenidos de cada lección.</span>
          </li>
          <li className="flex items-center gap-3">
            <FiLink size={20} />
            <span><strong>Recursos:</strong> Revisa guías, glosarios y ejercicios adicionales.</span>
          </li>
          <li className="flex items-center gap-3">
            <FiMic size={20} />
            <span><strong>Clase en vivo con JUNE:</strong> Practica en tiempo real con IA.</span>
          </li>
        </ul>

        <p className="text-white/60 pt-2">
          Usa el submenú de arriba para empezar tu aprendizaje. ¡Vamos con todo! 💪
        </p>
      </div>
    </div>
  );
}
