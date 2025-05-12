'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { uploadFile, saveHandbook } from '@/lib/supabase';
import { toast } from 'sonner';

// Avsnitt som kan inkluderas i handboken
const handbookSections = [
  { id: 'intro', label: 'Introduktion och välkomstinformation' },
  { id: 'members', label: 'Medlemsinformation' },
  { id: 'board', label: 'Styrelse och organisation' },
  { id: 'rules', label: 'Ordningsregler' },
  { id: 'maintenance', label: 'Underhåll och skötsel' },
  { id: 'economy', label: 'Ekonomi och avgifter' },
  { id: 'environment', label: 'Miljö och hållbarhet' },
  { id: 'contact', label: 'Viktiga kontaktuppgifter' },
  { id: 'calendar', label: 'Årskalender' },
];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    association_name: '',
    association_type: 'brf',
    address: '',
    zip_code: '',
    city: '',
    contact_email: '',
    contact_phone: '',
    contact_person: '',
    customer_email: '',
    selected_sections: [] as string[],
    custom_information: '',
    logo_url: null as string | null,
    pdf_url: null,
    site_url: null,
    payment_status: 'pending' as const,
    payment_id: null,
  });

  // Hantera formulärändringar
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hantera val av avsnitt
  const handleSectionToggle = (sectionId: string) => {
    setFormData(prev => {
      const selected = [...prev.selected_sections];
      if (selected.includes(sectionId)) {
        return { ...prev, selected_sections: selected.filter(id => id !== sectionId) };
      } else {
        return { ...prev, selected_sections: [...selected, sectionId] };
      }
    });
  };

  // Markera eller avmarkera alla avsnitt
  const handleToggleAll = () => {
    if (formData.selected_sections.length === handbookSections.length) {
      // Om alla är valda, avmarkera alla
      setFormData(prev => ({ ...prev, selected_sections: [] }));
    } else {
      // Annars, markera alla
      setFormData(prev => ({ 
        ...prev, 
        selected_sections: handbookSections.map(section => section.id) 
      }));
    }
  };

  // Hantera logotypuppladdning
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setLogo(selectedFile);
      
      // Visa förhandsgranskning av bilden
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Gå till nästa steg
  const handleNextStep = () => {
    if (step === 1) {
      // Validera första steget
      if (!formData.association_name || !formData.address || !formData.customer_email) {
        toast.error('Vänligen fyll i alla obligatoriska fält');
        return;
      }
    }
    
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  // Gå tillbaka ett steg
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Skicka in formuläret
  const handleSubmit = async () => {
    if (formData.selected_sections.length === 0) {
      toast.error('Välj minst ett avsnitt att inkludera i handboken');
      return;
    }

    try {
      setIsLoading(true);
      let logoUrl = null;

      // Ladda upp logotypen om en sådan valts
      if (logo) {
        const fileName = `logos/${Date.now()}_${logo.name}`;
        const uploadResult = await uploadFile(logo, fileName);
        logoUrl = uploadResult.url;
      }

      // Spara handboken i databasen
      const handbookData = {
        ...formData,
        logo_url: logoUrl,
      };

      const savedHandbook = await saveHandbook(handbookData);
      
      toast.success('Din handbok har skapats!');
      
      // Omdirigera till bekräftelsesida
      router.push(`/confirmation/${savedHandbook.id}`);
      
    } catch (error) {
      console.error('Fel vid skapande av handbok:', error);
      toast.error('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero-sektion */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Skapa en komplett handbok för din BRF – på 10 minuter
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enkelt, snabbt och professionellt. Din föreningshandbok innehåller allt medlemmarna behöver veta.
          </p>
          
          {step === 1 && (
            <Button size="lg" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
              Kom igång nu
            </Button>
          )}
        </div>
      </section>

      {/* Formulärssektion */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Stegindikator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="text-sm">Information</span>
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="text-sm">Innehåll</span>
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="text-sm">Bekräfta</span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              {/* Steg 1: Föreningsinformation */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Grundinformation om föreningen</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Föreningsnamn <span className="text-red-500">*</span></label>
                      <Input 
                        name="association_name" 
                        value={formData.association_name} 
                        onChange={handleInputChange}
                        placeholder="Brf Solhöjden"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Adress <span className="text-red-500">*</span></label>
                      <Input 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange}
                        placeholder="Exempelgatan 123"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Postnummer</label>
                        <Input 
                          name="zip_code" 
                          value={formData.zip_code} 
                          onChange={handleInputChange}
                          placeholder="123 45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ort</label>
                        <Input 
                          name="city" 
                          value={formData.city} 
                          onChange={handleInputChange}
                          placeholder="Stockholm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Kontaktperson</label>
                      <Input 
                        name="contact_person" 
                        value={formData.contact_person} 
                        onChange={handleInputChange}
                        placeholder="Förnamn Efternamn"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">E-post</label>
                        <Input 
                          name="contact_email" 
                          value={formData.contact_email} 
                          onChange={handleInputChange}
                          placeholder="kontakt@example.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Telefon</label>
                        <Input 
                          name="contact_phone" 
                          value={formData.contact_phone} 
                          onChange={handleInputChange}
                          placeholder="070-123 45 67"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Din e-post (för fakturering) <span className="text-red-500">*</span></label>
                      <Input 
                        name="customer_email" 
                        value={formData.customer_email} 
                        onChange={handleInputChange}
                        placeholder="din.epost@example.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Steg 2: Innehållsval */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Vad vill du ha med i handboken?</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Ladda upp föreningen logotyp (valfritt)</label>
                      <Input 
                        id="logo-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      
                      {logoPreview && (
                        <div className="mt-4 border rounded p-4 text-center">
                          <Image 
                            src={logoPreview} 
                            alt="Förhandsgranskning av logotyp" 
                            width={200} 
                            height={100} 
                            className="mx-auto"
                            style={{ objectFit: 'contain', maxHeight: '100px' }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium">Välj avsnitt att inkludera</label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="toggle-all"
                            checked={formData.selected_sections.length === handbookSections.length}
                            onCheckedChange={handleToggleAll}
                          />
                          <label 
                            htmlFor="toggle-all" 
                            className="text-sm cursor-pointer leading-none"
                          >
                            Markera alla
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {handbookSections.map(section => (
                          <div key={section.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={section.id}
                              checked={formData.selected_sections.includes(section.id)}
                              onCheckedChange={() => handleSectionToggle(section.id)}
                            />
                            <label 
                              htmlFor={section.id} 
                              className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {section.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}
              
              {/* Steg 3: Sammanfattning och bekräftelse */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Bekräfta din beställning</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-medium text-lg mb-2">{formData.association_name}</h3>
                      <p>{formData.address}</p>
                      {(formData.zip_code || formData.city) && (
                        <p>{formData.zip_code} {formData.city}</p>
                      )}
                      {formData.contact_person && (
                        <p className="mt-2">Kontaktperson: {formData.contact_person}</p>
                      )}
                      {(formData.contact_email || formData.contact_phone) && (
                        <p>
                          {formData.contact_email && `${formData.contact_email} `}
                          {formData.contact_phone && formData.contact_phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Valda avsnitt:</h3>
                      <ul className="list-disc pl-5">
                        {formData.selected_sections.map(sectionId => {
                          const section = handbookSections.find(s => s.id === sectionId);
                          return <li key={sectionId}>{section?.label}</li>;
                        })}
                      </ul>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded">
                      <h3 className="font-medium mb-2">Pris:</h3>
                      <p className="text-xl font-bold">299 kr</p>
                      <p className="text-sm text-gray-600">Moms ingår. Faktura skickas till {formData.customer_email}</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Genom att fortsätta godkänner du våra <Link href="/terms" className="text-blue-600 hover:underline">villkor</Link> och <Link href="/privacy" className="text-blue-600 hover:underline">integritetspolicy</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                    Tillbaka
                  </Button>
                ) : (
                  <div></div> 
                )}
                
                {step < 3 ? (
                  <Button onClick={handleNextStep}>
                    Fortsätt
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Bearbetar...' : 'Skapa handbok'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fördelar-sektion */}
      <section className="bg-gray-50 py-16 px-4 mt-12">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Fördelar med Föreningshandboken</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Spara tid</h3>
              <p className="text-gray-600">Slipp skapa innehåll från grunden. Få en komplett handbok på några minuter.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Professionellt resultat</h3>
              <p className="text-gray-600">Välstrukturerat och komplett material som ger ett professionellt intryck.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Tillgänglighet</h3>
              <p className="text-gray-600">Delge alla medlemmar viktig information både digitalt och i utskrivbart format.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
