
import React, { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, Eye, Plus, Users } from 'lucide-react';
import { ClientModal } from '@/components/ClientModal';

const Documents = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();
  const navigate = useNavigate();

  const handleClientClick = (clientId: string) => {
    navigate(`/documents/${clientId}`);
  };

  const getClientDocumentCount = (clientId: string) => {
    return documents.filter(doc => doc.client_id === clientId).length;
  };

  if (clientsLoading || documentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading documents...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-gray-50 min-h-screen pt-20"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage client documents and files</p>
        </div>
        <Button 
          onClick={() => setIsClientModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => {
            const documentCount = getClientDocumentCount(client.id);
            
            return (
              <motion.div
                key={client.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border border-gray-200"
                  onClick={() => handleClientClick(client.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={client.photo_url || ''} alt={client.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <p className="text-sm text-gray-600">{client.case_title || 'No case title'}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {documentCount} document{documentCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/documents/${client.id}`);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/documents/${client.id}`);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Upload className="h-3 w-3" />
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                      Click to manage documents
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No clients found</p>
            <p className="text-gray-400">Add a client first to start managing documents.</p>
          </div>
        )}
      </div>

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
    </motion.div>
  );
};

export default Documents;
