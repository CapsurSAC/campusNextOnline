'use client';

import { useState, useRef } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, FileText, Hash, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminEvaluacionesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cursoId, setCursoId] = useState<string>('2');
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
      if (validTypes.includes(droppedFile.type) || droppedFile.name.match(/\.(xlsx|xls|csv)$/)) {
         setFile(droppedFile);
         setMessage(null);
      } else {
         setMessage({ text: 'Por favor sube un archivo Excel válido (.xlsx, .xls, .csv)', type: 'error' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Por favor, selecciona un archivo Excel.', type: 'error' });
      return;
    }
    if (!titulo.trim() || !descripcion.trim() || !cursoId.trim()) {
      setMessage({ text: 'Por favor, completa todos los campos del formulario.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cursoId', cursoId);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    try {
      const res = await fetch('/api/admin/evaluaciones/importar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Evaluación importada y guardada correctamente.', type: 'success' });
        setFile(null);
        setTitulo('');
        setDescripcion('');
      } else {
        setMessage({ text: data.error || 'Hubo un problema al importar.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Ocurrió un error inesperado al conectar con el servidor.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f4f5] dark:bg-[#0f0c29] p-4 sm:p-8 flex justify-center items-start">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl border-none backdrop-blur-xl bg-white/90 dark:bg-black/60">
          <CardHeader className="flex flex-col gap-1 items-start px-8 pt-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <FileSpreadsheet size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-default-900 tracking-tight">Importar Evaluación</h1>
                <p className="text-sm text-default-500 font-medium">Carga las preguntas de tus alumnos a través de un archivo Excel.</p>
              </div>
            </div>
          </CardHeader>
          
          <Divider className="opacity-50" />
          
          <CardBody className="px-8 py-6 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="ID del Curso"
                placeholder="Ej. 2"
                variant="flat"
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                startContent={<Hash className="text-default-400 pointer-events-none" size={18} />}
                className="font-medium"
              />
              <Input
                label="Título de la Evaluación"
                placeholder="Ej. Examen de Medio Término"
                variant="flat"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                startContent={<FileText className="text-default-400 pointer-events-none" size={18} />}
                className="font-medium"
              />
            </div>

            <Textarea
              label="Descripción"
              placeholder="Instrucciones breves o descripción de esta evaluación..."
              variant="flat"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              minRows={3}
              className="font-medium"
            />

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-default-700 ml-1">Archivo de Preguntas</label>
              <div 
                className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all duration-300 group cursor-pointer
                  ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-default-300 hover:border-primary/50 hover:bg-default-100/50 dark:hover:bg-default-50/10'}
                  ${file ? 'border-success/50 bg-success/5 dark:bg-success/10' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div 
                      key="file"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center text-center gap-2"
                    >
                      <div className="p-4 rounded-full bg-success/20 text-success mb-2">
                        <FileSpreadsheet size={40} />
                      </div>
                      <span className="font-bold text-success-600 dark:text-success-500 text-lg">{file.name}</span>
                      <span className="text-sm font-medium text-default-500 bg-default-100 px-3 py-1 rounded-full">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <span className="text-xs text-default-400 mt-2 hover:underline">Haz clic para cambiar el archivo</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="upload"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center text-center gap-2"
                    >
                      <div className="p-4 rounded-full bg-default-100 dark:bg-default-50 group-hover:bg-primary/10 text-default-400 group-hover:text-primary transition-colors mb-2">
                        <UploadCloud size={40} />
                      </div>
                      <span className="font-bold text-default-700 text-lg">Haz clic o arrastra tu Excel aquí</span>
                      <p className="text-sm text-default-500 max-w-xs">
                        Soporta archivos <strong className="text-default-700">.xlsx, .xls, .csv</strong>
                      </p>
                      <div className="mt-4 text-xs font-medium text-default-400 bg-default-100 dark:bg-default-50 px-4 py-2 rounded-lg">
                        Columnas requeridas: <span className="text-primary">Enunciado</span>, <span className="text-primary">Opciones</span>, <span className="text-primary">Respuesta_Correcta</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
                    message.type === 'success' 
                      ? 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-900/30 dark:text-success-400 dark:border-success-800' 
                      : 'bg-danger-50 text-danger-700 border border-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:border-danger-800'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              color="primary"
              size="lg"
              className="w-full font-bold text-lg mt-2 shadow-lg shadow-primary/30"
              onClick={handleUpload}
              isLoading={loading}
              isDisabled={!file}
              startContent={!loading && <UploadCloud size={20} />}
            >
              {loading ? 'Procesando archivo...' : 'Guardar e Importar Evaluación'}
            </Button>
            
          </CardBody>
        </Card>
      </motion.div>
    </main>
  );
}
