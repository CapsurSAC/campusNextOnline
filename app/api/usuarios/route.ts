// app/api/usuarios/route.ts
import { PrismaClient, RolUsuario } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // 👈 importa bcrypt

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
     console.error('Error en GET /api/usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body recibido:", body);

    const { nombre, apellido, email, telefono, dni, contraseña, rol } = body;

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuario ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, apellido, email, telefono, dni, contraseña: hashedPassword, rol },
    });


    return NextResponse.json(nuevoUsuario);
  } catch (error: any) {
    console.error("Error en POST /api/usuarios:", error);
    return NextResponse.json({ error: error.message || 'Error inesperado' }, { status: 500 });
  }
}

