import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  User, 
  Calendar,
  Clock,
  ArrowUpDown,
  Mail,
  FileCode
} from 'lucide-react';
import { SystemActivity } from '../types';

interface SystemActivityLogProps {
  activities: SystemActivity[];
}

export const SystemActivityLog: React.FC<SystemActivityLogProps> = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'All' | 'Modification' | 'Deletion'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Member' | 'Event'>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Format date helper
  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  // Filter activities
  const filteredActivities = activities
    .filter(act => {
      const matchesSearch = 
        act.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.details.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesAction = actionFilter === 'All' || act.actionType === actionFilter;
      const matchesType = typeFilter === 'All' || act.targetType === typeFilter;
      
      return matchesSearch && matchesAction && matchesType;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="system_activity_panel">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 font-display">System Audit Logs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time read-only oversight tracking critical profile edits, structural modifications, and record deletions.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-55 p-1 rounded-lg">
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded font-mono">
            {filteredActivities.length} logs
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Immutable</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        {/* Search */}
        <div className="col-span-1 sm:col-span-2 relative">
          <label htmlFor="log_search" className="sr-only">Search logs</label>
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="log_search"
            type="text"
            placeholder="Search by target name, email, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        {/* Action filter */}
        <div className="relative">
          <label htmlFor="action_filter" className="sr-only">Filter by action</label>
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            id="action_filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as any)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-600 appearance-none"
          >
            <option value="All">All Actions (Edit/Del)</option>
            <option value="Modification">Modifications</option>
            <option value="Deletion">Deletions</option>
          </select>
        </div>

        {/* Target Type filter */}
        <div className="relative">
          <label htmlFor="type_filter" className="sr-only">Filter by target type</label>
          <FileCode className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            id="type_filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-600 appearance-none"
          >
            <option value="All">All Entities</option>
            <option value="Member">Members Only</option>
            <option value="Event">Events Only</option>
          </select>
        </div>
      </div>

      {/* Sorting / Action Header */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-400">Chronological Event Timeline</span>
        <button 
          onClick={toggleSort}
          className="flex items-center space-x-1.5 text-sky-600 font-bold hover:text-sky-700 transition"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Sort By Time: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          <ArrowUpDown className="w-3 h-3" />
        </button>
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/20 rounded-2xl border border-dashed border-slate-100 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-slate-100 text-slate-400 rounded-full">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">No logs match your filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or filters.</p>
          </div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActionFilter('All');
              setTypeFilter('All');
            }}
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Logs Table List */
        <div className="overflow-hidden border border-slate-100 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold tracking-wider uppercase border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">Activity Time</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Coordinator / Admin</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Action</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Entity Type</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Target Record</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">Change Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivities.map((act) => {
                  const isDelete = act.actionType === 'Deletion';
                  const isMember = act.targetType === 'Member';
                  
                  return (
                    <tr key={act.id} className="hover:bg-slate-50/40 transition-all">
                      {/* Formatted Date */}
                      <td className="px-5 py-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatTimestamp(act.timestamp)}
                      </td>
                      
                      {/* Coordinator Email Details */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{act.userEmail}</span>
                          <span className="font-mono text-[10px] text-slate-400">UID: {act.userId}</span>
                        </div>
                      </td>

                      {/* Action Pill Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          isDelete 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {isDelete ? <Trash2 className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
                          {act.actionType}
                        </span>
                      </td>

                      {/* Target Entity Type Icon + Text */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          {isMember ? (
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                          )}
                          {act.targetType}
                        </span>
                      </td>

                      {/* Target Record Description and ID */}
                      <td className="px-5 py-4 max-w-[200px] truncate">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800" title={act.targetName}>
                            {act.targetName || 'N/A'}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 truncate" title={act.targetId}>
                            ID: {act.targetId}
                          </span>
                        </div>
                      </td>

                      {/* Custom Details Description */}
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-medium">
                          {act.details}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
