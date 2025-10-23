'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { authService } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Se já estiver logado, redireciona para dashboard
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      console.log('[Login Page] Usuário já está logado, redirecionando para /dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, _hasHydrated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);

      // O token vem no cookie HTTP-only, apenas salvamos o usuário no estado
      setAuth(response.user);

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${response.user.name}`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      const errorData = error.response?.data;
      let errorTitle = 'Erro ao fazer login';
      let errorDescription = 'Credenciais inválidas';

      if (errorData) {
        if (errorData.error) {
          errorDescription = errorData.error;

          // Se tiver detalhes de múltiplos erros, mostra todos
          if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 1) {
            errorDescription = errorData.details
              .map((detail: any) => detail.message)
              .join(', ');
          }
        }
      } else if (error.message) {
        errorDescription = error.message;
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Medical AI</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="medico@exemplo.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Registre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
