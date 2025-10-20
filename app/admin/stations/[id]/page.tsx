
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { Station } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const stationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  streamUrl: z.string().url('Debe ser una URL válida'),
  logoUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  country: z.string().min(1, 'El país es requerido'),
  countryCode: z.string().min(1, 'El código de país es requerido'),
  city: z.string().optional(),
  tags: z.string().optional(),
  order: z.coerce.number().min(0, 'El orden debe ser un número positivo'),
  whatsappUrl: z.string().url('URL de WhatsApp no válida').optional().or(z.literal('')),
  instagramUrl: z.string().url('URL de Instagram no válida').optional().or(z.literal('')),
  tiktokUrl: z.string().url('URL de TikTok no válida').optional().or(z.literal('')),
  email: z.string().email('Email no válido').optional().or(z.literal('')),
  metadataUrl: z.string().url('URL de metadatos no válida').optional().or(z.literal('')),
});

type StationFormValues = z.infer<typeof stationSchema>;

export default function StationFormPage() {
  const router = useRouter();
  const params = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === 'new';

  const stationRef = useMemo(() => isNew ? null : doc(firestore, 'stations', id), [firestore, id, isNew]);
  const { data: station, loading: loadingStation } = useDoc<Station>(stationRef);

  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: '',
      streamUrl: '',
      logoUrl: '',
      country: '',
      countryCode: '',
      city: '',
      tags: '',
      order: 99,
      whatsappUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
      email: '',
      metadataUrl: '',
    },
  });
  
  useEffect(() => {
    if (station && !isNew) {
      form.reset({
        ...station,
        tags: station.tags?.join(', ') || '',
      });
    }
  }, [station, isNew, form]);

  const onSubmit = async (values: StationFormValues) => {
    setIsSaving(true);
    const stationData: Omit<Station, 'id'> = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
    };

    try {
      if (isNew) {
        const collectionRef = collection(firestore, 'stations');
        await addDoc(collectionRef, stationData)
            .catch(e => {
                if (e.code === 'permission-denied') {
                    throw new FirestorePermissionError({
                        path: collectionRef.path,
                        operation: 'create',
                        requestResourceData: stationData,
                    });
                }
                throw e;
            });
        toast({ title: 'Emisora creada', description: 'La nueva emisora ha sido añadida.' });
      } else {
        const docRef = doc(firestore, 'stations', id);
        await setDoc(docRef, stationData, { merge: true })
           .catch(e => {
                if (e.code === 'permission-denied') {
                    throw new FirestorePermissionError({
                        path: docRef.path,
                        operation: 'update',
                        requestResourceData: stationData,
                    });
                }
                throw e;
            });
        toast({ title: 'Emisora actualizada', description: 'Los cambios han sido guardados.' });
      }
      router.push('/admin/stations');
    } catch (error: any) {
        if (error instanceof FirestorePermissionError) {
             errorEmitter.emit('permission-error', error);
        }
        console.error("Error saving station:", error);
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: error.message || 'No se pudo guardar la emisora.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (loadingStation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isNew && !station) {
    return (
       <div className="flex flex-col min-h-screen items-center justify-center text-center">
          <p className="text-2xl font-bold text-destructive">Emisora no encontrada</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/admin/stations">Volver a la lista</Link>
          </Button>
       </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
       <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin/stations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
                </Link>
            </Button>
            <h1 className="text-xl font-bold text-foreground">
                {isNew ? 'Añadir Emisora' : 'Editar Emisora'}
            </h1>
            <div />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Emisora</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Radio City Latino" {...field} />
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
                            name="streamUrl"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>URL del Stream</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>URL del Logo</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Colombia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="countryCode"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Código de País</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: CO" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                         <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ciudad (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Ocaña" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Tags (separados por coma)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Rock, Pop, Noticias" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="whatsappUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL de WhatsApp (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://wa.me/..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="instagramUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL de Instagram (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://instagram.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="tiktokUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL de TikTok (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://tiktok.com/@..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email de Contacto (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="contacto@..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="metadataUrl"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>URL de Metadatos (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
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

    