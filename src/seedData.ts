import { Member, Department, Event, Finance, Attendance, VolunteerSchedule, Announcement, ChatMessage, EventFeedback } from './types';

export const SEED_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    name: 'Praise Bankole',
    email: 'bankolepraise3@gmail.com',
    phone: '+234 812 345 6789',
    department: 'Choir',
    role: 'Music Director & Keyboardist',
    status: 'Active',
    registeredAt: '2026-04-15T09:00:00.000Z',
    notes: 'Plays the Nord keyboard in the primary worship band. Conducts vocal rehearsals on Saturdays.'
  },
  {
    id: 'mem_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 321-9876',
    department: 'Choir',
    role: 'Soprano Lead',
    status: 'Active',
    registeredAt: '2026-04-18T10:30:00.000Z',
    notes: 'Incredible range. Leads solos on standard Sunday praise sets.'
  },
  {
    id: 'mem_3',
    name: 'John Doe',
    email: 'john.usher@example.com',
    phone: '+1 (555) 789-0123',
    department: 'Ushers',
    role: 'Lead Usher',
    status: 'Active',
    registeredAt: '2026-05-02T08:15:00.000Z',
    notes: 'Handles visual coordination of seating for main services. Highly reliable.'
  },
  {
    id: 'mem_4',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Media',
    role: 'AV Technician',
    status: 'Active',
    registeredAt: '2026-05-10T14:00:00.000Z',
    notes: 'Manages live streams, OBS routing, sermon lyric projection slides, and lighting desk cue levels.'
  },
  {
    id: 'mem_5',
    name: 'Deborah Cole',
    email: 'deborah.c@example.com',
    phone: '+1 (555) 901-2345',
    department: 'Choir',
    role: 'Alto Vocalist',
    status: 'Active',
    registeredAt: '2026-05-24T11:45:00.000Z',
    notes: 'Vocal coach alternate. Attends all standard morning prayers.'
  },
  {
    id: 'mem_6',
    name: 'Rev. Mark Peterson',
    email: 'pastor.mark@example.com',
    phone: '+1 (555) 111-2222',
    department: 'None',
    role: 'Lead Pastor',
    status: 'Active',
    registeredAt: '2026-01-01T08:00:00.000Z',
    notes: 'Primary pastoral support. Delivers sermons and coordinates ministry leads.'
  },
  {
    id: 'mem_7',
    name: 'Brooke Evans',
    email: 'b.evans@example.com',
    phone: '+1 (555) 333-4444',
    department: 'Ushers',
    role: 'Greeter',
    status: 'Active',
    registeredAt: '2026-06-01T09:15:00.000Z',
    notes: 'Greets members in the main lobby with bulletins. Energetic and welcoming.'
  }
];

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: 'dept_choir',
    name: 'Choir',
    leaderName: 'Praise Bankole',
    leaderId: 'mem_1',
    description: 'Provides worship music and guides the congregation into holy alignment with musical and spiritual excellence. Meets weekly for intense keyboard guides and vocal reviews.',
    meetingTime: 'Saturdays at 4:30 PM'
  },
  {
    id: 'dept_ushers',
    name: 'Ushers',
    leaderName: 'John Doe',
    leaderId: 'mem_3',
    description: 'Ensuring absolute structural organization, sanctuary decorum, secure offering collections, and warm greetings to secure an inviting atmosphere in the temple house.',
    meetingTime: 'Sundays at 7:45 AM'
  },
  {
    id: 'dept_media',
    name: 'Media',
    leaderName: 'Michael Chen',
    leaderId: 'mem_4',
    description: 'Manages live streams, sermon slide graphics, sound desk operations, professional stage illumination, social media posts, and sound wave recording backups.',
    meetingTime: 'Wednesdays at 6:00 PM'
  }
];

export const SEED_EVENTS: Event[] = [
  {
    id: 'evt_1',
    title: 'Sunday Worship Encounter',
    description: 'Main corporate service with praise sessions led by the choir, corporate prayer, communion, and standard biblical sermons.',
    dateTime: '2026-06-21T09:00:00.000Z',
    location: 'Main Sanctuary',
    category: 'Sunday Service',
    registrationsCount: 124,
    createdAt: '2026-06-01T12:00:00.000Z'
  },
  {
    id: 'evt_2',
    title: 'Midweek Power Study & Communion',
    description: 'Diving deep into specific theology and building strong spiritual foundations, concluding with dynamic small group prayer circles.',
    dateTime: '2026-06-24T18:30:00.000Z',
    location: 'Fellowship Hall',
    category: 'Midweek',
    registrationsCount: 45,
    createdAt: '2026-06-01T12:00:00.000Z'
  },
  {
    id: 'evt_3',
    title: 'Youth Fire Encounter Conference',
    description: 'Impactful youth-centric gathering featuring acoustic keyboard chords, modern panel Q&As, and an encouraging campfire social.',
    dateTime: '2026-06-27T17:00:00.000Z',
    location: 'Youth Center Gym',
    category: 'Youth',
    registrationsCount: 68,
    createdAt: '2026-06-10T11:00:00.000Z'
  }
];

export const SEED_FINANCES: Finance[] = [
  {
    id: 'fin_1',
    type: 'Tithe',
    amount: 1200,
    date: '2026-06-07',
    donorName: 'Anonymous Member',
    memberId: 'mem_2',
    notes: 'Faithful June tithes.',
    recordedBy: 'Admin Staff',
    recordedAt: '2026-06-07T11:30:00.000Z'
  },
  {
    id: 'fin_2',
    type: 'Offering',
    amount: 450,
    date: '2026-06-07',
    donorName: 'Sunday Congregation',
    memberId: '',
    notes: 'First corporate Sunday response basket.',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-07T12:15:00.000Z'
  },
  {
    id: 'fin_3',
    type: 'Donation',
    amount: 2500,
    date: '2026-06-10',
    donorName: 'Praise Bankole',
    memberId: 'mem_1',
    notes: 'Contribution towards the new stage studio speakers & worship microphone set.',
    recordedBy: 'Pastor Peterson',
    recordedAt: '2026-06-10T16:00:00.000Z'
  },
  {
    id: 'fin_4',
    type: 'Tithe',
    amount: 850,
    date: '2026-06-11',
    donorName: 'Sarah Jenkins',
    memberId: 'mem_2',
    notes: 'Monthly standard tithe.',
    recordedBy: 'Admin Staff',
    recordedAt: '2026-06-11T09:45:00.000Z'
  },
  {
    id: 'fin_5',
    type: 'Offering',
    amount: 512,
    date: '2026-06-14',
    donorName: 'Sunday Congregation',
    memberId: '',
    notes: 'Seeding basket offerings - 2nd general call.',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-14T12:00:00.000Z'
  },
  {
    id: 'fin_6',
    type: 'Tithe',
    amount: 1400,
    date: '2026-06-14',
    donorName: 'Michael Chen',
    memberId: 'mem_4',
    notes: 'Thankful blessings contribution.',
    recordedBy: 'Admin Staff',
    recordedAt: '2026-06-14T12:30:00.000Z'
  }
];

export const SEED_ATTENDANCE: Attendance[] = [
  // Sunday Attendance (last week)
  {
    id: 'att_1',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    date: '2026-06-14',
    memberId: 'mem_1',
    memberName: 'Praise Bankole',
    status: 'Present',
    recordedBy: 'Sarah Jenkins',
    recordedAt: '2026-06-14T09:15:00.000Z'
  },
  {
    id: 'att_2',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    date: '2026-06-14',
    memberId: 'mem_2',
    memberName: 'Sarah Jenkins',
    status: 'Present',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-14T09:16:00.000Z'
  },
  {
    id: 'att_3',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    date: '2026-06-14',
    memberId: 'mem_3',
    memberName: 'John Doe',
    status: 'Present',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-14T09:10:00.000Z'
  },
  {
    id: 'att_4',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    date: '2026-06-14',
    memberId: 'mem_4',
    memberName: 'Michael Chen',
    status: 'Present',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-14T09:12:00.000Z'
  },
  {
    id: 'att_5',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    date: '2026-06-14',
    memberId: 'mem_5',
    memberName: 'Deborah Cole',
    status: 'Excused',
    recordedBy: 'John Doe',
    recordedAt: '2026-06-14T09:20:00.000Z'
  }
];

export const SEED_VOLUNTEER_SCHEDULES: VolunteerSchedule[] = [
  {
    id: 'sched_1',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    dateTime: '2026-06-21T09:00:00.000Z',
    roleName: 'Lead Keyboardist',
    memberId: 'mem_1',
    memberName: 'Praise Bankole',
    memberEmail: 'bankolepraise3@gmail.com',
    status: 'Confirmed',
    requirements: 'Rehearse keyboard vocal chords Saturday 4:30 PM. Power on the dual Stage Nord layers.'
  },
  {
    id: 'sched_2',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    dateTime: '2026-06-21T09:00:00.000Z',
    roleName: 'Primary Soprano Solos',
    memberId: 'mem_2',
    memberName: 'Sarah Jenkins',
    memberEmail: 'sarah.j@example.com',
    status: 'Assigned',
    requirements: 'Wear the Choir blue custom robes. Be at the stage tuning booth by 8:15 AM.'
  },
  {
    id: 'sched_3',
    eventId: 'evt_2',
    eventTitle: 'Midweek Power Study & Communion',
    dateTime: '2026-06-24T18:30:00.000Z',
    roleName: 'Sound Desk Operator',
    memberId: 'mem_4',
    memberName: 'Michael Chen',
    memberEmail: 'm.chen@example.com',
    status: 'Confirmed',
    requirements: 'Perform handheld wireless mic gains checks. Secure standard broadcast line feed streams.'
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Mid-Year Sanctuary Restoration Campaign',
    content: 'We are launching our mid-year prayer initiative. We require additional volunteer support for stage microphone setups and door greeters. Please register availability in the registry scheduler.',
    senderName: 'Rev. Mark Peterson',
    senderEmail: 'pastor.mark@example.com',
    category: 'General',
    createdAt: '2026-06-15T12:00:00.000Z'
  },
  {
    id: 'ann_2',
    title: 'CHOIR HARMONY TIME RE-ALIGNMENT',
    content: 'Saturday preparatory vocal harmonies practice is rescheduled to 4:45 PM. Group chord configurations will be completed before standard corporate prayers.',
    senderName: 'Praise Bankole',
    senderEmail: 'bankolepraise3@gmail.com',
    category: 'Urgent',
    createdAt: '2026-06-18T16:30:00.000Z'
  }
];

export const SEED_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    groupId: 'general',
    groupName: 'General Saints Channel',
    senderId: 'mem_1',
    senderName: 'Praise Bankole',
    senderEmail: 'bankolepraise3@gmail.com',
    content: 'Welcome saints to our interactive Sanctuary secure channel! Let us keep our communications aligned with spiritual and administrative excellence.',
    createdAt: '2026-06-19T10:00:00.000Z'
  },
  {
    id: 'msg_2',
    groupId: 'Choir',
    groupName: 'Choir Department',
    senderId: 'mem_1',
    senderName: 'Praise Bankole',
    senderEmail: 'bankolepraise3@gmail.com',
    content: 'Vocal leads - please review the midi guide chord progressions before Saturday afternoon reviews.',
    createdAt: '2026-06-19T14:30:00.000Z'
  },
  {
    id: 'msg_3',
    groupId: 'Choir',
    groupName: 'Choir Department',
    senderId: 'mem_2',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@example.com',
    content: 'Copied Bro Praise! The Alto and Soprano sections have matched our vocal guides successfully.',
    createdAt: '2026-06-19T15:00:00.000Z'
  }
];

export const SEED_FEEDBACKS: EventFeedback[] = [
  {
    id: 'feed_1',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    rating: 5,
    comment: 'The worship acoustics and song selections were incredibly aligned with the spirit of the sermon. Beautifully coordinated experience.',
    submitterName: 'Sarah Jenkins',
    submitterEmail: 'sarah.j@example.com',
    createdAt: '2026-06-15T13:00:00.000Z'
  },
  {
    id: 'feed_2',
    eventId: 'evt_1',
    eventTitle: 'Sunday Worship Encounter',
    rating: 4,
    comment: 'Strong sermon outlines by Reverend Mark. Seat support in row B was somewhat tight, but the ushers accommodated late arrivals wonderfully.',
    submitterName: 'John Doe',
    submitterEmail: 'john.usher@example.com',
    createdAt: '2026-06-15T14:00:00.000Z'
  }
];

