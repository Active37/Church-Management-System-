import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Flag, 
  Calendar, 
  Search, 
  CheckSquare, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { Member, Event, Attendance } from '../types';

interface AttendanceTrackerProps {
  members: Member[];
  events: Event[];
  attendance: Attendance[];
  onSaveAttendance: (records: Omit<Attendance, 'id' | 'recordedBy' | 'recordedAt'>[]) => Promise<void>;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  members,
  events,
  attendance,
  onSaveAttendance
}) => {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || 'evt_1');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberSearch, setMemberSearch] = useState('');
  
  // Track current marks in temporary local state before saving to Firestore
  const [marks, setMarks] = useState<{ [memberId: string]: 'Present' | 'Absent' | 'Excused' }>(() => {
    const initialMarks: { [memberId: string]: 'Present' | 'Absent' | 'Excused' } = {};
    members.forEach(m => {
      initialMarks[m.id] = 'Present'; // Default everyone to Present values
    });
    return initialMarks;
  });

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleMarkChange = (memberId: string, status: 'Present' | 'Absent' | 'Excused') => {
    setMarks(prev => ({
      ...prev,
      [memberId]: status
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent' | 'Excused') => {
    const updatedMarks = { ...marks };
    members.forEach(m => {
      updatedMarks[m.id] = status;
    });
    setMarks(updatedMarks);
  };

  const handleSubmit = async () => {
    const recordsToSave = members.map(member => ({
      eventId: selectedEventId,
      eventTitle: selectedEvent?.title || 'General Gathering',
      date: attendanceDate,
      memberId: member.id,
      memberName: member.name,
      status: marks[member.id] || 'Present'
    }));

    await onSaveAttendance(recordsToSave);
    alert('Attendance successfully secured to standard corporate cloud records!');
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) && m.status === 'Active'
  );

  // Statistics
  const totalWorshippers = filteredMembers.length;
  const presentCount = Object.values(marks).filter(v => v === 'Present').length;
  const absentCount = Object.values(marks).filter(v => v === 'Absent').length;
  const excusedCount = Object.values(marks).filter(v => v === 'Excused').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="attendance_view_panel">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Active Service Roll-Call</h2>
          <p className="text-xs text-slate-500">Conduct regular checklists of church members against service gatherings.</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Sheet</span>
        </button>
      </div>

      {/* Target Gathering Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        {/* Event Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Gathering Event</label>
          <select 
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-600"
          >
            {events.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.title} ({evt.category})</option>
            ))}
          </select>
        </div>

        {/* Date Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Service Roll-Call Date</label>
          <div className="relative">
            <input 
              type="date" 
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Quick Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search active roll-call name..." 
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 focus:ring-2 focus:ring-sky-500 bg-slate-50/50 border border-slate-200 rounded-lg text-xs outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Bulk tools */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <span>Bulk Mark:</span>
          <button 
            type="button"
            onClick={() => handleMarkAll('Present')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded-md transition-colors"
          >
            All Present
          </button>
          <button 
            type="button"
            onClick={() => handleMarkAll('Absent')}
            className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 rounded-md transition-colors"
          >
            All Absent
          </button>
          <button 
            type="button"
            onClick={() => handleMarkAll('Excused')}
            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 rounded-md transition-colors"
          >
            All Excused
          </button>
        </div>
      </div>

      {/* Roster Live Stat Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Present</span>
          <h4 className="text-xl font-bold text-emerald-800">{presentCount} Worshippers</h4>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Absent</span>
          <h4 className="text-xl font-bold text-rose-800">{absentCount} Worshippers</h4>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Excused</span>
          <h4 className="text-xl font-bold text-amber-800">{excusedCount} Attendees</h4>
        </div>
      </div>

      {/* Attendance Sheet List */}
      {filteredMembers.length > 0 ? (
        <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {filteredMembers.map((member) => {
            const currentStatus = marks[member.id] || 'Present';
            return (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/40 transition-colors gap-3">
                {/* Member Identity */}
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{member.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {member.id}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {member.department === 'None' ? 'General Space' : member.department}
                    </span>
                  </div>
                </div>

                {/* Mark controls */}
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {/* Present Button */}
                  <button 
                    type="button"
                    onClick={() => handleMarkChange(member.id, 'Present')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                      currentStatus === 'Present' 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Present</span>
                  </button>

                  {/* Absent Button */}
                  <button 
                    type="button"
                    onClick={() => handleMarkChange(member.id, 'Absent')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                      currentStatus === 'Absent' 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Absent</span>
                  </button>

                  {/* Excused Button */}
                  <button 
                    type="button"
                    onClick={() => handleMarkChange(member.id, 'Excused')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                      currentStatus === 'Excused' 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Excused</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">No active members found.</p>
          <p className="text-xs text-slate-400">Please verify you have registered active church members in the registry first.</p>
        </div>
      )}
    </div>
  );
};
