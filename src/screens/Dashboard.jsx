import React, { useEffect, useState } from 'react';
import { Icon } from '../components/brand';
import { AppNav } from '../components/chrome';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuthStore } from '../stores/authStore';
import { useWorkoutStore } from '../stores/workoutStore';
import { useBadgeStore } from '../stores/badgeStore';
import BadgeDisplay from '../components/BadgeDisplay';
import ManualWorkoutForm from '../components/ManualWorkoutForm';
import WorkoutDetail from '../components/WorkoutDetail';

const SV_TARGET = 3284;
const SV_ANIM_FROM = 3100;
const CHART_POINTS = [12, 18, 24, 22, 28, 32, 30, 36, 42, 38, 46, 52];

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ onNav }) {
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Athlete';
  const { loadUserWorkouts, workouts, getStats, setSelectedWorkout, selectedWorkout } = useWorkoutStore();
  const { badges, loadBadges } = useBadgeStore();
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUserWorkouts(user.id);
      loadBadges(user.id);
    }
  }, [user?.id, loadUserWorkouts, loadBadges]);

  const stats = getStats();
  const recentWorkouts = workouts.slice(0, 3);

  function handleManualSave(workout) {
    const { addWorkout } = useWorkoutStore.getState();
    addWorkout(user.id, workout);
    setShowManual(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "white" }}>
      <AppNav onNav={onNav} active="dashboard" />
      <main className="app-main-content" style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "16px 20px" : "20px 32px", borderBottom: "1px solid var(--hairline)",
        }}>
          <div>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Overview · week {getISOWeek(new Date())}</span>
            <h1 className="t-h2" style={{ margin: "4px 0 0" }}>{getTimeGreeting()}, {firstName}.</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setShowManual(true)}>
              <Icon.Plus size={14} /> Log session
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => onNav("badge")}>
              <Icon.Trophy size={14} /> View badges
            </button>
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 32 }}>
          {/* Workout stats strip */}
          {stats.totalWorkouts > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: 12, marginBottom: 24,
            }}>
              <DashStatCard icon="Dumbbell" label="Workouts" value={stats.totalWorkouts} onClick={() => onNav("workouts")} />
              <DashStatCard icon="Fire" label="Sweat Credits" value={stats.totalCredits} onClick={() => onNav("workouts")} />
              <DashStatCard icon="Chart" label="Avg / Week" value={stats.avgPerWeek} onClick={() => onNav("workouts")} />
              <DashStatCard icon="Bolt" label="Streak" value={`${stats.currentStreak}d`} onClick={() => onNav("workouts")} />
            </div>
          ) : (
            <div className="card" style={{
              padding: "24px 28px", marginBottom: 24,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Start tracking your workouts</div>
                <div className="t-small" style={{ color: "var(--muted)" }}>Connect Garmin or log your first session to earn sweat credits.</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => onNav("workouts")} style={{ flexShrink: 0 }}>
                <Icon.Plus size={14} /> Log workout
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.55fr 1fr", gap: isMobile ? 16 : 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <HeroSweatCard onNav={onNav} isMobile={isMobile} />
              <ActivityCard isMobile={isMobile} recentWorkouts={recentWorkouts} onSelectWorkout={setSelectedWorkout} onNav={onNav} />
              <MatchesCard onNav={onNav} isMobile={isMobile} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <BadgeProgressCard onNav={onNav} earnedBadges={badges} />
              <DevicesCard onNav={onNav} />
              <UpcomingCard />
            </div>
          </div>
        </div>
      </main>

      {showManual && (
        <ManualWorkoutForm userId={user?.id} onSave={handleManualSave} onClose={() => setShowManual(false)} />
      )}
      {selectedWorkout && (
        <WorkoutDetail workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      )}
    </div>
  );
}

function DashStatCard({ icon, label, value, onClick }) {
  const IC = Icon[icon];
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer", width: "100%", textAlign: "left", transition: "all 150ms",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--ink-04)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "white"}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: "var(--ink-04)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <IC size={15} color="var(--navy)" />
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--navy)" }}>{value}</div>
        <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 1 }}>
          {label}
        </div>
      </div>
    </button>
  );
}

function HeroSweatCard({ onNav, isMobile }) {
  const [val, setVal] = React.useState(SV_ANIM_FROM);
  React.useEffect(() => {
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(SV_ANIM_FROM + (SV_TARGET - SV_ANIM_FROM) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = CHART_POINTS;
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
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 14 }}>
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
        {!isMobile && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
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
        )}
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

const ACTIVITY_ICON = { running: "Run", cycling: "Bike", strength: "Dumbbell", swimming: "Swim" };

function formatShortDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ActivityCard({ isMobile, recentWorkouts, onSelectWorkout, onNav }) {
  const FALLBACK = [
    { day: "Today", icon: "Run", title: "Tempo run · 10.4 km", meta: "04:52 /km · zone 3 · garmin", sv: "+48" },
    { day: "Yesterday", icon: "Dumbbell", title: "Push day · 6×5", meta: "RPE 8 · hevy log", sv: "+24" },
    { day: "May 09", icon: "Bike", title: "Long ride · 42.8 km", meta: "312 W avg · wahoo", sv: "+61" },
    { day: "May 08", icon: "Swim", title: "Pool · 2,400 m", meta: "38:14 · apple watch", sv: "+32" },
    { day: "May 07", icon: "Run", title: "Easy recovery · 6.2 km", meta: "05:48 /km · zone 2", sv: "+19" },
  ];

  const hasReal = recentWorkouts && recentWorkouts.length > 0;
  const sessions = hasReal
    ? recentWorkouts.map(w => ({
        day: formatShortDate(w.created_at),
        icon: ACTIVITY_ICON[w.activity_type] || "Run",
        title: `${w.activity_type.charAt(0).toUpperCase() + w.activity_type.slice(1)}${w.distance_km > 0 ? ` · ${w.distance_km} km` : ""}`,
        meta: `${w.duration_minutes}min · ${w.intensity_level} · ${w.avg_heart_rate}bpm`,
        sv: `+${w.sweat_credits_earned}`,
        workout: w,
      }))
    : FALLBACK;
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="t-eyebrow">Activity · recent proofs</span>
          <h3 className="t-h3" style={{ margin: "4px 0 0" }}>
            {hasReal ? `Last ${sessions.length} sessions` : "Last 5 verified sessions"}
          </h3>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => onNav && onNav("workouts")}>
          All activity <Icon.ArrowRight size={12} />
        </button>
      </div>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {sessions.map((s, i) => {
            const IC = Icon[s.icon];
            return (
              <div key={i}
                onClick={() => s.workout && onSelectWorkout && onSelectWorkout(s.workout)}
                style={{ display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 20px", borderTop: "1px solid var(--hairline)",
                  cursor: s.workout ? "pointer" : "default" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--ink-04)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IC size={16} color="var(--navy)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.title}</div>
                  <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.day}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="t-mono" style={{ fontSize: 13, color: "var(--mint)" }}>{s.sv}</div>
                  <Icon.CheckCircle size={14} color="var(--mint)" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
              {[["When","When"], ["Session","Session"], ["Detail","Detail"], ["Sv","Sweat Value"], ["","Verified"]].map(([label, srLabel]) => (
                <th key={srLabel} scope="col" style={{ textAlign: "left", padding: "10px 24px",
                  fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)",
                  letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 400 }}>
                  {label || <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{srLabel}</span>}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const IC = Icon[s.icon];
              return (
                <tr key={i}
                  onClick={() => s.workout && onSelectWorkout && onSelectWorkout(s.workout)}
                  style={{ borderBottom: i < sessions.length - 1 ? "1px solid var(--hairline)" : "none",
                    cursor: s.workout ? "pointer" : "default" }}>
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
      )}
    </div>
  );
}

function MatchesCard({ onNav, isMobile }) {
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
        {matches.map((m, i) => isMobile ? (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start",
            padding: "16px 20px", borderTop: "1px solid var(--hairline)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: m.grad,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon.Spark size={18} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{m.brand}</div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.tag}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{m.offer}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{m.expires}</div>
                <button className="btn btn-sm btn-primary">Claim <Icon.ArrowRight size={12} /></button>
              </div>
            </div>
          </div>
        ) : (
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

function BadgeProgressCard({ onNav, earnedBadges = [] }) {
  const recentBadges = [...earnedBadges]
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
    .slice(0, 5);

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

      {/* Achievement badges strip */}
      {recentBadges.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>Recent achievements</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {recentBadges.map(b => (
              <BadgeDisplay key={b.id} badgeId={b.id} earned earnedAt={b.earnedAt} size="sm" />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => onNav("badge")} className="btn btn-sm btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}>
          Tier details <Icon.ArrowRight size={12} />
        </button>
        <button onClick={() => onNav("badges")} className="btn btn-sm btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}>
          All badges <Icon.Trophy size={12} />
        </button>
      </div>
    </div>
  );
}

function DevicesCard({ onNav }) {
  const { garminAuth } = useWorkoutStore();
  const garminSynced = !!garminAuth;
  const garminLast = garminAuth
    ? new Date(garminAuth.connectedAt || garminAuth.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const devices = [
    { name: "Garmin (mock)", state: garminSynced ? "synced" : "off", last: garminSynced ? garminLast : "—" },
    { name: "Strava", state: "synced", last: "today" },
    { name: "Apple watch", state: "off", last: "—" },
    { name: "Wahoo elemnt", state: "synced", last: "may 09" },
  ];
  const activeCount = devices.filter(d => d.state === "synced").length;
  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span className="t-eyebrow">Devices · coverage</span>
          <h3 className="t-h3" style={{ margin: "4px 0 0" }}>{activeCount} / 4 active</h3>
        </div>
        <button onClick={() => onNav && onNav("workouts")} className="t-mono" style={{ fontSize: 11, color: "var(--navy)", textDecoration: "underline" }}>Manage</button>
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
