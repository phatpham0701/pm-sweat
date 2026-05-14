import React from 'react';
import { Icon } from '../components/brand';
import { PublicNav, Footer } from '../components/chrome';

export default function Partners({ onNav }) {
  return (
    <div>
      <section style={{ background: "var(--navy)", color: "white", position: "relative", overflow: "hidden" }}>
        <div className="halo" style={{ inset: "-30% auto auto -10%", width: "70%", height: "80%",
          background: "radial-gradient(closest-side, rgba(16,185,129,0.20), rgba(14,165,233,0.08) 50%, transparent 70%)" }} />
        <div className="container" style={{ position: "relative" }}>
          <PublicNav onDark={true} onNav={onNav} route="partners" />

          <div style={{ padding: "80px 0 96px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end" }}>
            <div>
              <div className="t-mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)", marginBottom: 28 }}>
                For brand partners <span style={{ opacity: 0.35, margin: "0 8px" }}>/</span> verified audiences only
              </div>
              <h1 className="t-display" style={{ margin: 0, color: "white", fontSize: "clamp(56px, 6.2vw, 92px)" }}>
                Reach athletes <br/>whose <span style={{
                  backgroundImage: "var(--grad-momentum)",
                  backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                }}>effort is on record.</span>
              </h1>
              <p style={{ marginTop: 28, maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.72)" }}>
                Premium supplement shops, race organizers, recovery clinics and sportswear retailers use PM Sweat to match offers to athletes by verified tier — not self-reported claims or lookalike audiences.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                <button className="btn btn-onDark">
                  Book a demo <Icon.ArrowRight size={14} />
                </button>
                <button className="btn btn-onDark-ghost">
                  Read the spec
                </button>
              </div>
            </div>
            <CampaignCard />
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: "20px 0",
          fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>17 live partners · sea region</span>
            <div style={{ display: "flex", gap: 36 }}>
              {["ORIGIN SUPPS", "SAIGON TRAIL", "SALT & LIME", "ATELIER RUN", "NORD KIT", "VELO COFFEE", "HYDRA LAB"].map(b => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container" style={{ padding: "120px 0 40px" }}>
        <div className="section-cap">
          <span className="num">01</span>
          <span className="lbl">The pitch</span>
          <span className="line" />
        </div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { k: "01", t: "Verified, not claimed", b: "Every athlete you reach has hardware-attested proof of recent effort. No filled-in surveys, no lookalike segments.", icon: "Verify" },
            { k: "02", t: "Targeted by tier and discipline", b: "Match your offer to athletes by verified tier, primary discipline, and zone profile. No raw biometric ever leaves the device.", icon: "Map" },
            { k: "03", t: "Compensated, not extracted", b: "You pay only for accepted matches. Athletes hold the passport — they choose to engage. We never resell their data.", icon: "Shield" },
          ].map(c => {
            const IC = Icon[c.icon];
            return (
              <div key={c.k} className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em" }}>{c.k}</span>
                  <IC size={16} color="var(--indigo)" />
                </div>
                <h3 className="t-h3" style={{ margin: "0 0 8px" }}>{c.t}</h3>
                <p className="t-small" style={{ margin: 0 }}>{c.b}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TARGETING */}
      <section style={{ background: "#f7f8fa", padding: "120px 0", marginTop: 40 }}>
        <div className="container">
          <div className="section-cap">
            <span className="num">02</span>
            <span className="lbl">Targeting</span>
            <span className="line" />
          </div>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "start" }}>
            <div>
              <h2 className="t-h1" style={{ margin: 0, maxWidth: 460 }}>
                Build an audience that's already moving.
              </h2>
              <p style={{ color: "var(--muted)", marginTop: 20, maxWidth: 460 }}>
                Combine tier, discipline, region, and effort signals. We surface the verified pool size in real time. No raw user data is exposed — only counts.
              </p>
              <ul style={{ marginTop: 28, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Pool size, live", "Counts update as you tune filters"],
                  ["No raw export", "Targeting happens server-side, against signed proofs"],
                  ["Athlete opt-in per offer", "Every match requires explicit accept"],
                ].map(([k, v]) => (
                  <li key={k} style={{ display: "flex", gap: 14 }}>
                    <Icon.CheckCircle size={20} color="var(--mint)" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{k}</div>
                      <div className="t-small">{v}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <TargetingTool />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="container" style={{ padding: "120px 0 40px" }}>
        <div className="section-cap">
          <span className="num">03</span>
          <span className="lbl">Pricing</span>
          <span className="line" />
        </div>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 56, alignItems: "start" }}>
          <h2 className="t-h1" style={{ margin: 0 }}>Pay per accepted match. <span style={{ color: "var(--muted)" }}>Never per impression.</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { name: "Starter", price: "$0.40", unit: "per accepted match", lim: "Tier 1–2 audience · self-serve", pop: false },
              { name: "Verified", price: "$1.20", unit: "per accepted match", lim: "Tier 1–4 · campaign tools · api", pop: true },
              { name: "Endemic", price: "Custom", unit: "annual partner", lim: "All tiers · co-branded badges · api", pop: false },
            ].map(p => (
              <div key={p.name} style={{
                padding: 28, borderRadius: 16,
                background: p.pop ? "var(--navy)" : "white",
                color: p.pop ? "white" : "var(--navy)",
                border: p.pop ? "1px solid var(--navy)" : "1px solid var(--hairline)",
                position: "relative",
              }}>
                {p.pop && (
                  <span style={{ position: "absolute", top: 16, right: 16,
                    fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                    color: "var(--mint)", textTransform: "uppercase" }}>Most chosen</span>
                )}
                <div className="t-mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: p.pop ? "rgba(255,255,255,0.55)" : "var(--muted)" }}>{p.name}</div>
                <div style={{ marginTop: 20 }}>
                  <span className="t-mono" style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em" }}>{p.price}</span>
                  <span className="t-mono" style={{ fontSize: 12, marginLeft: 8,
                    color: p.pop ? "rgba(255,255,255,0.6)" : "var(--muted)" }}>{p.unit}</span>
                </div>
                <p style={{ fontSize: 13, marginTop: 14, marginBottom: 24,
                  color: p.pop ? "rgba(255,255,255,0.65)" : "var(--muted)" }}>{p.lim}</p>
                <button className={`btn btn-sm ${p.pop ? "btn-onDark" : "btn-secondary"}`} style={{ width: "100%", justifyContent: "center" }}>
                  {p.name === "Endemic" ? "Talk to us" : "Start campaign"} <Icon.ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="container" style={{ padding: "80px 0 40px" }}>
        <div style={{
          background: "white", border: "1px solid var(--hairline)", borderRadius: 20, padding: 56,
          display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center",
        }}>
          <div>
            <span className="t-eyebrow">Case · origin supps</span>
            <h2 className="t-h2" style={{ marginTop: 12, marginBottom: 16, maxWidth: 480 }}>
              "We stopped buying impressions. We started funding athletes who actually train."
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 0, maxWidth: 480 }}>
              Origin Supps replaced their lookalike Meta spend with PM Sweat tier 3 matches. CAC dropped 62%, repeat purchase doubled, and brand trust scores hit category-best in three months.
            </p>
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: "var(--grad-momentum)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500 }}>LH</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Linh Hoàng</div>
                <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)" }}>head of growth · origin supps</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--hairline)",
            border: "1px solid var(--hairline)", borderRadius: 12, overflow: "hidden" }}>
            {[["CAC change", "−62%"], ["Repeat purchase", "2.1×"], ["Match acceptance", "84%"], ["Brand trust score", "Top 1"]].map(([k, v]) => (
              <div key={k} style={{ background: "white", padding: 24 }}>
                <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{k}</div>
                <div className="t-mono" style={{ fontSize: 32, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ padding: "80px 0 0" }}>
        <div style={{ textAlign: "center", padding: "64px 0", borderTop: "1px solid var(--hairline)" }}>
          <h2 className="t-h1" style={{ margin: 0, maxWidth: 760, marginInline: "auto" }}>
            Talk to verified athletes. <span style={{ color: "var(--muted)" }}>Or keep buying impressions.</span>
          </h2>
          <div style={{ marginTop: 32, display: "inline-flex", gap: 12 }}>
            <button className="btn btn-primary">Book a 20 min demo <Icon.ArrowRight size={14} /></button>
            <button className="btn btn-secondary">Read the api docs</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CampaignCard() {
  return (
    <div style={{
      borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.10)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
      position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Campaign · live</span>
        <span className="tier tier-4">Active</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 500, color: "white" }}>Origin Supps · whey starter</div>
      <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
        tier 3+ · running, cycling · sea region
      </div>

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.10)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[["Pool", "1,284"], ["Accept", "84%"], ["Cpa", "$1.42"]].map(([k, v]) => (
          <div key={k}>
            <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{k}</div>
            <div className="t-mono" style={{ fontSize: 24, fontWeight: 500, color: "white", marginTop: 4, letterSpacing: "-0.02em" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Match feed</div>
        {[["minhsweat", "tier 3 · run", "+1"], ["thanhrun", "tier 3 · run+bike", "+1"], ["loanlift", "tier 3 · strength", "+1"]].map(([h, t, d]) => (
          <div key={h} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{h}</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>{t}</span>
            <span style={{ color: "var(--mint)" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TargetingTool() {
  const [tier, setTier] = React.useState(3);
  const [disciplines, setDisciplines] = React.useState({ run: true, bike: true, swim: false, lift: false });
  const [region, setRegion] = React.useState("sea");

  const counts = [12480, 6240, 3140, 1284, 412];
  const disciplineMult = Object.values(disciplines).filter(Boolean).length / 4;
  const regionMult = region === "global" ? 5 : region === "sea" ? 1 : 0.4;
  const pool = Math.round(counts[tier - 1] * (0.4 + 0.6 * disciplineMult) * regionMult);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--hairline)",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="t-eyebrow">Audience builder</span>
        <span className="t-mono" style={{ fontSize: 11, color: "var(--mint)" }}>● live</span>
      </div>
      <div style={{ padding: 24 }}>
        <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Minimum tier</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(t => (
            <button key={t} onClick={() => setTier(t)}
              style={{
                padding: "10px 0", borderRadius: 8,
                background: t === tier ? "var(--navy)" : "white",
                border: `1px solid ${t === tier ? "var(--navy)" : "var(--hairline)"}`,
                color: t === tier ? "white" : "var(--navy)",
                fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.05em",
                transition: "all 150ms",
              }}>
              T{t}
            </button>
          ))}
        </div>

        <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Disciplines</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 24 }}>
          {[
            { id: "run", label: "Run", icon: "Run" },
            { id: "bike", label: "Bike", icon: "Bike" },
            { id: "swim", label: "Swim", icon: "Swim" },
            { id: "lift", label: "Lift", icon: "Dumbbell" },
          ].map(d => {
            const IC = Icon[d.icon];
            const on = disciplines[d.id];
            return (
              <button key={d.id}
                onClick={() => setDisciplines(s => ({ ...s, [d.id]: !s[d.id] }))}
                style={{
                  padding: 10, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  background: on ? "var(--ink-04)" : "white",
                  border: `1px solid ${on ? "var(--navy)" : "var(--hairline)"}`,
                  transition: "all 150ms",
                }}>
                <IC size={16} color={on ? "var(--navy)" : "var(--muted)"} />
                <span className="t-mono" style={{ fontSize: 11, color: on ? "var(--navy)" : "var(--muted)" }}>{d.label}</span>
              </button>
            );
          })}
        </div>

        <div className="t-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Region</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[["local", "Local"], ["sea", "SEA"], ["global", "Global"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setRegion(id)}
              style={{
                padding: "10px 0", borderRadius: 8,
                background: region === id ? "var(--navy)" : "white",
                border: `1px solid ${region === id ? "var(--navy)" : "var(--hairline)"}`,
                color: region === id ? "white" : "var(--navy)",
                fontFamily: "var(--font-mono)", fontSize: 12,
                transition: "all 150ms",
              }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--navy)", color: "white", padding: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Verified pool</div>
          <div className="t-mono" style={{ fontSize: 36, fontWeight: 500, marginTop: 6, letterSpacing: "-0.025em", color: "white" }}>{pool.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Est. cpa</div>
          <div className="t-mono" style={{ fontSize: 20, color: "var(--mint)", marginTop: 6 }}>
            ${(1.0 + tier * 0.18).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
