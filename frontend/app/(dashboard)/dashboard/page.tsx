'use client';

import Header from '@/components/layout/Header';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao Medical AI System</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Consultas</CardTitle>
              <CardDescription>Gerencie suas consultas médicas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Total de consultas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transcrições</CardTitle>
              <CardDescription>Consultas transcritas pela IA</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Transcrições realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnósticos</CardTitle>
              <CardDescription>Diagnósticos gerados pela IA</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Diagnósticos gerados</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Nome:</span> {user?.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium">CRM:</span> {user?.crm}
            </div>
            <div>
              <span className="font-medium">Função:</span> {user?.role}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
