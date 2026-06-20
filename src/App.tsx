import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  logoutUser, 
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  OperationType,
  handleFirestoreError
} from './firebase';
import { 
  Member, 
  Department, 
  Event, 
  Finance, 
  Attendance,
  VolunteerSchedule,
  Announcement,
  ChatMessage,
  EventFeedback
} from './types';
import { 
  SEED_MEMBERS, 
  SEED_DEPARTMENTS, 
  SEED_FINANCES, 
  SEED_ATTENDANCE, 
  SEED_EVENTS,
  SEED_VOLUNTEER_SCHEDULES,
  SEED_ANNOUNCEMENTS,
  SEED_CHAT_MESSAGES,
  SEED_FEEDBACKS
} from './seedData';

// Views
import { StatsDashboard } from './components/StatsDashboard';
import { MembersList } from './components/MembersList';
import { AttendanceTracker } from './components/AttendanceTracker';
import { FinanceManager } from './components/FinanceManager';
import { DepartmentsManager } from './components/DepartmentsManager';
import { EventsManager } from './components/EventsManager';
import { VolunteerScheduler } from './components/VolunteerScheduler';
import { CommunicationHub } from './components/CommunicationHub';
import { EventFeedbackSystem } from './components/EventFeedbackSystem';

// Lucide Icons
import { 
  Users, 
  Music, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut, 
  LayoutDashboard, 
  Database,
  Grid,
  CheckCircle,
  Sparkles,
  BookOpen,
  Megaphone,
  UserCheck,
  Smile,
  Volume2
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Live database states
  const [members, setMembers] = useState<Member[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [schedules, setSchedules] = useState<VolunteerSchedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [feedbacks, setFeedbacks] = useState<EventFeedback[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Connection validation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Real-time Firestore synchronizations
  useEffect(() => {
    if (!currentUser) return;

    setDbLoading(true);

    const unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Member);
      setMembers(data);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'members'));

    const unsubDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Department);
      setDepartments(data);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'departments'));

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Event);
      // Sort upcoming events by date
      setEvents(data.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

    const unsubFinances = onSnapshot(collection(db, 'finances'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Finance);
      // Sort finance transactions newest first
      setFinances(data.sort((a,b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'finances'));

    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Attendance);
      setAttendance(data);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'attendance'));

    const unsubSchedules = onSnapshot(collection(db, 'volunteer_schedules'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as VolunteerSchedule);
      setSchedules(data);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'volunteer_schedules'));

    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Announcement);
      setAnnouncements(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'announcements'));

    const unsubChats = onSnapshot(collection(db, 'chats'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as ChatMessage);
      setChatMessages(data.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'chats'));

    const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as EventFeedback);
      setFeedbacks(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setDbLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'feedbacks'));

    return () => {
      unsubMembers();
      unsubDepts();
      unsubEvents();
      unsubFinances();
      unsubAttendance();
      unsubSchedules();
      unsubAnnouncements();
      unsubChats();
      unsubFeedbacks();
    };
  }, [currentUser]);

  // Handle Seeding of Demo Data
  const handleSeedDatabase = async () => {
    try {
      setDbLoading(true);
      // Seed Members
      for (const m of SEED_MEMBERS) {
        await createDocument('members', m);
      }
      // Seed Departments
      for (const d of SEED_DEPARTMENTS) {
        await createDocument('departments', d);
      }
      // Seed Events
      for (const e of SEED_EVENTS) {
        await createDocument('events', e);
      }
      // Seed Finances
      for (const f of SEED_FINANCES) {
        await createDocument('finances', f);
      }
      // Seed Attendance
      for (const a of SEED_ATTENDANCE) {
        await createDocument('attendance', a);
      }
      // Seed Volunteer Schedules
      for (const s of SEED_VOLUNTEER_SCHEDULES) {
        await createDocument('volunteer_schedules', s);
      }
      // Seed Announcements
      for (const an of SEED_ANNOUNCEMENTS) {
        await createDocument('announcements', an);
      }
      // Seed Chats
      for (const c of SEED_CHAT_MESSAGES) {
        await createDocument('chats', c);
      }
      // Seed Feedbacks
      for (const f of SEED_FEEDBACKS) {
        await createDocument('feedbacks', f);
      }
      alert('Vault seeded beautifully with high-fidelity workspace records!');
    } catch (error) {
      console.error('Seeding error:', error);
      alert('Failed to seed. Please check database configuration details.');
    } finally {
      setDbLoading(false);
    }
  };

  // --- CRUD Event Handlers ---

  const handleAddMember = async (payload: Omit<Member, 'id' | 'registeredAt'>) => {
    const id = `mem_${Date.now()}`;
    const newMember: Member = {
      ...payload,
      id,
      registeredAt: new Date().toISOString()
    };
    await createDocument<Member>('members', newMember);
  };

  const handleUpdateMember = async (id: string, updates: Partial<Member>) => {
    await updateDocument<Member>('members', id, updates);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this member profile?')) {
      await deleteDocument('members', id);
    }
  };

  const handleAddFinance = async (payload: Omit<Finance, 'id' | 'recordedBy' | 'recordedAt'>) => {
    const id = `fin_${Date.now()}`;
    const newTx: Finance = {
      ...payload,
      id,
      recordedBy: currentUser?.displayName || currentUser?.email || 'Authorized admin',
      recordedAt: new Date().toISOString()
    };
    await createDocument<Finance>('finances', newTx);
  };

  const handleSaveAttendance = async (records: Omit<Attendance, 'id' | 'recordedBy' | 'recordedAt'>[]) => {
    for (const item of records) {
      const id = `att_${Date.now()}_${item.memberId}_${item.eventId}`;
      const newAttendance: Attendance = {
        ...item,
        id,
        recordedBy: currentUser?.displayName || currentUser?.email || 'Staff',
        recordedAt: new Date().toISOString()
      };
      await createDocument<Attendance>('attendance', newAttendance);
    }
  };

  const handleUpdateDepartment = async (id: string, updates: Partial<Department>) => {
    await updateDocument<Department>('departments', id, updates);
  };

  const handleAddEvent = async (payload: Omit<Event, 'id' | 'registrationsCount' | 'createdAt'>) => {
    const id = `evt_${Date.now()}`;
    const newEvent: Event = {
      ...payload,
      id,
      registrationsCount: 0,
      createdAt: new Date().toISOString()
    };
    await createDocument<Event>('events', newEvent);
  };

  const handleUpdateEvent = async (id: string, updates: Partial<Event>) => {
    await updateDocument<Event>('events', id, updates);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to cancel this event schedule?')) {
      await deleteDocument('events', id);
    }
  };

  const handleAddSchedule = async (payload: Omit<VolunteerSchedule, 'id'>) => {
    const id = `sched_${Date.now()}`;
    const newSched: VolunteerSchedule = {
      ...payload,
      id
    };
    await createDocument<VolunteerSchedule>('volunteer_schedules', newSched);
  };

  const handleUpdateSchedule = async (id: string, updates: Partial<VolunteerSchedule>) => {
    await updateDocument<VolunteerSchedule>('volunteer_schedules', id, updates);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (confirm('Are you sure you want to delete this volunteer assignment?')) {
      await deleteDocument('volunteer_schedules', id);
    }
  };

  const handleAddAnnouncement = async (payload: Omit<Announcement, 'id' | 'createdAt'>) => {
    const id = `ann_${Date.now()}`;
    const newAnn: Announcement = {
      ...payload,
      id,
      createdAt: new Date().toISOString()
    };
    await createDocument<Announcement>('announcements', newAnn);
  };

  const handleAddChatMessage = async (payload: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const id = `msg_${Date.now()}`;
    const newMsg: ChatMessage = {
      ...payload,
      id,
      createdAt: new Date().toISOString()
    };
    await createDocument<ChatMessage>('chats', newMsg);
  };

  const handleAddFeedback = async (payload: Omit<EventFeedback, 'id' | 'createdAt'>) => {
    const id = `feed_${Date.now()}`;
    const newFeedback: EventFeedback = {
      ...payload,
      id,
      createdAt: new Date().toISOString()
    };
    await createDocument<EventFeedback>('feedbacks', newFeedback);
  };

  // Auth screen layout
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-4">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Accessing Vault records...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4" id="login_screen">
        <div className="bg-white/80 border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-300 backdrop-blur-md">
          {/* Brand Logo Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-sky-50 rounded-2xl text-sky-600 shadow-xs">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">Worship Temple</h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[85%] mx-auto">
              Fault-Tolerant Church Management System. Synchronize attendance, ministries, team schedules, and tithing ledgers flawlessly.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left space-y-1.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Authorization level</span>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span>Multi-Admin Secure Access Gateway Enabled</span>
            </p>
          </div>

          {/* Login Action */}
          <button 
            id="btn_google_login"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm group cursor-pointer"
          >
            {/* Google Vector Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" width="24" height="24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.637 0-8.4-3.763-8.4-8.4s3.763-8.4 8.4-8.4c2.25 0 4.185.836 5.674 2.227l3.12-3.12C18.66 1.09 15.682 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.52-4.89 11.52-11.76 0-.82-.08-1.56-.24-2.22L12.24 10.285z"/>
            </svg>
            <span className="text-sm">Sign In with Google</span>
          </button>

          <p className="text-[10px] text-slate-400">Authenticates secure session tokens using Google Identity Services.</p>
        </div>
      </div>
    );
  }

  // Database is successfully loaded
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50" id="main_app_layout">
      {/* Dynamic Desktop Sidebar / Navigation Rail */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between">
        <div className="p-6 space-y-6">
          {/* Brand header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500 rounded-xl text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight font-display">Temple Sanctum</h2>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Operations Hub</span>
            </div>
          </div>

          {/* Database seeding alert box if vault is empty */}
          {members.length === 0 && !dbLoading && (
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 space-y-2">
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">Vessel Empty</span>
              <p className="text-[10px] text-slate-300 leading-normal font-medium">No records found. Seed beautiful worship sandbox data instantly:</p>
              <button 
                onClick={handleSeedDatabase}
                className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] rounded-lg transition-colors border border-sky-400/20"
              >
                Seed Sandbox Data
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1" id="sidebar_nav">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Analytics</span>
            </button>

            <button 
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'members' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Worshipper Registry</span>
            </button>

            <button 
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'attendance' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Service Attendance</span>
            </button>

            <button 
              onClick={() => setActiveTab('finances')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'finances' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Treasury Ledgers</span>
            </button>

            <button 
              onClick={() => setActiveTab('departments')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'departments' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Ministries/Teams</span>
            </button>

            <button 
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'events' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar Schedules</span>
            </button>

            <div className="pt-4 pb-1 border-t border-slate-800/60 my-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest px-4 block">Coordinators Hub</span>
            </div>

            <button 
              onClick={() => setActiveTab('schedules')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'schedules' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Volunteer Duties</span>
            </button>

            <button 
              onClick={() => setActiveTab('comms')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'comms' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Communication Hub</span>
            </button>

            <button 
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'feedback' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Event Feedback Map</span>
            </button>
          </nav>
        </div>

        {/* User Card & LogOut */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 space-y-4">
          <div className="flex items-center space-x-3">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Admin profile" referrerPolicy="no-referrer" className="w-9 h-9 rounded-xl border border-slate-700 shadow-xs" />
            ) : (
              <div className="w-9 h-9 bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center font-bold text-sm">
                {currentUser.displayName ? currentUser.displayName[0] : 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-200">{currentUser.displayName || 'Authorized Admin'}</p>
              <span className="text-[10px] text-slate-400 truncate block font-mono">{currentUser.email}</span>
            </div>
          </div>

          <button 
            id="btn_logout"
            onClick={logoutUser}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800/60 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 font-bold text-xs rounded-xl transition-all border border-slate-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Container Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Loading Indicator */}
        {dbLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-3">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-semibold tracking-wider">Synchronizing Live cloud vaults...</span>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {activeTab === 'dashboard' && (
              <StatsDashboard 
                members={members}
                finances={finances}
                attendance={attendance}
                events={events}
                onNavigate={setActiveTab}
              />
            )}
            {activeTab === 'members' && (
              <MembersList 
                members={members}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
              />
            )}
            {activeTab === 'attendance' && (
              <AttendanceTracker 
                members={members}
                events={events}
                attendance={attendance}
                onSaveAttendance={handleSaveAttendance}
              />
            )}
            {activeTab === 'finances' && (
              <FinanceManager 
                finances={finances}
                members={members}
                onAddFinance={handleAddFinance}
              />
            )}
            {activeTab === 'departments' && (
              <DepartmentsManager 
                departments={departments}
                members={members}
                onUpdateDepartment={handleUpdateDepartment}
              />
            )}
            {activeTab === 'events' && (
              <EventsManager 
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
            {activeTab === 'schedules' && (
              <VolunteerScheduler 
                schedules={schedules}
                members={members}
                events={events}
                currentUserEmail={currentUser?.email}
                onAddSchedule={handleAddSchedule}
                onUpdateSchedule={handleUpdateSchedule}
                onDeleteSchedule={handleDeleteSchedule}
              />
            )}
            {activeTab === 'comms' && (
              <CommunicationHub 
                announcements={announcements}
                chatMessages={chatMessages}
                members={members}
                currentUserEmail={currentUser?.email}
                currentUserName={currentUser?.displayName}
                onAddAnnouncement={handleAddAnnouncement}
                onAddChatMessage={handleAddChatMessage}
              />
            )}
            {activeTab === 'feedback' && (
              <EventFeedbackSystem 
                events={events}
                feedbacks={feedbacks}
                currentUserEmail={currentUser?.email}
                currentUserName={currentUser?.displayName}
                onAddFeedback={handleAddFeedback}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
