import React from 'react';
import { Wordmark, Icon } from './brand';
import { useIsMobile } from '../hooks/useIsMobile';

export function PublicNav({ onDark = false, onNav, route }) {
  const isMobile = useIsMobile();
  const linkStyle = {
    fontSize: 14,
    color: onDark ? "rgba(255,255,255,0.7)" : "var(--ink-60)",
    transition: "color 150ms",
  };
  const items = [
    { id: "landing", label: "Product" },
    { id: "partners", label: "For partners" },
    { id: "onboarding", label: "Verification" },
    { id: "dashboard", label: "Dashboard" },
  ];
  return (
    <nav aria-label="Main navigation" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0",
    }}>
      <button onClick={() => onNav("landing")} style={{ display: "flex", alignItems: "center" }}>
        <Wordmark on={onDark ? "dark" : "light"} size={15} />
      </button>
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {items.map(it => (
            <button key={it.id} onClick={() => onNav(it.id)}
              style={{ ...linkStyle, color: route === it.id ? (onDark ? "white" : "var(--navy)") : linkStyle.color }}
              onMouseEnter={(e) => e.currentTarget.style.color = onDark ? "white" : "var(--navy)"}
              onMouseLeave={(e) => e.currentTarget.style.color = route === it.id ? (onDark ? "white" : "var(--navy)") : linkStyle.color}
            >{it.label}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!isMobile && (
          <button className={`btn btn-sm ${onDark ? "btn-onDark-ghost" : "btn-ghost"}`}>Sign in</button>
        )}
        <button onClick={() => onNav("onboarding")} className={`btn btn-sm ${onDark ? "btn-onDark" : "btn-primary"}`}>
          {isMobile ? "Join" : "Get verified"} <Icon.ArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  const isMobile = useIsMobile();
  const cols = [
    { h: "Product", links: ["How it works", "Verification", "Sweat Value", "Badges", "Rewards"] },
    { h: "For partners", links: ["Why PM Sweat", "Targeting", "Pricing", "API", "Case studies"] },
    { h: "Company", links: ["About", "Manifesto", "Press", "Careers", "Contact"] },
    { h: "Legal", links: ["Privacy", "Terms", "Data policy", "Cookies"] },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", padding: "64px 0 48px", marginTop: 80 }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.6fr repeat(4, 1fr)", gap: isMobile ? 32 : 48 }}>
        <div style={isMobile ? { gridColumn: "1 / -1" } : undefined}>
          <Wordmark size={15} />
          <p className="t-small" style={{ marginTop: 16, maxWidth: 280 }}>
            Verified sport effort, perfectly matched to fair compensation. Built for athletes who show up.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <span className="tier tier-1">Wcag aaa</span>
            <span className="tier tier-1">Soc 2</span>
          </div>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div className="t-eyebrow" style={{ marginBottom: 16 }}>{c.h}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {c.links.map(l => (
                <li key={l}><a className="t-small" style={{ color: "var(--navy)" }} href="#/">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container" style={{ marginTop: 56, display: "flex",
          flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0,
          justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
          paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
        <span className="t-small">© 2026 PM Sweat Labs · Perfect Match Sweat</span>
        <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>v0.9.4 · build 2026.05.14</span>
      </div>
    </footer>
  );
}

export function ScreenJumper({ route, onNav }) {
  const screens = [
    { id: "landing", label: "01 Landing" },
    { id: "onboarding", label: "02 Onboarding" },
    { id: "dashboard", label: "03 Dashboard" },
    { id: "badge", label: "04 Badge" },
    { id: "partners", label: "05 Partners" },
  ];
  return (
    <div className="screen-jumper" style={{
      position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)",
      zIndex: 100, display: "flex", padding: 4, borderRadius: 999,
      background: "rgba(255,255,255,0.78)", backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      border: "1px solid rgba(7,19,38,0.08)", boxShadow: "0 8px 24px rgba(7,19,38,0.08)",
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.02em",
    }}>
      {screens.map(s => (
        <button key={s.id} onClick={() => onNav(s.id)}
          style={{
            padding: "8px 14px", borderRadius: 999,
            color: route === s.id ? "white" : "var(--muted)",
            background: route === s.id ? "var(--navy)" : "transparent",
            transition: "all 200ms",
          }}>{s.label}</button>
      ))}
    </div>
  );
}

export function AppNav({ onNav, active = "dashboard" }) {
  const items = [
    { id: "dashboard", label: "Overview", icon: "Chart" },
    { id: "verify", label: "Verify", icon: "Verify" },
    { id: "badges", label: "Badges", icon: "Trophy" },
    { id: "rewards", label: "Rewards", icon: "Spark" },
    { id: "matches", label: "Matches", icon: "Map" },
  ];
  return (
    <aside className="app-nav-sidebar" aria-label="Athlete navigation" style={{
      width: 232, borderRight: "1px solid var(--hairline)", height: "100%",
      padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div className="nav-logo" style={{ padding: "0 8px 24px" }}>
        <Wordmark size={14} />
      </div>
      <div className="t-eyebrow" style={{ padding: "0 8px 8px" }}>Athlete</div>
      {items.map(it => {
        const IC = Icon[it.icon];
        const isActive = it.id === active;
        return (
          <button key={it.id}
            className="nav-item"
            onClick={() => onNav && onNav(it.id === "badges" ? "badge" : "dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 10px",
              borderRadius: 8, color: isActive ? "var(--navy)" : "var(--muted)",
              background: isActive ? "var(--ink-04)" : "transparent",
              fontSize: 14, transition: "all 150ms",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--ink-04)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <IC size={16} color={isActive ? "var(--navy)" : "var(--muted)"} />
            <span>{it.label}</span>
          </button>
        );
      })}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        <div className="t-eyebrow" style={{ padding: "0 8px 8px" }}>Account</div>
        <button style={{
          display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 10px",
          borderRadius: 8, color: "var(--muted)", fontSize: 14,
        }}>
          <Icon.Settings size={16} color="var(--muted)" />
          <span>Settings</span>
        </button>
        <div style={{
          marginTop: 8, padding: 10, border: "1px solid var(--hairline)", borderRadius: 12,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: "var(--grad-earned)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 13,
          }}>MN</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.1 }}>Minh Ngọc</div>
            <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>tier 3 · signal</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
