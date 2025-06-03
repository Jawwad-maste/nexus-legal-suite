
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClients } from '@/hooks/useClients';
import { ClientModal } from '@/components/ClientModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: clients = [], isLoading } = useClients();
  const navigate = useNavigate();

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
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
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          + Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleClientClick(client.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage src={client.photo_url || ''} alt={client.name} />
                  <AvatarFallback className="text-lg">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.case_title}</p>
                  {client.age && (
                    <p className="text-xs text-muted-foreground mt-1">Age: {client.age}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clients found. Create your first client to get started.</p>
        </div>
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
};

export default Clients;
