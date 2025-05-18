import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function generarCertificado(inscripcionId: number): Promise<Uint8Array> {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id: inscripcionId },
    include: {
      usuario: true,
      curso: true,
    },
  });

  if (!inscripcion) throw new Error('Inscripción no encontrada');

  const templatePath = path.join(process.cwd(), 'public', 'plantilla.pdf');
  const buffer = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(new Uint8Array(buffer));

  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const nombre = `${inscripcion.usuario.nombre} ${inscripcion.usuario.apellido}`;
  const curso = inscripcion.curso.titulo;
  const fecha = new Date().toLocaleDateString('es-PE');

  page.drawText(nombre, { x: 200, y: 300, size: 24, font, color: rgb(0, 0, 0) });
  page.drawText(curso, { x: 200, y: 270, size: 20, font, color: rgb(0, 0, 0) });
  page.drawText(fecha, { x: 200, y: 240, size: 16, font, color: rgb(0, 0, 0) });

  return await pdfDoc.save();
}