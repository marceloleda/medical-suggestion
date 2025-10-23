'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, _hasHydrated } = useAuthStore();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Só redireciona depois que o Zustand terminou de hidratar
    if (_hasHydrated && !loading && !isAuthenticated) {
      router.push('/login');
    } else if (_hasHydrated && isAuthenticated) {
      setShouldRender(true);
    }
  }, [isAuthenticated, loading, _hasHydrated, router]);

  // Enquanto está hidratando, mostra loading
  if (!_hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado após hidratar, não renderiza nada (já redirecionou)
  if (!isAuthenticated) {
    return null;
  }

  // Só renderiza o conteúdo quando tiver certeza que está autenticado
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
