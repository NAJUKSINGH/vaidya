"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // 🚀 Added to clear user cookies on logout click

interface Post {
    id: string;
    userName: string;
    title: string;
    condition: string;
    experience: string;
}

interface LandingProps {
    isLoggedIn: boolean;
    communityPosts: Post[];
}

const REMEDIES = [
    { icon: "🫚", name: "Turmeric milk", hint: "Immunity & inflammation" },
    { icon: "🍯", name: "Honey & ginger", hint: "Cold & sore throat" },
    { icon: "🌿", name: "Tulsi kadha", hint: "Fever & congestion" },
    { icon: "🌙", name: "Ashwagandha", hint: "Stress & sleep" },
    { icon: "🍋", name: "Triphala", hint: "Digestion & gut health" },
    { icon: "🧄", name: "Neem paste", hint: "Skin & infections" },
    { icon: "🌸", name: "Brahmi oil", hint: "Memory & hair" },
    { icon: "🫖", name: "Mulethi tea", hint: "Voice & digestion" },
];

const FEATURES = [
    { title: "Grounded in ancient texts", desc: "Every answer traces back to Ayurvedic scripture. RAG ensures nothing is fabricated — only what the texts actually say." },
    { title: "Dosha-aware guidance", desc: "Understands Vata, Pitta, and Kapha constitution to offer personalised remedies suited to your prakriti." },
    { title: "Hindi & English", desc: "Ask in Hindi, get answers in Hindi. Traditional nushkas feel most natural in the language they were passed down." },
    { title: "Source transparency", desc: "See exactly which text each remedy came from. Charaka, Sushruta, Vagbhata — all cited clearly." },
    { title: "Safety-first advice", desc: "Flags contraindications, pregnancy concerns, and remedies that need a vaidya's supervision — always responsible." },
    { title: "Always available", desc: "Dadi's wisdom at 2 AM. Ask about that headache, that cough, that skin rash — any time you need it." },
];

const SAMPLE_QUESTIONS = [
    "What is the Ayurvedic remedy for indigestion?",
    "How to treat acne with Ayurvedic home remedies?",
    "Ayurvedic remedies for better sleep and anxiety?",
    "What is Triphala and how do I use it?",
    "Ayurvedic home remedy for hair fall?",
];

const TESTIMONIALS = [
    { author: "Priya Sharma", role: "Delhi", text: "Vaidya helped me find simple Ayurvedic remedies for digestion issues. Very useful and easy to follow." },
    { author: "Rohan Mehta", role: "Mumbai", text: "I liked that remedies were grounded in classical Ayurvedic texts instead of random internet advice." },
    { author: "Ananya Verma", role: "Bangalore", text: "The prakriti-aware suggestions felt surprisingly personalized and helpful." },
];

export default function LandingPageClient({ isLoggedIn, communityPosts }: LandingProps) {
    const router = useRouter();

    function startChat(question?: string) {
        if (!isLoggedIn) { router.push("/auth"); return; }
        if (question) router.push(`/chat?q=${encodeURIComponent(question)}`);
        else router.push("/profile");
    }

    function handleRemediesClick(e: React.MouseEvent) {
        e.preventDefault();
        router.push(isLoggedIn ? "/chat" : "/auth");
    }

    // 🚀 Handles explicit browser storage flush and hard redirects back to landing root
    async function handleLogout() {
        if (!confirm("Are you sure you want to log out of your session?")) return;
        await signOut({ redirect: true, callbackUrl: "/" });
    }

    return (
        <>
            <style>{STYLES}</style>
            <div className="vd">

                {/* ── NAV ── */}
                <nav>
                    <a href="/" className="nav-logo"><span>🌿</span> Vaidya</a>
                    <div className="nav-links">
                        <button onClick={handleRemediesClick} className="nav-btn">Remedies</button>
                        <a href="/about">About</a>
                        <a href="/community">Community</a>
                        <a href="/support">Support</a>
                    </div>
                    
                    {/* 🚀 Dynamic Action Control Container Group */}
                    <div className="nav-actions-wrap">
                        {isLoggedIn ? (
                            <>
                                <button className="nav-cta" onClick={() => router.push("/profile")}>My Profile</button>
                                <button className="nav-cta btn-logout" onClick={handleLogout}>Sign Out</button>
                            </>
                        ) : (
                            <button className="nav-cta" onClick={() => router.push("/auth")}>Login / Register</button>
                        )}
                    </div>
                </nav>

                {/* ── HERO ── */}
                <div className="hero-bg">
                    <div className="hero">
                        <div>
                            <div className="hero-eyebrow">🌱 Ancient wisdom · Modern AI</div>
                            <h1 className="serif">
                                Healing rooted in<br /><em>5000 years</em> of<br />Ayurvedic wisdom
                            </h1>
                            <p className="hero-desc">
                                Ask Vaidya about traditional home remedies, herbal nushkas, and
                                Ayurvedic treatments — sourced from ancient texts, trusted by generations.
                            </p>
                            <div className="hero-btns">
                                <button className="btn-primary" onClick={() => startChat("What is a good Ayurvedic remedy for a sore throat?")}>Try a free remedy →</button>
                                <button className="btn-secondary" onClick={() => startChat()}>Explore remedies</button>
                            </div>
                        </div>
                        <div className="hero-art">
                            <div className="mandala-wrap">
                                <svg className="mandala-svg" width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <g opacity="0.25" stroke="#1B4332" fill="none" strokeWidth="1">
                                        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                            <ellipse key={deg} cx="140" cy="70" rx="12" ry="30" transform={`rotate(${deg} 140 140)`} />
                                        ))}
                                    </g>
                                    <g opacity="0.35" stroke="#B5631A" fill="none" strokeWidth="0.8">
                                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                            <ellipse key={deg} cx="140" cy="95" rx="8" ry="20" transform={`rotate(${deg} 140 140)`} />
                                        ))}
                                    </g>
                                    <circle cx="140" cy="140" r="100" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.2" />
                                    <circle cx="140" cy="140" r="72" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.2" />
                                    <circle cx="140" cy="140" r="46" fill="none" stroke="#B5631A" strokeWidth="0.5" opacity="0.3" />
                                    <circle cx="140" cy="140" r="24" fill="rgba(27,67,50,0.08)" stroke="#1B4332" strokeWidth="0.5" opacity="0.4" />
                                    <circle cx="140" cy="140" r="120" fill="none" stroke="#1B4332" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.15" />
                                </svg>
                                <div className="mandala-center">🌿</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TRUST BAR ── */}
                <div className="trust-bar">
                    {[
                        { num: "5,000+", label: "Years of Ayurvedic tradition" },
                        { num: "1,200+", label: "Remedies indexed" },
                        { num: "50+", label: "Ancient texts sourced" },
                        { num: "RAG", label: "Grounded AI, no hallucinations" },
                    ].map((t) => (
                        <div className="trust-item" key={t.num}>
                            <span className="trust-num">{t.num}</span>
                            <span className="trust-label">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── HOW IT WORKS ── */}
                <div className="section-wrap">
                    <div className="section-eyebrow">How it works</div>
                    <div className="section-title serif">Ancient knowledge, instantly accessible</div>
                    <p className="section-sub">Vaidya uses Retrieval-Augmented Generation to search verified Ayurvedic texts before every answer — so you get real, grounded wisdom.</p>
                    <div className="how-wrap">
                        {[
                            { n: "1", title: "Ask your question", desc: "Describe your ailment or ask about a specific herb, dosha, or traditional remedy in plain language." },
                            { n: "2", title: "AI searches the texts", desc: "Our RAG system retrieves the most relevant passages from Charaka Samhita, Ashtanga Hridayam, and other ancient sources." },
                            { n: "3", title: "Get grounded wisdom", desc: "Receive a clear remedy with its traditional reasoning — complete with the source it came from, never invented." },
                        ].map((s) => (
                            <div className="how-step" key={s.n}>
                                <div className="step-num">{s.n}</div>
                                <div className="step-title serif">{s.title}</div>
                                <p className="step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── REMEDY HIGHLIGHTS ── */}
                <div className="remedy-bg">
                    <div className="section-wrap">
                        <div className="section-eyebrow">Popular remedies</div>
                        <div className="section-title serif">Nushkas for every need</div>
                        <div className="remedy-grid">
                            {REMEDIES.map((r) => (
                                <div className="remedy-card" key={r.name} onClick={() => startChat(`Tell me about the Ayurvedic remedy: ${r.name}`)} style={{ cursor: "pointer" }}>
                                    <div className="remedy-icon">{r.icon}</div>
                                    <div className="remedy-name serif">{r.name}</div>
                                    <div className="remedy-hint">{r.hint}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── FEATURES ── */}
                <div className="section-wrap">
                    <div className="section-eyebrow">Why Vaidya</div>
                    <div className="section-title serif">More than a chatbot</div>
                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <div className="feat-card" key={f.title}>
                                <div className="feat-title serif">{f.title}</div>
                                <p className="feat-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CHAT DEMO ── */}
                <div className="section-wrap">
                    <div className="chat-demo">
                        <div>
                            <div className="chat-demo-title serif">Ask anything.<br />Get ancient answers.</div>
                            <p className="chat-demo-desc">Try one of these common questions — or start your own conversation:</p>
                            <div className="chat-tags">
                                {SAMPLE_QUESTIONS.map((q) => (
                                    <button key={q} className="chat-tag" onClick={() => startChat(q)}>{q} →</button>
                                ))}
                            </div>
                        </div>
                        <div className="chat-window">
                            <div className="chat-msg user">
                                <div className="chat-av usr">👤</div>
                                <div className="chat-bubble user">Gale mein dard ho raha hai — koi gharelu nushka?</div>
                            </div>
                            <div className="chat-msg">
                                <div className="chat-av ai">🌿</div>
                                <div className="chat-bubble ai">Charaka Samhita mentions Yashtimadhu (mulethi) as the premier herb for throat ailments. Boil half a teaspoon in water, add honey after cooling. Gargle thrice daily.</div>
                            </div>
                            <div className="chat-msg user">
                                <div className="chat-av usr">👤</div>
                                <div className="chat-bubble user">Kaunsi kitab mein likha hai?</div>
                            </div>
                            <div className="chat-msg">
                                <div className="chat-av ai">🌿</div>
                                <div className="chat-bubble ai">Charaka Samhita, Sutra Sthana, Chapter 4, verse 18. Yashtimadhu is listed among Jeevaniyas — life-supporting herbs.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── COMMUNITY FEED ── */}
                <section className="f-section">
                    <div className="f-header">
                        <div className="section-eyebrow">Community Feed</div>
                        <h2 className="section-title serif">Shared Remedial Experiences</h2>
                        <p className="section-sub">Real results from families using classical combinations to track bodily balance.</p>
                    </div>
                    {isLoggedIn && (
                        <div className="f-share-box">
                            <h4 className="serif" style={{ color: "#1B4332", fontSize: "18px" }}>Shared an effective combination lately?</h4>
                            <p style={{ fontSize: "14px", color: "#5C5442", marginTop: "4px" }}>Help others on their wellness journey by logging an experience report from your profile block.</p>
                            <button onClick={() => router.push("/profile")} className="f-share-btn" style={{ border: "none", cursor: "pointer" }}>
                                Write a Experience Post ✍️
                            </button>
                        </div>
                    )}
                    <div className="f-grid">
                        {communityPosts.length > 0 ? communityPosts.map((post) => (
                            <div key={post.id} className="f-card">
                                <div>
                                    <div className="f-card-top">
                                        <span className="f-user">👤 {post.userName}</span>
                                        <span className="f-badge">{post.condition}</span>
                                    </div>
                                    <div className={isLoggedIn ? "" : "f-blur-zone"}>
                                        <h4 className="f-card-title">{post.title}</h4>
                                        <p className="f-card-text">{isLoggedIn ? post.experience : "Formulated standard decoction arrays with precise metric additions to soothe ongoing Pitta disruptions and stomach acidity safely..."}</p>
                                    </div>
                                </div>
                                {!isLoggedIn && (
                                    <div className="f-gate-overlay">
                                        <span style={{ fontSize: "24px", marginBottom: "8px" }}>🔒</span>
                                        <button onClick={() => router.push("/auth")} className="f-gate-btn">Join Community to Read Log</button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="f-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                                <p style={{ color: "#8C7B64" }}>No community logs published yet. Be the first to share your journey!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <div className="testi-bg">
                    <div className="section-wrap">
                        <div className="section-eyebrow">What people say</div>
                        <div className="section-title serif">Trusted by families across India</div>
                        <div className="testi-grid">
                            {TESTIMONIALS.map((t) => (
                                <div className="testi-card" key={t.author}>
                                    <div className="testi-stars">★★★★★</div>
                                    <p className="testi-text">"{t.text}"</p>
                                    <div className="testi-author">{t.author}</div>
                                    <div className="testi-role">{t.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CTA ── */}
                <div className="cta-outer">
                    <div className="cta-section">
                        <h2 className="serif">Your dadi&apos;s nushka,<br />now always with you.</h2>
                        <p>Thousands of years of healing wisdom — one question away. Free to try, no sign-up needed.</p>
                        <button className="cta-btn" onClick={() => startChat()}>Start asking Vaidya →</button>
                        <p className="cta-disclaimer">Not a substitute for professional medical advice. Always consult a qualified vaidya or doctor for serious conditions.</p>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <footer className="vd-footer">
                    <div className="vd-footer-inner">

                        {/* Brand column */}
                        <div className="vd-footer-brand">
                            <div className="vd-footer-logo">
                                <span className="vd-footer-logo-icon">🌿</span>
                                <span className="vd-footer-logo-text">Vaidya</span>
                            </div>
                            <p className="vd-footer-tagline">
                                Ancient Ayurvedic wisdom, grounded in classical texts and made accessible through modern AI.
                            </p>
                            <div className="vd-footer-sources">
                                <div className="vd-footer-source-label">Sources indexed</div>
                                <div className="vd-footer-source-pills">
                                    {["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridayam", "Dhanvantari Nighantu"].map((s) => (
                                        <span className="vd-footer-pill" key={s}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Explore column */}
                        <div className="vd-footer-col">
                            <div className="vd-footer-col-title">Explore</div>
                            <ul className="vd-footer-links">
                                <li><a href="/chat">Ask Vaidya</a></li>
                                <li><a href="/community">Community Feed</a></li>
                                <li><button onClick={handleRemediesClick} className="vd-footer-btn">Browse Remedies</button></li>
                                <li><a href="/profile">My Profile</a></li>
                            </ul>
                        </div>

                        {/* Company column */}
                        <div className="vd-footer-col">
                            <div className="vd-footer-col-title">Company</div>
                            <ul className="vd-footer-links">
                                <li><a href="/about">About Vaidya</a></li>
                                <li><a href="/about#team">Our Team</a></li>
                                <li><a href="/about#texts">Classical Texts</a></li>
                                <li><a href="/support">Support</a></li>
                            </ul>
                        </div>

                        {/* Legal column */}
                        <div className="vd-footer-col">
                            <div className="vd-footer-col-title">Legal</div>
                            <ul className="vd-footer-links">
                                <li><a href="/">Privacy Policy</a></li>
                                <li><a href="/">Terms of Service</a></li>
                                <li><a href="/">Medical Disclaimer</a></li>
                            </ul>
                            <div className="vd-footer-disclaimer">
                                ⚠️ Vaidya is for informational purposes only. Always consult a qualified vaidya or doctor for serious conditions.
                            </div>
                        </div>

                    </div>

                    {/* Bottom bar */}
                    <div className="vd-footer-bottom">
                        <span>© 2026 Vaidya · Ancient wisdom, responsibly shared.</span>
                        <div className="vd-footer-bottom-links">
                            <a href="#">Privacy</a>
                            <span className="vd-footer-sep">·</span>
                            <a href="#">Terms</a>
                            <span className="vd-footer-sep">·</span>
                            <a href="/support">Support</a>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vd { font-family: 'Inter', sans-serif; background: #FEFCF7; color: #1B1B14; line-height: 1.6; overflow-x: hidden; }
  .vd .serif { font-family: 'Playfair Display', serif; }

  /* NAV */
  nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 40px; background: rgba(254,252,247,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid #E8DCC8; position: sticky; top: 0; z-index: 50; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1B4332; display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .nav-links { display: flex; gap: 28px; align-items: center; }
  .nav-links a { font-size: 14px; color: #5C5442; text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .nav-links a:hover { color: #1B4332; }
  .nav-btn { background: none; border: none; font-size: 14px; color: #5C5442; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0; transition: color 0.15s; }
  .nav-btn:hover { color: #1B4332; }
  
  /* 🚀 Actions row box alignment */
  .nav-actions-wrap { display: flex; align-items: center; gap: 10px; }
  .nav-cta { background: #1B4332; color: #F5EDD8; border: none; padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; font-family: 'Inter', sans-serif; white-space: nowrap; }
  .nav-cta:hover { background: #143626; }
  
  /* 🚀 Outlined logout button customization specs */
  .nav-cta.btn-logout { background: transparent; color: #dc2626; border: 1.5px solid rgba(220, 38, 38, 0.25); }
  .nav-cta.btn-logout:hover { background: #dc2626; color: #ffffff; border-color: #dc2626; }

  /* HERO */
  .hero-bg { background: linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 55%, #F0E8D0 100%); }
  .hero { padding: 80px 40px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; max-width: 1100px; margin: 0 auto; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; background: rgba(27,67,50,0.1); color: #1B4332; border: 1px solid rgba(27,67,50,0.2); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 20px; }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: 52px; line-height: 1.12; font-weight: 700; color: #1B1B14; margin-bottom: 20px; }
  .hero h1 em { font-style: italic; color: #B5631A; }
  .hero-desc { font-size: 17px; color: #5C5442; line-height: 1.7; margin-bottom: 32px; max-width: 460px; }
  .btn-primary { background: #1B4332; color: #F5EDD8; border: none; padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .btn-primary:hover { background: #143626; }
  .btn-secondary { background: transparent; color: #1B4332; border: 1.5px solid #1B4332; padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .btn-secondary:hover { background: rgba(27,67,50,0.06); }
  .hero-art { display: flex; align-items: center; justify-content: center; }
  .mandala-wrap { width: 320px; height: 320px; background: radial-gradient(circle, rgba(27,67,50,0.08) 0%, transparent 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
  .mandala-svg { animation: rotateSlow 40s linear infinite; }
  @keyframes rotateSlow { to { transform: rotate(360deg); } }
  .mandala-center { position: absolute; font-size: 56px; animation: floatAnim 4s ease-in-out infinite; }
  @keyframes floatAnim { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  /* TRUST BAR */
  .trust-bar { background: #1B4332; padding: 18px 40px; display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; }
  .trust-item { text-align: center; color: #B8D4C0; }
  .trust-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #F5EDD8; display: block; }
  .trust-label { font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }

  /* SECTIONS */
  .section-wrap { padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
  .section-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: #1B1B14; line-height: 1.2; margin-bottom: 16px; }
  .section-sub { font-size: 16px; color: #5C5442; max-width: 520px; line-height: 1.7; }

  /* HOW IT WORKS */
  .how-wrap { background: #F5EDD8; border-radius: 20px; padding: 56px 40px; margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .how-step { text-align: center; }
  .step-num { width: 48px; height: 48px; border-radius: 50%; background: #1B4332; color: #F5EDD8; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .step-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; color: #1B1B14; margin-bottom: 8px; }
  .step-desc { font-size: 14px; color: #5C5442; line-height: 1.65; }

  /* REMEDIES */
  .remedy-bg { background: #F5EDD8; }
  .remedy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 40px; }
  .remedy-card { background: #FEFCF7; border: 1px solid #E0CFA8; border-radius: 14px; padding: 20px 16px; text-align: center; transition: transform 0.2s; }
  .remedy-card:hover { transform: translateY(-3px); }
  .remedy-icon { font-size: 32px; margin-bottom: 10px; }
  .remedy-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: #1B1B14; margin-bottom: 4px; }
  .remedy-hint { font-size: 12px; color: #8C7B64; }

  /* FEATURES */
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
  .feat-card { background: #FEFCF7; border: 1px solid #E8DCC8; border-radius: 14px; padding: 28px 24px; transition: box-shadow 0.2s, transform 0.2s; }
  .feat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(27,67,50,0.1); }
  .feat-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 500; color: #1B1B14; margin-bottom: 8px; }
  .feat-desc { font-size: 14px; color: #5C5442; line-height: 1.6; }

  /* CHAT DEMO */
  .chat-demo { background: #F5EDD8; border-radius: 20px; padding: 40px; margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
  .chat-demo-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1B1B14; margin-bottom: 12px; }
  .chat-demo-desc { font-size: 15px; color: #5C5442; line-height: 1.65; margin-bottom: 24px; }
  .chat-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .chat-tag { background: rgba(27,67,50,0.1); color: #1B4332; border: 1px solid rgba(27,67,50,0.2); border-radius: 20px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .chat-tag:hover { background: rgba(27,67,50,0.18); }
  .chat-window { background: #1B1B14; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
  .chat-msg { display: flex; gap: 10px; align-items: flex-start; }
  .chat-msg.user { flex-direction: row-reverse; }
  .chat-av { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .chat-av.ai   { background: rgba(27,67,50,0.6); }
  .chat-av.usr { background: rgba(181,99,26,0.4); }
  .chat-bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.6; max-width: 220px; }
  .chat-bubble.ai   { background: rgba(255,255,255,0.08); color: #D4C9B0; border-radius: 4px 12px 12px 12px; }
  .chat-bubble.user { background: rgba(181,99,26,0.3); color: #F5D5B0; border-radius: 12px 4px 12px 12px; }

  /* COMMUNITY */
  .f-section { background: #FEFCF7; padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
  .f-header { text-align: center; margin-bottom: 40px; }
  .f-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  .f-card { background: #FEFCF7; border: 1px solid #E8DCC8; border-radius: 16px; padding: 24px; position: relative; min-height: 200px; display: flex; flex-direction: column; justify-content: space-between; }
  .f-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .f-user { font-weight: 600; font-size: 14px; color: #1B4332; }
  .f-badge { font-size: 11px; font-weight: 500; background: rgba(27,67,50,0.06); color: #1B4332; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(27,67,50,0.15); }
  .f-card-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #1B1B14; margin-bottom: 8px; }
  .f-card-text { font-size: 13.5px; color: #5C5442; line-height: 1.6; }
  .f-blur-zone { filter: blur(5px); opacity: 0.35; user-select: none; pointer-events: none; }
  .f-gate-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(254,252,247,0.4); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; }
  .f-gate-btn { background: #1B4332; color: #F5EDD8; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(27,67,50,0.12); }
  .f-share-box { background: #F5EDD8; border: 1px solid #E0CFA8; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 36px; }
  .f-share-btn { display: inline-block; background: #1B4332; color: #F5EDD8; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 8px; margin-top: 12px; font-family: 'Inter', sans-serif; }

  /* TESTIMONIALS */
  .testi-bg { background: #F5EDD8; }
  .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 40px; }
  .testi-card { background: #FEFCF7; border: 1px solid #E8DCC8; border-radius: 14px; padding: 24px; }
  .testi-stars { color: #B5631A; font-size: 14px; margin-bottom: 12px; }
  .testi-text { font-size: 14px; color: #5C5442; line-height: 1.65; margin-bottom: 16px; font-style: italic; }
  .testi-author { font-size: 13px; font-weight: 500; color: #1B1B14; }
  .testi-role { font-size: 12px; color: #8C7B64; }

  /* CTA */
  .cta-outer { padding: 72px 40px; }
  .cta-section { background: #1B4332; border-radius: 20px; padding: 64px 40px; text-align: center; }
  .cta-section h2 { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #F5EDD8; margin-bottom: 16px; }
  .cta-section p { font-size: 16px; color: #A8C4B0; margin-bottom: 32px; }
  .cta-btn { background: #F5EDD8; color: #1B4332; border: none; padding: 15px 36px; border-radius: 10px; font-size: 16px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .cta-btn:hover { background: #EDE0C4; }
  .cta-disclaimer { font-size: 12px; color: #6B9480; margin-top: 16px; }

  /* FOOTER */
  .vd-footer { background: #0F2B1C; color: #6B9480; }
  .vd-footer-inner { max-width: 1100px; margin: 0 auto; padding: 64px 40px 48px; display: grid; grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 48px; }
  .vd-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .vd-footer-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(245,237,216,0.1); border: 1.5px solid rgba(245,237,216,0.18); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .vd-footer-logo-text { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #D4C9A8; }
  .vd-footer-tagline { font-size: 13.5px; color: #5C7A64; line-height: 1.7; margin-bottom: 24px; max-width: 280px; }
  .vd-footer-source-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #3D6050; margin-bottom: 10px; }
  .vd-footer-source-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .vd-footer-pill { background: rgba(245,237,216,0.06); border: 1px solid rgba(245,237,216,0.1); color: #5C7A64; border-radius: 6px; padding: 4px 10px; font-size: 11.5px; }
  .vd-footer-col-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #A8C4B0; margin-bottom: 16px; }
  .vd-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .vd-footer-links a, .vd-footer-btn { font-size: 13.5px; color: #5C7A64; text-decoration: none; transition: color 0.15s; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0; text-align: left; }
  .vd-footer-links a:hover, .vd-footer-btn:hover { color: #A8C4B0; }
  .vd-footer-disclaimer { margin-top: 20px; font-size: 12px; color: #3D6050; line-height: 1.6; background: rgba(245,237,216,0.04); border: 1px solid rgba(245,237,216,0.08); border-radius: 8px; padding: 10px 12px; }
  .vd-footer-bottom { border-top: 1px solid rgba(245,237,216,0.08); padding: 20px 40px; max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #3D6050; }
  .vd-footer-bottom-links { display: flex; align-items: center; gap: 10px; }
  .vd-footer-bottom-links a { color: #3D6050; text-decoration: none; transition: color 0.15s; font-size: 12px; }
  .vd-footer-bottom-links a:hover { color: #6B9480; }
  .vd-footer-sep { color: #2A4A38; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .vd-footer-inner { grid-template-columns: 1fr 1fr; gap: 36px; padding: 48px 20px 36px; }
    .vd-footer-brand { grid-column: 1 / -1; }
    .vd-footer-bottom { flex-direction: column; gap: 10px; text-align: center; padding: 20px; }
  }
  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; padding: 48px 20px 40px; }
    .hero h1 { font-size: 36px; }
    .hero-art { display: none; }
    nav { padding: 14px 20px; }
    .nav-links { display: none; }
    .how-wrap { grid-template-columns: 1fr; }
    .remedy-grid { grid-template-columns: repeat(2, 1fr); }
    .features-grid { grid-template-columns: 1fr; }
    .chat-demo { grid-template-columns: 1fr; }
    .testi-grid { grid-template-columns: 1fr; }
    .trust-bar { gap: 32px; }
    .section-title { font-size: 28px; }
    .cta-section h2 { font-size: 28px; }
    .cta-outer { padding: 48px 20px; }
    .section-wrap { padding: 48px 20px; }
    .f-section { padding: 48px 20px; }
  }
  @media (max-width: 560px) {
    .vd-footer-inner { grid-template-columns: 1fr; }
  }
`;