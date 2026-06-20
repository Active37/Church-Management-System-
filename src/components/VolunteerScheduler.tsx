import React, { useState } from 'react';
import { 
  Calendar, 
  UserCheck, 
  Clock, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles, 
  User, 
  Tag, 
  Info, 
  Trash2, 
  Filter 
} from 'lucide-react';
import { VolunteerSchedule, Member, Event } from '../types';

interface VolunteerSchedulerProps {
  schedules: VolunteerSchedule[];
  members: Member[];
  events: Event[];
  currentUserEmail: string | null;
  onAddSchedule: (schedule: Omit<VolunteerSchedule, 'id'>) => Promise<void>;
  onUpdateSchedule: (id: string, updates: Partial<VolunteerSchedule>) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
}

export const VolunteerScheduler: React.FC<VolunteerSchedulerProps> = ({
  schedules,
  members,
  events,
  currentUserEmail,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}) => {
  const [activeMode, setActiveMode] = useState<'all' | 'mine'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [selectedEventId, setSelectedEventId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [requirements, setRequirements] = useState('');

  const activeSchedules = activeMode === 'mine' 
    ? schedules.filter(s => s.memberEmail.toLowerCase() === (currentUserEmail || '').toLowerCase())
    : schedules;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !roleName.trim() || !selectedMemberId) {
      alert('Please fill out all required fields.');
      return;
    }

    // Get event detail
    let eTitle = 'Regular Sunday Service';
    let eTime = new Date().toISOString();
    if (selectedEventId !== 'regular_sunday' && selectedEventId !== 'regular_midweek') {
      const matchEvent = events.find(evt => evt.id === selectedEventId);
      if (matchEvent) {
        eTitle = matchEvent.title;
        eTime = matchEvent.dateTime;
      }
    } else {
      eTitle = selectedEventId === 'regular_sunday' ? 'Regular Sunday Service' : 'Regular Midweek Power Study';
      // Next Sunday or next Wednesday
      const today = new Date();
      const dayOfWeek = selectedEventId === 'regular_sunday' ? 0 : 3;
      const resultDate = new Date(today);
      resultDate.setDate(today.getDate() + (7 + dayOfWeek - today.getDay()) % 7);
      resultDate.setHours(selectedEventId === 'regular_sunday' ? 9 : 18, 0, 0, 0);
      eTime = resultDate.toISOString();
    }

    // Get member detail
    const matchMember = members.find(m => m.id === selectedMemberId);
    if (!matchMember) return;

    await onAddSchedule({
      eventId: selectedEventId,
      eventTitle: eTitle,
      dateTime: eTime,
      roleName: roleName.trim(),
      memberId: matchMember.id,
      memberName: matchMember.name,
      memberEmail: matchMember.email,
      status: 'Assigned',
      requirements: requirements.trim() || 'No special requirements listed'
    });

    // Reset
    setRoleName('');
    setSelectedMemberId('');
    setRequirements('');
    setIsFormOpen(false);
    alert('Volunteer role assigned successfully!');
  };

  const handleStatusChange = async (scheduleId: string, newStatus: 'Confirmed' | 'Declined') => {
    await onUpdateSchedule(scheduleId, { status: newStatus });
    alert(`Your shift assignment has been marked as ${newStatus}!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="volunteer_scheduler_panel">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center space-x-2">
            <span>Volunteer Duty Scheduling</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign active temple volunteers to specific services and roles, coordinate availability details, and view personalized user lists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setActiveMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeMode === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Master Roster
            </button>
            <button
              onClick={() => setActiveMode('mine')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                activeMode === 'mine' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Personal Duties
              {schedules.filter(s => s.memberEmail.toLowerCase() === (currentUserEmail || '').toLowerCase() && s.status === 'Assigned').length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Roster / personal list view selector info alert */}
      {activeMode === 'mine' && (
        <div className="bg-sky-50/50 border border-sky-100/50 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sky-900">Logged In Member Email Matching</p>
            <p className="mt-1 leading-relaxed text-slate-500">
              Only duties assigned to <span className="font-mono text-slate-700 font-semibold">{currentUserEmail}</span> are shown list below. Directly respond (Confirm/Decline) to instantly update schedules in the admin dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      {activeSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeSchedules.map(slot => {
            const dateObj = new Date(slot.dateTime);
            const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            const isOwnDuty = slot.memberEmail.toLowerCase() === (currentUserEmail || '').toLowerCase();

            return (
              <div 
                key={slot.id} 
                className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3 relative overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                {/* Status Badge */}
                <div className="absolute right-0 top-0 pt-3 pr-3">
                  <span className={`px-2 py-0.5 rounded-bl-xl rounded-tr-xl text-[9px] font-mono font-bold uppercase ${
                    slot.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    slot.status === 'Declined' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {slot.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Service Role</span>
                  </div>
                  
                  <h3 className="font-extrabold text-sm text-slate-800">{slot.roleName}</h3>
                  
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{slot.eventTitle}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateStr} at {timeStr}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-600">Assigned: {slot.memberName}</span>
                    </p>
                  </div>

                  {/* Requirements note */}
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1">
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      <span>Special Requirements</span>
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1 italic leading-relaxed">
                      "{slot.requirements}"
                    </p>
                  </div>
                </div>

                {/* Confirm/Decline Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  {isOwnDuty ? (
                    <div className="w-full flex items-center space-x-1.5">
                      <button
                        onClick={() => handleStatusChange(slot.id, 'Confirmed')}
                        disabled={slot.status === 'Confirmed'}
                        className="flex-1 py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 disabled:bg-emerald-50/55 disabled:cursor-not-allowed text-emerald-700 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center space-x-1 border border-emerald-100"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm Shift</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(slot.id, 'Declined')}
                        disabled={slot.status === 'Declined'}
                        className="py-1 px-2 bg-rose-50 hover:bg-rose-100 disabled:bg-rose-55/55 disabled:cursor-not-allowed text-rose-700 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center space-x-1 border border-rose-100"
                      >
                        <X className="w-3 h-3" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex justify-between items-center text-[10px] text-slate-400">
                      <span>Roster Entry ID: {slot.id.split('_')[1] || slot.id}</span>
                      <button
                        onClick={() => onDeleteSchedule(slot.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 hover:bg-slate-200/50 rounded-lg"
                        title="Remove Assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">No duty schedules found.</p>
          <p className="text-xs text-slate-400">Click "Create Assignment" to schedule helper roles on regular services or custom events.</p>
        </div>
      )}

      {/* Creation Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 font-display mb-1 flex items-center space-x-2">
              <UserCheck className="text-sky-600 w-5 h-5" />
              <span>Schedule Volunteer Role</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Assign an active church member to a service role with designated timing and reminders.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Service / Event *</label>
                <select 
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
                >
                  <option value="">-- Choose Church Event / Service --</option>
                  <option value="regular_sunday">Regular Sunday Service (Next Sunday morning)</option>
                  <option value="regular_midweek">Regular Midweek Power Study (Next Wednesday evening)</option>
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.title} ({new Date(evt.dateTime).toLocaleDateString()})</option>
                  ))}
                </select>
              </div>

              {/* Role Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Duty / Role *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Lead Keyboardist, A/V Camera Operator, Door Greeter"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
                />
              </div>

              {/* Member Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assign Volunteer *</label>
                <select 
                  required
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 font-semibold text-slate-700"
                >
                  <option value="">-- Select Church Volunteer --</option>
                  {members.filter(m => m.status === 'Active').map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.department} - {m.role})</option>
                  ))}
                </select>
              </div>

              {/* Setup Requirements */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Requirements & Availability details</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Arrive 35 mins early at the setup booth, wear choir sky-blue layout vestments."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
