import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Testa Supabase Storage - Föreningshandboken',
  description: 'En testsida för att prova Supabase Storage-funktioner',
};

export default function TestStorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-50 min-h-screen">
      {children}
      
      <div className="container py-6 border-t mt-8">
        <p className="text-sm text-gray-500 text-center">
          Detta är en testsida för att prova Supabase Storage-funktioner
        </p>
      </div>
    </section>
  );
} 