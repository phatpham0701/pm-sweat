import React, { useState } from 'react';
import { BADGES_CONFIG, RARITY_CONFIG } from '../constants/badges';

export default function BadgeDisplay({ badgeId, earned = false, earnedAt = null, size = 'md' }) {
  const [hovered, setHovered] = useState(false);
  const config = BADGES_CONFIG[badgeId];
  if (!config) return null;

  const rarity = RARITY_CONFIG[config.rarity];

  const dim = { sm: 40, md: 52, lg: 64 }[size];
  const fontSize = { sm: 18, md: 24, lg: 30 }[size];

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: dim, height: dim, borderRadius: dim,
        background: earned ? config.bg : 'rgba(107,114,128,0.08)',
        border: `2px solid ${earned ? config.color + '40' : 'rgba(107,114,128,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, filter: earned ? 'none' : 'grayscale(100%) opacity(0.4)',
        transition: 'transform 150ms, box-shadow 150ms',
        transform: hovered && earned ? 'scale(1.08)' : 'scale(1)',
        boxShadow: hovered && earned ? `0 4px 16px ${config.color}30` : 'none',
        cursor: 'default',
        flexShrink: 0,
      }}>
        {config.icon}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--navy)', color: 'white',
          padding: '8px 12px', borderRadius: 8,
          fontSize: 12, whiteSpace: 'normal',
          zIndex: 200, pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          maxWidth: 180, textAlign: 'center',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{config.name}</div>
          <div style={{ opacity: 0.75, fontSize: 11 }}>{config.description}</div>
          <div style={{
            marginTop: 4,
            color: rarity.color,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {rarity.label}
            {earned && earnedAt ? ` · ${new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : earned ? ' · Earned' : ' · Locked'}
          </div>
        </div>
      )}
    </div>
  );
}

export function BadgeGrid({ earned = [], allBadgeIds, showLabel = false }) {
  const earnedMap = Object.fromEntries(earned.map(b => [b.id, b.earnedAt]));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {allBadgeIds.map(id => (
        <BadgeDisplay
          key={id}
          badgeId={id}
          earned={!!earnedMap[id]}
          earnedAt={earnedMap[id]}
          size="md"
        />
      ))}
    </div>
  );
}
