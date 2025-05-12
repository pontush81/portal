'use client';

import React, { useState, useEffect } from 'react';
import { saveHandbook, listHandbooks, updateHandbook } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Handbook } from '@/types/database';

// Type for form data
type HandbookFormData = {
  association_name: string;
  association_type: string;
  address: string;
  zip_code: string;
  city: string;
  contact_email: string;
  contact_phone: string;
  contact_person: string;
  selected_sections: string[];
  custom_information: string;
  customer_email: string;
  logo_url: string | null;
  pdf_url: string | null;
  site_url: string | null;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_id: string | null;
};

// Föreningen testdata
const testAssociationData: HandbookFormData = {
  association_name: 'Testförening',
  association_type: 'brf',
  address: 'Testgatan 123',
  zip_code: '12345',
  city: 'Teststad',
  contact_email: 'test@example.com',
  contact_phone: '070-1234567',
  contact_person: 'Test Testsson',
  selected_sections: ['intro', 'members', 'rules'],
  custom_information: 'Detta är en testförening.',
  customer_email: 'kund@example.com',
  logo_url: null,
  pdf_url: null,
  site_url: null,
  payment_status: 'pending',
  payment_id: null
};

export default function TestDatabasePage() {
  const [handbooks, setHandbooks] = useState<Handbook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<HandbookFormData>(testAssociationData);
  const [selectedHandbookId, setSelectedHandbookId] = useState<string | null>(null);

  // Hämta handböcker när sidan laddas
  useEffect(() => {
    fetchHandbooks();
  }, []);

  // Hämta handböcker från Supabase
  const fetchHandbooks = async () => {
    try {
      setIsLoading(true);
      const { data } = await listHandbooks(100, 0);
      setHandbooks(data || []);
    } catch (error) {
      console.error('Fel vid hämtning av handböcker:', error);
      toast.error('Kunde inte hämta handböcker');
    } finally {
      setIsLoading(false);
    }
  };

  // Hantera formulärändring
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hantera val av föreningstyp
  const handleAssociationTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, association_type: value }));
  };

  // Spara handbok
  const handleSaveHandbook = async () => {
    try {
      setIsLoading(true);
      const result = await saveHandbook(formData);
      toast.success('Handbok sparad');
      console.log('Sparad handbok:', result);
      await fetchHandbooks();
    } catch (error) {
      console.error('Fel vid sparande:', error);
      toast.error('Kunde inte spara handboken');
    } finally {
      setIsLoading(false);
    }
  };

  // Uppdatera handbok
  const handleUpdateHandbook = async () => {
    if (!selectedHandbookId) {
      toast.error('Välj en handbok att uppdatera');
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateHandbook(selectedHandbookId, {
        custom_information: formData.custom_information,
        contact_email: formData.contact_email,
      });
      toast.success('Handbok uppdaterad');
      console.log('Uppdaterad handbok:', result);
      await fetchHandbooks();
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
      toast.error('Kunde inte uppdatera handboken');
    } finally {
      setIsLoading(false);
    }
  };

  // Fyll i formuläret med data från en befintlig handbok
  const handleSelectHandbook = (id: string) => {
    const handbook = handbooks.find(h => h.id === id);
    if (handbook) {
      setFormData({
        association_name: handbook.association_name,
        association_type: handbook.association_type,
        address: handbook.address || '',
        zip_code: handbook.zip_code || '',
        city: handbook.city || '',
        contact_email: handbook.contact_email || '',
        contact_phone: handbook.contact_phone || '',
        contact_person: handbook.contact_person || '',
        selected_sections: handbook.selected_sections || [],
        custom_information: handbook.custom_information || '',
        customer_email: handbook.customer_email,
        logo_url: handbook.logo_url,
        pdf_url: handbook.pdf_url,
        site_url: handbook.site_url,
        payment_status: handbook.payment_status,
        payment_id: handbook.payment_id
      });
      setSelectedHandbookId(id);
      toast.info('Handbok vald för redigering');
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Testa Supabase Databas</h1>
      
      {/* Formulärsektion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Föreningsinformation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Föreningsnamn</label>
              <Input
                name="association_name"
                value={formData.association_name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Föreningstyp</label>
              <Select 
                onValueChange={handleAssociationTypeChange}
                defaultValue={formData.association_type}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brf">Bostadsrättsförening</SelectItem>
                  <SelectItem value="samfallighet">Samfällighet</SelectItem>
                  <SelectItem value="forening">Förening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Adress</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Postnummer</label>
              <Input
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ort</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">E-post</label>
              <Input
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefon</label>
              <Input
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Kontaktperson</label>
              <Input
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Anpassad information</label>
              <Textarea
                name="custom_information"
                value={formData.custom_information}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Kund e-post</label>
              <Input
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <Button
              onClick={handleSaveHandbook}
              disabled={isLoading}
            >
              Spara ny handbok
            </Button>
            
            <Button
              variant="outline"
              onClick={handleUpdateHandbook}
              disabled={isLoading || !selectedHandbookId}
            >
              Uppdatera vald handbok
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Handbokslista */}
      <Card>
        <CardHeader>
          <CardTitle>Befintliga Handböcker</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && handbooks.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Hämtar handböcker...</p>
            </div>
          ) : handbooks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Inga handböcker hittades i databasen
            </p>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {handbooks.map((handbook) => (
                    <tr key={handbook.id} className={selectedHandbookId === handbook.id ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {handbook.association_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {handbook.association_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {handbook.contact_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${handbook.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 
                          handbook.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {handbook.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleSelectHandbook(handbook.id)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={isLoading}
                        >
                          Välj
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={fetchHandbooks}
              disabled={isLoading}
            >
              Uppdatera lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 