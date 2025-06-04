
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateEvent, useDeleteEvent } from '@/hooks/useEventOperations';
import { Event, Client } from '@/types/database';
import { toast } from 'sonner';

interface EventDetailModalProps {
  event: Event;
  clients: Client[];
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  clients,
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date.split('T')[0]);
  const [time, setTime] = useState(
    new Date(event.date).toTimeString().slice(0, 5)
  );
  const [type, setType] = useState<'hearing' | 'meeting'>(event.type);
  const [clientId, setClientId] = useState(event.client_id || '');

  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const eventDate = new Date(`${date}T${time}:00`).toISOString();
      
      await updateEvent.mutateAsync({
        id: event.id,
        updates: {
          title,
          type,
          date: eventDate,
          client_id: clientId || null,
        }
      });

      toast.success('Event updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent.mutateAsync(event.id);
      toast.success('Event deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Info Display */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="font-semibold mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.type === 'hearing' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {event.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time:</span>
                <span>{new Date(event.date).toLocaleString()}</span>
              </div>
              {event.client && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span>{event.client.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(event.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
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
                  <SelectItem value="">No client selected</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.case_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteEvent.isPending}
              >
                {deleteEvent.isPending ? 'Deleting...' : 'Delete Event'}
              </Button>
              
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateEvent.isPending}>
                  {updateEvent.isPending ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
