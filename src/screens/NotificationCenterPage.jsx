import React, { useEffect } from 'react';
import { AppNav } from '../components/chrome';
import { Icon } from '../components/brand';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

const PRIORITY_COLOR = {
  high:   '#EF4444',
  medium: '#F59E0B',
  low:    'var(--mint)',
};

const TYPE_ICON = {
  WORKOUT_LOGGED:   'Dumbbell',
  GOAL_COMPLETED:   'Trophy',
  STREAK_MILESTONE: 'Fire',
  STREAK_WARNING:   'Bolt',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return 'just now';
}

export default function NotificationCenterPage({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { notifications, loadNotifications, markRead, markAllRead, clearAll } = useNotificationStore();

  useEffect(() => {
    if (user?.id) loadNotifications(user.id);
  }, [user?.id, loadNotifications]);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      <AppNav onNav={onNav} active="notifications" />

      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '20px 32px',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Alerts · activity updates
            </span>
            <h1 className="t-h2" style={{ margin: '4px 0 0' }}>Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {unread > 0 && (
                <button className="btn btn-sm btn-secondary" onClick={() => markAllRead(user.id)}>
                  Mark all read
                </button>
              )}
              <button className="btn btn-sm btn-secondary" onClick={() => clearAll(user.id)}>
                Clear all
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 32px' }}>
              <Icon.Bell size={40} color="var(--ink-12)" />
              <div style={{ marginTop: 12, fontWeight: 600, fontSize: 15 }}>All caught up!</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6, maxWidth: 280, margin: '8px auto 0' }}>
                Notifications appear here when you log workouts, hit streaks, and achieve goals.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.map(n => {
                const iconName = TYPE_ICON[n.type] || 'Spark';
                const IC = Icon[iconName];
                const pc = PRIORITY_COLOR[n.priority] || 'var(--muted)';
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(user.id, n.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '16px 20px', borderRadius: 12,
                      border: `1px solid ${n.read ? 'var(--hairline)' : 'rgba(99,102,241,0.2)'}`,
                      background: n.read ? 'white' : 'rgba(99,102,241,0.03)',
                      cursor: n.read ? 'default' : 'pointer',
                      textAlign: 'left', width: '100%', transition: 'background 150ms',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                      background: `${pc}1a`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IC size={16} color={pc} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--navy)' }}>{n.title}</span>
                        <span className="t-mono" style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{timeAgo(n.created_at)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{n.message}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--indigo)', flexShrink: 0, marginTop: 6 }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
