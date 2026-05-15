import React, { useEffect } from 'react';
import { AppNav } from '../components/chrome';
import { Icon } from '../components/brand';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuthStore } from '../stores/authStore';
import { useBadgeStore } from '../stores/badgeStore';
import BadgeDisplay from '../components/BadgeDisplay';
import { BADGES_CONFIG, BADGE_CATEGORIES, RARITY_CONFIG } from '../constants/badges';

export default function BadgesPage({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const { badges, loadBadges } = useBadgeStore();

  useEffect(() => {
    if (user?.id) loadBadges(user.id);
  }, [user?.id, loadBadges]);

  const earnedMap = Object.fromEntries(badges.map(b => [b.id, b.earnedAt]));
  const earnedCount = badges.length;
  const totalCount = Object.keys(BADGES_CONFIG).length;

  const badgesByCategory = BADGE_CATEGORIES.map(cat => ({
    ...cat,
    badges: Object.values(BADGES_CONFIG).filter(b => b.category === cat.id),
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }}>
      <AppNav onNav={onNav} active="badges" />

      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '16px 20px' : '20px 32px',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Badges · achievement collection
            </span>
            <h1 className="t-h2" style={{ margin: '4px 0 0' }}>Your Badges</h1>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => onNav('badge')}>
            <Icon.Trophy size={14} /> View Tiers
          </button>
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {/* Progress overview */}
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span className="t-eyebrow">Collection progress</span>
                <h3 className="t-h3" style={{ margin: '4px 0 0' }}>
                  {earnedCount} / {totalCount} badges earned
                </h3>
              </div>
              <div className="t-mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>
                {Math.round((earnedCount / totalCount) * 100)}%
              </div>
            </div>
            <div className="bar" style={{ height: 8 }}>
              <i style={{ width: `${(earnedCount / totalCount) * 100}%`, background: 'var(--mint)' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {Object.entries(RARITY_CONFIG).map(([key, r]) => {
                const count = badges.filter(b => BADGES_CONFIG[b.id]?.rarity === key).length;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 999, background: r.color,
                      display: 'inline-block', flexShrink: 0,
                    }} />
                    <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {count} {r.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recently earned */}
          {badges.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>Recently earned</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[...badges]
                  .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
                  .slice(0, 6)
                  .map(b => (
                    <RecentBadgeChip key={b.id} badgeId={b.id} earnedAt={b.earnedAt} />
                  ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {badgesByCategory.map(cat => (
            <div key={cat.id} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                <h2 className="t-h3">{cat.label}</h2>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {cat.badges.filter(b => earnedMap[b.id]).length} / {cat.badges.length}
                </span>
                <span className="t-small" style={{ color: 'var(--muted)' }}>— {cat.description}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
                gap: 16,
              }}>
                {cat.badges.map(cfg => (
                  <BadgeCell
                    key={cfg.id}
                    config={cfg}
                    earned={!!earnedMap[cfg.id]}
                    earnedAt={earnedMap[cfg.id]}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {badges.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <h3 className="t-h3" style={{ marginBottom: 8 }}>No badges yet</h3>
              <p className="t-small" style={{ marginBottom: 20 }}>Log your first workout to start earning badges!</p>
              <button className="btn btn-primary btn-sm" onClick={() => onNav('workouts')}>
                Log a Workout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function BadgeCell({ config, earned, earnedAt }) {
  const rarity = RARITY_CONFIG[config.rarity];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
      <BadgeDisplay badgeId={config.id} earned={earned} earnedAt={earnedAt} size="lg" />
      <div style={{ fontSize: 12, fontWeight: 500, color: earned ? 'var(--navy)' : 'var(--muted)', lineHeight: 1.2 }}>
        {config.name}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <span style={{
          fontSize: 10, padding: '1px 6px', borderRadius: 999,
          background: rarity.bg, color: rarity.color,
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {rarity.label}
        </span>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{config.trigger}</span>
      </div>
    </div>
  );
}

function RecentBadgeChip({ badgeId, earnedAt }) {
  const config = BADGES_CONFIG[badgeId];
  if (!config) return null;
  const rarity = RARITY_CONFIG[config.rarity];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px', borderRadius: 10,
      border: `1px solid ${config.color}30`,
      background: config.bg,
    }}>
      <span style={{ fontSize: 20 }}>{config.icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{config.name}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
          <span style={{ fontSize: 10, color: rarity.color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            {rarity.label}
          </span>
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
            {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
