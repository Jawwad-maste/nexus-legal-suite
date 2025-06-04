
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useClients } from '@/hooks/useClients';
import { useDocuments } from '@/hooks/useDocuments';
import { useEvents } from '@/hooks/useEvents';
import { ArrowLeft, Edit, FileText, Calendar, Upload, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientEditModal } from './ClientEditModal';
import { EventDetailModal } from './EventDetailModal';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: clients = [] } = useClients();
  const { data: documents = [] } = useDocuments(clientId);
  const { data: events = [] } = useEvents();

  const client = clients.find(c => c.id === clientId);
  const clientEvents = events.filter(e => e.client_id === clientId);

  if (!client) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen pt-20">
        <div className="text-center max-w-md mx-auto">
          <p className="text-gray-500">Client not found</p>
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
      className="p-6 space-y-6 bg-gray-50 min-h-screen pt-20"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Details</h1>
            <p className="text-gray-600">Manage client information and related data</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Client
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <Card className="lg:col-span-1 bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={client.photo_url || ''} alt={client.name} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">{client.name}</h3>
                {client.age && (
                  <p className="text-gray-600">Age: {client.age}</p>
                )}
              </div>
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Case Title:</label>
                  <p className="text-sm text-gray-600 mt-1">
                    {client.case_title || 'No case title specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Client Since:</label>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(client.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Total Documents:</label>
                  <p className="text-sm text-gray-600 mt-1">
                    {documents.length} file{documents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Total Events:</label>
                  <p className="text-sm text-gray-600 mt-1">
                    {clientEvents.length} event{clientEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="lg:col-span-1 bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calendar className="h-5 w-5 mr-2" />
                Related Events ({clientEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientEvents.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {clientEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.type === 'hearing' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {event.type}
                        </span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No events linked to this client</p>
                  <p className="text-sm text-gray-400">Events will appear here when created</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="lg:col-span-1 bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents ({documents.length})
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/documents/${clientId}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {documents.slice(0, 8).map((document) => (
                    <div key={document.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-2 flex-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{document.file_name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/documents/${clientId}`)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {documents.length > 8 && (
                    <p className="text-sm text-gray-500 text-center pt-2 border-t border-gray-100">
                      +{documents.length - 8} more documents
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No documents uploaded</p>
                  <p className="text-sm text-gray-400">Upload files to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ClientEditModal
        client={client}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          clients={clients}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </motion.div>
  );
};

export default ClientDetail;
