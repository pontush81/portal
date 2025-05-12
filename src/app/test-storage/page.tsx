'use client';

import React, { useState, useEffect } from 'react';
import { 
  uploadFile, 
  listFiles, 
  deleteFile 
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Define proper type for storage files
interface StorageFile {
  name: string;
  metadata?: {
    size?: number;
  };
  created_at?: string;
}

export default function TestStoragePage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Hämta filer när sidan laddas
  useEffect(() => {
    fetchFiles();
  }, []);

  // Hämta fillistan från Supabase
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const fileList = await listFiles();
      setFiles(fileList || []);
    } catch (error) {
      console.error('Fel vid hämtning av filer:', error);
      toast.error('Kunde inte hämta filer');
    } finally {
      setIsLoading(false);
    }
  };

  // Hantera val av fil
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Ladda upp fil
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Välj en fil först');
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);

      // Skapa filnamn baserat på tidsstämpel för att undvika dubletter
      const fileName = `${Date.now()}_${selectedFile.name}`;
      
      // Simulera uppladdningsförlopp
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Ladda upp filen
      const result = await uploadFile(selectedFile, fileName);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('Fil uppladdad');
      console.log('Uppladdad fil:', result);
      
      // Nollställ vald fil
      setSelectedFile(null);
      if (document.getElementById('file-input') as HTMLInputElement) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
      
      // Uppdatera fillistan
      await fetchFiles();
    } catch (error) {
      console.error('Fel vid uppladdning:', error);
      toast.error('Uppladdning misslyckades');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Ta bort fil
  const handleDelete = async (path: string) => {
    if (!path) return;
    
    if (!confirm('Är du säker på att du vill ta bort denna fil?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteFile(path);
      toast.success('Fil borttagen');
      
      // Uppdatera fillistan
      await fetchFiles();
    } catch (error) {
      console.error('Fel vid borttagning:', error);
      toast.error('Kunde inte ta bort filen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Testa Supabase Storage</h1>
      
      {/* Uppladdningssektion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ladda upp fil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? 'Laddar upp...' : 'Ladda upp'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fillistesektion */}
      <Card>
        <CardHeader>
          <CardTitle>Filer i Storage</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && files.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Hämtar filer...</p>
            </div>
          ) : files.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Inga filer hittades i storage
            </p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Storlek
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skapat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file.metadata?.size 
                          ? `${Math.round(file.metadata.size / 1024)} KB` 
                          : 'Okänd'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file.created_at 
                          ? new Date(file.created_at).toLocaleString() 
                          : 'Okänd'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleDelete(file.name)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          Ta bort
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
              onClick={fetchFiles}
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