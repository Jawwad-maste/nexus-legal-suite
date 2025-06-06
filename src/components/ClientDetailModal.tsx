
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, FileText, X, Mail, Phone, MapPin } from 'lucide-react';
import { Client } from '@/types/database';
import { useNavigate } from 'react-router-dom';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDetailModal = ({ client, isOpen, onClose }: ClientDetailModalProps) => {
  const navigate = useNavigate();

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Client Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Client Header */}
          <div className="flex items-center space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {client.photo_url ? (
              <img
                src={client.photo_url}
                alt={client.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h2>
              {client.age && (
                <p className="text-gray-600 dark:text-gray-400">Age: {client.age}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Client since {new Date(client.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Case Information */}
          {client.case_title && (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Current Case
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{client.case_title}</p>
              <Badge variant="outline" className="mt-2">Active</Badge>
            </div>
          )}

          {/* Contact Information */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">client@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">123 Main St, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Meetings</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={() => {
                navigate(`/clients/${client.id}/documents`);
                onClose();
              }}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate('/calendar');
                onClose();
              }}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
