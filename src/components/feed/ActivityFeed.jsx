import React from 'react';
import ActivityItem from './ActivityItem';

export default function ActivityFeed({ activities }) {
  if (activities.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
        <div className="t-h3" style={{ marginBottom: 8 }}>No activity yet</div>
        <p className="t-small">Follow athletes to see their achievements here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="t-eyebrow" style={{ marginBottom: 4 }}>Recent Activity</div>
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
