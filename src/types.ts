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

export interface VolunteerSchedule {
  id: string;
  eventId: string;
  eventTitle: string;
  dateTime: string;
  roleName: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: 'Assigned' | 'Confirmed' | 'Declined';
  requirements: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  senderEmail: string;
  category: 'General' | 'Urgent' | 'Ministry';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  groupName: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  createdAt: string;
}

export interface EventFeedback {
  id: string;
  eventId: string;
  eventTitle: string;
  rating: number; // 1 to 5
  comment: string;
  submitterName: string;
  submitterEmail: string;
  createdAt: string;
}

