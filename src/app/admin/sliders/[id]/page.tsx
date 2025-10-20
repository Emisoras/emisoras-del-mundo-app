
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import type { Slider } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const sliderSchema = z.object({
  src: z.string().url('Debe ser una URL de imagen válida'),
  alt: z.string().min(1, 'El texto alternativo es requerido'),
  linkUrl: z.string().url('Debe ser una URL de enlace válida'),
  order: z.coerce.number().min(0, 'El orden debe ser un número positivo'),
  dataAiHint: z.string().optional(),
});

type SliderFormValues = z.infer<typeof sliderSchema>;

export default function SliderFormPage() {
  const router = useRouter();
  const params = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === 'new';

  const sliderRef = useMemo(() => isNew ? null : doc(firestore, 'sliders', id), [firestore, id, isNew]);
  const { data: slider, loading: loadingSlider } = useDoc<Slider>(sliderRef);

  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      src: '',
      alt: '',
      linkUrl: '',
      order: 99,
      dataAiHint: '',
    },
  });
  
  useEffect(() => {
    if (slider && !isNew) {
      form.reset(slider);
    }
  }, [slider, isNew, form]);

  const onSubmit = async (values: SliderFormValues) => {
    setIsSaving(true);

    try {
      if (isNew) {
        const collectionRef = collection(firestore, 'sliders');
        await addDoc(collectionRef, values)
            .catch(e => {
                if (e.code === 'permission-denied') {
                    throw new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: values });
                }
                throw e;
            });
        toast({ title: 'Slider creado', description: 'El nuevo slider ha sido añadido.' });
      } else {
        const docRef = doc(firestore, 'sliders', id);
        await setDoc(docRef, values, { merge: true })
           .catch(e => {
                if (e.code === 'permission-denied') {
                    throw new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: values });
                }
                throw e;
            });
        toast({ title: 'Slider actualizado', description: 'Los cambios han sido guardados.' });
      }
      router.push('/admin/sliders');
    } catch (error: any) {
        if (error instanceof FirestorePermissionError) {
             errorEmitter.emit('permission-error', error);
        }
        console.error("Error saving slider:", error);
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: error.message || 'No se pudo guardar el slider.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (loadingSlider) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isNew && !slider) {
    return (
       <div className="flex flex-col min-h-screen items-center justify-center text-center">
          <p className="text-2xl font-bold text-destructive">Slider no encontrado</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/admin/sliders">Volver a la lista</Link>
          </Button>
       </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
       <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin/sliders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
                </Link>
            </Button>
            <h1 className="text-xl font-bold text-foreground">
                {isNew ? 'Añadir Slider' : 'Editar Slider'}
            </h1>
            <div />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles del Slider</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <FormField
                            control={form.control}
                            name="alt"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Texto alternativo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Anuncio de festival" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Orden</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Ej: 1" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="src"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>URL de la Imagen</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="linkUrl"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>URL de Enlace</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="dataAiHint"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>AI Hint (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: banner ad" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end p-6">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
      </main>
    </div>
  );
}
