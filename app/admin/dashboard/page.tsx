
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirebaseApp } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Radio, SlidersHorizontal, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cerrar la sesión.',
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Panel de Administración
          </h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">¡Bienvenido!</h2>
          <p className="text-muted-foreground">
            Desde aquí puedes gestionar el contenido de tu aplicación.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/stations">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Gestionar Emisoras
                </CardTitle>
                <Radio className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Agrega, edita o elimina las emisoras de radio.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/sliders">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Gestionar Sliders
                </CardTitle>
                <SlidersHorizontal className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Administra las imágenes y enlaces del carrusel de anuncios.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
