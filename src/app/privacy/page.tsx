import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Integritetspolicy</h1>

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Inledning</h2>
        <p>
          Din integritet är viktig för oss. Denna integritetspolicy beskriver hur vi samlar in, använder och skyddar dina personuppgifter 
          när du använder vår tjänst Föreningshandboken.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Vilka personuppgifter vi samlar in</h2>
        <p>
          Vi samlar in följande typer av personuppgifter när du använder vår tjänst:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Kontaktinformation (namn, e-postadress, telefonnummer)</li>
          <li>Föreningsinformation (föreningsnamn, adress)</li>
          <li>Betalningsinformation (endast för fakturering)</li>
          <li>Användarinnehåll som du tillhandahåller (text, bilder, logotyper)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Hur vi använder dina personuppgifter</h2>
        <p>
          Vi använder dina personuppgifter för att:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Tillhandahålla och förbättra vår tjänst</li>
          <li>Skapa din handbok enligt dina specifikationer</li>
          <li>Hantera fakturaprocessen</li>
          <li>Kommunicera viktig information om din beställning</li>
          <li>Uppfylla våra rättsliga förpliktelser</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Hur vi skyddar dina personuppgifter</h2>
        <p>
          Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina personuppgifter från obehörig åtkomst, förlust eller stöld.
          All data lagras säkert på servrar inom EU/EES.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Lagring av personuppgifter</h2>
        <p>
          Vi behåller dina personuppgifter endast så länge som är nödvändigt för att uppfylla de syften för vilka uppgifterna samlades in,
          eller för att uppfylla lagkrav (t.ex. bokföringslagen).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Dina rättigheter</h2>
        <p>
          Enligt dataskyddsförordningen (GDPR) har du rätt att:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Begära tillgång till dina personuppgifter</li>
          <li>Begära rättelse av felaktiga personuppgifter</li>
          <li>Begära radering av dina personuppgifter</li>
          <li>Begära begränsning av behandlingen av dina personuppgifter</li>
          <li>Invända mot behandlingen av dina personuppgifter</li>
          <li>Begära dataportabilitet</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Ändringar i integritetspolicyn</h2>
        <p>
          Vi kan komma att uppdatera denna integritetspolicy från tid till annan. Betydande ändringar kommer att kommuniceras via e-post.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Kontakt</h2>
        <p>
          Om du har frågor gällande hur vi behandlar dina personuppgifter, vänligen kontakta oss via e-post på privacy@foreningshandboken.se.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    </div>
  );
} 