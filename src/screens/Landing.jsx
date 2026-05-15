import React from 'react';
import { Icon } from '../components/brand';
import { PublicNav, Footer } from '../components/chrome';
import { useIsMobile } from '../hooks/useIsMobile';
import { ShareButtons } from '../components/ShareButtons';

const PROOF_EXAMPLES = [
  { id: "run",  icon: "Run",      title: "10.4 km · 04:52 /km",  meta: "Garmin · zone 3 · source ✓", value: "+48 sv" },
  { id: "swim", icon: "Swim",     title: "2,400 m freestyle",     meta: "Apple Watch · 38 min · auth ✓", value: "+32 sv" },
  { id: "bike", icon: "Bike",     title: "42.8 km loop",          meta: "Wahoo · 312 W avg · auth ✓", value: "+61 sv" },
  { id: "lift", icon: "Dumbbell", title: "Push session · 6×5",    meta: "Hevy log · RPE 8 · auth ✓", value: "+24 sv" },
];

export default function Landing({ onNav }) {
  const isMobile = useIsMobile();
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 4), 2200);
    return () => clearInterval(id);
  }, []);

  const proofExamples = PROOF_EXAMPLES;

  return (
    <div>
      {/* ─── HERO ───────────────────────────────────────────── */}
      <section style={{ background: "var(--navy)", color: "white", position: "relative", overflow: "hidden" }}>
        <div className="halo" style={{ inset: "-20% -10% auto auto", width: "80%", height: "80%" }} />
        <div className="halo" style={{ inset: "auto auto -30% -20%", width: "60%", height: "60%",
          background: "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(14,165,233,0.08) 45%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <PublicNav onDark={true} onNav={onNav} route="landing" />

          <div style={{ padding: isMobile ? "40px 0 48px" : "80px 0 96px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.35fr 1fr", gap: isMobile ? 32 : 64, alignItems: "end" }}>
            <div>
              <div className="eyebrow-row on-dark" style={{ marginBottom: 28 }}>
                <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  Pm sweat <span style={{ opacity: 0.35, margin: "0 8px" }}>/</span> perfect match sweat
                </span>
              </div>
              <h1 className="t-display" style={{ margin: 0, color: "white" }}>
                Verified effort,<br/>
                <span style={{
                  backgroundImage: "var(--grad-full)",
                  backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                }}>earned value.</span>
              </h1>
              <p style={{
                marginTop: 28, maxWidth: 560, fontSize: 18, lineHeight: 1.55,
                color: "rgba(255,255,255,0.72)",
              }}>
                A premium identity passport for the people who train consistently. PM Sweat proves your real-world effort, then matches it to opportunities and rewards from brands that respect it.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                <button className="btn btn-onDark" onClick={() => onNav("onboarding")}>
                  Start verification <Icon.ArrowRight size={14} />
                </button>
                <button className="btn btn-onDark-ghost" onClick={() => onNav("partners")}>
                  For brand partners
                </button>
              </div>

              <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--mint)" }} />
                  <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)" }}>Sample athlete activity preview</span>
                </div>
                <div style={{ height: 12, width: 1, background: "rgba(255,255,255,0.12)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,0.45)" }}>
                  <span className="t-mono" style={{ fontSize: 11 }}>GARMIN*</span>
                  <span className="t-mono" style={{ fontSize: 11 }}>APPLE HEALTH</span>
                  <span className="t-mono" style={{ fontSize: 11 }}>STRAVA</span>
                  <span className="t-mono" style={{ fontSize: 11 }}>WHOOP</span>
                  <span className="t-mono" style={{ fontSize: 11 }}>WAHOO*</span>
                </div>
              </div>
            </div>

            <ProofTicker tick={tick} items={proofExamples} />
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          padding: "14px 0", overflow: "hidden",
          fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.16em", textTransform: "uppercase",
        }}>
          <div style={{ display: "flex", gap: 56, animation: "marquee 38s linear infinite", whiteSpace: "nowrap" }}>
            {Array.from({ length: 2 }).map((_, k) => (
              <React.Fragment key={k}>
                <span>Demo verification flow · verified-source-ready</span>
                <span>Sample athlete activity preview</span>
                <span>Sample partner network · sea region</span>
                <span>Mock activity data for product demo</span>
                <span>Accessible design principles · security roadmap · privacy-first consent model</span>
                <span>Privacy-first eligibility</span>
              </React.Fragment>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────── */}
      <section className="container" style={{ padding: "120px 0 40px" }}>
        <div className="section-cap">
          <span className="num">01</span>
          <span className="lbl">How it works</span>
          <span className="line" />
        </div>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? 32 : 80, alignItems: "start" }}>
          <div style={{ position: isMobile ? "static" : "sticky", top: 80 }}>
            <h2 className="t-h1" style={{ margin: 0 }}>
              Effort is the signal. <span style={{ color: "var(--muted)" }}>We just verify it.</span>
            </h2>
            <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 16, maxWidth: 460 }}>
              Three steps, then your Sweat Value compounds in the background while you train. No grinding for points, no fake activity, no resold data.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "01", title: "Connect your devices", body: "Link Garmin, Apple Health, Strava, Whoop, Wahoo. Demo verification summarizes selected workout signals. Real source integrations are planned.", accent: "indigo", tag: "Proof" },
              { n: "02", title: "Train like you already do", body: "Every verified session adds to your Sweat Value. Consistency multiplies. Volume alone doesn't. The system rewards the long arc, not the sprint week.", accent: "signal", tag: "Momentum" },
              { n: "03", title: "Get matched", body: "Brands send offers tuned to your verified profile — recovery clinics, nutrition shops, race entries, gear. You hold the passport. You choose the match.", accent: "mint", tag: "Earned" },
            ].map(s => <StepRow key={s.n} {...s} onNav={onNav} />)}
          </div>
        </div>
      </section>

      {/* ─── SWEAT VALUE EXPLAINER ──────────────────────────── */}
      <section className="container" style={{ padding: "80px 0 40px" }}>
        <div className="section-cap">
          <span className="num">02</span>
          <span className="lbl">Sweat value</span>
          <span className="line" />
        </div>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr", gap: isMobile ? 32 : 56, alignItems: "center" }}>
          <SweatValueDemo />
          <div>
            <h2 className="t-h1" style={{ margin: 0, maxWidth: 480 }}>
              One number. Built from years of showing up.
            </h2>
            <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 16, maxWidth: 480 }}>
              Sweat Value (SV) is the durable score behind your PM Sweat passport. It weights consistency over heroics — a five-month streak compounds harder than a single epic week.
            </p>
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--hairline)",
              border: "1px solid var(--hairline)", borderRadius: 12, overflow: "hidden" }}>
              {[
                ["Consistency", "62%", "Weeks active over rolling 12mo"],
                ["Variety", "18%", "Disciplines logged"],
                ["Intensity", "12%", "Verified zone time"],
                ["Recovery", "08%", "Sleep + recovery signals"],
              ].map(([k, v, m]) => (
                <div key={k} style={{ background: "white", padding: 20 }}>
                  <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                  <div className="t-mono" style={{ fontSize: 32, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>{v}</div>
                  <div className="t-small" style={{ marginTop: 6 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BADGES ─────────────────────────────────────────── */}
      <section className="container" style={{ padding: "80px 0 40px" }}>
        <div className="section-cap">
          <span className="num">03</span>
          <span className="lbl">Five tier badge system</span>
          <span className="line" />
        </div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 56, alignItems: "end" }}>
          <h2 className="t-h1" style={{ margin: 0, maxWidth: 480 }}>
            Earned, not bought. Recognized, not rented.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 460, margin: 0 }}>
            Each tier raises the floor of opportunities you're matched with. Tier 1 is your foundation. Tier 5 is reserved for athletes whose effort is undeniable on paper.
          </p>
        </div>
        <div style={{ marginTop: 56 }}>
          <BadgeLadder onNav={onNav} />
        </div>
      </section>

      {/* ─── VERIFICATION DEMO ──────────────────────────────── */}
      <section style={{ background: "#f7f8fa", marginTop: 80, padding: "120px 0" }}>
        <div className="container">
          <div className="section-cap">
            <span className="num">04</span>
            <span className="lbl">Verification, inspectable</span>
            <span className="line" />
          </div>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr", gap: isMobile ? 32 : 64, alignItems: "center" }}>
            <div>
              <h2 className="t-h1" style={{ margin: 0 }}>
                You can see the summary. <span style={{ color: "var(--muted)" }}>Partners see eligibility status, not raw workout details.</span>
              </h2>
              <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 16, maxWidth: 480 }}>
                Every demo session produces a privacy-safe summary. Brand partners check eligibility status, not raw workout details. Raw health details are not shown to partners in this demo.
              </p>
              <ul style={{ marginTop: 28, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Session summary", "Verified-source-ready session summary"],
                  ["Effort signal", "Selected workout signals — pace, power, consistency"],
                  ["Partner eligibility check", "Brand sees fit without raw workout details"],
                ].map(([k, v]) => (
                  <li key={k} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ marginTop: 2 }}><Icon.CheckCircle size={20} color="var(--mint)" /></div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{k}</div>
                      <div className="t-small">{v}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <VerificationDemo />
          </div>
        </div>
      </section>

      {/* ─── PARTNERS PREVIEW ───────────────────────────────── */}
      <section className="container" style={{ padding: "120px 0 40px" }}>
        <div className="section-cap">
          <span className="num">05</span>
          <span className="lbl">For brand partners</span>
          <span className="line" />
        </div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 56, alignItems: "start" }}>
          <h2 className="t-h1" style={{ margin: 0, maxWidth: 520 }}>
            Reach athletes whose effort is on the record.
          </h2>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0 }}>
              Premium supplement shops, race organizers, recovery clinics and sportswear retailers can use PM Sweat to plan privacy-first athlete campaigns — not lookalike audiences, not self-reported claims.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onNav("partners")}>
              Partner with PM Sweat <Icon.ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16 }}>
          {[
            { k: "Campaign fit", v: "Sample", m: "Illustrative metrics for pilot planning" },
            { k: "Audience signal", v: "Demo", m: "Privacy-first eligibility preview" },
            { k: "Wasted impressions", v: "Lower", m: "Modeled against self-reported claims" },
            { k: "Partner network", v: "Pilot", m: "Sample partner network · sea region" },
          ].map(s => (
            <div key={s.k} className="card" style={{ position: "relative" }}>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.k}</div>
              <div className="t-mono" style={{ fontSize: 36, fontWeight: 500, marginTop: 12, letterSpacing: "-0.03em" }}>{s.v}</div>
              <div className="t-small" style={{ marginTop: 6 }}>{s.m}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────── */}
      <section className="container" style={{ padding: "80px 0 0" }}>
        <div style={{
          background: "var(--navy)", color: "white", borderRadius: 20,
          padding: isMobile ? "48px 28px" : "72px 64px",
          position: "relative", overflow: "hidden",
        }}>
          <div className="halo" style={{ inset: "auto -10% -40% auto", width: "60%", height: "100%" }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: isMobile ? 32 : 56, alignItems: "center" }}>
            <div>
              <div className="t-mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)" }}>Free · open beta · sea region</div>
              <h2 className="t-h1" style={{ color: "white", marginTop: 16 }}>
                Your training is the credential.<br/>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>Make it count.</span>
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              <button className="btn btn-onDark" onClick={() => onNav("onboarding")}>
                Start verification — 6 min <Icon.ArrowRight size={14} />
              </button>
              <button className="btn btn-onDark-ghost" onClick={() => onNav("dashboard")}>
                Tour the dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHARE ──────────────────────────────────────────── */}
      <section className="container" style={{ padding: "32px 0 48px", textAlign: "center" }}>
        <p className="t-small" style={{ marginBottom: 14, color: "var(--muted)" }}>Share PM Sweat</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ShareButtons />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProofTicker({ tick, items }) {
  return (
    <div style={{ position: "relative", padding: 24, borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)" }}>Demo · activity feed</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--mint)",
            boxShadow: "0 0 0 4px rgba(16,185,129,0.18)" }} />
          <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>sample data</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => {
          const IC = Icon[it.icon];
          const active = i === tick;
          return (
            <div key={it.id} style={{
              display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 14, alignItems: "center",
              padding: 14, borderRadius: 12,
              background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${active ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
              transition: "all 400ms cubic-bezier(0.2,0.6,0.2,1)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: active ? "var(--grad-proof)" : "rgba(255,255,255,0.06)",
                transition: "background 400ms",
              }}>
                <IC size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "white" }}>{it.title}</div>
                <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4,
                  letterSpacing: "0.04em" }}>{it.meta}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="t-mono" style={{ fontSize: 16, fontWeight: 500,
                  color: active ? "var(--mint)" : "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>{it.value}</div>
                {active && <div className="t-mono" style={{ fontSize: 10, color: "rgba(16,185,129,0.7)" }}>verified</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepRow({ n, title, body, accent, tag }) {
  const accentColor = accent === "indigo" ? "var(--indigo)" : accent === "signal" ? "var(--signal)" : "var(--mint)";
  return (
    <div className="card" style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "start",
      padding: 28,
    }}>
      <div className="t-mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em" }}>{n}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h3 className="t-h2" style={{ margin: 0 }}>{title}</h3>
          <span className="t-mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
            color: accentColor }}>{tag}</span>
        </div>
        <p style={{ color: "var(--muted)", margin: 0, maxWidth: 560 }}>{body}</p>
      </div>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--ink-04)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--hairline)" }}>
        <span style={{ width: 14, height: 14, borderRadius: 999, background: accentColor }} />
      </div>
    </div>
  );
}

function SweatValueDemo() {
  const [val, setVal] = React.useState(0);
  const target = 3284;
  React.useEffect(() => {
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="card" style={{ padding: 36, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="t-eyebrow">Sweat value</span>
        <span className="tier tier-3">Tier 3 · signal</span>
      </div>
      <div className="sv-num">{val.toLocaleString()}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, color: "var(--mint)" }}>
        <Icon.ArrowUp size={14} color="var(--mint)" />
        <span className="t-mono" style={{ fontSize: 13 }}>+184 this week</span>
        <span className="t-small" style={{ marginLeft: 8 }}>· 47 week streak</span>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="t-small">Toward tier 4 · mint</span>
          <span className="t-mono" style={{ fontSize: 12 }}>3,284 / 5,000</span>
        </div>
        <div className="bar"><i style={{ width: "65.6%" }} /></div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--hairline)",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[["sessions", "284"], ["disciplines", "04"], ["streak", "47w"]].map(([k, v]) => (
          <div key={k}>
            <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{k}</div>
            <div className="t-mono" style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeLadder({ onNav }) {
  const isMobile = useIsMobile();
  const tiers = [
    { n: "01", name: "Foundation", desc: "Verified, consistent for 4+ weeks", count: "All members", cls: "tier-1" },
    { n: "02", name: "Proof", desc: "Completed 12 weeks of verified-source-ready effort", count: "Sample", cls: "tier-2" },
    { n: "03", name: "Signal", desc: "6 months · 2+ disciplines · zone discipline", count: "28%", cls: "tier-3" },
    { n: "04", name: "Momentum", desc: "12 months · streak intact · top quartile", count: "8%", cls: "tier-4" },
    { n: "05", name: "Mastery", desc: "24 months · verified across categories", count: "2%", cls: "tier-5" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: isMobile ? 10 : 12 }}>
      {tiers.map((t) => (
        <button key={t.n} onClick={() => onNav("badge")}
          style={{
            textAlign: "left", padding: 24,
            background: "white", border: "1px solid var(--hairline)", borderRadius: 12,
            cursor: "pointer", transition: "all 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--ink-24)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--hairline)"; }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: t.cls === "tier-1" ? "transparent" : t.cls === "tier-5" ? "var(--grad-full)" :
              t.cls === "tier-2" ? "var(--indigo)" : t.cls === "tier-3" ? "var(--signal)" : "var(--mint)",
            border: t.cls === "tier-1" ? "2px solid var(--navy)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <Icon.Check size={24} color={t.cls === "tier-1" ? "var(--navy)" : "white"} />
          </div>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em" }}>Tier {t.n}</div>
          <div className="t-h3" style={{ margin: "4px 0 8px" }}>{t.name}</div>
          <p className="t-small" style={{ margin: 0, minHeight: 56 }}>{t.desc}</p>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--hairline)",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{t.count}</span>
            <Icon.ArrowRight size={14} color="var(--muted)" />
          </div>
        </button>
      ))}
    </div>
  );
}

function VerificationDemo() {
  const isMobile = useIsMobile();
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setStage(s => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);
  const stages = ["Captured", "Summarized", "Verified", "Matched"];
  return (
    <div style={{
      background: "white", border: "1px solid var(--hairline)", borderRadius: 16,
      padding: 28, position: "relative", overflow: "hidden", boxShadow: "var(--sh-2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <span className="t-eyebrow">Demo verification summary</span>
        <span className="tier tier-1">Verified</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 8 : 0, marginBottom: 32 }}>
        {stages.map((s, i) => (
          <div key={s} style={{ position: "relative", textAlign: "left" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: i <= stage ? "var(--grad-proof)" : "var(--ink-08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 400ms",
            }}>
              {i < stage ? <Icon.Check size={16} color="white" />
                : i === stage ? <span style={{ width: 10, height: 10, borderRadius: 999, background: "white" }} />
                : <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{i+1}</span>}
            </div>
            {i < stages.length - 1 && (
              <div style={{ position: "absolute", left: 32, right: -8, top: 15, height: 2,
                background: i < stage ? "var(--grad-proof)" : "var(--ink-08)", transition: "background 400ms" }} />
            )}
            <div className="t-mono" style={{ fontSize: 11, marginTop: 10,
              color: i <= stage ? "var(--navy)" : "var(--muted)", letterSpacing: "0.06em",
              textTransform: "uppercase" }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {[
          ["session", "morning run · 10.4 km"],
          ["device", "garmin fenix 7s"],
          ["effort", "zone 3 · selected signals"],
          ["duration", "00:50:48"],
          ["verification", "verified-source-ready"],
          ["sv earned", "+48"],
        ].map(([k, v], i) => (
          <div key={k} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderTop: "1px solid var(--hairline)",
          }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</span>
            <span className="t-mono" style={{ fontSize: 13, color: k === "sv earned" ? "var(--mint)" : "var(--navy)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
