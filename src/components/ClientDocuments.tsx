
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useClients } from '@/hooks/useClients';
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useDocuments';
import { ArrowLeft, Upload, FileText, Trash2, Download, Eye, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ClientDocuments = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);

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
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

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

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  if (!client) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen pt-20">
        <div className="text-center max-w-md mx-auto">
          <p className="text-gray-500">Client not found</p>
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
      className="p-6 space-y-6 bg-gray-50 min-h-screen pt-20"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name} - Documents</h1>
            <p className="text-gray-600">{client.case_title || 'No case title'}</p>
          </div>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
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

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-lg">Loading documents...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((document) => (
              <motion.div
                key={document.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                      <p className="text-xs text-gray-500">
                        {document.file_type}
                      </p>
                      {document.file_size && (
                        <p className="text-xs text-gray-500">
                          {(document.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingDocument(document)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(document.file_url, document.file_name)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {documents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No documents uploaded yet</p>
            <p className="text-gray-400">Click "Upload Documents" to add files for this client.</p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{viewingDocument?.file_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewingDocument && (
              <div>
                {isImageFile(viewingDocument.file_type) ? (
                  <img 
                    src={viewingDocument.file_url} 
                    alt={viewingDocument.file_name}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : isPdfFile(viewingDocument.file_type) ? (
                  <iframe
                    src={viewingDocument.file_url}
                    width="100%"
                    height="600px"
                    className="border rounded-lg"
                    title={viewingDocument.file_name}
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Preview not available for this file type</p>
                    <Button
                      onClick={() => downloadDocument(viewingDocument.file_url, viewingDocument.file_name)}
                      className="mt-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ClientDocuments;
