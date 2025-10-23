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

      // Tratamento específico para erros de validação Zod
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        const firstError = zodError.issues[0];
        const fieldName = firstError.path[0];
        const errorMessage = firstError.message;

        const fieldTranslation: Record<string, string> = {
          email: 'E-mail',
          password: 'Senha',
          name: 'Nome',
          crm: 'CRM',
        };

        const translatedField = fieldTranslation[fieldName] || fieldName;

        return res.status(400).json({
          error: `${translatedField}: ${errorMessage}`,
          field: fieldName,
          details: zodError.issues.map((issue: any) => ({
            field: issue.path[0],
            message: issue.message,
          }))
        });
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

      // Tratamento específico para erros de validação Zod
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        const firstError = zodError.issues[0];
        const fieldName = firstError.path[0];
        const errorMessage = firstError.message;

        const fieldTranslation: Record<string, string> = {
          email: 'E-mail',
          password: 'Senha',
        };

        const translatedField = fieldTranslation[fieldName] || fieldName;

        return res.status(400).json({
          error: `${translatedField}: ${errorMessage}`,
          field: fieldName,
          details: zodError.issues.map((issue: any) => ({
            field: issue.path[0],
            message: issue.message,
          }))
        });
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
