import React, { useState } from 'react';
import { 
  Music, 
  Users, 
  Tv, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle, 
  UserCheck, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { Department, Member } from '../types';

interface DepartmentsManagerProps {
  departments: Department[];
  members: Member[];
  onUpdateDepartment: (id: string, updates: Partial<Department>) => Promise<void>;
}

export const DepartmentsManager: React.FC<DepartmentsManagerProps> = ({
  departments,
  members,
  onUpdateDepartment
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept_choir');
  const [isEditingMeeting, setIsEditingMeeting] = useState(false);
  const [newMeetingTime, setNewMeetingTime] = useState('');

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];

  // Members enrolled in this department
  const deptMembers = members.filter(m => m.department === selectedDept?.name);

  // Leaders available
  const potentialLeaders = members.filter(m => m.status === 'Active');

  const handleLeaderChange = async (leaderId: string) => {
    const leader = members.find(m => m.id === leaderId);
    if (!leader) return;

    await onUpdateDepartment(selectedDept.id, {
      leaderId,
      leaderName: leader.name
    });
    alert(`Department leadership transferred to ${leader.name} successfully!`);
  };

  const handleMeetingTimeSave = async () => {
    if (!newMeetingTime.trim()) return;
    await onUpdateDepartment(selectedDept.id, {
      meetingTime: newMeetingTime
    });
    setIsEditingMeeting(false);
    alert('Meeting schedules updated successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="departments_view_panel">
      {/* Sidebar: Department Cards selector */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Church Ministries</h3>
        <div className="space-y-3">
          {departments.map(dept => {
            const memberCount = members.filter(m => m.department === dept.name).length;
            const isSelected = dept.id === selectedDeptId;
            return (
              <div 
                key={dept.id}
                onClick={() => {
                  setSelectedDeptId(dept.id);
                  setNewMeetingTime(dept.meetingTime);
                  setIsEditingMeeting(false);
                }}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start space-x-3 ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-800'
                }`}
              >
                {/* Icon wrapper */}
                <div className={`p-2.5 rounded-xl ${
                  isSelected 
                    ? 'bg-white/10 text-white' 
                    : dept.name === 'Choir' ? 'bg-sky-50 text-sky-600' :
                      dept.name === 'Ushers' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-amber-50 text-amber-600'
                }`}>
                  {dept.name === 'Choir' && <Music className="w-5 h-5" />}
                  {dept.name === 'Ushers' && <UserCheck className="w-5 h-5" />}
                  {dept.name === 'Media' && <Tv className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm tracking-tight">{dept.name} Ministry</h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>Leader: {dept.leaderName}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50/10">
                    <span className="text-[10px] font-mono font-semibold">{memberCount} volunteers</span>
                    <span className="text-[9px] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{dept.meetingTime.split(' at ')[0]}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel: Selected Department detail layout */}
      <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        {selectedDept ? (
          <>
            {/* Header info */}
            <div className="pb-5 border-b border-slate-100 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-mono">Ministry Profile</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-semibold text-slate-400">Database Synchronized</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 font-display flex items-center space-x-2">
                <span>{selectedDept.name} Department</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedDept.description}</p>
            </div>

            {/* Ministry Specific Context Accents */}
            {selectedDept.name === 'Choir' && (
              <div className="bg-sky-50/40 border border-sky-100/50 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Interactive Band & Lead Guide Chords</span>
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Keyboard setups: Standard Nord stage synthesizers with dual acoustic layers. Choir vocalese: Rehearsing perfect vocal harmonies (Soprano, Alto, Tenor) against corporate chord patterns. 
                </p>
              </div>
            )}

            {selectedDept.name === 'Ushers' && (
              <div className="bg-emerald-50/40 border border-emerald-100/50 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sanctuary Decorum & Seating Maps</span>
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ensuring comfortable seat alignments for late congregants. Coordinating communion row progressions and securing donation collections safely.
                </p>
              </div>
            )}

            {selectedDept.name === 'Media' && (
              <div className="bg-amber-50/40 border border-amber-100/50 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  <span>A/V Streaming & Lyric Projection Console</span>
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Managing live stream broadcast logs. Operating OBS studio mixers, sermon presentation slides, wireless handheld microphone gains, and standard ambient lighting.
                </p>
              </div>
            )}

            {/* Dynamic Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Leader Management */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transfer Ministry Leadership</label>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedDept.leaderId}
                    onChange={(e) => handleLeaderChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-600 font-semibold"
                  >
                    {potentialLeaders.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Transfers administrative control of the department in security databases.</p>
              </div>

              {/* Weekly Schedule Controls */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rehearsal / Meeting Schedule</label>
                {isEditingMeeting ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={newMeetingTime}
                      onChange={(e) => setNewMeetingTime(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none font-medium text-slate-700" 
                    />
                    <button 
                      onClick={handleMeetingTimeSave}
                      className="px-2.5 py-1 bg-slate-900 text-white font-semibold text-[10px] rounded hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{selectedDept.meetingTime}</span>
                    <button 
                      onClick={() => {
                        setNewMeetingTime(selectedDept.meetingTime);
                        setIsEditingMeeting(true);
                      }}
                      className="text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Modify
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1">Schedules are visible to all assigned volunteers in workspace dashboards.</p>
              </div>
            </div>

            {/* Volunteers Directory List */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrolled Volunteers Directory</h4>
                <span className="text-[10px] font-mono text-slate-400">{deptMembers.length} active in database</span>
              </div>

              {deptMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deptMembers.map(member => (
                    <div key={member.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-slate-800">{member.name}</h5>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.role}</p>
                      </div>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[9px]">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-500 italic">No volunteers registered directly in {selectedDept.name} yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Assign members this department via the main registry.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 mt-2 font-semibold">Select a Department to start management.</p>
          </div>
        )}
      </div>
    </div>
  );
};
