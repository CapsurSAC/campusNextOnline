// app/api/usuarios/route.ts
import { PrismaClient, RolUsuario } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // 👈 importa bcrypt

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
    const { nombre, apellido, email, contraseña, rol } = body;

    // 🛑 Validar si el correo ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 400 });
    }

    // 🔐 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // ✅ Crear nuevo usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        contraseña: hashedPassword,
        rol: rol as RolUsuario,
      },
    });

    return NextResponse.json(nuevoUsuario);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
