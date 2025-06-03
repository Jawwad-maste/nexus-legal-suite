
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEvent } from '@/hooks/useEvents';
import { Client } from '@/types/database';
import { toast } from 'sonner';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  selectedDate?: string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  clients,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || '');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<'hearing' | 'meeting'>('meeting');
  const [clientId, setClientId] = useState('');

  const createEvent = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const eventDate = new Date(`${date}T${time}:00`).toISOString();
      
      await createEvent.mutateAsync({
        title,
        type,
        date: eventDate,
        client_id: clientId || null,
        google_event_id: null
      });

      toast.success('Event created successfully');
      onClose();
      setTitle('');
      setDate('');
      setTime('09:00');
      setType('meeting');
      setClientId('');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'hearing' | 'meeting') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="hearing">Hearing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Linked Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.case_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEvent.isPending}>
              {createEvent.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
