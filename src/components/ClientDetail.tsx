
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClients } from '@/hooks/useClients';
import { useDocuments } from '@/hooks/useDocuments';
import { useEvents } from '@/hooks/useEvents';
import { ArrowLeft, Edit, FileText, Calendar, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientEditModal } from './ClientEditModal';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: documents = [] } = useDocuments(clientId);
  const { data: events = [] } = useEvents();

  const client = clients.find(c => c.id === clientId);
  const clientEvents = events.filter(e => e.client_id === clientId);

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => navigate('/clients')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
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
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <h1 className="text-3xl font-bold">Client Details</h1>
        </div>
        
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={client.photo_url || ''} alt={client.name} />
                <AvatarFallback className="text-2xl">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{client.name}</h3>
              {client.age && (
                <p className="text-muted-foreground">Age: {client.age}</p>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Case Title:</label>
                <p className="text-sm text-muted-foreground">
                  {client.case_title || 'No case title specified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Client Since:</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(client.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Related Events ({clientEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientEvents.length > 0 ? (
              <div className="space-y-3">
                {clientEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.type === 'hearing' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {event.type}
                      </span>
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {clientEvents.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{clientEvents.length - 5} more events
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No events linked to this client
              </p>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents ({documents.length})
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => navigate(`/documents/${clientId}`)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.slice(0, 5).map((document) => (
                  <div key={document.id} className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{document.file_name}</span>
                  </div>
                ))}
                {documents.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{documents.length - 5} more documents
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No documents uploaded
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ClientEditModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </motion.div>
  );
};

export default ClientDetail;
