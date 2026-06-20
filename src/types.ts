export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'Choir' | 'Ushers' | 'Media' | 'None' | string;
  role: string; // e.g. Lead, Alternate, Member, None
  status: 'Active' | 'Inactive';
  registeredAt: string;
  notes: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  memberId: string;
  memberName: string;
  status: 'Present' | 'Absent' | 'Excused';
  recordedBy: string;
  recordedAt: string;
}

export interface Finance {
  id: string;
  type: 'Tithe' | 'Offering' | 'Donation' | 'Other';
  amount: number;
  date: string;
  donorName: string;
  memberId: string; // Connects to a member if available
  notes: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Department {
  id: string;
  name: 'Choir' | 'Ushers' | 'Media' | string;
  leaderName: string;
  leaderId: string; // memberId
  description: string;
  meetingTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  category: 'Sunday Service' | 'Midweek' | 'Youth' | 'Special' | string;
  registrationsCount: number;
  createdAt: string;
}

export interface ChurchStats {
  totalMembers: number;
  activeMembers: number;
  weeklyAttendanceRate: number;
  monthlyFinances: {
    total: number;
    tithes: number;
    offerings: number;
    donations: number;
  };
}
