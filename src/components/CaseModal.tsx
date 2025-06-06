
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { useClients } from '@/hooks/useClients';
import { useCreateClient } from '@/hooks/useClientOperations';
import { toast } from 'sonner';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseModal = ({ isOpen, onClose }: CaseModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active' as 'Active' | 'Pending Review' | 'Discovery' | 'Investigation' | 'Completed',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    client_name: '',
    existing_client_id: '',
    new_client_name: '',
    new_client_age: '',
    use_existing_client: true,
  });

  const { data: clients = [] } = useClients();
  const { createCase } = useCaseOperations();
  const createClient = useCreateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let clientName = formData.client_name;

      // If creating a new client, create the client first
      if (!formData.use_existing_client && formData.new_client_name) {
        const newClient = await createClient.mutateAsync({
          name: formData.new_client_name,
          age: formData.new_client_age ? parseInt(formData.new_client_age) : undefined,
          case_title: formData.title,
        });
        clientName = newClient.name;
      } else if (formData.use_existing_client && formData.existing_client_id) {
        const selectedClient = clients.find(c => c.id === formData.existing_client_id);
        clientName = selectedClient?.name || '';
      }

      await createCase.mutateAsync({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        client_name: clientName,
      });

      toast.success('Case created successfully!');
      onClose();
      setFormData({
        title: '',
        description: '',
        status: 'Active',
        priority: 'Medium',
        client_name: '',
        existing_client_id: '',
        new_client_name: '',
        new_client_age: '',
        use_existing_client: true,
      });
    } catch (error) {
      toast.error('Failed to create case');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Case Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Active' | 'Pending Review' | 'Discovery' | 'Investigation' | 'Completed') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Discovery">Discovery</SelectItem>
                <SelectItem value="Investigation">Investigation</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Client Selection</Label>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="client_option"
                    checked={formData.use_existing_client}
                    onChange={() => setFormData({ ...formData, use_existing_client: true })}
                  />
                  <span>Use Existing Client</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="client_option"
                    checked={!formData.use_existing_client}
                    onChange={() => setFormData({ ...formData, use_existing_client: false })}
                  />
                  <span>Create New Client</span>
                </label>
              </div>

              {formData.use_existing_client ? (
                <div>
                  <Label htmlFor="existing_client">Select Client</Label>
                  <Select value={formData.existing_client_id} onValueChange={(value) => setFormData({ ...formData, existing_client_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new_client_name">New Client Name</Label>
                    <Input
                      id="new_client_name"
                      value={formData.new_client_name}
                      onChange={(e) => setFormData({ ...formData, new_client_name: e.target.value })}
                      required={!formData.use_existing_client}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new_client_age">Client Age (Optional)</Label>
                    <Input
                      id="new_client_age"
                      type="number"
                      value={formData.new_client_age}
                      onChange={(e) => setFormData({ ...formData, new_client_age: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCase.isPending || createClient.isPending}>
              {createCase.isPending || createClient.isPending ? 'Creating...' : 'Create Case'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
