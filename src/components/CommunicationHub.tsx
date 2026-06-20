import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  MessageSquare, 
  Send, 
  Bell, 
  Sparkles, 
  Search, 
  Volume2, 
  Plus, 
  X, 
  Check, 
  Users, 
  User, 
  BellRing, 
  AlertTriangle 
} from 'lucide-react';
import { Announcement, ChatMessage, Member } from '../types';

interface CommunicationHubProps {
  announcements: Announcement[];
  chatMessages: ChatMessage[];
  members: Member[];
  currentUserEmail: string | null;
  currentUserName: string | null;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  onAddChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => Promise<void>;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  announcements,
  chatMessages,
  members,
  currentUserEmail,
  currentUserName,
  onAddAnnouncement,
  onAddChatMessage
}) => {
  const [activeHubTab, setActiveHubTab] = useState<'announcements' | 'groups' | 'dms' | 'notify'>('announcements');
  
  // Announcement composition state
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [aTitle, setATitle] = useState('');
  const [aCategory, setACategory] = useState<'General' | 'Urgent' | 'Ministry'>('General');
  const [aContent, setAContent] = useState('');

  // Chat message state
  const [selectedGroupId, setSelectedGroupId] = useState('general');
  const [selectedGroupName, setSelectedGroupName] = useState('General Saints');
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // DM state
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [typedDM, setTypedDM] = useState('');
  const dmEndRef = useRef<HTMLDivElement>(null);

  // Notifications simulation state
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermitted, setPushPermitted] = useState('default');
  const [alertCategory, setAlertCategory] = useState<'all' | 'urgent' | 'none'>('all');

  useEffect(() => {
    // Attempt checking native browser support info
    if ('Notification' in window) {
      setPushPermitted(Notification.permission);
      if (Notification.permission === 'granted') {
        setPushEnabled(true);
      }
    }
  }, []);

  // auto scroll list
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedGroupId]);

  useEffect(() => {
    dmEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedRecipientId]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim() || !aContent.trim()) return;

    await onAddAnnouncement({
      title: aTitle.trim(),
      content: aContent.trim(),
      category: aCategory,
      senderName: currentUserName || 'Temple Admin',
      senderEmail: currentUserEmail || ''
    });

    setATitle('');
    setAContent('');
    setSelectedGroupId('general'); // switch
    setIsAnnounceModalOpen(false);

    // Trigger local push notification test if enabled
    triggerLocalPushNotification(`[Announced] ${aTitle}`, aContent);
    alert('Announcement published successfully to all dashboards.');
  };

  const handleSendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    // Sender details
    const currentMember = members.find(m => m.email.toLowerCase() === (currentUserEmail || '').toLowerCase());
    const senderId = currentMember?.id || 'admin_user';

    await onAddChatMessage({
      groupId: selectedGroupId,
      groupName: selectedGroupName,
      senderId,
      senderName: currentUserName || currentMember?.name || 'Authorized User',
      senderEmail: currentUserEmail || '',
      content: typedMessage.trim()
    });

    setTypedMessage('');
  };

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedDM.trim() || !selectedRecipientId) return;

    const currentMember = members.find(m => m.email.toLowerCase() === (currentUserEmail || '').toLowerCase());
    const senderId = currentMember?.id || 'admin_user';

    // Composition DM key 'dm_sorted(id1, id2)'
    const sortedIds = [senderId, selectedRecipientId].sort();
    const dmGroupId = `dm_${sortedIds[0]}_${sortedIds[1]}`;

    const recipient = members.find(m => m.id === selectedRecipientId);
    const recipientName = recipient?.name || 'Worshipper';

    await onAddChatMessage({
      groupId: dmGroupId,
      groupName: `Private DM with ${recipientName}`,
      senderId,
      senderName: currentUserName || currentMember?.name || 'Worshipper',
      senderEmail: currentUserEmail || '',
      content: typedDM.trim()
    });

    setTypedDM('');
  };

  // Browser HTML5 Notice API
  const requestNotificationPermissions = () => {
    if (!('Notification' in window)) {
      alert('This environment launcher does not support HTML5 push notifications.');
      return;
    }

    Notification.requestPermission().then(permission => {
      setPushPermitted(permission);
      if (permission === 'granted') {
        setPushEnabled(true);
        triggerLocalPushNotification('Notifications Granted!', 'You will now receive instant push notifications for important church updates.');
      } else {
        setPushEnabled(false);
      }
    });
  };

  const triggerLocalPushNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted' && alertCategory !== 'none') {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
      });
    }
  };

  const simulateImportantUpdatesNotification = () => {
    const alerts = [
      { title: 'Urgent Rehearsal Update', body: 'Sunday morning choir rehearsals start 20 minutes earlier due to sanctuary alignment.' },
      { title: 'Tithe Ledger Backed Up', body: 'Monthly sanctuary financial audits completed securely.' },
      { title: 'Sermon PPT Uploaded', body: 'OBS Presentation slides for Prophetic worship are active.' }
    ];
    const picked = alerts[Math.floor(Math.random() * alerts.length)];
    
    if (pushEnabled && pushPermitted === 'granted') {
      triggerLocalPushNotification(picked.title, picked.body);
    } else {
      alert(`[MOCK PUSH ALERT] ${picked.title}\n\n${picked.body}`);
    }
  };

  // Chats filtering
  const selectedGroupMessages = chatMessages.filter(m => m.groupId === selectedGroupId);

  const getDMMessages = () => {
    const currentMember = members.find(m => m.email.toLowerCase() === (currentUserEmail || '').toLowerCase());
    const senderId = currentMember?.id || 'admin_user';
    const sortedIds = [senderId, selectedRecipientId].sort();
    const targetDmId = `dm_${sortedIds[0]}_${sortedIds[1]}`;
    return chatMessages.filter(m => m.groupId === targetDmId);
  };

  const currentMember = members.find(m => m.email.toLowerCase() === (currentUserEmail || '').toLowerCase());
  const senderId = currentMember?.id || 'admin_user';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="comm_hub_panel">
      {/* Top hub headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center space-x-2">
            <span>Corporate Communication Centre</span>
            <Volume2 className="w-5 h-5 text-sky-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch announcements, maintain departmental chats (Choir, Ushers, Media), converse directly with fellow believers, and manage simulated push notifications.
          </p>
        </div>

        {/* Modal activation */}
        <button
          onClick={() => setIsAnnounceModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Warning</span>
        </button>
      </div>

      {/* Navigation subtabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveHubTab('announcements')}
          className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 tracking-tight ${
            activeHubTab === 'announcements' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Announcements Board ({announcements.length})
        </button>
        <button
          onClick={() => setActiveHubTab('groups')}
          className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 tracking-tight ${
            activeHubTab === 'groups' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Ministry Chats Channels
        </button>
        <button
          onClick={() => setActiveHubTab('dms')}
          className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 tracking-tight ${
            activeHubTab === 'dms' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Private Direct Messaging
        </button>
        <button
          onClick={() => setActiveHubTab('notify')}
          className={`pb-3 text-xs font-bold transition-all px-4 border-b-2 tracking-tight flex items-center space-x-1.5 ${
            activeHubTab === 'notify' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Push Dispatch Center</span>
        </button>
      </div>

      {/* Switch content blocks */}
      <div>
        {/* TAB 1: Announcement list */}
        {activeHubTab === 'announcements' && (
          <div className="space-y-4">
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map(ann => {
                  const annDate = new Date(ann.createdAt).toLocaleString();
                  return (
                    <div 
                      key={ann.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        ann.category === 'Urgent' 
                          ? 'bg-rose-50/50 border-rose-100' 
                          : ann.category === 'Ministry' 
                          ? 'bg-amber-50/50 border-amber-100' 
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-[9px] uppercase tracking-wider ${
                            ann.category === 'Urgent' ? 'bg-rose-100 text-rose-850 animate-pulse' :
                            ann.category === 'Ministry' ? 'bg-amber-100 text-amber-850' :
                            'bg-sky-100 text-sky-850'
                          }`}>
                            {ann.category} Broadcast
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">{annDate}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-150 px-2 py-0.5 rounded-full">
                          By {ann.senderName}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-base leading-tight mb-2">{ann.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-semibold text-sm">Announcements Board Empty</p>
                <p className="text-xs text-slate-400">Click "Broadcast Warning" to compose general memos or urgent bulletins.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Department/Group chats */}
        {activeHubTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[420px]">
            {/* Left selector rails */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 px-1">Coordinated Groups</span>
              
              {[
                { id: 'general', name: 'General Saints Channel' },
                { id: 'Choir', name: 'Choir Department' },
                { id: 'Ushers', name: 'Ushers Team' },
                { id: 'Media', name: 'Media Operators' }
              ].map(group => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <div 
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setSelectedGroupName(group.name);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{group.name}</span>
                    </div>
                    {isSelected && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
                  </div>
                );
              })}
            </div>

            {/* Right chat message board */}
            <div className="md:col-span-8 border border-slate-100 rounded-2xl flex flex-col justify-between bg-slate-50 hover:shadow-xs transition-shadow">
              <div className="p-4 border-b border-slate-200/65 bg-white rounded-t-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">{selectedGroupName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Church secure communication room</span>
                </div>
              </div>

              {/* Msg listing */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[300px] min-h-[250px]">
                {selectedGroupMessages.length > 0 ? (
                  selectedGroupMessages.map((msg, i) => {
                    const isCurrentUser = msg.senderEmail.toLowerCase() === (currentUserEmail || '').toLowerCase();
                    return (
                      <div key={msg.id || i} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] text-slate-400 font-mono mb-1">{msg.senderName}</span>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                          isCurrentUser 
                            ? 'bg-sky-600 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200/80 text-slate-700 rounded-tl-none shadow-xs'
                        }`}>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs italic">
                    No conversation histories in this workspace group yet. Be the first to say something!
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Composer */}
              <form onSubmit={handleSendGroupMessage} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex items-center space-x-2">
                <input 
                  type="text" 
                  required
                  placeholder={`Write message to ${selectedGroupName}...`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-xs outline-none"
                />
                <button 
                  type="submit"
                  className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Direct Messaging */}
        {activeHubTab === 'dms' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[420px]">
            {/* Left recipient list selector */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 px-1">Select Church Believer</span>
              <div className="max-h-[300px] overflow-y-auto space-y-1.5">
                {members.filter(m => m.status === 'Active' && m.email.toLowerCase() !== (currentUserEmail || '').toLowerCase()).map(m => {
                  const isCurRecipient = selectedRecipientId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedRecipientId(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                        isCurRecipient
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <h5 className="font-bold">{m.name}</h5>
                          <p className="text-[9px] text-slate-400 truncate">{m.role} • {m.department}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right message thread */}
            <div className="md:col-span-8 border border-slate-100 rounded-2xl flex flex-col justify-between bg-slate-50">
              {selectedRecipientId ? (
                <>
                  <div className="p-4 border-b border-slate-200/65 bg-white rounded-t-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        Private DM with {members.find(m => m.id === selectedRecipientId)?.name}
                      </h4>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Secure Direct-Channel Session</span>
                    </div>
                  </div>

                  {/* Msg display */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[300px] min-h-[250px]">
                    {getDMMessages().length > 0 ? (
                      getDMMessages().map((msg, i) => {
                        const isCurrentUser = msg.senderEmail.toLowerCase() === (currentUserEmail || '').toLowerCase();
                        return (
                          <div key={msg.id || i} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-slate-400 font-mono mb-1">{msg.senderName}</span>
                            <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                              isCurrentUser 
                                ? 'bg-sky-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200/80 text-slate-700 rounded-tl-none shadow-xs'
                            }`}>
                              <p>{msg.content}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-slate-400 text-xs italic">
                        No previous DM threads here. Type your first text to say hello!
                      </div>
                    )}
                    <div ref={dmEndRef} />
                  </div>

                  {/* Composers */}
                  <form onSubmit={handleSendDM} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex items-center space-x-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Type private message..."
                      value={typedDM}
                      onChange={(e) => setTypedDM(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-xs outline-none"
                    />
                    <button 
                      type="submit"
                      className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-2 text-slate-400">
                  <MessageSquare className="w-10 h-10 text-slate-350" />
                  <p className="font-semibold text-sm">No Conversations Selected</p>
                  <p className="text-xs">Pick an active church worshipper from the left directory rail to initiate secure conversation.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Simulated Push Alerts */}
        {activeHubTab === 'notify' && (
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6 max-w-xl mx-auto hover:shadow-sm transition-shadow">
            <div className="space-y-2 text-center pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
                <BellRing className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Worship Alerts & Broadcast Options</h3>
              <p className="text-xs text-slate-500">
                To guarantee worshippers always receive urgent instructions, toggle background alert dispatches or simulate an instant push broadcast.
              </p>
            </div>

            {/* Permission trigger block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-100 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-700">Native Browser Notifications</p>
                <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-400 tracking-wide font-mono">
                  <span>Current status:</span>
                  <span className={`font-bold ${
                    pushPermitted === 'granted' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{pushPermitted.toUpperCase()}</span>
                </div>
              </div>

              {pushPermitted !== 'granted' ? (
                <button
                  onClick={requestNotificationPermissions}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center space-x-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Configure Access</span>
                </button>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-lg border border-emerald-100 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Configured</span>
                </div>
              )}
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Alert Distribution Tiers</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'all', label: 'All Alerts' },
                  { value: 'urgent', label: 'Urgent Memos Only' },
                  { value: 'none', label: 'Mute Notifications' }
                ].map(opt => {
                  const check = alertCategory === opt.value;
                  return (
                    <div 
                      key={opt.value}
                      onClick={() => setAlertCategory(opt.value as any)}
                      className={`p-3 rounded-xl border text-center cursor-pointer font-bold text-xs-1 transition-colors ${
                        check 
                          ? 'bg-sky-55 bg-sky-50 text-sky-800 border-sky-200' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated trigger button */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="bg-amber-50/65 border border-amber-100 p-3.5 rounded-xl flex items-start space-x-2 text-[11px] text-slate-600 leading-normal">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p>
                  Click the test launcher button below to instantly simulate a real-time background task alerting your operating system. If direct browser permissions were blocked or not allowed, it fallback fires as a smart in-app dialogue overlay window!
                </p>
              </div>

              <button
                onClick={simulateImportantUpdatesNotification}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Simulate Push Alert Announcement</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Creation Modal */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <button 
              onClick={() => setIsAnnounceModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-800 font-display mb-1 flex items-center space-x-2">
              <Megaphone className="text-sky-600 w-4 h-4" />
              <span>Compose Corporate Announcement</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">File a general church bulletin or send an urgent alert to members immediately.</p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Memo Priority</label>
                <select
                  value={aCategory}
                  onChange={(e) => setACategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
                >
                  <option value="General">General Notice</option>
                  <option value="Urgent">⚠️ Urgent (Fires push warning)</option>
                  <option value="Ministry">Ministry / Department Note</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Announcement Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sunday Choir Harmony Session Adjusted"
                  value={aTitle}
                  onChange={(e) => setATitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-slate-700"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Announcement Body Content *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Insert notice context and guidelines..."
                  value={aContent}
                  onChange={(e) => setAContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-slate-700"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
