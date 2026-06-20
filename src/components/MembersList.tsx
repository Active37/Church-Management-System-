import React, { useState } from 'react';
import { Search, UserPlus, Mail, Phone, Tag, Trash2, Edit3, Calendar, Plus, X, AlertCircle } from 'lucide-react';
import { Member } from '../types';

interface MembersListProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'registeredAt'>) => Promise<void>;
  onUpdateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('None');
  const [role, setRole] = useState('Member');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [notes, setNotes] = useState('');

  // Search/Filter logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone.includes(searchTerm);
    const matchesDept = deptFilter === 'All' || member.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('None');
    setRole('Member');
    setStatus('Active');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setDepartment(member.department);
    setRole(member.role);
    setStatus(member.status);
    setNotes(member.notes);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: phone || '+1 (555) 000-0000',
      department,
      role,
      status,
      notes
    };

    if (editingId) {
      await onUpdateMember(editingId, payload);
    } else {
      await onAddMember(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="members_view_panel">
      {/* View Header with Registration Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Worship Sanctuary Registry</h2>
          <p className="text-xs text-slate-500">Manage church attendee lists, active volunteer profiles, and contact registries.</p>
        </div>
        <button 
          id="btn_register_member"
          onClick={openAddModal}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Member</span>
        </button>
      </div>

      {/* Query Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 focus:ring-2 focus:ring-sky-500 bg-white border border-slate-200 rounded-lg text-xs outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Dept filter */}
        <div>
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-600"
          >
            <option value="All">All Departments</option>
            <option value="Choir">Choir Team</option>
            <option value="Ushers">Ushers Team</option>
            <option value="Media">Media Team</option>
            <option value="None">No Team (General)</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Directory Grid / Table */}
      {filteredMembers.length > 0 ? (
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse" id="members_table">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Ministry Team</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Enrollment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{member.id}</span>
                    </div>
                  </td>
                  {/* Ministry */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-max ${
                        member.department === 'Choir' ? 'bg-sky-50 text-sky-700' :
                        member.department === 'Ushers' ? 'bg-emerald-50 text-emerald-700' :
                        member.department === 'Media' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {member.department === 'None' ? 'General Space' : member.department}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">{member.role}</span>
                    </div>
                  </td>
                  {/* Contacts */}
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  </td>
                  {/* Registered date */}
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(member.registeredAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {member.status}
                    </span>
                  </td>
                  {/* Settings */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="p-1 px-1.5 bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded border border-slate-100 transition-colors"
                        title="Edit profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1 px-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded border border-slate-100 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">No members meet the selected criteria.</p>
          <p className="text-xs text-slate-400">Clear search parameters or click "Register Member" to log new attendees.</p>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" id="member_modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 font-display mb-1 flex items-center space-x-2">
              <UserPlus className="text-sky-600 w-5 h-5" />
              <span>{editingId ? 'Edit Worship Profile' : 'Register New Worshipper'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Create or modify profile dimensions connected to church ministries.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Legal Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. sarah.j@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile Line</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +1 (555) 321-9876"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Ministry Team assignment</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                  >
                    <option value="None">None (General Member)</option>
                    <option value="Choir">Choir Team</option>
                    <option value="Ushers">Ushers Team</option>
                    <option value="Media">Media Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Team Role Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Soloist, Organist, Greeter"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Status checkboxes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Security / Activity Status</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="text-sky-600 focus:ring-sky-500 rounded"
                    />
                    <span className="text-xs font-semibold text-emerald-600">Active Worshipper</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="text-sky-600 focus:ring-sky-500 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-500">Inactive State</span>
                  </label>
                </div>
              </div>

              {/* Pastoral notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Ministry Notes / Spiritual Bio</label>
                <textarea 
                  placeholder="e.g. Key vocal range or instrumental skills helpful for rehearsals"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                />
              </div>

              {/* Form Actions */}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
