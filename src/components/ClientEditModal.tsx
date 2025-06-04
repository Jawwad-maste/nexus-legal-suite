
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateClient, useDeleteClient } from '@/hooks/useClientOperations';
import { Client } from '@/types/database';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ClientEditModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({ 
  client, 
  isOpen, 
  onClose 
}) => {
  const [name, setName] = useState(client.name);
  const [age, setAge] = useState(client.age?.toString() || '');
  const [caseTitle, setCaseTitle] = useState(client.case_title || '');
  
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a client name');
      return;
    }

    try {
      await updateClient.mutateAsync({
        id: client.id,
        updates: {
          name,
          age: age ? parseInt(age) : null,
          case_title: caseTitle || null,
        }
      });

      toast.success('Client updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update client');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteClient.mutateAsync(client.id);
      toast.success('Client deleted successfully');
      onClose();
      navigate('/clients');
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              required
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Client age"
            />
          </div>

          <div>
            <Label htmlFor="caseTitle">Case Title</Label>
            <Input
              id="caseTitle"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              placeholder="Case title"
            />
          </div>

          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteClient.isPending}
            >
              {deleteClient.isPending ? 'Deleting...' : 'Delete Client'}
            </Button>
            
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateClient.isPending}>
                {updateClient.isPending ? 'Updating...' : 'Update Client'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
