
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, FileText, Download, Eye, MoreHorizontal, Trash2, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useClients } from '@/hooks/useClients';
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [uploadingClient, setUploadingClient] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: allDocuments = [], isLoading: documentsLoading } = useDocuments();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const queryClient = useQueryClient();

  // Set up real-time subscription for documents
  useEffect(() => {
    const channel = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientDocuments = (clientId: string) => {
    return allDocuments.filter(doc => doc.client_id === clientId);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, clientId: string) => {
    const files = event.target.files;
    if (!files) return;

    try {
      for (const file of Array.from(files)) {
        await uploadDocument.mutateAsync({ file, clientId });
      }
      toast.success('Documents uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadingClient(null);
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
    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('doc')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📎';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Documents</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage client documents by client</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Client Cards with Documents */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {clientsLoading || documentsLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-lg text-gray-900 dark:text-white">Loading documents...</div>
              </div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => {
                const clientDocuments = getClientDocuments(client.id);
                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {client.photo_url ? (
                              <img
                                src={client.photo_url}
                                alt={client.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                {client.name}
                              </CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {clientDocuments.length} document{clientDocuments.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setUploadingClient(client.id);
                              fileInputRef.current?.click();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {clientDocuments.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {clientDocuments.map((document) => (
                              <div
                                key={document.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <span className="text-lg">{getFileIcon(document.file_type)}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {document.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(document.uploaded_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewingDocument(document)}
                                    className="p-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => downloadDocument(document.file_url, document.file_name)}
                                    className="p-1"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteDocument(document.id)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <FileText className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Add clients first to upload documents</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => uploadingClient && handleFileUpload(e, uploadingClient)}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />

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
                    <p className="text-gray-600 dark:text-gray-400">Preview not available for this file type</p>
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
    </div>
  );
};

export default Documents;
