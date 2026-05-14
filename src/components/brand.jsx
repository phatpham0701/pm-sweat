import React from 'react';

export function LogoMark({ size = 28, variant = "navy" }) {
  const stroke = variant === "white" ? "#ffffff" : variant === "gradient" ? "url(#pm-grad)" : "#071326";
  return (
    <svg width={size} height={size * (24/32)} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PM Sweat">
      <defs>
        <linearGradient id="pm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path d="M2 13 L9 20 L16 4" stroke={stroke} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M30 13 L23 20 L16 4" stroke={stroke} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function Wordmark({ on = "light", size = 16 }) {
  const color = on === "dark" ? "#ffffff" : "#071326";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color }}>
      <LogoMark size={size * 1.5} variant={on === "dark" ? "white" : "navy"} />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: size, letterSpacing: "-0.01em" }}>
        PM Sweat
      </span>
    </div>
  );
}

const Ic = ({ children, size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const Icon = {
  CheckCircle: (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.8 2.8L16.5 9.5" /></Ic>,
  Check: (p) => <Ic {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Ic>,
  ArrowRight: (p) => <Ic {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Ic>,
  ArrowUp: (p) => <Ic {...p}><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></Ic>,
  ArrowUpRight: (p) => <Ic {...p}><path d="M7 17L17 7" /><path d="M9 7h8v8" /></Ic>,
  Trophy: (p) => <Ic {...p}><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v4a5 5 0 01-10 0V4z" /><path d="M17 5h3v3a3 3 0 01-3 3" /><path d="M7 5H4v3a3 3 0 003 3" /></Ic>,
  Lock: (p) => <Ic {...p}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></Ic>,
  Eye: (p) => <Ic {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Ic>,
  Settings: (p) => <Ic {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8L4.2 7a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></Ic>,
  Chart: (p) => <Ic {...p}><path d="M3 21h18" /><path d="M6 17V10" /><path d="M11 17V6" /><path d="M16 17v-4" /><path d="M21 17V3" /></Ic>,
  Dumbbell: (p) => <Ic {...p}><path d="M2 12h2" /><path d="M20 12h2" /><rect x="4" y="8" width="3" height="8" rx="1" /><rect x="17" y="8" width="3" height="8" rx="1" /><path d="M7 12h10" /></Ic>,
  Run: (p) => <Ic {...p}><circle cx="17" cy="4" r="1.6" /><path d="M7 21l3-5 2-2-3-3-3 2-3-1" /><path d="M12 14l3 2 3-1 2 3" /></Ic>,
  Swim: (p) => <Ic {...p}><path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /><path d="M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /><circle cx="17" cy="6" r="1.6" /><path d="M5 13l5-3 4 2 3-2" /></Ic>,
  Bike: (p) => <Ic {...p}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-7h5l3 7" /><path d="M9 6h3l1 4" /></Ic>,
  Plus: (p) => <Ic {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Ic>,
  Trash: (p) => <Ic {...p}><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" /><path d="M9 7V4h6v3" /></Ic>,
  Shield: (p) => <Ic {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></Ic>,
  Heart: (p) => <Ic {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 10c0 5.5-7 10-7 10z" /></Ic>,
  Spark: (p) => <Ic {...p}><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" /></Ic>,
  Verify: (p) => <Ic {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></Ic>,
  Map: (p) => <Ic {...p}><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" /><path d="M9 3v16" /><path d="M15 5v16" /></Ic>,
  Clock: (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ic>,
  Fire: (p) => <Ic {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 11-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" /></Ic>,
  Calendar: (p) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 3v4" /><path d="M16 3v4" /></Ic>,
  Bolt: (p) => <Ic {...p}><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" /></Ic>,
};
