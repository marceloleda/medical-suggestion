import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../utils/validations';

export class AuthService {
  async register(data: RegisterInput) {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', 400);
    }

    // Verificar se CRM já existe
    const existingCrm = await prisma.user.findUnique({
      where: { crm: data.crm },
    });

    if (existingCrm) {
      throw new AppError('CRM já cadastrado', 400);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        crm: data.crm,
      },
      select: {
        id: true,
        email: true,
        name: true,
        crm: true,
        role: true,
        createdAt: true,
      },
    });

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async login(data: LoginInput) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        crm: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }
}
