import React from 'react';
import { Icon } from '../components/brand';
import { AppNav } from '../components/chrome';

export default function BadgeDetail({ onNav }) {
  const [selected, setSelected] = React.useState(3);
  const tiers = [
    { n: 1, name: "Foundation", cls: "tier-1", req: "Verified · consistent 4w", count: "All members" },
    { n: 2, name: "Proof", cls: "tier-2", req: "12w attested effort", count: "62%" },
    { n: 3, name: "Signal", cls: "tier-3", req: "6mo · 2+ disciplines", count: "28%" },
    { n: 4, name: "Momentum", cls: "tier-4", req: "12mo · streak intact", count: "8%" },
    { n: 5, name: "Mastery", cls: "tier-5", req: "24mo · multi-category", count: "2%" },
  ];
  const tier = tiers.find(t => t.n === selected);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "white" }}>
      <AppNav onNav={onNav} active="badges" />
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 32px", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="btn btn-sm btn-ghost" onClick={() => onNav("dashboard")}>
              ← Overview
            </button>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>/ badges / tier {String(selected).padStart(2,"0")}</span>
          </div>
          <button className="btn btn-sm btn-secondary">
            <Icon.ArrowUpRight size={14} /> Share verified passport
          </button>
        </div>

        <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
          <div>
            <span className="t-eyebrow">Badge ladder</span>
            <h2 className="t-h2" style={{ margin: "4px 0 24px" }}>Five tiers, earned in sequence.</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tiers.map(t => (
                <button key={t.n} onClick={() => setSelected(t.n)}
                  style={{
                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                    padding: 16, borderRadius: 12, textAlign: "left",
                    background: t.n === selected ? "white" : "transparent",
                    border: `1px solid ${t.n === selected ? "var(--navy)" : "var(--hairline)"}`,
                    boxShadow: t.n === selected ? "var(--sh-card)" : "none",
                    transition: "all 200ms", cursor: "pointer",
                  }}>
                  <TierBadge cls={t.cls} size={48} held={t.n <= 3} />
                  <div>
                    <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Tier {String(t.n).padStart(2,"0")}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>{t.name}</div>
                    <div className="t-small" style={{ marginTop: 2 }}>{t.req}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{t.count}</div>
                    <span className="t-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: t.n <= 3 ? "var(--mint)" : "var(--muted)", marginTop: 4, display: "block" }}>
                      {t.n < 3 ? "held" : t.n === 3 ? "current" : t.n === 4 ? "next" : "locked"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              padding: 40, borderRadius: 16, position: "relative", overflow: "hidden",
              background: selected === 1 ? "white" : selected === 2 ? "#eef0ff" : selected === 3 ? "#e6f6fe" : selected === 4 ? "#e6f7f1" : "white",
              border: "1px solid var(--hairline)",
            }}>
              {selected === 5 && (
                <div style={{ position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(14,165,233,0.18) 50%, rgba(16,185,129,0.18) 100%)" }} />
              )}
              <div style={{ position: "relative", display: "flex", gap: 32, alignItems: "center" }}>
                <TierBadge cls={tier.cls} size={120} held={selected <= 3} animate={selected === 3} />
                <div>
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    Tier {String(selected).padStart(2,"0")} · {tier.name.toLowerCase()}
                  </span>
                  <h2 className="t-h1" style={{ margin: "8px 0 0" }}>{tier.name}</h2>
                  <p style={{ color: "var(--muted)", marginTop: 10, maxWidth: 380 }}>
                    {selected === 1 && "Your foundation. Activated when you verify your first device and complete two weeks of attested sessions."}
                    {selected === 2 && "Twelve consecutive weeks of attested effort. The point at which brands begin to trust the signal."}
                    {selected === 3 && "Six months across at least two disciplines. Sweat Value compounds and your match rate triples."}
                    {selected === 4 && "Twelve months, streak intact, top quartile of your cohort. Auto-claim opens for premium rewards."}
                    {selected === 5 && "Two years of verified effort across categories. Reserved for athletes whose record is undeniable."}
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="t-eyebrow">Requirements</span>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                  {selected <= 3 ? "Met" : selected === 4 ? "65% complete" : "Locked"}
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--hairline)" }}>
                {requirementsFor(selected).map((r, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "24px 1fr auto auto", gap: 14, alignItems: "center",
                    padding: "16px 24px", borderTop: i > 0 ? "1px solid var(--hairline)" : "none",
                  }}>
                    <div>
                      {r.met ? <Icon.CheckCircle size={20} color="var(--mint)" /> :
                        r.progress !== undefined ?
                          <div style={{ width: 18, height: 18, borderRadius: 999, border: "2px solid var(--ink-12)",
                            background: `conic-gradient(var(--signal) ${r.progress * 360}deg, transparent 0)` }} />
                          : <div style={{ width: 18, height: 18, borderRadius: 999, border: "2px solid var(--ink-12)" }} />}
                    </div>
                    <span style={{ fontSize: 14 }}>{r.label}</span>
                    <span className="t-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{r.detail}</span>
                    <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: r.met ? "var(--mint)" : "var(--muted)" }}>
                      {r.met ? "Met" : r.progress !== undefined ? `${Math.round(r.progress * 100)}%` : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="t-eyebrow">Unlocks at this tier</span>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>3 perks</span>
              </div>
              <div style={{ borderTop: "1px solid var(--hairline)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {unlocksFor(selected).map((u, i) => {
                  const IC = Icon[u.icon];
                  return (
                    <div key={i} style={{ padding: 20, borderRight: i < 2 ? "1px solid var(--hairline)" : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink-04)",
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <IC size={16} color="var(--navy)" />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{u.title}</div>
                      <div className="t-small" style={{ marginTop: 4 }}>{u.body}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between",
              alignItems: "center", background: "var(--ink-04)", borderColor: "var(--hairline)" }}>
              <div>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Public proof url</span>
                <div className="t-mono" style={{ fontSize: 13, marginTop: 4 }}>pmsweat.com/minhsweat/tier-3</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-sm btn-secondary"><Icon.Eye size={14} /> Preview</button>
                <button className="btn btn-sm btn-primary">Copy link</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TierBadge({ cls, size = 64, held = false, animate = false }) {
  const bg = cls === "tier-1" ? "transparent" :
             cls === "tier-2" ? "var(--indigo)" :
             cls === "tier-3" ? "var(--signal)" :
             cls === "tier-4" ? "var(--mint)" :
             "var(--grad-full)";
  const border = cls === "tier-1" ? "2px solid var(--navy)" : "none";
  const color = cls === "tier-1" ? "var(--navy)" : "white";
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 5,
      background: bg, border, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative",
      boxShadow: cls === "tier-5" ? "0 12px 32px rgba(99,102,241,0.18)" : "none",
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"
          className={animate ? "check-draw" : ""} />
      </svg>
      {!held && cls !== "tier-1" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", borderRadius: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon.Lock size={size * 0.3} color="var(--muted)" />
        </div>
      )}
    </div>
  );
}

function requirementsFor(t) {
  if (t === 1) return [
    { label: "First device connected", detail: "garmin", met: true },
    { label: "Two weeks attested", detail: "5 sessions", met: true },
  ];
  if (t === 2) return [
    { label: "12 consecutive weeks", detail: "13w / 12w", met: true },
    { label: "Min 3 sessions / week avg", detail: "4.1 avg", met: true },
    { label: "Effort zones validated", detail: "z2 + z3", met: true },
  ];
  if (t === 3) return [
    { label: "6 months attested", detail: "8mo", met: true },
    { label: "Two or more disciplines", detail: "run · bike · swim · lift", met: true },
    { label: "Zone discipline maintained", detail: "z2:65 z3:24 z4:11", met: true },
    { label: "Recovery signals logged", detail: "hrv · sleep", met: true },
  ];
  if (t === 4) return [
    { label: "12 months continuous", detail: "8mo / 12mo", met: false, progress: 0.66 },
    { label: "Streak intact", detail: "47w / 52w", met: false, progress: 0.90 },
    { label: "Top quartile cohort", detail: "q2 currently", met: false, progress: 0.55 },
    { label: "Verified across 3 disciplines", detail: "4 logged · met", met: true },
  ];
  return [
    { label: "24 months continuous", detail: "8mo / 24mo", met: false, progress: 0.33 },
    { label: "Multi-category mastery", detail: "endurance + strength", met: false, progress: 0.4 },
    { label: "Top decile cohort", detail: "—", met: false },
    { label: "Public proof endorsements", detail: "0 / 3", met: false },
  ];
}

function unlocksFor(t) {
  if (t === 1) return [
    { icon: "Verify", title: "Verified passport", body: "Your public proof page goes live." },
    { icon: "Chart", title: "Sweat value tracking", body: "Full trend history and zone reports." },
    { icon: "Spark", title: "Starter matches", body: "Welcome offers from foundational partners." },
  ];
  if (t === 2) return [
    { icon: "ArrowUpRight", title: "10% on partner gear", body: "All verified retail partners." },
    { icon: "Calendar", title: "Race priority window", body: "48h early access to lottery races." },
    { icon: "Heart", title: "Recovery match", body: "Local clinics matched to your zones." },
  ];
  if (t === 3) return [
    { icon: "Bolt", title: "Auto-match offers", body: "We surface matches without your asking." },
    { icon: "Trophy", title: "Skip the lottery", body: "Direct entry to participating races." },
    { icon: "Heart", title: "30% on recovery", body: "Cryotherapy + massage partners." },
  ];
  if (t === 4) return [
    { icon: "Spark", title: "Hand-picked drops", body: "Limited gear before public release." },
    { icon: "Map", title: "Camp invitations", body: "Partner training camps · pre-vetted." },
    { icon: "Shield", title: "Insurance discount", body: "Premium athlete policies, audited." },
  ];
  return [
    { icon: "Trophy", title: "PM Sweat circle", body: "Annual gathering · invite-only." },
    { icon: "Bolt", title: "Brand ambassadorship", body: "Direct partnership matches." },
    { icon: "Eye", title: "Public proof verified", body: "Mastery mark on your passport url." },
  ];
}
