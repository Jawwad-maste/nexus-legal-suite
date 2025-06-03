
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClients } from '@/hooks/useClients';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Documents = () => {
  const { data: clients = [], isLoading } = useClients();
  const navigate = useNavigate();

  const handleClientClick = (clientId: string) => {
    navigate(`/documents/${clientId}`);
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
      <div className="flex items-center space-x-2">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Documents</h1>
      </div>

      <p className="text-muted-foreground">
        Select a client to manage their documents
      </p>

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
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={client.photo_url || ''} alt={client.name} />
                  <AvatarFallback>
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">View Documents</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clients found. Add clients first to manage their documents.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Documents;
