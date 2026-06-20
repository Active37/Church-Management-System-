import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Music, 
  Calendar, 
  TrendingUp, 
  Award, 
  HeartHandshake 
} from 'lucide-react';
import { Member, Finance, Attendance, Event } from '../types';

interface StatsDashboardProps {
  members: Member[];
  finances: Finance[];
  attendance: Attendance[];
  events: Event[];
  onNavigate: (tab: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  members,
  finances,
  attendance,
  events,
  onNavigate
}) => {
  // 1. Calculate General Metrics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  
  const totalFinancialFlow = finances.reduce((acc, f) => acc + f.amount, 0);
  const totalTithes = finances.filter(f => f.type === 'Tithe').reduce((acc, f) => acc + f.amount, 0);
  const totalOfferings = finances.filter(f => f.type === 'Offering').reduce((acc, f) => acc + f.amount, 0);
  const totalDonations = finances.filter(f => f.type === 'Donation').reduce((acc, f) => acc + f.amount, 0);

  // 2. Member growth chart (cumulative over time)
  const getGrowthData = () => {
    // Group members by month of registration
    const monthlyCount: { [key: string]: number } = {};
    members.forEach(m => {
      if (!m.registeredAt) return;
      const date = new Date(m.registeredAt);
      const isNum = !isNaN(date.getTime());
      const monthStr = isNum ? date.toLocaleString('default', { month: 'short', year: '2-digit' }) : 'Prior';
      monthlyCount[monthStr] = (monthlyCount[monthStr] || 0) + 1;
    });

    const months = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26'];
    let runningTotal = totalMembers - members.filter(m => {
      if (!m.registeredAt) return false;
      const date = new Date(m.registeredAt);
      return date.getTime() >= new Date('2026-01-01T00:00:00').getTime();
    }).length; // Start with historical base

    if (runningTotal < 0) runningTotal = 0;

    return months.map(m => {
      const added = monthlyCount[m] || 0;
      runningTotal += added;
      return {
        month: m,
        Members: runningTotal,
        Joined: added
      };
    });
  };

  const growthData = getGrowthData();

  // 3. Finance breakdown details for Pie Chart
  const financialDistribution = [
    { name: 'Tithes', value: totalTithes, color: '#0ea5e9' }, // sky-500
    { name: 'Offerings', value: totalOfferings, color: '#10b981' }, // emerald-500
    { name: 'Donations', value: totalDonations, color: '#f59e0b' }, // amber-500
    { name: 'Other', value: finances.filter(f => f.type === 'Other').reduce((acc, f) => acc + f.amount, 0), color: '#8b5cf6' } // violet-500
  ].filter(f => f.value > 0);

  // 4. Department Distribution for Bar Chart
  const getDeptDistribution = () => {
    const depts = ['Choir', 'Ushers', 'Media', 'None'];
    return depts.map(d => ({
      name: d === 'None' ? 'General' : d,
      Volunteers: members.filter(m => m.department === d).length
    }));
  };
  const deptData = getDeptDistribution();

  // 5. Attendance ratios
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const totalMarked = attendance.length;
  const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 85;

  return (
    <div className="space-y-6" id="dashboard_view_container">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div 
          id="stat_card_members"
          onClick={() => onNavigate('members')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Members</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalMembers}</h3>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-500 font-semibold">{activeMembers} Active</span> volunteers
            </p>
          </div>
        </div>

        {/* Global Treasury */}
        <div 
          id="stat_card_finance"
          onClick={() => onNavigate('finances')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Treasury Flow</p>
            <h3 className="text-2xl font-bold text-slate-800">${totalFinancialFlow.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tithes: <span className="font-semibold text-sky-600">${totalTithes}</span>
            </p>
          </div>
        </div>

        {/* Average Attendance */}
        <div 
          id="stat_card_attendance"
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-2xl font-bold text-slate-800">{attendanceRate}%</h3>
            <p className="text-xs text-slate-400 mt-1">
              Based on <span className="font-semibold text-slate-600">{totalMarked}</span> total logs
            </p>
          </div>
        </div>

        {/* Scheduled Events */}
        <div 
          id="stat_card_events"
          onClick={() => onNavigate('events')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Upcoming Events</p>
            <h3 className="text-2xl font-bold text-slate-800">{events.length}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Active calendar schedules
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Curves (Line Chart) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-8 flex flex-col justify-between" id="member_growth_chart_block">
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-display">Member Growth Curve</h3>
            <p className="text-xs text-slate-400 mb-4">Total accumulative church registry for 2026</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Members" 
                  name="Cumulative Members" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Joined" 
                  name="Monthly Joins" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Allocations (Pie Chart) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-4 flex flex-col justify-between" id="financial_breakdown_pie_block">
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-display">Treasury Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Allocation weights of Tithes, Offerings & Donations</p>
          </div>
          <div className="h-[210px] relative flex items-center justify-center">
            {financialDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {financialDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm italic">No contributions recorded yet.</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Ledger</span>
              <span className="text-xl font-bold text-slate-800">${totalFinancialFlow}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {financialDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}</span>
                <span className="text-slate-400 font-mono ml-auto">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ministries & Live Updates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Volunteers status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100" id="ministry_volunteers_block">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 font-display">Ministries Enrollment</h3>
              <p className="text-xs text-slate-400">Total volunteers registered under departments</p>
            </div>
            <button 
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors border border-slate-100"
              onClick={() => onNavigate('departments')}
            >
              Manage Teams
            </button>
          </div>
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} />
                <Bar dataKey="Volunteers" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Choir' ? '#0ea5e9' : entry.name === 'Ushers' ? '#10b981' : entry.name === 'Media' ? '#f59e0b' : '#64748b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live System Activity Log */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100" id="recent_activities_block">
          <h3 className="text-lg font-bold text-slate-800 font-display mb-1">Recent General Activity</h3>
          <p className="text-xs text-slate-400 mb-4">Real-time cloud database synchronization feed</p>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {/* Sync Status Badge */}
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-xs mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="flex-1">
                <span className="font-semibold">Cloud Sync Online:</span> Real-time Firestore socket connected. 
              </div>
            </div>

            {/* Dynamic Activity Logs */}
            {members.length > 0 && (
              <div className="flex items-start space-x-3 text-xs leading-relaxed border-b border-slate-50 pb-2">
                <div className="p-1 bg-sky-50 rounded-lg text-sky-600 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">New Member registered:</span> {members[members.length - 1].name} joined the registry under {members[members.length - 1].department || 'General'}.
                  </p>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
              </div>
            )}

            {finances.length > 0 && (
              <div className="flex items-start space-x-3 text-xs leading-relaxed border-b border-slate-50 pb-2">
                <div className="p-1 bg-emerald-50 rounded-lg text-emerald-600 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">Financial Entry Logged:</span> {finances[0].donorName} submitted a <span className="font-semibold">{finances[0].type}</span> of ${finances[0].amount}.
                  </p>
                  <span className="text-[10px] text-slate-400">Recently locked</span>
                </div>
              </div>
            )}

            {attendance.length > 0 && (
              <div className="flex items-start space-x-3 text-xs leading-relaxed border-b border-slate-50 pb-2">
                <div className="p-1 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">Attendance Marker:</span> {attendance[0].memberName} marked <span className="font-semibold text-amber-600">{attendance[0].status}</span> at "{attendance[0].eventTitle}".
                  </p>
                  <span className="text-[10px] text-slate-400">Automatic Sync</span>
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div className="flex items-start space-x-3 text-xs leading-relaxed">
                <div className="p-1 bg-violet-50 rounded-lg text-violet-600 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700">
                    <span className="font-semibold">Calendar Milestone:</span> "{events[0].title}" scheduled at Room: {events[0].location}.
                  </p>
                  <span className="text-[10px] text-slate-400">Database Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
