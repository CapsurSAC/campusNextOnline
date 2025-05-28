'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';


export default function EvaluacionesPage() {
  const { user, loading: userLoading } = useUser();
  const { cursos, loading: cursosLoading } = useMisCursos();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading]);

  if (userLoading || cursosLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <p className="text-lg font-semibold animate-pulse">Cargando evaluaciones...</p>
      </main>
    );
  }

  if (!user || cursos.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-slate-900 px-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Acceso denegado</h2>
          <p className="text-white/70">
            Necesitas estar inscrito en al menos un curso para ver las evaluaciones. Contacta al administrador.
          </p>
        </div>
      </main>
    );
  }

  return (

        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold drop-shadow tracking-tight">
          🚀 Selecciona tu <span className="text-purple-400">nivel</span> para evaluar
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
          Comienza con el básico y desbloquea los niveles superiores a medida que avanzas con <strong className="text-white">JUNE</strong>.
        </p>
        {/* Barra de progreso opcional */}
        <div className="mt-6 w-72 mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
          <div className="bg-green-400 h-full w-1/3 transition-all duration-500"></div>
        </div>
      </motion.div>


        <LevelCard
          title="Nivel Básico"
          description="Evalúa lo aprendido en tus primeras lecciones."
          icon={<CheckCircle size={48} className="text-green-400" />}
          href="/evaluaciones/basico"
          locked={false}
        />
        <LevelCard
          title="Nivel Intermedio"
          description="Desbloquea este nivel completando el módulo básico."
          icon={<Lock size={48} className="text-yellow-300" />}
          locked
        />
        <LevelCard
          title="Nivel Avanzado"
          description="Completa los niveles anteriores para acceder."
          icon={<ShieldCheck size={48} className="text-red-400" />}
          locked
        />
      </div>
    </main>
  );
}

function LevelCard({
  title,
  description,
  icon,
  href,
  locked,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  locked?: boolean;
}) {
  const animatedIcon = !locked ? (
    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
      {icon}
    </motion.div>
  ) : (
    icon
  );

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative group rounded-3xl p-6 border transition-all duration-300 backdrop-blur-md ${
        locked
          ? 'bg-gray-700 border-white/10 opacity-40 cursor-not-allowed'
          : 'bg-[#1b1b2f] border-white/10 hover:border-violet-500 hover:shadow-violet-500/20 cursor-pointer'
      }`}
    >
      {!locked && (
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 blur opacity-0 group-hover:opacity-20 transition" />
      )}
      <div className="relative flex flex-col items-center text-center gap-5 z-10">
        <div className="p-4 bg-white/10 rounded-full shadow-inner">{animatedIcon}</div>
        <h3 className="text-2xl font-bold tracking-tight">
          {locked ? (
            <span className="group relative">
              {title}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Termina el anterior primero
              </span>
            </span>
          ) : (
            title
          )}
        </h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </motion.div>
  );

  return locked ? <div>{card}</div> : <Link href={href ?? '#'}>{card}</Link>;

