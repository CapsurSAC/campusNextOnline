/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "dni" TEXT NOT NULL,
ADD COLUMN     "idioma" TEXT DEFAULT 'Español',
ADD COLUMN     "metaSemanal" TEXT DEFAULT '3 lecciones',
ADD COLUMN     "nivel" TEXT DEFAULT 'Básico',
ADD COLUMN     "progreso" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ultimoAcceso" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");
