'use client';

import { useState, useRef } from 'react';

export default function LuciaPiPWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = pipRef.current;
    if (!el) return;

    const shiftX = e.clientX - el.getBoundingClientRect().left;
    const shiftY = e.clientY - el.getBoundingClientRect().top;

    const moveAt = (pageX: number, pageY: number) => {
      el.style.left = pageX - shiftX + 'px';
      el.style.top = pageY - shiftY + 'px';
    };

    const onMouseMove = (e: MouseEvent) => moveAt(e.pageX, e.pageY);
    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };

  const openLucia = () => {
    window.open(
      'https://chatgpt.com/g/g-67eaffd5a94c81918945652d44cdec39-chat-lucia',
      'luciaChat',
      'width=420,height=700,left=1000,top=100,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  return (
    <>
      {/* Botón flotante para abrir la PiP */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          💬 Mentor June
        </button>
      )}

      {/* Ventana PiP flotante */}
      {isOpen && (
        <div
          ref={pipRef}
          onMouseDown={handleMouseDown}
          className="fixed z-50 bottom-20 right-4 bg-white border shadow-lg rounded-lg overflow-hidden w-[300px]"
          style={{ cursor: 'move' }}
        >
          {/* Barra superior */}
          <div className="bg-purple-600 text-white flex justify-between items-center px-3 py-2">
            <span className="text-sm font-semibold">Lucía Asistente</span>
            <div className="flex gap-2">
              <button
                onClick={() => setMinimized(!minimized)}
                className="text-white hover:text-gray-200"
              >
                {minimized ? '🔼' : '🔽'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Contenido */}
          {!minimized && (
            <div className="p-4 text-sm text-gray-700 flex flex-col items-center text-center">
              <p className="mb-2">
                ¿Necesitas ayuda? Haz clic en el botón para hablar con Lucía en una ventana nueva.
              </p>
              <button
                onClick={openLucia}
                className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition"
              >
                Abrir Chat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}