/*
  Warnings:

  - A unique constraint covering the columns `[inscripcionId,leccionId]` on the table `ProgresoLeccion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProgresoLeccion_inscripcionId_leccionId_key" ON "ProgresoLeccion"("inscripcionId", "leccionId");
