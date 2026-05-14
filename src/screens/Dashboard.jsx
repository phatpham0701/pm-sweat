import React from 'react';
import { Icon } from '../components/brand';
import { AppNav } from '../components/chrome';

export default function Dashboard({ onNav }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "white" }}>
      <AppNav onNav={onNav} active="dashboard" />
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 32px", borderBottom: "1px solid var(--hairline)",
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Overview · week 19</span>
            <h1 className="t-h2" style={{ margin: "4px 0 0" }}>Good evening, Minh.</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-sm btn-secondary">
              <Icon.Plus size={14} /> Log session
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => onNav("badge")}>
              <Icon.Trophy size={14} /> View badges
            </button>
          </div>
        </div>

        <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <HeroSweatCard onNav={onNav} />
            <ActivityCard />
            <MatchesCard onNav={onNav} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <BadgeProgressCard onNav={onNav} />
            <DevicesCard />
            <UpcomingCard />
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroSweatCard({ onNav }) {
  const [val, setVal] = React.useState(3100);
  React.useEffect(() => {
    let raf, start = null;
    const target = 3284;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(3100 + (target - 3100) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = [12, 18, 24, 22, 28, 32, 30, 36, 42, 38, 46, 52];
  const max = Math.max(...points);
  const w = 280, h = 60;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${h - (p / max) * h}`).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="t-eyebrow">Sweat value · current</span>
          <div className="sv-num" style={{ marginTop: 12 }}>{val.toLocaleString()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--mint)" }}>
              <Icon.ArrowUp size={14} color="var(--mint)" />
              <span className="t-mono" style={{ fontSize: 13 }}>+184 / week</span>
            </span>
            <span style={{ height: 12, width: 1, background: "var(--hairline)" }} />
            <span className="t-mono" style={{ fontSize: 13, color: "var(--muted)" }}>47w streak</span>
            <span style={{ height: 12, width: 1, background: "var(--hairline)" }} />
            <span className="tier tier-3">Tier 3 · signal</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Trailing 12 weeks</div>
          <svg width={w} height={h + 4} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#spark-grad)" />
            <path d={path} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => i === points.length - 1 && (
              <circle key={i} cx={(i / (points.length - 1)) * w} cy={h - (p / max) * h} r="3" fill="#10B981" />
            ))}
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span className="t-small">Toward tier 4 · momentum</span>
          <span className="t-mono" style={{ fontSize: 12 }}>3,284 / 5,000 sv</span>
        </div>
        <div className="bar"><i style={{ width: "65.6%" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>~9 weeks at current pace</span>
          <button onClick={() => onNav("badge")} className="t-mono"
            style={{ fontSize: 11, color: "var(--navy)", textDecoration: "underline" }}>
            What unlocks at tier 4 →
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityCard() {
  const sessions = [
    { day: "Today", icon: "Run", title: "Tempo run · 10.4 km", meta: "04:52 /km · zone 3 · garmin", sv: "+48" },
    { day: "Yesterday", icon: "Dumbbell", title: "Push day · 6×5", meta: "RPE 8 · hevy log", sv: "+24" },
    { day: "May 09", icon: "Bike", title: "Long ride · 42.8 km", meta: "312 W avg · wahoo", sv: "+61" },
    { day: "May 08", icon: "Swim", title: "Pool · 2,400 m", meta: "38:14 · apple watch", sv: "+32" },
    { day: "May 07", icon: "Run", title: "Easy recovery · 6.2 km", meta: "05:48 /km · zone 2", sv: "+19" },
  ];
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="t-eyebrow">Activity · recent proofs</span>
          <h3 className="t-h3" style={{ margin: "4px 0 0" }}>Last 5 verified sessions</h3>
        </div>
        <button className="btn btn-sm btn-ghost">All activity <Icon.ArrowRight size={12} /></button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
            {["When", "Session", "Detail", "Sv", ""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 24px",
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)",
                letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => {
            const IC = Icon[s.icon];
            return (
              <tr key={i} style={{ borderBottom: i < sessions.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                <td style={{ padding: "14px 24px" }}>
                  <span className="t-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{s.day}</span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink-04)",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IC size={16} color="var(--navy)" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{s.title}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <span className="t-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{s.meta}</span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <span className="t-mono" style={{ fontSize: 13, color: "var(--mint)" }}>{s.sv}</span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <Icon.CheckCircle size={16} color="var(--mint)" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MatchesCard({ onNav }) {
  const matches = [
    { brand: "Salt & Lime Recovery", tag: "Recovery clinic · district 2", offer: "30% off cryotherapy block", expires: "expires in 3d", grad: "var(--grad-proof)" },
    { brand: "Origin Supps", tag: "Premium nutrition · vn", offer: "Free 1lb whey on $80+ order", expires: "expires in 6d", grad: "var(--grad-momentum)" },
    { brand: "Saigon Trail Race", tag: "30k · jun 14", offer: "Skip lottery · tier 3+ pass", expires: "auto-claim available", grad: "var(--grad-earned)" },
  ];
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="t-eyebrow">Matches · live offers</span>
          <h3 className="t-h3" style={{ margin: "4px 0 0" }}>3 brand matches at your tier</h3>
        </div>
        <button className="btn btn-sm btn-ghost">All matches <Icon.ArrowRight size={12} /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {matches.map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "44px 1.4fr 1.6fr auto", gap: 16, alignItems: "center",
            padding: "20px 24px", borderTop: "1px solid var(--hairline)",
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: m.grad,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Spark size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{m.brand}</div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, letterSpacing: "0.04em" }}>{m.tag}</div>
            </div>
            <div>
              <div style={{ fontSize: 14 }}>{m.offer}</div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.expires}</div>
            </div>
            <button className="btn btn-sm btn-primary">Claim <Icon.ArrowRight size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeProgressCard({ onNav }) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <span className="t-eyebrow">Badge ladder</span>
      <h3 className="t-h3" style={{ margin: "4px 0 16px" }}>You're on tier 3</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { n: "01", name: "Foundation", state: "done", cls: "tier-1" },
          { n: "02", name: "Proof", state: "done", cls: "tier-2" },
          { n: "03", name: "Signal", state: "current", cls: "tier-3" },
          { n: "04", name: "Momentum", state: "next", cls: "tier-4" },
          { n: "05", name: "Mastery", state: "locked", cls: "tier-5" },
        ].map(t => (
          <div key={t.n} style={{
            display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 12, alignItems: "center",
            padding: 10, borderRadius: 10,
            background: t.state === "current" ? "var(--ink-04)" : "transparent",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              opacity: t.state === "locked" ? 0.3 : 1,
              background: t.cls === "tier-1" ? "transparent" : t.cls === "tier-5" ? "var(--grad-full)" :
                t.cls === "tier-2" ? "var(--indigo)" : t.cls === "tier-3" ? "var(--signal)" : "var(--mint)",
              border: t.cls === "tier-1" ? "2px solid var(--navy)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {t.state === "locked" ? <Icon.Lock size={14} color="var(--muted)" /> :
                <Icon.Check size={18} color={t.cls === "tier-1" ? "var(--navy)" : "white"} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.state === "locked" ? "var(--muted)" : "var(--navy)" }}>
                {t.name}
              </div>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tier {t.n}</div>
            </div>
            <span className="t-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
              color: t.state === "current" ? "var(--mint)" : "var(--muted)" }}>
              {t.state === "done" ? "Held" : t.state === "current" ? "Current" : t.state === "next" ? "Next" : "Locked"}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => onNav("badge")} className="btn btn-sm btn-secondary"
        style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
        Inspect tier 3 badge <Icon.ArrowRight size={12} />
      </button>
    </div>
  );
}

function DevicesCard() {
  const devices = [
    { name: "Garmin fenix 7s", state: "synced", last: "12m ago" },
    { name: "Strava", state: "synced", last: "today" },
    { name: "Apple watch", state: "off", last: "—" },
    { name: "Wahoo elemnt", state: "synced", last: "may 09" },
  ];
  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span className="t-eyebrow">Devices · coverage</span>
          <h3 className="t-h3" style={{ margin: "4px 0 0" }}>3 / 4 active</h3>
        </div>
        <button className="t-mono" style={{ fontSize: 11, color: "var(--navy)", textDecoration: "underline" }}>Manage</button>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {devices.map(d => (
          <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999,
                background: d.state === "synced" ? "var(--mint)" : "var(--ink-12)" }} />
              <span style={{ fontSize: 13 }}>{d.name}</span>
            </div>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{d.last}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingCard() {
  return (
    <div className="card" style={{ padding: 28, background: "var(--navy)", color: "white", borderColor: "var(--navy)",
      position: "relative", overflow: "hidden" }}>
      <div className="halo" />
      <div style={{ position: "relative" }}>
        <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Upcoming · auto-match</span>
        <h3 className="t-h3" style={{ margin: "8px 0 0", color: "white" }}>Saigon Trail · 30k</h3>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8, fontSize: 13 }}>
          You pre-qualified via tier 3 sweat value. Lottery skipped. Entry held until jun 1.
        </p>
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.10)",
          display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>WHEN</div>
            <div className="t-mono" style={{ fontSize: 14, marginTop: 4 }}>jun 14 · 05:30</div>
          </div>
          <div>
            <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>WHERE</div>
            <div className="t-mono" style={{ fontSize: 14, marginTop: 4 }}>cu chi · vn</div>
          </div>
        </div>
        <button className="btn btn-sm btn-onDark" style={{ marginTop: 20, width: "100%", justifyContent: "center" }}>
          Confirm entry <Icon.ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
