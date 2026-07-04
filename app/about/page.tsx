"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // 🚀 Added to track active user login state

const TEAM = [
    {
        initials: "N",
        name: "Najuk Singh",
        role: "Full-Stack Web Developer",
        bio: "Najuk is a full-stack web developer with a passion for building user-friendly applications. She specializes in React and Node.js, and has a keen interest in integrating AI technologies into web platforms.",
    },
    
];

const TEXTS = [
    {  name: "Charaka Samhita", desc: "The foundational text of Ayurvedic medicine, covering internal medicine and herbal formulations." },
    {  name: "Sushruta Samhita", desc: "Ancient surgical treatise also covering wound healing, skin disorders, and herbal preparations." },
    {  name: "Ashtanga Hridayam", desc: "Vagbhata's synthesis of Charaka and Sushruta — the most widely studied Ayurvedic text today." },
    { name: "Dhanvantari Nighantu", desc: "A classical lexicon of medicinal plants, minerals, and their therapeutic properties." },
    {  name: "Bhavaprakasha Nighantu", desc: "16th-century compendium covering herbs, foods, and lifestyle across three major sections." },
    {  name: "Rasaratna Samuccaya", desc: "Covers Rasa Shastra — the Ayurvedic science of minerals, metals, and their medicinal use." },
];

const VALUES = [
    { title: "Source transparency", desc: "Every remedy cites the exact text, chapter, and verse it came from. You always know the origin." },
    {  title: "Safety first", desc: "We flag contraindications, pregnancy warnings, and situations that require a qualified vaidya." },
    {  title: "No hallucinations", desc: "RAG retrieval means the AI only answers from documents — it will not invent remedies." },
    { title: "Multilingual", desc: "Ask in Hindi or English. Nushkas shared in the language they feel most natural." },
];

export default function AboutPage() {
    const router = useRouter();
    const { status } = useSession(); // 🚀 status can be "authenticated", "unauthenticated", or "loading"

    // 🚀 Dynamic routing engine based on authentication parameters
    const handleNavigationGate = () => {
        if (status === "authenticated") {
            router.push("/chat");
        } else {
            router.push("/auth");
        }
    };

    return (
        <>
            <style>{STYLES}</style>
            <div className="va-root">

                {/* ── NAV ── */}
                <nav className="va-nav">
                    <a href="/" className="va-logo">
                        <span className="va-logo-icon">🌿</span>
                        <span className="va-logo-text">Vaidya</span>
                    </a>
                    <div className="va-nav-links">
                        <a href="/" className="va-nav-link">Home</a>
                        <a href="/about" className="va-nav-link active">About</a>
                        <a href="/community" className="cc-nav-link cc-nav-link-active">Community</a>
                        <a href="/support" className="va-nav-link">Support</a>
                    </div>
                    {/* 🚀 Updated with handleNavigationGate */}
                    <button className="va-nav-cta" onClick={handleNavigationGate}>
                        Ask Vaidya →
                    </button>
                </nav>

                {/* ── HERO ── */}
                <div className="va-hero-bg">
                    <div className="va-hero">
                        <div className="va-mandala-wrap" aria-hidden="true">
                            <svg className="va-mandala-svg" width="260" height="260" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.22" stroke="#1B4332" fill="none" strokeWidth="1">
                                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => (
                                        <ellipse key={d} cx="140" cy="70" rx="12" ry="30" transform={`rotate(${d} 140 140)`} />
                                    ))}
                                </g>
                                <g opacity="0.3" stroke="#B5631A" fill="none" strokeWidth="0.8">
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
                                        <ellipse key={d} cx="140" cy="95" rx="8" ry="20" transform={`rotate(${d} 140 140)`} />
                                    ))}
                                </g>
                                <circle cx="140" cy="140" r="100" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.18" />
                                <circle cx="140" cy="140" r="72" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.18" />
                                <circle cx="140" cy="140" r="46" fill="none" stroke="#B5631A" strokeWidth="0.5" opacity="0.25" />
                                <circle cx="140" cy="140" r="120" fill="none" stroke="#1B4332" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.12" />
                            </svg>
                            <div className="va-mandala-center">🌿</div>
                        </div>
                        <div className="va-hero-text">
                            <div className="va-eyebrow">Our story</div>
                            <h1 className="va-hero-h1">
                                Preserving ancient<br /><em>healing wisdom</em><br />for the modern world
                            </h1>
                            <p className="va-hero-desc">
                                Vaidya was born from a simple belief — the remedies passed down through
                                generations of Indian families deserve to be preserved, verified, and made
                                accessible to everyone. We built an AI that reads the original texts so you
                                never have to wonder if a remedy is real or invented.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── TRUST BAR ── */}
                <div className="va-trust-bar">
                    {[
                        { num: "5,000+", label: "Years of tradition" },
                        { num: "1,200+", label: "Remedies indexed" },
                        { num: "50+", label: "Ancient texts sourced" },
                        { num: "100%", label: "Source-cited answers" },
                    ].map((t) => (
                        <div className="va-trust-item" key={t.num}>
                            <span className="va-trust-num">{t.num}</span>
                            <span className="va-trust-label">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── MISSION ── */}
                <section className="va-section">
                    <div className="va-mission">
                        <div>
                            <div className="va-section-eyebrow">Our mission</div>
                            <h2 className="va-section-title">Why Vaidya exists</h2>
                            <p className="va-section-body">
                                Millions of Indians carry fragments of Ayurvedic knowledge — a grandmother's
                                kadha recipe, a father's advice about turmeric. But this oral tradition is
                                fragile. We built Vaidya to anchor that knowledge in verified primary sources,
                                so it can never be lost or distorted.
                            </p>
                            <p className="va-section-body" style={{ marginTop: 16 }}>
                                Our RAG (Retrieval-Augmented Generation) system searches classical texts before
                                every response. The AI never guesses — if the answer isn't in the texts,
                                it says so. This makes Vaidya fundamentally different from a generic chatbot.
                            </p>
                            {/* 🚀 Updated with handleNavigationGate */}
                            <button className="va-btn-primary" style={{ marginTop: 28 }} onClick={handleNavigationGate}>
                                Experience it yourself →
                            </button>
                        </div>
                        <div className="va-mission-cards">
                            {VALUES.map((v) => (
                                <div className="va-value-card" key={v.title}>
                                    {/* <div className="va-value-icon">{v.icon}</div> */}
                                    <div>
                                        <div className="va-value-title">{v.title}</div>
                                        <div className="va-value-desc">{v.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── HOW RAG WORKS ── */}
                <div className="va-alt-bg">
                    <section className="va-section">
                        <div className="va-section-eyebrow">The technology</div>
                        <h2 className="va-section-title">How RAG keeps answers honest</h2>
                        <p className="va-section-sub">
                            Traditional AI models hallucinate — they confidently generate plausible-sounding
                            but false information. Vaidya uses a different approach.
                        </p>
                        <div className="va-rag-steps">
                            {[
                                { n: "1",title: "You ask a question", desc: "In plain Hindi or English — describe your ailment, herb, or curiosity." },
                                { n: "2", title: "We search the texts", desc: "A vector search finds the most relevant passages across all indexed classical texts." },
                                { n: "3", title: "Context is retrieved", desc: "Only verified, relevant excerpts are passed to the AI — nothing from outside the texts." },
                                { n: "4",  title: "Grounded answer is generated", desc: "The AI synthesises the retrieved passages into a clear, readable answer with its source." },
                            ].map((s) => (
                                <div className="va-rag-step" key={s.n}>
                                    <div className="va-rag-num">{s.n}</div>
                                    {/* <div className="va-rag-icon">{s.icon}</div> */}
                                    <div className="va-rag-title">{s.title}</div>
                                    <p className="va-rag-desc">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── TEXTS ── */}
                <section className="va-section">
                    <div className="va-section-eyebrow">Our sources</div>
                    <h2 className="va-section-title">The classical texts we index</h2>
                    <p className="va-section-sub">
                        Every remedy in Vaidya traces back to one of these primary sources — translated,
                        verified, and indexed by our team of Ayurvedic researchers.
                    </p>
                    <div className="va-texts-grid">
                        {TEXTS.map((t) => (
                            <div className="va-text-card" key={t.name}>
                                {/* <div className="va-text-icon">{t.icon}</div> */}
                                <div className="va-text-name">{t.name}</div>
                                <p className="va-text-desc">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── TEAM ── */}
                <div className="va-alt-bg">
                    <section className="va-section">
                        <div className="va-section-eyebrow">The people</div>
                        <h2 className="va-section-title">Who built Vaidya</h2>
                        <div className="va-team-grid">
                            {TEAM.map((m) => (
                                <div className="va-team-card" key={m.name}>
                                    <div className="va-team-avatar">{m.initials}</div>
                                    <div className="va-team-name">{m.name}</div>
                                    <div className="va-team-role">{m.role}</div>
                                    <p className="va-team-bio">{m.bio}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── DISCLAIMER ── */}
                <section className="va-section">
                    <div className="va-disclaimer-box">
                        <div className="va-disclaimer-icon">⚕️</div>
                        <div>
                            <div className="va-disclaimer-title">Medical disclaimer</div>
                            <p className="va-disclaimer-body">
                                Vaidya is an informational tool, not a medical service. The remedies and
                                guidance provided are drawn from classical Ayurvedic literature and are
                                intended for educational purposes only. They are not a substitute for
                                professional medical advice, diagnosis, or treatment. Always consult a
                                qualified Ayurvedic practitioner or medical doctor before beginning any
                                new health regimen, especially for serious, chronic, or acute conditions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <div className="va-cta-outer">
                    <div className="va-cta">
                        <h2 className="va-cta-title">Ready to explore ancient wisdom?</h2>
                        <p className="va-cta-sub">Free to try. Rooted in real texts.</p>
                        {/* 🚀 Updated with handleNavigationGate */}
                        <button className="va-cta-btn" onClick={handleNavigationGate}>
                            Start asking Vaidya →
                        </button>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <footer className="va-footer">
                    <div className="va-footer-logo">🌿 Vaidya</div>
                    <p>Grounded in Charaka Samhita · Sushruta Samhita · Ashtanga Hridayam · Dhanvantari Nighantu and more.</p>
                    <p style={{ marginTop: 8, fontSize: 12 }}>© 2026 Vaidya · Ancient wisdom, responsibly shared.</p>
                </footer>

            </div>
        </>
    );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5EDD8; font-family: 'Inter', sans-serif; }

  .va-root { font-family: 'Inter', sans-serif; background: #FEFCF7; color: #1B1B14; overflow-x: hidden; }

  /* NAV */
  .va-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; background: rgba(254,252,247,0.93);
    backdrop-filter: blur(8px); border-bottom: 1px solid #E8DCC8;
    position: sticky; top: 0; z-index: 50;
  }
  .va-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .va-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(27,67,50,0.1); border: 1.5px solid rgba(27,67,50,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .va-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1B4332; }
  .va-nav-links { display: flex; gap: 28px; }
  .va-nav-link { font-size: 14px; color: #5C5442; text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .va-nav-link:hover, .va-nav-link.active { color: #1B4332; }
  .va-nav-link.active { border-bottom: 2px solid #1B4332; padding-bottom: 2px; }
  .va-nav-cta {
    background: #1B4332; color: #F5EDD8; border: none;
    padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .va-nav-cta:hover { background: #143626; }

  /* HERO */
  .va-hero-bg { background: linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 55%, #F0E8D0 100%); }
  .va-hero {
    max-width: 1100px; margin: 0 auto; padding: 72px 40px 60px;
    display: grid; grid-template-columns: auto 1fr; gap: 56px; align-items: center;
  }
  .va-mandala-wrap {
    width: 260px; height: 260px; flex-shrink: 0;
    background: radial-gradient(circle, rgba(27,67,50,0.07) 0%, transparent 70%);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .va-mandala-svg { animation: vaMandala 40s linear infinite; }
  @keyframes vaMandala { to { transform: rotate(360deg); } }
  .va-mandala-center { position: absolute; font-size: 48px; animation: vaFloat 4s ease-in-out infinite; }
  @keyframes vaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .va-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .va-hero-h1 { font-family: 'Playfair Display', serif; font-size: 46px; line-height: 1.12; font-weight: 700; color: #1B1B14; margin-bottom: 20px; }
  .va-hero-h1 em { font-style: italic; color: #B5631A; }
  .va-hero-desc { font-size: 16px; color: #5C5442; line-height: 1.75; max-width: 480px; }

  /* TRUST BAR */
  .va-trust-bar {
    background: #1B4332; padding: 18px 40px;
    display: flex; justify-content: center; gap: 60px; flex-wrap: wrap;
  }
  .va-trust-item { text-align: center; color: #B8D4C0; }
  .va-trust-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #F5EDD8; display: block; }
  .va-trust-label { font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }

  /* SECTIONS */
  .va-section { padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
  .va-alt-bg { background: #F5EDD8; }
  .va-alt-bg .va-section { max-width: 100%; padding: 72px 40px; }
  .va-alt-bg .va-section > * { max-width: 1100px; margin-left: auto; margin-right: auto; }
  .va-section-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .va-section-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #1B1B14; line-height: 1.2; margin-bottom: 14px; }
  .va-section-sub { font-size: 16px; color: #5C5442; max-width: 540px; line-height: 1.7; }
  .va-section-body { font-size: 15.5px; color: #5C5442; line-height: 1.75; max-width: 520px; }

  /* MISSION */
  .va-mission { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
  .va-mission-cards { display: flex; flex-direction: column; gap: 14px; }
  .va-value-card {
    display: flex; gap: 14px; align-items: flex-start;
    background: #F5EDD8; border: 1px solid #E0CFA8;
    border-radius: 12px; padding: 16px;
  }
  .va-value-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
  .va-value-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: #1B1B14; margin-bottom: 4px; }
  .va-value-desc { font-size: 13.5px; color: #5C5442; line-height: 1.6; }
  .va-btn-primary {
    background: #1B4332; color: #F5EDD8; border: none;
    padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
    display: inline-block;
  }
  .va-btn-primary:hover { background: #143626; }

  /* RAG STEPS */
  .va-rag-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
  .va-rag-step { text-align: center; }
  .va-rag-num {
    width: 44px; height: 44px; border-radius: 50%;
    background: #1B4332; color: #F5EDD8;
    font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
  }
  .va-rag-icon { font-size: 26px; margin-bottom: 10px; }
  .va-rag-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: #1B1B14; margin-bottom: 8px; }
  .va-rag-desc { font-size: 13.5px; color: #5C5442; line-height: 1.65; }

  /* TEXTS GRID */
  .va-texts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 40px; }
  .va-text-card {
    background: #F5EDD8; border: 1px solid #E0CFA8;
    border-radius: 14px; padding: 24px 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .va-text-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(27,67,50,0.1); }
  .va-text-icon { font-size: 28px; margin-bottom: 10px; }
  .va-text-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: #1B1B14; margin-bottom: 8px; }
  .va-text-desc { font-size: 13.5px; color: #5C5442; line-height: 1.65; }

  /* TEAM */
  .va-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
  .va-team-card {
    background: #FEFCF7; border: 1px solid #E8DCC8;
    border-radius: 16px; padding: 28px 24px; text-align: center;
  }
  .va-team-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #1B4332, #2D6A4F);
    color: #F5EDD8; font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px; border: 2px solid #E0CFA8;
  }
  .va-team-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #1B1B14; margin-bottom: 4px; }
  .va-team-role { font-size: 12px; color: #B5631A; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
  .va-team-bio { font-size: 13.5px; color: #5C5442; line-height: 1.65; }

  /* DISCLAIMER */
  .va-disclaimer-box {
    display: flex; gap: 20px; align-items: flex-start;
    background: rgba(181,99,26,0.07); border: 1px solid rgba(181,99,26,0.22);
    border-radius: 16px; padding: 28px 32px;
  }
  .va-disclaimer-icon { font-size: 32px; flex-shrink: 0; }
  .va-disclaimer-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #8C5A1A; margin-bottom: 10px; }
  .va-disclaimer-body { font-size: 14px; color: #7A5020; line-height: 1.75; }

  /* CTA */
  .va-cta-outer { padding: 0 40px 72px; }
  .va-cta { background: #1B4332; border-radius: 20px; padding: 64px 40px; text-align: center; }
  .va-cta-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: #F5EDD8; margin-bottom: 14px; }
  .va-cta-sub { font-size: 16px; color: #A8C4B0; margin-bottom: 28px; }
  .va-cta-btn {
    background: #F5EDD8; color: #1B4332; border: none;
    padding: 14px 36px; border-radius: 10px; font-size: 16px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .va-cta-btn:hover { background: #EDE0C4; }

  /* FOOTER */
  .va-footer { background: #0F2B1C; color: #6B9480; padding: 40px; text-align: center; font-size: 13px; }
  .va-footer-logo { font-family: 'Playfair Display', serif; font-size: 22px; color: #A8C4B0; font-weight: 700; margin-bottom: 8px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .va-hero { grid-template-columns: 1fr; padding: 48px 20px 40px; }
    .va-mandala-wrap { display: none; }
    .va-hero-h1 { font-size: 34px; }
    .va-mission { grid-template-columns: 1fr; }
    .va-rag-steps { grid-template-columns: repeat(2, 1fr); }
    .va-texts-grid { grid-template-columns: repeat(2, 1fr); }
    .va-team-grid { grid-template-columns: 1fr; }
    .va-nav-links { display: none; }
    .va-nav { padding: 14px 20px; }
    .va-section { padding: 48px 20px; }
    .va-cta-outer { padding: 0 20px 48px; }
    .va-cta-title { font-size: 28px; }
  }
  @media (max-width: 600px) {
    .va-rag-steps { grid-template-columns: 1fr; }
    .va-texts-grid { grid-template-columns: 1fr; }
    .va-trust-bar { gap: 28px; }
    .va-disclaimer-box { flex-direction: column; gap: 12px; padding: 20px; }
  }
`;