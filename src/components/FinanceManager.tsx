import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  TrendingUp, 
  FileCheck, 
  Calendar, 
  User, 
  Tag, 
  Plus, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { Finance, Member } from '../types';

interface FinanceManagerProps {
  finances: Finance[];
  members: Member[];
  onAddFinance: (transaction: Omit<Finance, 'id' | 'recordedBy' | 'recordedAt'>) => Promise<void>;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  finances,
  members,
  onAddFinance
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Form states
  const [type, setType] = useState<'Tithe' | 'Offering' | 'Donation' | 'Other'>('Tithe');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [donorName, setDonorName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [notes, setNotes] = useState('');

  // Total summary calculations
  const totalFlow = finances.reduce((sum, f) => sum + f.amount, 0);
  const totalTithes = finances.filter(f => f.type === 'Tithe').reduce((sum, f) => sum + f.amount, 0);
  const totalOfferings = finances.filter(f => f.type === 'Offering').reduce((sum, f) => sum + f.amount, 0);
  const totalDonations = finances.filter(f => f.type === 'Donation').reduce((sum, f) => sum + f.amount, 0);

  // Link member action
  const handleMemberSelect = (id: string) => {
    setMemberId(id);
    const m = members.find(org => org.id === id);
    if (m) {
      setDonorName(m.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please output a positive numeric value!');
      return;
    }

    const transaction = {
      type,
      amount: val,
      date,
      donorName: donorName || 'Anonymous Member',
      memberId: memberId || '',
      notes
    };

    await onAddFinance(transaction);
    
    // Reset
    setAmount('');
    setDonorName('');
    setMemberId('');
    setNotes('');
    setIsModalOpen(false);
  };

  const filteredFinances = finances.filter(f => {
    const matchesSearch = f.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          f.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="finances_view_panel">
      {/* Finance Ledger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Treasury Audit & Ledgers</h2>
          <p className="text-xs text-slate-500">Record faithfully and review tithes, sacrificial offerings, and specialized builder-donations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Offering / Tithe</span>
        </button>
      </div>

      {/* Corporate Summary widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Raised */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Ledger Flow</span>
          <h4 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">${totalFlow.toLocaleString()}</h4>
          <span className="text-[10px] text-slate-400 mt-1">100% cloud audited</span>
        </div>

        {/* Tithes */}
        <div className="bg-sky-50/50 border border-sky-100/75 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">Corporate Tithes</span>
          <h4 className="text-xl md:text-2xl font-bold text-sky-800 mt-1">${totalTithes.toLocaleString()}</h4>
          <span className="text-[10px] text-sky-500 mt-1 font-semibold">{totalFlow > 0 ? Math.round((totalTithes/totalFlow)*100) : 0}% contribution</span>
        </div>

        {/* Offerings */}
        <div className="bg-emerald-50/50 border border-emerald-100/75 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Service Offerings</span>
          <h4 className="text-xl md:text-2xl font-bold text-emerald-800 mt-1">${totalOfferings.toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-500 mt-1 font-semibold">{totalFlow > 0 ? Math.round((totalOfferings/totalFlow)*100) : 0}% contribution</span>
        </div>

        {/* Donations */}
        <div className="bg-amber-50/50 border border-amber-100/75 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Building Donations</span>
          <h4 className="text-xl md:text-2xl font-bold text-amber-800 mt-1">${totalDonations.toLocaleString()}</h4>
          <span className="text-[10px] text-amber-600 mt-1 font-semibold">{totalFlow > 0 ? Math.round((totalDonations/totalFlow)*100) : 0}% contribution</span>
        </div>
      </div>

      {/* Search and Category Filter tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions by donor or notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 focus:ring-2 focus:ring-sky-500 bg-white border border-slate-200 rounded-lg text-xs outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Type filter */}
        <div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-600"
          >
            <option value="All">All Categories</option>
            <option value="Tithe">Tithes</option>
            <option value="Offering">Offerings</option>
            <option value="Donation">Specific Donations</option>
            <option value="Other">Other Flow</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      {filteredFinances.length > 0 ? (
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse" id="finances_table">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Locked Date</th>
                <th className="py-3 px-4">Memo Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
              {filteredFinances.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>
                      <span>{f.donorName}</span>
                      {f.memberId && (
                        <span className="block text-[9px] text-slate-400 font-mono font-normal">Linked member: {f.memberId}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      f.type === 'Tithe' ? 'bg-sky-50 text-sky-700' :
                      f.type === 'Offering' ? 'bg-emerald-50 text-emerald-700' :
                      f.type === 'Donation' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                    ${f.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{f.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={f.notes}>
                    {f.notes || <span className="text-slate-300 italic">None</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">No transaction records match filters.</p>
          <p className="text-xs text-slate-400">Lock offering slips or seed new tithe amounts optionally.</p>
        </div>
      )}

      {/* Record offering modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" id="finance_modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 font-display mb-1 flex items-center space-x-2">
              <DollarSign className="text-emerald-500 w-5 h-5 animate-pulse" />
              <span>Record Treasury Asset</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Record tithes, general offering counts or building fund donations faithfully next to church lists.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Treasury Asset Category *</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                >
                  <option value="Tithe">Tithe (Faithful Tenth)</option>
                  <option value="Offering">Offering (Corporate Basket)</option>
                  <option value="Donation">Specific Seed/Project Donation</option>
                  <option value="Other">Other Income</option>
                </select>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-display">Financial Amount ($ USD) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-mono font-bold"
                  />
                </div>
              </div>

              {/* Linking registered Members */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-display">Link Registered Member (Optional)</label>
                <select 
                  value={memberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-semibold"
                >
                  <option value="">-- No linked member (Anonymous / General Audience) --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name} ({member.department})</option>
                  ))}
                </select>
              </div>

              {/* Donor Name text (fills automatically if member linked) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Donor Attribution Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bro Praise, or Anonymous"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                />
              </div>

              {/* Log Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-display">Transaction Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                />
              </div>

              {/* Memo memo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Memo Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sound equipment support or general sunday covenant seed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-lg text-xs-1 text-slate-700 transition-all font-medium"
                />
              </div>

              {/* Actions */}
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
