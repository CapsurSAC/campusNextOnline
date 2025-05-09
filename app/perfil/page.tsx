'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Progress,
  Chip,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react';
import { User, TrendingUp, Medal, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState('Juan Pérez');
  const [email, setEmail] = useState('juanperez@example.com');
  const [language, setLanguage] = useState('Español');
  const [level, setLevel] = useState('Básico');
  const [goal, setGoal] = useState('3 lecciones');

  return (
    <main className="min-h-screen px-4 py-10 md:px-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <h1 className="text-4xl font-bold mb-10 text-center flex items-center justify-center gap-3">
        <User className="w-8 h-8" /> Mi perfil
      </h1>

      {/* Cards de resumen */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="bg-slate-800 text-white">
          <CardHeader className="flex items-center gap-4">
            <TrendingUp />
            <div>
              <p className="text-sm text-white/60">Progreso</p>
              <p className="text-lg font-bold">45%</p>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-slate-800 text-white">
          <CardHeader className="flex items-center gap-4">
            <Medal />
            <div>
              <p className="text-sm text-white/60">Logros</p>
              <p className="text-lg font-bold">10 lecciones</p>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-slate-800 text-white">
          <CardHeader className="flex items-center gap-4">
            <Clock />
            <div>
              <p className="text-sm text-white/60">Último acceso</p>
              <p className="text-lg font-bold">Hoy 18:23</p>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-slate-800 text-white">
          <CardHeader className="flex items-center gap-4">
            <User />
            <div>
              <p className="text-sm text-white/60">Nivel</p>
              <p className="text-lg font-bold">{level}</p>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Paneles principales */}
      <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
        {/* Perfil */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
          <Image src="/images/perfil.jpg" alt="Avatar" width={110} height={110} className="rounded-full mb-4" />
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-white/70 text-sm">{email}</p>
          <div className="mt-4 text-left w-full max-w-xs mx-auto space-y-1 text-sm">
            <p><strong>Idioma:</strong> {language}</p>
            <p><strong>Nivel actual:</strong> {level}</p>
            <p><strong>Meta semanal:</strong> {goal}</p>
          </div>
          <Button onPress={onOpen} color="primary" className="mt-4 w-full max-w-xs">✏️ Editar perfil</Button>
        </div>

        {/* Progreso */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">📊 Progreso general</h3>
            <Progress value={45} color="success" className="mb-1" />
            <p className="text-xs text-white/70">45% del curso completado</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">📌 Últimas actividades</h3>
            <ul className="text-sm text-white/80 list-disc list-inside">
              <li>Lección 4: Presentaciones - Completada ayer</li>
              <li>Evaluación 2: 90% - Hace 3 días</li>
              <li>Último acceso: Hoy a las 18:23</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">🏅 Logros</h3>
            <div className="flex flex-wrap gap-2">
              <Chip color="success" variant="flat">✅ 10 lecciones</Chip>
              <Chip color="warning" variant="flat">⭐ Nivel básico</Chip>
              <Chip color="secondary" variant="flat">📄 Constancia</Chip>
            </div>
          </div>

          <div className="flex gap-3">
            <Button color="warning" className="flex-1">🔐 Cambiar contraseña</Button>
            <Button color="danger" className="flex-1">🚪 Cerrar sesión</Button>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold">Editar perfil</ModalHeader>
              <ModalBody>
                <Input label="Nombre" value={name} onValueChange={setName} />
                <Input label="Correo electrónico" value={email} onValueChange={setEmail} />
                <Input label="Idioma" value={language} onValueChange={setLanguage} />
                <Input label="Nivel" value={level} onValueChange={setLevel} />
                <Input label="Meta semanal" value={goal} onValueChange={setGoal} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={onClose}>Guardar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
