import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Smile, 
  Frown, 
  BarChart2, 
  Sparkles, 
  Send, 
  Calendar, 
  CheckCircle,
  ThumbsUp,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Event, EventFeedback, Member } from '../types';

interface EventFeedbackSystemProps {
  events: Event[];
  feedbacks: EventFeedback[];
  currentUserEmail: string | null;
  currentUserName: string | null;
  onAddFeedback: (feedback: Omit<EventFeedback, 'id' | 'createdAt'>) => Promise<void>;
}

export const EventFeedbackSystem: React.FC<EventFeedbackSystemProps> = ({
  events,
  feedbacks,
  currentUserEmail,
  currentUserName,
  onAddFeedback
}) => {
  const [activeFeedbackTab, setActiveFeedbackTab] = useState<'survey' | 'reports'>('survey');
  
  // Survey form states
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !comment.trim()) {
      alert('Please select an event and write a short comment.');
      return;
    }

    const tEvent = events.find(evt => evt.id === selectedEventId);
    if (!tEvent) return;

    await onAddFeedback({
      eventId: selectedEventId,
      eventTitle: tEvent.title,
      rating,
      comment: comment.trim(),
      submitterName: currentUserName || 'Congregant',
      submitterEmail: currentUserEmail || ''
    });

    setSelectedEventId('');
    setRating(5);
    setComment('');
    alert('Thank you for your valuable response! Review submitted successfully!');
    setActiveFeedbackTab('reports');
  };

  // --- Analytical Aggregations ---
  const totalReviews = feedbacks.length;
  
  const averageOverallRating = totalReviews > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Average per Event
  const eventRatingBreakdown = events.map(evt => {
    const evtFeedbacks = feedbacks.filter(f => f.eventId === evt.id);
    const count = evtFeedbacks.length;
    const avg = count > 0 
      ? (evtFeedbacks.reduce((sum, f) => sum + f.rating, 0) / count).toFixed(1)
      : 'No responses';
    return {
      eventId: evt.id,
      title: evt.title,
      count,
      avg
    };
  });

  // Count distribution of scores
  const scoreDistribution = {
    5: feedbacks.filter(f => f.rating === 5).length,
    4: feedbacks.filter(f => f.rating === 4).length,
    3: feedbacks.filter(f => f.rating === 3).length,
    2: feedbacks.filter(f => f.rating === 2).length,
    1: feedbacks.filter(f => f.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="feedback_system_panel">
      {/* Top headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center space-x-2">
            <span>Corporate Event Feedback & Quality Reports</span>
            <Smile className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Allow churchgoers to submit ratings after services, and evaluate report logs to refine worship decorum, speaker clarity, and seating comfort levels.
          </p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
          <button
            onClick={() => setActiveFeedbackTab('survey')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFeedbackTab === 'survey' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Leave Review
          </button>
          <button
            onClick={() => setActiveFeedbackTab('reports')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFeedbackTab === 'reports' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Quality Dashboard Reports
          </button>
        </div>
      </div>

      {/* TABS Switch content */}
      {activeFeedbackTab === 'survey' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Survey Submission Left */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 p-6 rounded-2xl space-y-5">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span>Congregational Feedback Card</span>
            </h3>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Event dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Concluded Event / Service *</label>
                <select 
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-sky-500 outline-none rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="">-- Choose Gathering --</option>
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.title} ({new Date(evt.dateTime).toLocaleDateString()})</option>
                  ))}
                </select>
              </div>

              {/* Interactive Star rating */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Gathering Rating *</label>
                <div className="flex items-center space-x-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFitted = (hoveredRating !== null ? star <= hoveredRating : star <= rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className="w-8 h-8" 
                          fill={isFitted ? 'currentColor' : 'transparent'} 
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-mono font-bold text-slate-400 pl-2">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Needs Improvement' : 'Disappointed'}
                  </span>
                </div>
              </div>

              {/* Comment text box */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observation & Comments *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Share details regarding acoustics, sermon progression, seat support, parking availability, or song sections..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-sky-500 outline-none rounded-xl text-xs text-slate-700"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Experience Card</span>
              </button>
            </form>
          </div>

          {/* Quick instructions right */}
          <div className="lg:col-span-5 bg-sky-50/30 border border-sky-100/40 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-sky-850 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Anonymized Analytics Option</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opinions left on feedback cards compiled securely by security structures. Verified admin boards aggregate feedback cards to show averages, ensuring maximum sanctuary experience improvements.
              </p>
              <div className="border-t border-sky-100 pt-3 space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-sky-55 w-2 h-2 rounded-full bg-sky-500" />
                  <span>Interactive 5-star scoring</span>
                </p>
                <p className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-sky-55 w-2 h-2 rounded-full bg-sky-500" />
                  <span>Auto-calculates event ratings</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-sky-100 text-[10px] text-slate-400">
              Your session email is recorded as: <span className="font-mono font-semibold text-slate-500">{currentUserEmail}</span>
            </div>
          </div>
        </div>
      )}

      {/* TABS Switch: Aggregated Reports Dashboard */}
      {activeFeedbackTab === 'reports' && (
        <div className="space-y-6">
          {/* Key Stat Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total reviews */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Experience Cards</p>
                <h4 className="text-2xl font-black text-slate-800">{totalReviews} submissions</h4>
              </div>
            </div>

            {/* Average rating */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                <Star className="w-5 h-5" fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Happiness Score</p>
                <h4 className="text-2xl font-black text-slate-800">{averageOverallRating} / 5.0</h4>
              </div>
            </div>

            {/* Satisfaction level */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category approval</p>
                <h4 className="text-2xl font-black text-slate-800">
                  {totalReviews > 0 
                    ? (((feedbacks.filter(f => f.rating >= 4).length) / totalReviews) * 100).toFixed(0)
                    : 0}% High Approval
                </h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Event aggregate breakdown lists left */}
            <div className="lg:col-span-5 bg-white border border-slate-250 p-5 rounded-2xl border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                  <BarChart2 className="w-4 h-4 text-sky-500" />
                  <span>Aggregated Event Scores</span>
                </h3>
              </div>

              <div className="space-y-3">
                {eventRatingBreakdown.map((item, i) => (
                  <div key={item.eventId || i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center">
                    <div className="space-y-0.5 max-w-[70%]">
                      <h4 className="font-bold text-slate-850 truncate">{item.title}</h4>
                      <p className="text-[10px] font-mono text-slate-450">{item.count} responses</p>
                    </div>

                    <div className="flex items-center space-x-1 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                      <span className={item.avg === 'No responses' ? 'text-slate-400 font-sans' : 'text-slate-800'}>{item.avg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed Scroll lists right */}
            <div className="lg:col-span-7 bg-white border border-slate-250 p-5 rounded-2xl border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-sky-500" />
                <span>Congregational Remarks Stream</span>
              </h3>

              {feedbacks.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {feedbacks.map((item, i) => (
                    <div key={item.id || i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{item.submitterName}</span>
                          <span className="text-slate-350">•</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[120px] sm:max-w-none">{item.eventTitle}</span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= item.rating ? 'text-amber-400' : 'text-slate-200'}`} 
                              fill={star <= item.rating ? 'currentColor' : 'transparent'}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-650 leading-relaxed italic">
                        "{item.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 italic text-xs">
                  No comments or detailed review cards submitted yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
