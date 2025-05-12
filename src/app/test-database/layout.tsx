import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Testa Supabase Databas - Föreningshandboken',
  description: 'En testsida för att prova Supabase databasfunktioner',
};

export default function TestDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-50 min-h-screen">
      {children}
      
      <div className="container py-6 border-t mt-8">
        <p className="text-sm text-gray-500 text-center">
          Detta är en testsida för att prova Supabase databasfunktioner
        </p>
      </div>
    </section>
  );
} 