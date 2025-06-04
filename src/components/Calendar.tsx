
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import { useClients } from '@/hooks/useClients';
import { EventModal } from '@/components/EventModal';
import { EventDetailModal } from '@/components/EventDetailModal';
import { motion } from 'framer-motion';

const Calendar = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: clients = [] } = useClients();

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    backgroundColor: event.type === 'hearing' ? '#ef4444' : '#3b82f6',
    borderColor: event.type === 'hearing' ? '#dc2626' : '#2563eb',
    textColor: 'white',
    extendedProps: {
      type: event.type,
      client: event.client,
      fullEvent: event
    }
  }));

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    const fullEvent = arg.event.extendedProps.fullEvent;
    setSelectedEvent(fullEvent);
    setIsEventDetailModalOpen(true);
  };

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading calendar...</div>
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
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button 
          onClick={() => setIsEventModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          + New Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="100%"
              eventDisplay="block"
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
              }}
            />
          </div>
        </CardContent>
      </Card>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate('');
        }}
        clients={clients}
        selectedDate={selectedDate}
      />

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          clients={clients}
          isOpen={isEventDetailModalOpen}
          onClose={() => {
            setIsEventDetailModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default Calendar;
