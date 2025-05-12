'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getHandbook } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handbook } from '@/types/database';
import { toast } from 'sonner';

export default function ConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [handbook, setHandbook] = useState<Handbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadHandbook() {
      try {
        const data = await getHandbook(id);
        setHandbook(data);
      } catch (error) {
        console.error('Fel vid hämtning av handbok:', error);
        toast.error('Kunde inte hämta handboksinformation');
      } finally {
        setIsLoading(false);
      }
    }

    loadHandbook();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Laddar information...</p>
      </div>
    );
  }

  if (!handbook) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Handboken hittades inte</h1>
        <p className="mb-8 text-gray-600">Vi kunde inte hitta den begärda handboken.</p>
        <Button asChild>
          <Link href="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tack för din beställning!</h1>
        <p className="text-xl text-gray-600 mb-2">Din handbok är nu under bearbetning.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Orderdetaljer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h3 className="font-medium">Order-ID</h3>
                <p className="text-gray-600">{handbook.id}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <div className="flex items-center mt-1">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    {handbook.payment_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Föreningsinformation</h3>
              <p className="font-semibold">{handbook.association_name}</p>
              <p>{handbook.address}</p>
              {handbook.zip_code && handbook.city && (
                <p>{handbook.zip_code} {handbook.city}</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Leveransinformation</h3>
              <p>När din betalning är genomförd kommer du att få tillgång till din handbok via e-post: <span className="font-semibold">{handbook.customer_email}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vad händer nu?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>En faktura kommer att skickas till din e-post inom kort.</li>
            <li>När betalningen är genomförd börjar vi bearbeta din handbok.</li>
            <li>Inom 24 timmar får du tillgång till din färdiga handbok både som PDF och via en online-länk.</li>
            <li>Du kommer att få ett e-postmeddelande när allt är klart!</li>
          </ol>

          <div className="mt-6 text-center">
            <Button asChild>
              <Link href="/">Tillbaka till startsidan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 