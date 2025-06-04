
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useDocuments';
import { ArrowLeft, Upload, FileText, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ClientDocuments = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: documents = [], isLoading } = useDocuments(clientId);
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const client = clients.find(c => c.id === clientId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !clientId) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        await uploadDocument.mutateAsync({ file, clientId });
      }
      toast.success('Documents uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument.mutateAsync(documentId);
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => navigate('/documents')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name} - Documents</h1>
            <p className="text-muted-foreground">{client.case_title}</p>
          </div>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-primary hover:bg-primary/90"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Documents'}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading documents...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <motion.div
              key={document.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-sm font-medium truncate">
                      {document.file_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {document.file_type}
                    </p>
                    {document.file_size && (
                      <p className="text-xs text-muted-foreground">
                        {(document.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDocument(document.file_url, document.file_name)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {documents.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No documents uploaded yet. Click "Upload Documents" to add files.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ClientDocuments;
