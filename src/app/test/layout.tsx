import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Testverktyg - Föreningshandboken',
  description: 'Testverktyg för att utvärdera Supabase-funktioner',
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-50 min-h-screen">
      {children}
      
      <div className="container py-6 border-t mt-8">
        <p className="text-sm text-gray-500 text-center">
          Testverktyg för utvecklare - Föreningshandboken
        </p>
      </div>
    </section>
  );
} 