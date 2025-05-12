import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Användarvillkor</h1>

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduktion</h2>
        <p>
          Välkommen till Föreningshandboken. Genom att använda vår tjänst accepterar du dessa användarvillkor i sin helhet. 
          Om du inte godkänner dessa villkor, vänligen avstå från att använda tjänsten.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Tjänsten</h2>
        <p>
          Föreningshandboken erbjuder en tjänst där användare kan skapa digitala handböcker för bostadsrättsföreningar och samfälligheter.
          Vi förbehåller oss rätten att när som helst göra ändringar i tjänsten utan föregående meddelande.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Användaransvar</h2>
        <p>
          Som användare av tjänsten ansvarar du för att:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>All information du tillhandahåller är korrekt och lagenlig</li>
          <li>Du har rätt att använda eventuella logotyper eller bilder du laddar upp</li>
          <li>Inte använda tjänsten för olagliga eller otillåtna syften</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Betalning och leverans</h2>
        <p>
          När du beställer en handbok från oss gäller följande:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Faktura skickas till den e-postadress du anger vid beställning</li>
          <li>Handboken levereras efter genomförd betalning</li>
          <li>Leverans sker digitalt via e-post och/eller genom åtkomst till en dedikerad webbsida</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Immateriella rättigheter</h2>
        <p>
          Allt innehåll som tillhandahålls av Föreningshandboken, inklusive text, design och funktionalitet, ägs av oss och skyddas av immaterialrättslig lagstiftning.
          Du får en icke-exklusiv rätt att använda din färdiga handbok inom din förening.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Ansvarsbegränsning</h2>
        <p>
          Föreningshandboken tillhandahålls i befintligt skick utan några garantier. Vi ansvarar inte för eventuella skador som kan uppstå till följd av användning av vår tjänst.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Ändringar i villkoren</h2>
        <p>
          Vi förbehåller oss rätten att när som helst ändra dessa användarvillkor. Större ändringar kommer att meddelas via e-post.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Kontakt</h2>
        <p>
          Om du har frågor gällande dessa användarvillkor, vänligen kontakta oss via e-post på info@foreningshandboken.se.
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