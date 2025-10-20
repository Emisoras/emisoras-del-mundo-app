
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, deleteDoc, doc, orderBy, query, writeBatch, getDocs } from 'firebase/firestore';
import type { Slider } from '@/types';
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
import { ArrowLeft, PlusCircle, MoreHorizontal, Loader2, Trash2, Pencil, Image as ImageIcon } from 'lucide-react';
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

const slidersToMigrate: Omit<Slider, 'id'>[] = [
  { src: "https://i.imgur.com/g2ytUjl.png", alt: "Anuncio 1", dataAiHint: "advertisement banner", linkUrl: "https://wa.me/51941319613", order: 1 },
  { src: "https://i.imgur.com/evO6XUa.png", alt: "Anuncio 2", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 2 },
  { src: "https://i.imgur.com/SEYv4V9.png", alt: "Anuncio 3", dataAiHint: "advertisement", linkUrl: "https://wa.me/51941319613", order: 3 },
  { src: "https://i.imgur.com/Lu90kzG.png", alt: "Anuncio 4", dataAiHint: "promotion item", linkUrl: "https://wa.me/51941319613", order: 4 },
  { src: "https://i.imgur.com/IQIVY9U.png", alt: "Anuncio 5", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 5 },
  { src: "https://i.imgur.com/sXxc0Rf.png", alt: "Anuncio 6", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 6 },
  { src: "https://i.imgur.com/MjZflf3.png", alt: "Anuncio 7", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 7 },
  { src: "https://i.imgur.com/FnnP7zB.png", alt: "Anuncio 8", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 8 },
  { src: "https://i.imgur.com/BgAbxhE.png", alt: "Anuncio 9", dataAiHint: "banner ad", linkUrl: "https://wa.me/51941319613", order: 9 },
];


export default function ManageSlidersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const slidersQuery = useMemo(() => query(collection(firestore, 'sliders'), orderBy('order')), [firestore]);
  const { data: sliders, loading, error } = useCollection<Slider>(slidersQuery);

  const [sliderToDelete, setSliderToDelete] = useState<WithId<Slider> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(true);

  useEffect(() => {
    const handleMigration = async () => {
      const migrationKey = 'slider_migration_v1_done';
      const migrationDone = localStorage.getItem(migrationKey);

      if (migrationDone) {
        setIsMigrating(false);
        return;
      }
      
      const slidersRef = collection(firestore, 'sliders');
      
      try {
        const existingDocs = await getDocs(slidersRef);
        if (existingDocs.empty) {
            console.log("Adding sliders...");
            const addBatch = writeBatch(firestore);
            slidersToMigrate.forEach(sliderData => {
              const docRef = doc(slidersRef);
              addBatch.set(docRef, sliderData);
            });
            await addBatch.commit();
            console.log("Migration complete!");
        }
        localStorage.setItem(migrationKey, 'true');

      } catch (error: any) {
         if (error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: slidersRef.path,
                operation: 'write',
                requestResourceData: slidersToMigrate
            });
            errorEmitter.emit('permission-error', permissionError);
         } else {
            console.error("An unexpected error occurred during slider migration:", error);
         }
      } finally {
        setIsMigrating(false);
      }
    };
    
    handleMigration();
  }, [firestore]);

  const handleDeleteSlider = async () => {
    if (!sliderToDelete) return;
    
    setIsDeleting(true);
    const sliderRef = doc(firestore, 'sliders', sliderToDelete.id);

    try {
      await deleteDoc(sliderRef);
      toast({
        title: 'Slider eliminado',
        description: `El slider "${sliderToDelete.alt}" ha sido eliminado.`,
      });
    } catch (e: any) {
      console.error("Error deleting slider: ", e);
      if (e.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: sliderRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el slider. ' + (e.message || ''),
      });
    } finally {
      setIsDeleting(false);
      setSliderToDelete(null);
    }
  };


  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-card">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Gestionar Sliders
            </h1>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/sliders/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Slider
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
                  <TableHead className="w-[120px]">Imagen</TableHead>
                  <TableHead>Texto alternativo</TableHead>
                  <TableHead className="hidden md:table-cell">Orden</TableHead>
                  <TableHead className="hidden sm:table-cell">URL de enlace</TableHead>
                  <TableHead className="w-[50px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(loading || isMigrating) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         <span className="ml-2">{isMigrating ? 'Migrando datos...' : 'Cargando...'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !isMigrating && sliders && sliders.length > 0 ? (
                  sliders.map((slider) => (
                    <TableRow key={slider.id}>
                      <TableCell>
                        <Image
                            src={slider.src}
                            alt={slider.alt}
                            width={100}
                            height={50}
                            className="rounded-md aspect-video object-contain bg-muted"
                          />
                      </TableCell>
                      <TableCell className="font-medium">{slider.alt}</TableCell>
                      <TableCell className="hidden md:table-cell">{slider.order}</TableCell>
                      <TableCell className="hidden sm:table-cell truncate max-w-xs">{slider.linkUrl}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/sliders/${slider.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setSliderToDelete(slider)}
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
                  !loading && !isMigrating && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-48">
                        No hay sliders en la base de datos.
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

      <AlertDialog open={!!sliderToDelete} onOpenChange={(open) => !open && setSliderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el slider
              <span className="font-bold"> "{sliderToDelete?.alt}" </span>
              de los servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSliderToDelete(null)} disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSlider} 
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
