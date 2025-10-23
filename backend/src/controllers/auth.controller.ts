import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { loginSchema, registerSchema } from '../utils/validations';
import { AppError } from '../utils/errors';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      // Validar dados
      const validatedData = registerSchema.parse(req.body);

      // Registrar usuário
      const result = await authService.register(validatedData);

      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error });
      }
      console.error('Erro no registro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Validar dados
      const validatedData = loginSchema.parse(req.body);

      // Fazer login
      const result = await authService.login(validatedData);

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error });
      }
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const user = await authService.getProfile(userId);

      return res.status(200).json({ user });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
