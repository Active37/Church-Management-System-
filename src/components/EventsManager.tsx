import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  UserPlus, 
  Send, 
  CheckCircle, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { Event } from '../types';

interface EventsManagerProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id' | 'registrationsCount' | 'createdAt'>) => Promise<void>;
  onUpdateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const EventsManager: React.FC<EventsManagerProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remindersEventId, setRemindersEventId] = useState<string | null>(null);
  
  // Registration simulation states
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [activeRegId, setActiveRegId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Sunday Service' | 'Midweek' | 'Youth' | 'Special'>('Sunday Service');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;

    const payload = {
      title,
      description,
      dateTime,
      location: location || 'Main Church Sanctuary',
      category
    };

    await onAddEvent(payload);

    // Reset
    setTitle('');
    setDescription('');
    setDateTime('');
    setLocation('');
    setCategory('Sunday Service');
    setIsModalOpen(false);
    alert(`Successfully scheduled "${title}"!`);
  };

  const handleSimulatedRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRegId || !simName.trim()) return;

    const target = events.find(item => item.id === activeRegId);
    if (!target) return;

    const currentCount = target.registrationsCount || 0;
    await onUpdateEvent(activeRegId, {
      registrationsCount: currentCount + 1
    });

    setSimName('');
    setSimEmail('');
    setActiveRegId(null);
    alert(`Simulated attendee booking confirmed! Registrations updated for ${target.title}.`);
  };

  const triggerEventReminders = (eventId: string) => {
    setRemindersEventId(eventId);
    setTimeout(() => {
      setRemindersEventId(null);
      alert('SMS and email reminders broadcasted to all registered church members and volunteers!');
    }, 2200); // realistic mock dispatch
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="events_view_panel">
      {/* Event Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Schedule Corporate Events</h2>
          <p className="text-xs text-slate-500">Plan Sunday services, mid-week prayer calendars, special music set workshops, and track physical registration counts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Events Calendar List */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(evt => {
            const dateObj = new Date(evt.dateTime);
            const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            return (
              <div 
                key={evt.id} 
                className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-sm transition-shadow relative overflow-hidden"
              >
                {/* Category Accent Badge */}
                <div className="absolute right-0 top-0 pt-3 pr-3">
                  <span className={`px-2 py-0.5 rounded-bl-xl rounded-tr-xl text-[9px] font-bold uppercase tracking-wider ${
                    evt.category === 'Sunday Service' ? 'bg-sky-100 text-sky-800' :
                    evt.category === 'Midweek' ? 'bg-emerald-100 text-emerald-800' :
                    evt.category === 'Youth' ? 'bg-pink-100 text-pink-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {evt.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-850 text-base max-w-[80%] leading-snug">{evt.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{evt.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateStr} at <span className="font-semibold text-slate-700">{timeStr}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>

                {/* Event Actions & Attendee Numbers */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Total Booked</span>
                    <span className="font-bold text-slate-800 font-mono">{evt.registrationsCount || 0} Registrations</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Simulated registration button */}
                    <button 
                      onClick={() => setActiveRegId(evt.id)}
                      className="px-2.5 py-1.5 bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 rounded-lg font-bold text-[10px] flex items-center space-x-1 transition-colors"
                      title="Simulate Attendee registration"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Book Seat</span>
                    </button>

                    {/* Notification remainder button */}
                    <button 
                      onClick={() => triggerEventReminders(evt.id)}
                      disabled={remindersEventId === evt.id}
                      className="px-2.5 py-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:bg-slate-100 rounded-lg font-bold text-[10px] flex items-center space-x-1 transition-colors"
                    >
                      {remindersEventId === evt.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Remind Members</span>
                        </>
                      )}
                    </button>

                    {/* Delete option */}
                    <button 
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100/50 rounded-lg transition-colors"
                      title="Cancel Event Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">No Events scheduled on the calendar.</p>
          <p className="text-xs text-slate-400">Click "Create Event" to draft corporate Sunday worship setups or mid-week fellowships.</p>
        </div>
      )}

      {/* Simulated registration modal */}
      {activeRegId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveRegId(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-slate-800 text-sm mb-1">Simulate Attendee registration</h3>
            <p className="text-xs text-slate-400 mb-4">Book seats directly in real-time. Simulates standard attendee submission forms.</p>

            <form onSubmit={handleSimulatedRegistration} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Participant Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bro Praise"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  placeholder="e.g. praise@example.com"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event creation modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" id="create_event_modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 font-display mb-1 flex items-center space-x-2">
              <Calendar className="text-sky-600 w-5 h-5" />
              <span>Draft Church Calendar Event</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Schedule corporate gatherings, vocal music rehearsals, or community outreaches on the master planner.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sunday Worship Encounter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Purpose / Description</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Bring your bibles. Service includes communions, praise blocks and prophetic layouts."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all"
                />
              </div>

              {/* Date / Time */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Hour of Start *</label>
                <input 
                  type="datetime-local" 
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Gathering Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                  >
                    <option value="Sunday Service">Sunday Service</option>
                    <option value="Midweek">Midweek Power Study</option>
                    <option value="Youth">Youth Encounter</option>
                    <option value="Special">Special Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Location Room/Venue</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Main Auditorium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
