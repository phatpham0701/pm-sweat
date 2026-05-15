import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon, LogoMark, Wordmark } from '../components/brand';
import { useAuthStore } from '../stores/authStore';

export default function Onboarding({ onNav }) {
  const { user } = useAuthStore();
  const [step, setStep] = React.useState(0);
  const [profile, setProfile] = React.useState({
    name: user?.name || "",
    handle: user?.handle || "",
    age: "",
    city: user?.city || "",
    primary: "running",
  });
  const [devices, setDevices] = React.useState({ garmin: true, apple: false, strava: true, whoop: false, wahoo: false });
  const [attestStage, setAttestStage] = React.useState(0);

  React.useEffect(() => {
    if (step !== 2) { setAttestStage(0); return; }
    const id = setInterval(() => setAttestStage(s => Math.min(s + 1, 4)), 700);
    return () => clearInterval(id);
  }, [step]);

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "white" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px" }}>
          <button onClick={() => onNav("landing")}><Wordmark size={15} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em",
              textTransform: "uppercase" }}>Verification · step {step + 1} of 4</span>
            <button className="btn btn-sm btn-ghost" onClick={() => onNav("landing")}>Save & exit</button>
          </div>
        </div>
        <div className="container" style={{ paddingBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["Profile", "Devices", "Attest", "Passport"].map((label, i) => (
              <div key={label}>
                <div style={{ height: 3, borderRadius: 999, background: i <= step ? "var(--grad-proof)" : "var(--ink-08)",
                  transition: "background 400ms" }} />
                <div className="t-mono" style={{ fontSize: 10, marginTop: 8, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: i <= step ? "var(--navy)" : "var(--muted)" }}>
                  {String(i + 1).padStart(2, "0")} {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "56px 32px", maxWidth: 880, flex: 1 }}>
        {step === 0 && <ProfileStep profile={profile} onNext={(data) => { setProfile(data); setStep(1); }} />}
        {step === 1 && <DevicesStep devices={devices} setDevices={setDevices} />}
        {step === 2 && <AttestStep stage={attestStage} />}
        {step === 3 && <PassportStep profile={profile} onNav={onNav} />}
      </div>

      {step < 3 && (
        <div style={{ background: "white", borderTop: "1px solid var(--hairline)", padding: "16px 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={back} disabled={step === 0} className="btn btn-secondary"
              style={{ opacity: step === 0 ? 0.4 : 1 }}>
              Back
            </button>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {step === 2 && attestStage < 4 && (
                <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em",
                  textTransform: "uppercase" }}>Hold tight · demo verification in progress</span>
              )}
              <button
                type={step === 0 ? "submit" : "button"}
                form={step === 0 ? "profile-form" : undefined}
                onClick={step > 0 ? next : undefined}
                className="btn btn-primary"
                disabled={step === 2 && attestStage < 4}
                style={{ opacity: (step === 2 && attestStage < 4) ? 0.4 : 1 }}>
                {step === 1 ? "Run demo verification" : step === 2 ? "Create Sweat Pass" : "Continue"}
                <Icon.ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const profileSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  handle: z.string()
    .min(2, "Min 2 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase, numbers and _ only"),
  age: z.coerce.number()
    .int("Must be a whole number")
    .min(18, "Must be 18 or older")
    .max(80, "Must be 80 or younger"),
  city: z.string().optional(),
});

function ProfileStep({ profile, onNext }) {
  const [primary, setPrimary] = React.useState(profile.primary);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      handle: profile.handle,
      age: profile.age,
      city: profile.city || "Ho Chi Minh City · sea",
    },
  });

  const sports = [
    { id: "running", label: "Running", icon: "Run" },
    { id: "swimming", label: "Swimming", icon: "Swim" },
    { id: "cycling", label: "Cycling", icon: "Bike" },
    { id: "strength", label: "Strength", icon: "Dumbbell" },
  ];

  return (
    <div className="fade-up">
      <span className="t-eyebrow">01 · Profile</span>
      <h1 className="t-h1" style={{ marginTop: 12, marginBottom: 12, maxWidth: 600 }}>
        Start your passport. <span style={{ color: "var(--muted)" }}>This is the name brands will see.</span>
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: 560, marginTop: 0 }}>
        We capture only what's needed to verify and match. Your handle is public. Age range is bucketed. Nothing else is shared without your explicit consent on each match.
      </p>

      <form id="profile-form" onSubmit={handleSubmit((data) => onNext({ ...data, primary }))} noValidate>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Display name" hint="As shown to partners" error={errors.name?.message}>
            <input {...register("name")} autoComplete="name"
              style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "var(--hairline)" }} />
          </Field>
          <Field label="Handle" hint="Unique · used in your match url" error={errors.handle?.message}>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", padding: "0 16px",
              borderColor: errors.handle ? "#ef4444" : "var(--hairline)" }}>
              <span style={{ color: "var(--muted)" }}>pmsweat.com/</span>
              <input {...register("handle")} autoComplete="username"
                style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 15, padding: 0 }} />
              {!errors.handle && <Icon.CheckCircle size={18} color="var(--mint)" />}
            </div>
          </Field>
          <Field label="Age" hint="Bucketed to 25–34, 35–44 etc." error={errors.age?.message}>
            <input {...register("age")} type="number" autoComplete="age"
              style={{ ...inputStyle, borderColor: errors.age ? "#ef4444" : "var(--hairline)" }} />
          </Field>
          <Field label="City / region" hint="Approximate · for local matches" error={errors.city?.message}>
            <input {...register("city")} autoComplete="address-level2" style={inputStyle} />
          </Field>
        </div>
      </form>

      <div style={{ marginTop: 40 }}>
        <div className="t-eyebrow" style={{ marginBottom: 14 }}>Primary discipline</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {sports.map(s => {
            const IC = Icon[s.icon];
            const active = primary === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setPrimary(s.id)}
                style={{
                  padding: 20, borderRadius: 12, background: "white",
                  border: `1px solid ${active ? "var(--navy)" : "var(--hairline)"}`,
                  boxShadow: active ? "inset 0 0 0 1px var(--navy)" : "none",
                  display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start",
                  textAlign: "left", transition: "all 150ms",
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: active ? "var(--navy)" : "var(--ink-04)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IC size={20} color={active ? "white" : "var(--navy)"} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <PrivacyCallout />
    </div>
  );
}

function DevicesStep({ devices, setDevices }) {
  const list = [
    { id: "garmin", name: "Garmin", desc: "Connect IQ · all wearables", sigs: "source-connected signal" },
    { id: "apple", name: "Apple Health", desc: "Watch · iPhone HealthKit", sigs: "privacy-safe summary" },
    { id: "strava", name: "Strava", desc: "Activity timeline · 90 days history", sigs: "source-connected signal" },
    { id: "whoop", name: "Whoop", desc: "Strain · recovery · HRV", sigs: "consent-based eligibility" },
    { id: "wahoo", name: "Wahoo", desc: "ELEMNT bike computers · TICKR HR", sigs: "ANT+ · paired" },
  ];
  const connected = Object.values(devices).filter(Boolean).length;

  return (
    <div className="fade-up">
      <span className="t-eyebrow">02 · Devices</span>
      <h1 className="t-h1" style={{ marginTop: 12, marginBottom: 12, maxWidth: 600 }}>
        Link the gear that already tracks you.
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: 560, marginTop: 0 }}>
        At least one source connection is selected for this demo. The flow is designed around privacy-safe eligibility, not raw workout disclosure.
      </p>

      <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", background: "white", border: "1px solid var(--hairline)", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="v-ring" style={{ width: 44, height: 44 }}>
            <svg width={44} height={44}>
              <defs>
                <linearGradient id="grad-proof" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#0EA5E9"/>
                </linearGradient>
              </defs>
              <circle cx={22} cy={22} r={18} fill="none" strokeWidth={4} className="v-track" />
              <circle cx={22} cy={22} r={18} fill="none" strokeWidth={4} className="v-bar"
                strokeDasharray={113} strokeDashoffset={113 - (connected / 5) * 113} strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Coverage</div>
            <div style={{ fontWeight: 500 }}>{connected} of 5 sources connected</div>
          </div>
        </div>
        <span className={connected >= 1 ? "tier tier-4" : "tier tier-1"}>
          {connected >= 1 ? "Ready" : "Connect at least one"}
        </span>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map(d => {
          const on = devices[d.id];
          return (
            <div key={d.id} style={{
              display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 16, alignItems: "center",
              padding: 18, background: "white", border: `1px solid ${on ? "var(--mint)" : "var(--hairline)"}`,
              borderRadius: 12, transition: "all 200ms",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: on ? "var(--grad-momentum)" : "var(--ink-04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {on ? <Icon.Check size={22} color="white" /> :
                  <span className="t-mono" style={{ fontSize: 13, color: "var(--muted)" }}>—</span>}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{d.name}</div>
                <div className="t-small" style={{ marginTop: 2 }}>{d.desc} <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>· {d.sigs}</span></div>
              </div>
              <button onClick={() => setDevices(s => ({ ...s, [d.id]: !s[d.id] }))}
                className={`btn btn-sm ${on ? "btn-secondary" : "btn-primary"}`}>
                {on ? "Connected" : "Connect"}
                {!on && <Icon.ArrowRight size={12} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttestStep({ stage }) {
  const stages = [
    { k: "Reading device", v: "garmin fenix 7s · paired" },
    { k: "Capturing session", v: "morning run · 10.4 km · zone 3" },
    { k: "Preparing summary", v: "verified-source-ready" },
    { k: "Checking eligibility", v: "sample partner-ready summary" },
    { k: "Verification complete", v: "demo summary · sv +48" },
  ];

  return (
    <div className="fade-up">
      <span className="t-eyebrow">03 · Demo verification</span>
      <h1 className="t-h1" style={{ marginTop: 12, marginBottom: 12, maxWidth: 600 }}>
        Your first verification summary.
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: 560, marginTop: 0 }}>
        Demo verification summarizes selected workout signals from your connected source. Real source integrations are planned, and raw health details are not shown to partners in this demo.
      </p>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <span className="t-eyebrow">Demo verification flow</span>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{Math.min(stage + 1, 5)}/5</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {stages.map((s, i) => (
              <div key={s.k} style={{
                display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 14, alignItems: "center",
                padding: "14px 0",
                borderBottom: i < stages.length - 1 ? "1px solid var(--hairline)" : "none",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 999,
                  background: i < stage ? "var(--grad-proof)" : i === stage ? "var(--navy)" : "var(--ink-08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 300ms",
                }}>
                  {i < stage ? <Icon.Check size={14} color="white" /> :
                    i === stage ?
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: "white",
                        animation: "pulse 1.2s ease-in-out infinite" }} />
                      : <span className="t-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{i+1}</span>}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: i <= stage ? "var(--navy)" : "var(--muted)" }}>{s.k}</div>
                  {i <= stage && (
                    <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.v}</div>
                  )}
                </div>
                {i < stage && <Icon.CheckCircle size={16} color="var(--mint)" />}
              </div>
            ))}
          </div>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        </div>

        <div className="card" style={{ padding: 28, background: "var(--navy)", color: "white", borderColor: "var(--navy)",
          position: "relative", overflow: "hidden" }}>
          <div className="halo" style={{ inset: "-30% -30% auto auto", width: "120%", height: "120%" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Verification demo · v1</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {stage >= 4 ? <>
                  <Icon.CheckCircle size={14} color="var(--mint)" />
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--mint)" }}>valid</span>
                </> : <>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--signal)",
                    boxShadow: "0 0 0 4px rgba(14,165,233,0.2)" }} />
                  <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>building</span>
                </>}
              </span>
            </div>
            <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              {`{`}<br/>
              &nbsp;&nbsp;"id": "<span style={{ color: "var(--signal)" }}>demo-7s-summary</span>",<br/>
              &nbsp;&nbsp;"athlete": "<span style={{ color: "var(--signal)" }}>minhsweat</span>",<br/>
              &nbsp;&nbsp;"session": {`{`}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"kind": "<span style={{ color: "var(--signal)" }}>run</span>",<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"dist_m": <span style={{ color: "var(--mint)" }}>10412</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"effort_score": <span style={{ color: "var(--mint)" }}>82</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;"zone": <span style={{ color: "var(--mint)" }}>3</span><br/>
              &nbsp;&nbsp;{`}`},<br/>
              &nbsp;&nbsp;"device": "<span style={{ color: "var(--signal)" }}>fenix-7s</span>",<br/>
              &nbsp;&nbsp;"verification": "<span style={{ color: "var(--signal)" }}>{stage >= 2 ? "verified-source-ready" : "pending"}</span>",<br/>
              &nbsp;&nbsp;"sv": <span style={{ color: "var(--mint)" }}>{stage >= 4 ? "+48" : "—"}</span><br/>
              {`}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassportStep({ profile, onNav }) {
  return (
    <div className="fade-up" style={{ textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--mint)" }} />
        <span className="t-mono" style={{ fontSize: 11, color: "var(--mint)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Passport minted</span>
      </div>
      <h1 className="t-display" style={{ margin: "0 auto", maxWidth: 720, fontSize: 64 }}>
        Welcome to{" "}
        <span style={{
          backgroundImage: "var(--grad-earned)",
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>PM Sweat.</span>
      </h1>
      <p style={{ color: "var(--muted)", marginTop: 20, maxWidth: 520, marginInline: "auto" }}>
        Your Sweat Pass is ready. Sweat Value will compound as you train. We'll notify you when a sample brand match reaches your tier.
      </p>

      <div style={{
        margin: "48px auto 0", maxWidth: 540, textAlign: "left",
        background: "var(--navy)", color: "white", borderRadius: 16, padding: 28, position: "relative", overflow: "hidden",
        boxShadow: "0 24px 60px rgba(7,19,38,0.18)",
      }}>
        <div className="halo" />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Pm sweat · passport</span>
              <div style={{ marginTop: 18, fontSize: 28, fontWeight: 500 }}>{profile.name}</div>
              <div className="t-mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                pmsweat.com/{profile.handle}
              </div>
            </div>
            <LogoMark size={32} variant="white" />
          </div>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
            background: "rgba(255,255,255,0.1)", padding: 1, borderRadius: 12 }}>
            {[["tier", "01"], ["sv", "0"], ["streak", "—"]].map(([k, v]) => (
              <div key={k} style={{ background: "var(--navy)", padding: 16, borderRadius: 11 }}>
                <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{k}</div>
                <div className="t-mono" style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between",
            paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>summary · demo-7s</span>
            <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>since may 2026</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, display: "inline-flex", gap: 12 }}>
        <button className="btn btn-primary" onClick={() => onNav("dashboard")}>
          Open dashboard <Icon.ArrowRight size={14} />
        </button>
        <button className="btn btn-secondary" onClick={() => onNav("badge")}>See badge tiers</button>
      </div>
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <label style={{ display: "block" }}>
      <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em",
        textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      {children}
      {error
        ? <div style={{ marginTop: 6, fontSize: 12, color: "#ef4444" }}>{error}</div>
        : hint && <div className="t-small" style={{ marginTop: 6 }}>{hint}</div>
      }
    </label>
  );
}

const inputStyle = {
  width: "100%", height: 48, padding: "0 16px",
  border: "1px solid var(--hairline)", borderRadius: 10, background: "white",
  fontFamily: "inherit", fontSize: 15, color: "var(--navy)", outline: "none",
  transition: "border-color 150ms",
};

function PrivacyCallout() {
  return (
    <div style={{
      marginTop: 32, padding: "20px 24px", background: "white", border: "1px solid var(--hairline)",
      borderRadius: 12, display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: "var(--ink-04)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon.Shield size={20} color="var(--indigo)" />
      </div>
      <div>
        <div style={{ fontWeight: 500 }}>Privacy by default</div>
        <div className="t-small" style={{ marginTop: 4 }}>
          We never resell your data. Brands only see your tier and discipline until you accept a match. You can revoke any device or delete your passport from settings at any time.
        </div>
      </div>
    </div>
  );
}
