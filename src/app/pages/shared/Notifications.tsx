import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Loader2, List, Trash2 } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COMPLAINT_RESOLVED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'SLA_BREACH': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'SLA_WARNING': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          </div>
          <button className="text-sm font-bold text-blue-600 hover:underline">Mark all as read</button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500">Loading alerts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`bg-white p-5 rounded-2xl border transition-all ${n.read ? 'border-slate-100 opacity-75' : 'border-blue-100 shadow-sm shadow-blue-500/5 bg-blue-50/10'}`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-slate-50' : 'bg-blue-50'}`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h3>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-600'}`}>
                      {n.message}
                    </p>
                    {!n.read && (
                      <button 
                        onClick={() => handleMarkRead(n.id)}
                        className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                <p className="text-slate-500">You have no new notifications.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
