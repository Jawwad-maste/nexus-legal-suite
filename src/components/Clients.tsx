import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClients } from '@/hooks/useClients';
import { useDeleteClient } from '@/hooks/useClientOperations';
import { ClientModal } from '@/components/ClientModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';

const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: clients = [], isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const navigate = useNavigate();

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleDeleteClient = async (clientId: string, clientName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete ${clientName}? This will also delete all related documents and cannot be undone.`)) {
      return;
    }

    try {
      await deleteClient.mutateAsync(clientId);
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading clients...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your clients and their information</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
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
                  <div className="flex justify-between items-start">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={client.photo_url || ''} alt={client.name} />
                      <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClient(client.id, client.name, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.case_title || 'No case title'}</p>
                    {client.age && (
                      <p className="text-xs text-gray-500 mt-1">Age: {client.age}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Client since: {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Click to view details</span>
                    <Edit className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No clients found</p>
            <p className="text-gray-400">Create your first client to get started.</p>
          </div>
        )}
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
};

export default Clients;
