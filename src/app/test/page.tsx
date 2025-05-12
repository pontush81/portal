import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Testverktyg för Supabase</h1>
      <p className="text-gray-600 mb-8">
        Använd dessa verktyg för att testa olika Supabase-funktioner
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Storage</CardTitle>
            <CardDescription>
              Testa filuppladdning och hantering med Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Denna testsida låter dig:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Ladda upp filer till Supabase Storage</li>
              <li>Lista befintliga filer</li>
              <li>Ta bort filer</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/test-storage">
                Gå till Storage Test
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supabase Databas</CardTitle>
            <CardDescription>
              Testa databasoperationer med Supabase Database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Denna testsida låter dig:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Skapa handböcker i databasen</li>
              <li>Lista alla handböcker</li>
              <li>Uppdatera handböcker</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/test-database">
                Gå till Databas Test
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Viktigt att veta</h2>
        <p className="text-sm text-yellow-700">
          Dessa testsidor är endast avsedda för utveckling och testning. 
          Använd inte dessa på produktionsservern och var försiktig med vilken data du lägger in.
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/">
            Tillbaka till startsidan
          </Link>
        </Button>
      </div>
    </div>
  );
} 