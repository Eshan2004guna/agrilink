import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Bell, CheckCheck, Trash2, Clock, ShoppingBag, Sprout } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications Feed</h1>
          <p className="text-xs text-slate-500">Real-time alerts for orders, status updates, and harvest schedules.</p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-emerald-700" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10" />}
          title="No Notifications"
          description="You're all caught up! Updates regarding your orders and farm activities will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    notif.type === 'ORDER'
                      ? 'bg-blue-100 text-blue-700'
                      : notif.type === 'CROP'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {notif.type === 'ORDER' ? (
                    <ShoppingBag className="w-5 h-5" />
                  ) : notif.type === 'CROP' ? (
                    <Sprout className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 rounded-lg"
                    title="Mark as read"
                  >
                    Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
