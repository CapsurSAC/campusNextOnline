import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';
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
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Poppins-Bold.ttf');

  const templateBuffer = fs.readFileSync(templatePath);
  const fontBuffer = fs.readFileSync(fontPath);

  const pdfDoc = await PDFDocument.load(templateBuffer);

  // 👇 REGISTRAR FONTKIT para usar fuentes personalizadas
  pdfDoc.registerFontkit(fontkit);

  const customFont = await pdfDoc.embedFont(fontBuffer);
  const page = pdfDoc.getPage(0);

  const nombre = `${inscripcion.usuario.nombre} ${inscripcion.usuario.apellido}`;
  const curso = inscripcion.curso.titulo;
  const fecha = new Date().toLocaleDateString('es-PE');

  const width = page.getWidth();

  const xNombre = (width - customFont.widthOfTextAtSize(nombre, 24)) / 2;
  const xCurso = (width - customFont.widthOfTextAtSize(curso, 20)) / 2;
  const xFecha = (width - customFont.widthOfTextAtSize(fecha, 16)) / 2;

  page.drawText(nombre, { x: xNombre, y: 290, size: 24, font: customFont, color: rgb(0, 0, 0) });
  page.drawText(curso, { x: xCurso, y: 260, size: 20, font: customFont, color: rgb(0, 0, 0) });
  page.drawText(fecha, { x: xFecha, y: 230, size: 16, font: customFont, color: rgb(0, 0, 0) });

  return await pdfDoc.save();
}