
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import type { Station } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, PlusCircle, MoreHorizontal, Loader2, Radio, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { WithId } from '@/firebase/firestore/use-collection';

export default function ManageStationsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const stationsQuery = useMemo(() => query(collection(firestore, 'stations'), orderBy('order')), [firestore]);
  const { data: stations, loading, error } = useCollection<Station>(stationsQuery);

  const [stationToDelete, setStationToDelete] = useState<WithId<Station> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteStation = async () => {
    if (!stationToDelete) return;
    
    setIsDeleting(true);
    const stationRef = doc(firestore, 'stations', stationToDelete.id);

    try {
      await deleteDoc(stationRef);
      toast({
        title: 'Emisora eliminada',
        description: `La emisora "${stationToDelete.name}" ha sido eliminada.`,
      });
    } catch (e: any) {
      console.error("Error deleting station: ", e);
      if (e.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: stationRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la emisora. ' + (e.message || ''),
      });
    } finally {
      setIsDeleting(false);
      setStationToDelete(null);
    }
  };


  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-card">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Gestionar Emisoras
            </h1>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/stations/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Emisora
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">País</TableHead>
                  <TableHead className="hidden sm:table-cell">Tags</TableHead>
                  <TableHead className="w-[50px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && stations && stations.length > 0 ? (
                  stations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell>
                        {station.logoUrl ? (
                          <Image
                            src={station.logoUrl}
                            alt={station.name}
                            width={40}
                            height={40}
                            className="rounded-md aspect-square object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                              <Radio className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{station.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{station.country}</TableCell>
                      <TableCell className="hidden sm:table-cell">{station.tags?.join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/stations/${station.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setStationToDelete(station)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-48">
                        No hay emisoras en la base de datos.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
          {error && (
              <p className="text-destructive text-center mt-4">Error: {error.message}</p>
          )}
        </main>
      </div>

      <AlertDialog open={!!stationToDelete} onOpenChange={(open) => !open && setStationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la emisora
              <span className="font-bold"> "{stationToDelete?.name}" </span>
              de los servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStationToDelete(null)} disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStation} 
              disabled={isDeleting} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    