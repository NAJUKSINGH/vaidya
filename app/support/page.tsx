"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // 🚀 Added to track active user login state

const FAQS = [
    {
        q: "Is Vaidya a replacement for seeing a doctor?",
        a: "No. Vaidya provides educational information from classical Ayurvedic texts. It is not a medical service and cannot diagnose, treat, or prescribe. Always consult a qualified vaidya or medical doctor for serious, chronic, or acute health conditions.",
    },
    {
        q: "Where do the remedies come from?",
        a: "Every remedy is retrieved from indexed classical texts including Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam, Dhanvantari Nighantu, and Bhavaprakasha Nighantu. The source text, chapter, and verse are cited with each answer.",
    },
    {
        q: "Can Vaidya make up remedies?",
        a: "No. We use Retrieval-Augmented Generation (RAG), which means the AI only answers using content retrieved from our verified text database. It cannot invent remedies or fabricate citations. If the answer isn't in the texts, it will say so.",
    },
    {
        q: "Can I ask questions in Hindi?",
        a: "Yes. Vaidya understands and responds in both Hindi and English. You can switch languages mid-conversation and it will follow your lead.",
    },
    {
        q: "Are the remedies safe?",
        a: "Vaidya flags known contraindications, pregnancy warnings, and situations that require professional supervision. However, individual health conditions vary — always consult a practitioner before starting any new remedy.",
    },
    {
        q: "How do I report an incorrect answer?",
        a: "Use the feedback button in the chat window, or email us at feedback@vaidya.in. Include the question you asked and the response you received. Our team reviews all reports and cross-checks against the source texts.",
    },
    {
        q: "Is my chat history stored?",
        a: "Chat history is stored only for your active session to provide context in conversation. We do not use your questions to train AI models or share them with third parties. See our Privacy Policy for full details.",
    },
    {
        q: "Which Ayurvedic texts are indexed?",
        a: "We currently index Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam, Dhanvantari Nighantu, Bhavaprakasha Nighantu, and Rasaratna Samuccaya. We are continuously adding more texts.",
    },
];

const TOPICS = [
    { label: "Using the chatbot" },
    {  label: "Remedy sources" },
    {  label: "Account & privacy" },
    {  label: "Medical disclaimer" },
    {  label: "Report a bug" },
    {  label: "Feature request" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`vs-faq-item ${open ? "open" : ""}`}>
            <button className="vs-faq-q" onClick={() => setOpen(!open)}>
                <span>{q}</span>
                <span className="vs-faq-arrow">{open ? "−" : "+"}</span>
            </button>
            {open && <div className="vs-faq-a">{a}</div>}
        </div>
    );
}

export default function SupportPage() {
    const router = useRouter();
    const { status } = useSession(); // 🚀 status can be "authenticated", "unauthenticated", or "loading"
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

    // 🚀 Dynamic routing engine based on authentication parameters
    const handleNavigationGate = () => {
        if (status === "authenticated") {
            router.push("/chat");
        } else {
            router.push("/auth");
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Wire this to your actual support API
        setSubmitted(true);
    }

    return (
        <>
            <style>{STYLES}</style>
            <div className="vs-root">

                {/* ── NAV ── */}
                <nav className="vs-nav">
                    <a href="/" className="vs-logo">
                        <span className="vs-logo-icon">🌿</span>
                        <span className="vs-logo-text">Vaidya</span>
                    </a>
                    <div className="vs-nav-links">
                        <a href="/" className="vs-nav-link">Home</a>
                        <a href="/about" className="vs-nav-link">About</a>
                        <a href="/community" className="cc-nav-link cc-nav-link-active">Community</a>
                        <a href="/support" className="vs-nav-link active">Support</a>
                    </div>
                    {/* 🚀 Updated with handleNavigationGate */}
                    <button className="vs-nav-cta" onClick={handleNavigationGate}>
                        Ask Vaidya →
                    </button>
                </nav>

                {/* ── HERO ── */}
                <div className="vs-hero-bg">
                    <div className="vs-hero">
                        <div className="vs-eyebrow">Help & support</div>
                        <h1 className="vs-hero-h1">
                            How can we<br /><em>help you?</em>
                        </h1>
                        <p className="vs-hero-desc">
                            Browse our FAQ, send us a message, or jump straight into a conversation
                            with Vaidya. We're here to make sure you get the most from ancient wisdom.
                        </p>
                        <div className="vs-hero-btns">
                            {/* 🚀 Updated with handleNavigationGate */}
                            <button className="vs-btn-primary" onClick={handleNavigationGate}>
                                🌿 Ask Vaidya directly
                            </button>
                            <a href="#contact" className="vs-btn-secondary">Send a message</a>
                        </div>
                    </div>
                </div>

                {/* ── QUICK HELP TOPICS ── */}
                <div className="vs-trust-bar">
                    {TOPICS.map((t) => (
                        <div className="vs-topic-pill" key={t.label}>
                            {t.label}
                        </div>
                    ))}
                </div>

                {/* ── FAQ ── */}
                <section className="vs-section">
                    <div className="vs-section-eyebrow">Frequently asked questions</div>
                    <h2 className="vs-section-title">Quick answers</h2>
                    <p className="vs-section-sub">
                        Most questions are answered here. If you can't find what you need,
                        use the contact form below.
                    </p>
                    <div className="vs-faq-list">
                        {FAQS.map((f) => (
                            <FaqItem key={f.q} q={f.q} a={f.a} />
                        ))}
                    </div>
                </section>

                {/* ── CONTACT FORM ── */}
                <div className="vs-alt-bg" id="contact">
                    <section className="vs-section">
                        <div className="vs-contact-grid">

                            {/* Left — info */}
                            <div>
                                <div className="vs-section-eyebrow">Get in touch</div>
                                <h2 className="vs-section-title">Send us a message</h2>
                                <p className="vs-section-body">
                                    Our team of Ayurvedic researchers and engineers typically responds
                                    within 24 hours. For urgent medical concerns, please contact a
                                    qualified practitioner directly.
                                </p>
                                <div className="vs-contact-cards">
                                    <div className="vs-contact-card">
                                        <span className="vs-contact-icon"></span>
                                        <div>
                                            <div className="vs-contact-label">Email us</div>
                                            <div className="vs-contact-value">support@vaidya.in</div>
                                        </div>
                                    </div>
                                    <div className="vs-contact-card">
                                        <span className="vs-contact-icon"></span>
                                        <div>
                                            <div className="vs-contact-label">Response time</div>
                                            <div className="vs-contact-value">Within 24 hours</div>
                                        </div>
                                    </div>
                                    <div className="vs-contact-card">
                                        <span className="vs-contact-icon"></span>
                                        <div>
                                            <div className="vs-contact-label">Languages</div>
                                            <div className="vs-contact-value">Hindi & English</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — form */}
                            <div className="vs-form-card">
                                {submitted ? (
                                    <div className="vs-success">
                                        <div className="vs-success-icon">🌿</div>
                                        <h3 className="vs-success-title">Message received!</h3>
                                        <p className="vs-success-body">
                                            Thank you for reaching out. We'll get back to you at{" "}
                                            <strong>{form.email}</strong> within 24 hours.
                                        </p>
                                        <button className="vs-btn-primary" style={{ marginTop: 20 }}
                                            onClick={() => setSubmitted(false)}>
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="vs-form">
                                        <div className="vs-form-row">
                                            <div className="vs-field">
                                                <label className="vs-label">Your name</label>
                                                <input
                                                    className="vs-input"
                                                    placeholder="Arjun Kumar"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="vs-field">
                                                <label className="vs-label">Email address</label>
                                                <input
                                                    className="vs-input"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="vs-field">
                                            <label className="vs-label">Topic</label>
                                            <select
                                                className="vs-input"
                                                value={form.topic}
                                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                                required
                                            >
                                                <option value="">Select a topic…</option>
                                                {TOPICS.map((t) => (
                                                    <option key={t.label} value={t.label}> {t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="vs-field">
                                            <label className="vs-label">Message</label>
                                            <textarea
                                                className="vs-input vs-textarea"
                                                placeholder="Describe your question or issue in detail…"
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                rows={5}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="vs-submit-btn">
                                            Send message →
                                        </button>
                                        <p className="vs-form-note">
                                            Do not share personal medical information in this form.
                                            For health advice, use the chatbot.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── CTA ── */}
                <div className="vs-cta-outer">
                    <div className="vs-cta">
                        <h2 className="vs-cta-title">Still have a question?</h2>
                        <p className="vs-cta-sub">Vaidya is online 24/7 and ready to share ancient wisdom.</p>
                        {/* Updated with handleNavigationGate */}
                        <button className="vs-cta-btn" onClick={handleNavigationGate}>
                            Start a conversation →
                        </button>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <footer className="vs-footer">
                    <div className="vs-footer-logo">🌿 Vaidya</div>
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

  .vs-root { font-family: 'Inter', sans-serif; background: #FEFCF7; color: #1B1B14; overflow-x: hidden; }

  /* NAV */
  .vs-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; background: rgba(254,252,247,0.93);
    backdrop-filter: blur(8px); border-bottom: 1px solid #E8DCC8;
    position: sticky; top: 0; z-index: 50;
  }
  .vs-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .vs-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(27,67,50,0.1); border: 1.5px solid rgba(27,67,50,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .vs-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1B4332; }
  .vs-nav-links { display: flex; gap: 28px; }
  .vs-nav-link { font-size: 14px; color: #5C5442; text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .vs-nav-link:hover, .vs-nav-link.active { color: #1B4332; }
  .vs-nav-link.active { border-bottom: 2px solid #1B4332; padding-bottom: 2px; }
  .vs-nav-cta {
    background: #1B4332; color: #F5EDD8; border: none;
    padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .vs-nav-cta:hover { background: #143626; }

  /* HERO */
  .vs-hero-bg { background: linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 55%, #F0E8D0 100%); }
  .vs-hero { max-width: 720px; margin: 0 auto; padding: 80px 40px 64px; text-align: center; }
  .vs-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .vs-hero-h1 { font-family: 'Playfair Display', serif; font-size: 52px; line-height: 1.1; font-weight: 700; color: #1B1B14; margin-bottom: 20px; }
  .vs-hero-h1 em { font-style: italic; color: #B5631A; }
  .vs-hero-desc { font-size: 17px; color: #5C5442; line-height: 1.75; margin-bottom: 32px; }
  .vs-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .vs-btn-primary {
    background: #1B4332; color: #F5EDD8; border: none;
    padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .vs-btn-primary:hover { background: #143626; }
  .vs-btn-secondary {
    background: transparent; color: #1B4332; border: 1.5px solid #1B4332;
    padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; text-decoration: none;
    display: inline-flex; align-items: center; transition: background 0.15s;
  }
  .vs-btn-secondary:hover { background: rgba(27,67,50,0.06); }

  /* TOPIC BAR */
  .vs-trust-bar {
    background: #1B4332; padding: 18px 40px;
    display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;
  }
  .vs-topic-pill {
    display: flex; align-items: center; gap: 7px;
    background: rgba(245,237,216,0.12); border: 1px solid rgba(245,237,216,0.2);
    color: #D4C9A8; border-radius: 20px; padding: 6px 16px;
    font-size: 13px; font-weight: 500; white-space: nowrap;
  }

  /* SECTIONS */
  .vs-section { padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
  .vs-alt-bg { background: #F5EDD8; }
  .vs-section-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .vs-section-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #1B1B14; line-height: 1.2; margin-bottom: 14px; }
  .vs-section-sub { font-size: 16px; color: #5C5442; max-width: 540px; line-height: 1.7; margin-bottom: 36px; }
  .vs-section-body { font-size: 15px; color: #5C5442; line-height: 1.75; max-width: 480px; }

  /* FAQ */
  .vs-faq-list { display: flex; flex-direction: column; gap: 0; border: 1px solid #E8DCC8; border-radius: 16px; overflow: hidden; }
  .vs-faq-item { border-bottom: 1px solid #E8DCC8; }
  .vs-faq-item:last-child { border-bottom: none; }
  .vs-faq-item.open { background: #F5EDD8; }
  .vs-faq-q {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    gap: 16px; padding: 18px 24px; background: transparent; border: none;
    font-size: 15px; font-weight: 500; color: #1B1B14; cursor: pointer;
    text-align: left; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .vs-faq-q:hover { background: rgba(27,67,50,0.04); }
  .vs-faq-arrow { font-size: 20px; color: #1B4332; flex-shrink: 0; font-weight: 400; }
  .vs-faq-a { padding: 0 24px 18px; font-size: 14.5px; color: #5C5442; line-height: 1.75; }

  /* CONTACT */
  .vs-contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: start; }
  .vs-contact-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 28px; }
  .vs-contact-card {
    display: flex; align-items: center; gap: 14px;
    background: #FEFCF7; border: 1px solid #E8DCC8;
    border-radius: 12px; padding: 14px 18px;
  }
  .vs-contact-icon { font-size: 22px; flex-shrink: 0; }
  .vs-contact-label { font-size: 11px; color: #8C7B64; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  .vs-contact-value { font-size: 14px; font-weight: 500; color: #1B1B14; }

  /* FORM */
  .vs-form-card {
    background: #FEFCF7; border: 1px solid #E8DCC8;
    border-radius: 20px; padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(27,67,50,0.07);
  }
  .vs-form { display: flex; flex-direction: column; gap: 18px; }
  .vs-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .vs-field { display: flex; flex-direction: column; gap: 6px; }
  .vs-label { font-size: 12px; font-weight: 500; color: #5C5442; text-transform: uppercase; letter-spacing: 0.06em; }
  .vs-input {
    background: #F5EDD8; border: 1.5px solid #D4C4A8;
    border-radius: 10px; padding: 11px 14px;
    font-size: 14.5px; color: #1B1B14; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none; width: 100%;
  }
  .vs-input::placeholder { color: #A89880; }
  .vs-input:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.08); }
  .vs-textarea { resize: vertical; min-height: 100px; }
  .vs-submit-btn {
    background: #1B4332; color: #F5EDD8; border: none;
    padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s, transform 0.1s; width: 100%;
  }
  .vs-submit-btn:hover   { background: #143626; }
  .vs-submit-btn:active { transform: scale(0.98); }
  .vs-form-note { font-size: 12px; color: #8C7B64; text-align: center; line-height: 1.5; }

  /* SUCCESS */
  .vs-success { text-align: center; padding: 20px 0; }
  .vs-success-icon { font-size: 48px; margin-bottom: 16px; animation: vaFloat 3s ease-in-out infinite; }
  @keyframes vaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .vs-success-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1B4332; margin-bottom: 12px; }
  .vs-success-body { font-size: 14.5px; color: #5C5442; line-height: 1.7; }

  /* CTA */
  .vs-cta-outer { padding: 0 40px 72px; }
  .vs-cta { background: #1B4332; border-radius: 20px; padding: 64px 40px; text-align: center; }
  .vs-cta-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: #F5EDD8; margin-bottom: 14px; }
  .vs-cta-sub { font-size: 16px; color: #A8C4B0; margin-bottom: 28px; }
  .vs-cta-btn {
    background: #F5EDD8; color: #1B4332; border: none;
    padding: 14px 36px; border-radius: 10px; font-size: 16px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s;
  }
  .vs-cta-btn:hover { background: #EDE0C4; }

  /* FOOTER */
  .vs-footer { background: #0F2B1C; color: #6B9480; padding: 40px; text-align: center; font-size: 13px; }
  .vs-footer-logo { font-family: 'Playfair Display', serif; font-size: 22px; color: #A8C4B0; font-weight: 700; margin-bottom: 8px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .vs-hero { padding: 56px 20px 48px; }
    .vs-hero-h1 { font-size: 36px; }
    .vs-nav-links { display: none; }
    .vs-nav { padding: 14px 20px; }
    .vs-section { padding: 48px 20px; }
    .vs-contact-grid { grid-template-columns: 1fr; gap: 32px; }
    .vs-cta-outer { padding: 0 20px 48px; }
    .vs-cta-title { font-size: 28px; }
  }
  @media (max-width: 600px) {
    .vs-form-row { grid-template-columns: 1fr; }
    .vs-form-card { padding: 24px 20px; }
    .vs-trust-bar { gap: 8px; }
    .vs-faq-q { padding: 16px 18px; font-size: 14px; }
    .vs-faq-a { padding: 0 18px 14px; }
  }
`;