/*
  Warnings:

  - You are about to drop the column `tipo` on the `Leccion` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TipoMaterial" ADD VALUE 'CLASE_JUNE';

-- AlterTable
ALTER TABLE "Leccion" DROP COLUMN "tipo";
