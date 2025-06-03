
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClient } from '@/hooks/useClients';
import { toast } from 'sonner';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const createClient = useCreateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a client name');
      return;
    }

    try {
      // For now, we'll create the client without photo upload
      // Photo upload functionality can be added later
      await createClient.mutateAsync({
        name,
        age: age ? parseInt(age) : null,
        case_title: caseTitle || null,
        photo_url: null
      });

      toast.success('Client created successfully');
      onClose();
      setName('');
      setAge('');
      setCaseTitle('');
      setPhoto(null);
    } catch (error) {
      toast.error('Failed to create client');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
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

          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
