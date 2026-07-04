"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
    id: string;
    userId?: string; // 🚀 Added to trace ownership comparison matching
    userName: string;
    title: string;
    condition: string;
    remedyUsed: string;
    experience: string;
    createdAt: string;
}

interface CommunityProps {
    isLoggedIn: boolean;
    activeUserId?: string; // 🚀 Added to evaluate active creator permissions
    initialPosts: Post[];
}

export default function CommunityClientPage({ isLoggedIn, activeUserId, initialPosts }: CommunityProps) {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [searchFilter, setSearchFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newCondition, setNewCondition] = useState("");
    const [newRemedy, setNewRemedy] = useState("");
    const [newExperience, setNewExperience] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null); // 🚀 Tracks loading states for single post deletions

    const filteredPosts = posts.filter((p) =>
        p.condition.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.title.toLowerCase().includes(searchFilter.toLowerCase())
    );

    async function handleCreatePost(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoggedIn) { router.push("/auth"); return; }
        if (!newTitle || !newCondition || !newExperience) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, condition: newCondition, remedyUsed: newRemedy, experience: newExperience }),
            });
            if (res.ok) {
                const fresh = await res.json();
                setPosts([fresh, ...posts]);
                setIsModalOpen(false);
                setNewTitle(""); setNewCondition(""); setNewRemedy(""); setNewExperience("");
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setSubmitting(false);
        }
    }

    // 🚀 Added: Hook trigger to call your matching DELETE route endpoint sequence
    async function handleDeletePost(postId: string) {
        if (!confirm("Are you sure you want to completely remove this experience log?")) return;
        setDeletingId(postId);
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });
            
            if (res.ok) {
                // Instantly sync layout view matrices by removing it from the reactive array
                setPosts(posts.filter((p) => p.id !== postId));
            } else {
                const errData = await res.json();
                alert(errData.error || "Failed to drop post log.");
            }
        } catch (err) {
            console.error("Deletion error:", err);
            alert("Internal structural error encountered while tracking cleanup execution.");
        } finally {
            setDeletingId(null);
        }
    }

    function openModal() {
        if (!isLoggedIn) router.push("/auth");
        else setIsModalOpen(true);
    }

    return (
        <>
            <style>{STYLES}</style>
            <div className="cc-root">

                {/* ── NAV ── */}
                <nav className="cc-nav">
                    <a href="/" className="cc-logo">
                        <span className="cc-logo-icon">🌿</span>
                        <span className="cc-logo-text">Vaidya</span>
                    </a>
                    <div className="cc-nav-links">
                        <a href="/" className="cc-nav-link">Home</a>
                        <a href="/about" className="cc-nav-link">About</a>
                        <a href="/community" className="cc-nav-link cc-nav-link-active">Community</a>
                        <a href="/support" className="cc-nav-link">Support</a>
                    </div>
                    {isLoggedIn ? (
                        <button className="cc-nav-cta" onClick={() => router.push("/profile")}>My Profile</button>
                    ) : (
                        <button className="cc-nav-cta" onClick={() => router.push("/auth")}>Ask Vaidya →</button>
                    )}
                </nav>

                {/* ── HERO BAND ── */}
                <div className="cc-hero-bg">
                    <div className="cc-hero">
                        {/* Mandala */}
                        <div className="cc-mandala-wrap" aria-hidden="true">
                            <svg className="cc-mandala-svg" width="220" height="220" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.22" stroke="#1B4332" fill="none" strokeWidth="1">
                                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => (
                                        <ellipse key={d} cx="140" cy="70" rx="12" ry="30" transform={`rotate(${d} 140 140)`} />
                                    ))}
                                </g>
                                <g opacity="0.28" stroke="#B5631A" fill="none" strokeWidth="0.8">
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
                                        <ellipse key={d} cx="140" cy="95" rx="8" ry="20" transform={`rotate(${d} 140 140)`} />
                                    ))}
                                </g>
                                <circle cx="140" cy="140" r="100" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.18" />
                                <circle cx="140" cy="140" r="72" fill="none" stroke="#1B4332" strokeWidth="0.5" opacity="0.18" />
                                <circle cx="140" cy="140" r="46" fill="none" stroke="#B5631A" strokeWidth="0.5" opacity="0.22" />
                                <circle cx="140" cy="140" r="120" fill="none" stroke="#1B4332" strokeWidth="0.4" strokeDasharray="3 8" opacity="0.12" />
                            </svg>
                            <div className="cc-mandala-center">🌿</div>
                        </div>

                        <div className="cc-hero-content">
                            <div className="cc-hero-eyebrow">🌱 Community · Shared wisdom</div>
                            <h1 className="cc-hero-h1">
                                Healing stories from<br /><em>real families</em>
                            </h1>
                            <p className="cc-hero-desc">
                                Browse authentic experiences from people using classical Ayurvedic remedies.
                                Add your own journey and help others on their path to wellness.
                            </p>
                            <div className="cc-hero-btns">
                                <button className="cc-btn-primary" onClick={openModal}>
                                Share your experience
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div className="cc-stats-strip">
                        <div className="cc-stat">
                            <span className="cc-stat-num">{posts.length}</span>
                            <span className="cc-stat-label">Experiences shared</span>
                        </div>
                        <div className="cc-stat-div" />
                        <div className="cc-stat">
                            <span className="cc-stat-num">{Array.from(new Set(posts.map((p) => p.condition))).length || "—"}</span>
                            <span className="cc-stat-label">Conditions covered</span>
                        </div>
                        <div className="cc-stat-div" />
                        <div className="cc-stat">
                            <span className="cc-stat-num">Verified</span>
                            <span className="cc-stat-label">Member-only content</span>
                        </div>
                    </div>
                </div>

                {/* ── MAIN ── */}
                <main className="cc-main">

                    {/* Toolbar */}
                    <div className="cc-toolbar">
                        <div>
                            <h2 className="cc-toolbar-title">Experience Registry</h2>
                            <p className="cc-toolbar-sub">
                                {filteredPosts.length} experience{filteredPosts.length !== 1 ? "s" : ""}
                                {searchFilter ? ` matching "${searchFilter}"` : ""}
                            </p>
                        </div>
                        <div className="cc-toolbar-right">
                            <div className="cc-search-wrap">
                                <span className="cc-search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="cc-search"
                                    placeholder="Filter by condition or title…"
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                />
                            </div>
                            <button className="cc-btn-primary cc-btn-sm" onClick={openModal}>
                                Share Experience
                            </button>
                        </div>
                    </div>

                    {/* Gate banner for logged-out users */}
                    {!isLoggedIn && (
                        <div className="cc-gate-banner">
                            <span className="cc-gate-icon">🔒</span>
                            <div>
                                <div className="cc-gate-title">Join the community to read full experiences</div>
                                <div className="cc-gate-sub">Sign up free — takes less than a minute.</div>
                            </div>
                        </div>
                    )}

                    {/* Feed */}
                    <div className="cc-feed">
                        {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                            <div key={post.id} className="cc-card">

                                {/* Card header */}
                                <div className="cc-card-header">
                                    <div className="cc-card-author-wrap">
                                        <div className="cc-card-avatar">
                                            {post.userName?.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                        <div>
                                            <div className="cc-card-author">{post.userName}</div>
                                            <div className="cc-card-date"> {post.createdAt}</div>
                                        </div>
                                    </div>
                                    
                                    {/* 🚀 Dynamic Action Box containing either Delete or standard badge tags */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        {isLoggedIn && activeUserId && post.userId === activeUserId && (
                                            <button 
                                                className="cc-delete-btn" 
                                                onClick={() => handleDeletePost(post.id)}
                                                disabled={deletingId === post.id}
                                                aria-label="Delete log"
                                            >
                                                {deletingId === post.id ? "..." : "🗑️"}
                                            </button>
                                        )}
                                        <span className="cc-card-badge">{post.condition}</span>
                                    </div>
                                </div>

                                {/* Card body — gated for logged-out */}
                                <div className={isLoggedIn ? "cc-card-body" : "cc-card-body cc-gated"}>
                                    <h2 className="cc-card-title">{post.title}</h2>
                                    {post.remedyUsed && (
                                        <div className="cc-card-remedy">🌿 {post.remedyUsed}</div>
                                    )}
                                    <p className="cc-card-text">
                                        {isLoggedIn
                                            ? post.experience
                                            : "Detailed experience log available to registered members. Sign in to read the full remedy combination, timing, dosage, and outcome..."}
                                    </p>
                                </div>

                                {/* Gate overlay */}
                                {!isLoggedIn && (
                                    <div className="cc-gate-overlay">
                                        <span style={{ fontSize: 22, marginBottom: 8 }}>🔒</span>
                                        <a href="/auth" className="cc-gate-overlay-btn">Log in to read full experience</a>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="cc-empty">
                                <div className="cc-empty-icon">🌱</div>
                                <div className="cc-empty-title">No experiences found</div>
                                <p className="cc-empty-desc">
                                    {searchFilter
                                        ? `Nothing matched "${searchFilter}". Try a different condition or remedy.`
                                        : "Be the first to share your Ayurvedic journey with the community."}
                                </p>
                                <button className="cc-btn-primary" style={{ marginTop: 20 }} onClick={openModal}>
                                    Share your experience
                                </button>
                            </div>
                        )}
                    </div>

                </main>

                {/* ── FOOTER ── */}
                <footer className="cc-footer">
                    <div className="cc-footer-inner">
                        <div className="cc-footer-brand">
                            <div className="cc-footer-logo">
                                <span className="cc-footer-logo-icon">🌿</span>
                                <span className="cc-footer-logo-text">Vaidya</span>
                            </div>
                            <p className="cc-footer-tagline">Ancient Ayurvedic wisdom, grounded in classical texts and made accessible through modern AI.</p>
                            <div className="cc-footer-source-label">Sources indexed</div>
                            <div className="cc-footer-pills">
                                {["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridayam", "Dhanvantari Nighantu"].map((s) => (
                                    <span className="cc-footer-pill" key={s}>{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="cc-footer-col">
                            <div className="cc-footer-col-title">Explore</div>
                            <ul className="cc-footer-links">
                                <li><a href="/chat">Ask Vaidya</a></li>
                                <li><a href="/community">Community Feed</a></li>
                                <li><a href="/profile">My Profile</a></li>
                            </ul>
                        </div>
                        <div className="cc-footer-col">
                            <div className="cc-footer-col-title">Company</div>
                            <ul className="cc-footer-links">
                                <li><a href="/about">About Vaidya</a></li>
                                <li><a href="/about#texts">Classical Texts</a></li>
                                <li><a href="/support">Support</a></li>
                            </ul>
                        </div>
                        <div className="cc-footer-col">
                            <div className="cc-footer-col-title">Legal</div>
                            <ul className="cc-footer-links">
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                                <li><a href="/disclaimer">Medical Disclaimer</a></li>
                            </ul>
                            <div className="cc-footer-disclaimer">
                                ⚠️ Community posts are personal experiences and not medical advice.
                            </div>
                        </div>
                    </div>
                    <div className="cc-footer-bottom">
                        <span>© 2026 Vaidya · Ancient wisdom, responsibly shared.</span>
                        <div className="cc-footer-bottom-links">
                            <a href="/privacy">Privacy</a>
                            <span>·</span>
                            <a href="/terms">Terms</a>
                            <span>·</span>
                            <a href="/support">Support</a>
                        </div>
                    </div>
                </footer>

                {/* ── MODAL ── */}
                {isModalOpen && (
                    <div className="cc-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                        <div className="cc-modal">
                            <div className="cc-modal-header">
                                <div>
                                    <div className="cc-modal-eyebrow">Share with the community</div>
                                    <h3 className="cc-modal-title">Log Your Remedy Experience</h3>
                                </div>
                                <button className="cc-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close">✕</button>
                            </div>

                            <form onSubmit={handleCreatePost} className="cc-form">
                                <div className="cc-field">
                                    <label className="cc-label">Summary title</label>
                                    <input
                                        className="cc-input"
                                        type="text"
                                        placeholder="e.g., Quick relief from seasonal dry cough"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="cc-form-row">
                                    <div className="cc-field">
                                        <label className="cc-label">Health condition</label>
                                        <input
                                            className="cc-input"
                                            type="text"
                                            placeholder="e.g., Dry Cough"
                                            value={newCondition}
                                            onChange={(e) => setNewCondition(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="cc-field">
                                        <label className="cc-label">Remedy / herb used <span className="cc-optional">(optional)</span></label>
                                        <input
                                            className="cc-input"
                                            type="text"
                                            placeholder="e.g., Mulethi & Honey"
                                            value={newRemedy}
                                            onChange={(e) => setNewRemedy(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="cc-field">
                                    <label className="cc-label">Your detailed experience</label>
                                    <textarea
                                        className="cc-textarea"
                                        placeholder="Describe the remedy, how you prepared it, dosage, timing, and what results you noticed…"
                                        value={newExperience}
                                        onChange={(e) => setNewExperience(e.target.value)}
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="cc-modal-note">
                                    ⚠️ Share only personal experiences. Do not provide medical diagnoses or prescriptions.
                                </div>
                                <div className="cc-form-btns">
                                    <button type="button" className="cc-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="cc-btn-submit" disabled={submitting}>
                                        {submitting ? (
                                            <span className="cc-spinner-row"><span className="cc-spinner" /> Publishing…</span>
                                        ) : "Publish experience "}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

// 🚀 Appended explicit CSS token setups for the newly added button interaction configurations
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5EDD8; font-family: 'Inter', sans-serif; }

  .cc-root { min-height: 100vh; font-family: 'Inter', sans-serif; color: #1B1B14; background: #FEFCF7; display: flex; flex-direction: column; }

  /* NAV */
  .cc-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; background: rgba(254,252,247,0.93);
    backdrop-filter: blur(8px); border-bottom: 1px solid #E8DCC8;
    position: sticky; top: 0; z-index: 50;
  }
  .cc-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .cc-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(27,67,50,0.1); border: 1.5px solid rgba(27,67,50,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .cc-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1B4332; }
  .cc-nav-links { display: flex; gap: 28px; }
  .cc-nav-link { font-size: 14px; color: #5C5442; text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .cc-nav-link:hover { color: #1B4332; }
  .cc-nav-link-active { color: #1B4332; border-bottom: 2px solid #1B4332; padding-bottom: 2px; }
  .cc-nav-cta { background: #1B4332; color: #F5EDD8; border: none; padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s; }
  .cc-nav-cta:hover { background: #143626; }

  /* HERO */
  .cc-hero-bg { background: linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 55%, #F0E8D0 100%); }
  .cc-hero { max-width: 1100px; margin: 0 auto; padding: 64px 40px 0; display: grid; grid-template-columns: auto 1fr; gap: 48px; align-items: center; }
  .cc-mandala-wrap { width: 220px; height: 220px; flex-shrink: 0; background: radial-gradient(circle, rgba(27,67,50,0.07) 0%, transparent 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
  .cc-mandala-svg { animation: ccRotate 40s linear infinite; }
  @keyframes ccRotate { to { transform: rotate(360deg); } }
  .cc-mandala-center { position: absolute; font-size: 44px; animation: ccFloat 4s ease-in-out infinite; }
  @keyframes ccFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .cc-hero-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #B5631A; margin-bottom: 12px; }
  .cc-hero-h1 { font-family: 'Playfair Display', serif; font-size: 44px; line-height: 1.12; font-weight: 700; color: #1B1B14; margin-bottom: 16px; }
  .cc-hero-h1 em { font-style: italic; color: #B5631A; }
  .cc-hero-desc { font-size: 16px; color: #5C5442; line-height: 1.75; margin-bottom: 28px; max-width: 480px; }
  .cc-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

  /* Stats strip */
  .cc-stats-strip { background: #1B4332; margin-top: 40px; padding: 16px 40px; display: flex; justify-content: center; gap: 0; }
  .cc-stat { flex: 0 0 auto; text-align: center; padding: 10px 40px; }
  .cc-stat-div { width: 1px; background: rgba(255,255,255,0.12); align-self: stretch; }
  .cc-stat-num { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #F5EDD8; display: block; margin-bottom: 2px; }
  .cc-stat-label { font-size: 11px; color: #7A9E8A; text-transform: uppercase; letter-spacing: 0.07em; }

  /* MAIN */
  .cc-main { flex: 1; max-width: 900px; margin: 0 auto; width: 100%; padding: 40px 20px 64px; }

  /* Toolbar */
  .cc-toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
  .cc-toolbar-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1B4332; }
  .cc-toolbar-sub { font-size: 13px; color: #8C7B64; margin-top: 4px; }
  .cc-toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .cc-search-wrap { position: relative; display: flex; align-items: center; }
  .cc-search-icon { position: absolute; left: 12px; font-size: 13px; pointer-events: none; }
  .cc-search { padding: 10px 14px 10px 34px; border: 1.5px solid #D4C4A8; border-radius: 10px; outline: none; background: #FEFCF7; font-size: 14px; color: #1B1B14; font-family: 'Inter', sans-serif; width: 230px; transition: border-color 0.2s, box-shadow 0.2s; }
  .cc-search::placeholder { color: #A89880; }
  .cc-search:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.08); }

  /* Buttons */
  .cc-btn-primary { background: #1B4332; color: #F5EDD8; border: none; padding: 12px 22px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s, transform 0.1s; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
  .cc-btn-primary:hover { background: #143626; }
  .cc-btn-primary:active { transform: scale(0.98); }
  .cc-btn-sm { padding: 10px 18px; font-size: 13px; }

  /* Delete Action Presets */
  .cc-delete-btn {
    background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.25);
    color: #dc2626; padding: 4px 8px; border-radius: 8px; font-size: 12px;
    cursor: pointer; transition: all 0.15s ease-in-out; display: inline-flex; align-items: center;
  }
  .cc-delete-btn:hover { background: #dc2626; color: #ffffff; border-color: #dc2626; }
  .cc-delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Gate banner */
  .cc-gate-banner { display: flex; align-items: center; gap: 16px; background: rgba(181,99,26,0.07); border: 1px solid rgba(181,99,26,0.22); border-radius: 14px; padding: 16px 20px; margin-bottom: 28px; flex-wrap: wrap; }
  .cc-gate-icon { font-size: 24px; flex-shrink: 0; }
  .cc-gate-title { font-size: 14px; font-weight: 600; color: #6B3A0A; }
  .cc-gate-sub { font-size: 12px; color: #9C6A3A; margin-top: 2px; }

  /* Feed */
  .cc-feed { display: flex; flex-direction: column; gap: 20px; }

  /* Cards */
  .cc-card { background: #FEFCF7; border: 1px solid #E8DCC8; border-radius: 16px; padding: 0; overflow: hidden; position: relative; transition: box-shadow 0.2s, transform 0.2s; }
  .cc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(27,67,50,0.08); }

  .cc-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 24px 14px; border-bottom: 1px solid #EFE5D0; background: #F5EDD8; }
  .cc-card-author-wrap { display: flex; align-items: center; gap: 10px; }
  .cc-card-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1B4332, #2D6A4F); color: #F5EDD8; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid rgba(27,67,50,0.2); }
  .cc-card-author { font-size: 14px; font-weight: 600; color: #1B4332; }
  .cc-card-date { font-size: 11px; color: #8C7B64; margin-top: 1px; }
  .cc-card-badge { font-size: 11px; font-weight: 500; background: rgba(27,67,50,0.08); color: #1B4332; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(27,67,50,0.18); white-space: nowrap; }

  .cc-card-body { padding: 20px 24px 24px; }
  .cc-card-body.cc-gated { filter: blur(5px); opacity: 0.3; user-select: none; pointer-events: none; }
  .cc-card-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: #1B1B14; margin-bottom: 8px; line-height: 1.3; }
  .cc-card-remedy { font-size: 12px; color: #B5631A; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
  .cc-card-text { font-size: 14.5px; color: #5C5442; line-height: 1.7; white-space: pre-wrap; }

  /* Gate overlay on card */
  .cc-gate-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(254,252,247,0.5); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .cc-gate-overlay-btn { background: #1B4332; color: #F5EDD8; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 14px rgba(27,67,50,0.15); transition: background 0.15s; }
  .cc-gate-overlay-btn:hover { background: #143626; }

  /* Empty state */
  .cc-empty { text-align: center; padding: 64px 32px; background: rgba(245,237,216,0.4); border: 1.5px dashed #D4C4A8; border-radius: 16px; }
  .cc-empty-icon { font-size: 40px; margin-bottom: 12px; animation: ccFloat 3s ease-in-out infinite; }
  .cc-empty-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1B4332; margin-bottom: 8px; }
  .cc-empty-desc { font-size: 14px; color: #8C7B64; line-height: 1.65; max-width: 380px; margin: 0 auto; }

  /* FOOTER */
  .cc-footer { background: #0F2B1C; color: #6B9480; margin-top: auto; }
  .cc-footer-inner { max-width: 1100px; margin: 0 auto; padding: 56px 40px 40px; display: grid; grid-template-columns: 2fr 1fr 1fr 1.3fr; gap: 44px; }
  .cc-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .cc-footer-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(245,237,216,0.1); border: 1.5px solid rgba(245,237,216,0.15); display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .cc-footer-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #D4C9A8; }
  .cc-footer-tagline { font-size: 13px; color: #4A6855; line-height: 1.7; margin-bottom: 20px; max-width: 260px; }
  .cc-footer-source-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #3A5845; margin-bottom: 8px; }
  .cc-footer-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .cc-footer-pill { background: rgba(245,237,216,0.05); border: 1px solid rgba(245,237,216,0.1); color: #4A6855; border-radius: 6px; padding: 3px 9px; font-size: 11px; }
  .cc-footer-col-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #A8C4B0; margin-bottom: 14px; }
  .cc-footer-links { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .cc-footer-links a { font-size: 13px; color: #4A6855; text-decoration: none; transition: color 0.15s; }
  .cc-footer-links a:hover { color: #A8C4B0; }
  .cc-footer-disclaimer { margin-top: 18px; font-size: 11.5px; color: #3A5845; line-height: 1.6; background: rgba(245,237,216,0.04); border: 1px solid rgba(245,237,216,0.08); border-radius: 8px; padding: 10px 12px; }
  .cc-footer-bottom { border-top: 1px solid rgba(245,237,216,0.08); padding: 18px 40px; max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #3A5845; }
  .cc-footer-bottom-links { display: flex; align-items: center; gap: 10px; }
  .cc-footer-bottom-links a { color: #3A5845; text-decoration: none; font-size: 12px; transition: color 0.15s; }
  .cc-footer-bottom-links a:hover { color: #6B9480; }
  .cc-footer-bottom-links span { color: #2A4A38; }

  /* MODAL */
  .cc-modal-backdrop { position: fixed; inset: 0; background: rgba(15,43,28,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .cc-modal { background: #FEFCF7; border: 1px solid #E8DCC8; border-radius: 20px; width: 100%; max-width: 540px; box-shadow: 0 16px 48px rgba(0,0,0,0.12); overflow: hidden; }
  .cc-modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 28px 28px 0; }
  .cc-modal-eyebrow { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #B5631A; margin-bottom: 6px; }
  .cc-modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1B4332; }
  .cc-modal-close { background: none; border: none; font-size: 16px; color: #8C7B64; cursor: pointer; padding: 4px; line-height: 1; transition: color 0.15s; flex-shrink: 0; }
  .cc-modal-close:hover { color: #1B1B14; }

  .cc-form { padding: 24px 28px 28px; display: flex; flex-direction: column; gap: 16px; }
  .cc-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .cc-field { display: flex; flex-direction: column; gap: 6px; }
  .cc-label { font-size: 11px; font-weight: 600; color: #3D2E1A; text-transform: uppercase; letter-spacing: 0.07em; }
  .cc-optional { font-weight: 400; color: #A89880; text-transform: none; letter-spacing: 0; }
  .cc-input { background: #F5EDD8; border: 2px solid #C8B89A; border-radius: 10px; padding: 11px 14px; font-size: 14.5px; color: #1B1B14; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; }
  .cc-input::placeholder { color: #A08060; }
  .cc-input:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.1); background: #FEFCF7; }
  .cc-textarea { background: #F5EDD8; border: 2px solid #C8B89A; border-radius: 10px; padding: 11px 14px; font-size: 14.5px; color: #1B1B14; font-family: 'Inter', sans-serif; outline: none; resize: vertical; min-height: 110px; width: 100%; transition: border-color 0.2s, box-shadow 0.2s; }
  .cc-textarea::placeholder { color: #A08060; }
  .cc-textarea:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.1); background: #FEFCF7; }
  .cc-modal-note { font-size: 12px; color: #8C7B64; background: rgba(181,99,26,0.07); border: 1px solid rgba(181,99,26,0.18); border-radius: 8px; padding: 10px 12px; line-height: 1.5; }
  .cc-form-btns { display: flex; justify-content: flex-end; gap: 12px; padding-top: 4px; }
  .cc-btn-cancel { background: none; border: none; color: #8C7B64; font-size: 14px; cursor: pointer; font-family: 'Inter', sans-serif; padding: 10px 4px; transition: color 0.15s; }
  .cc-btn-cancel:hover { color: #1B1B14; }
  .cc-btn-submit { background: #1B4332; color: #F5EDD8; border: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.15s, transform 0.1s; display: flex; align-items: center; gap: 8px; }
  .cc-btn-submit:hover:not(:disabled) { background: #143626; }
  .cc-btn-submit:active:not(:disabled) { transform: scale(0.98); }
  .cc-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .cc-spinner-row { display: flex; align-items: center; gap: 8px; }
  .cc-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(245,237,216,0.3); border-top-color: #F5EDD8; animation: ccSpin 0.7s linear infinite; }
  @keyframes ccSpin { to { transform: rotate(360deg); } }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .cc-hero { grid-template-columns: 1fr; padding: 48px 20px 0; }
    .cc-mandala-wrap { display: none; }
    .cc-hero-h1 { font-size: 32px; }
    .cc-nav-links { display: none; }
    .cc-nav { padding: 16px 20px; }
    .cc-stats-strip { flex-direction: row; flex-wrap: wrap; justify-content: center; }
    .cc-stat { padding: 10px 20px; }
    .cc-footer-inner { grid-template-columns: 1fr 1fr; padding: 40px 20px; }
    .cc-footer-brand { grid-column: 1 / -1; }
    .cc-footer-bottom { flex-direction: column; gap: 8px; text-align: center; padding: 18px 20px; }
  }
  @media (max-width: 600px) {
    .cc-toolbar { flex-direction: column; }
    .cc-search { width: 100%; }
    .cc-search-wrap { width: 100%; }
    .cc-toolbar-right { width: 100%; justify-content: space-between; }
    .cc-form-row { grid-template-columns: 1fr; }
    .cc-footer-inner { grid-template-columns: 1fr; }
    .cc-gate-banner { flex-direction: column; align-items: flex-start; }
  }
`;