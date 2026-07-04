"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface ProfileDashboardProps {
  user: { name?: string; email: string; prakriti: string };
  initialSessions: Array<{ id: string; title: string; updatedAt: string }>;
}

export default function ProfileDashboardClient({ user, initialSessions }: ProfileDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

  const filteredSessions = initialSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const indexOfLast = currentPage * sessionsPerPage;
  const indexOfFirst = indexOfLast - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirst, indexOfLast);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "🌿";

  return (
    <>
      <style>{STYLES}</style>

      <div className="pd-root">

        {/* ── TOP NAV ── */}
        <header className="pd-nav">
          <a href="/" className="pd-logo">
            <span className="pd-logo-icon">🌿</span>
            <span className="pd-logo-text">Vaidya</span>
          </a>
          <div className="pd-nav-right">
            <a href="/" className="pd-nav-link">Home</a>
            <a href="/chat" className="pd-nav-link">Remedies</a>
            <a href="/about" className="pd-nav-link">About</a>
          </div>
        </header>

        {/* ── HERO BAND ── */}
        <div className="pd-hero-band">
          {/* Decorative mandala */}
          <svg className="pd-mandala" width="320" height="320" viewBox="0 0 280 280"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g opacity="0.18" stroke="#F5EDD8" fill="none" strokeWidth="1">
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((d) => (
                <ellipse key={d} cx="140" cy="70" rx="12" ry="30" transform={`rotate(${d} 140 140)`} />
              ))}
            </g>
            <g opacity="0.14" stroke="#B5C4B0" fill="none" strokeWidth="0.8">
              {[0,45,90,135,180,225,270,315].map((d) => (
                <ellipse key={d} cx="140" cy="95" rx="8" ry="20" transform={`rotate(${d} 140 140)`} />
              ))}
            </g>
            <circle cx="140" cy="140" r="100" fill="none" stroke="#F5EDD8" strokeWidth="0.5" opacity="0.12"/>
            <circle cx="140" cy="140" r="72" fill="none" stroke="#F5EDD8" strokeWidth="0.5" opacity="0.12"/>
            <circle cx="140" cy="140" r="120" fill="none" stroke="#F5EDD8" strokeWidth="0.4" strokeDasharray="3 8" opacity="0.08"/>
          </svg>

          <div className="pd-hero-inner">
            <div className="pd-avatar">{initials}</div>
            <div>
              <div className="pd-hero-eyebrow">Your Vaidya profile</div>
              <h1 className="pd-hero-name">
                Namaste, {user.name?.split(" ")[0] ?? "Practitioner"} 🙏
              </h1>
              <p className="pd-hero-email">{user.email}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="pd-stats">
            <div className="pd-stat">
              <span className="pd-stat-num">{initialSessions.length}</span>
              <span className="pd-stat-label">Consultations</span>
            </div>
            <div className="pd-stat-divider" />
            <div className="pd-stat">
              <span className="pd-stat-num">{user.prakriti}</span>
              <span className="pd-stat-label">Prakriti</span>
            </div>
            <div className="pd-stat-divider" />
            <div className="pd-stat">
              <span className="pd-stat-num">1,200+</span>
              <span className="pd-stat-label">Remedies available</span>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="pd-body">
          <div className="pd-layout">

            {/* ── LEFT SIDEBAR ── */}
            <aside className="pd-sidebar">

              <div className="pd-sidebar-card">
                <div className="pd-sidebar-section">
                  <div className="pd-sidebar-label">Account</div>
                  <div className="pd-sidebar-info">
                    <span className="pd-info-icon">👤</span>
                    <div>
                      <div className="pd-info-val">{user.name || "Ayurvedic Seeker"}</div>
                      <div className="pd-info-sub">{user.email}</div>
                    </div>
                  </div>
                </div>

                <div className="pd-sidebar-section">
                  <div className="pd-sidebar-label">Knowledge base</div>
                  <div className="pd-texts">
                    {["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridayam"].map((t) => (
                      <div className="pd-text-pill" key={t}>📜 {t}</div>
                    ))}
                  </div>
                </div>

                <Link href="/chat" className="pd-btn-new">
                  ＋ New Consultation
                </Link>

                <div className="pd-sidebar-footer">
                  <a href="/" className="pd-footer-link">← Main website</a>
                  <button
                    className="pd-footer-link pd-signout bold"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign out 
                  </button>
                </div>
              </div>

              {/* Quick tip card */}
              <div className="pd-tip-card">
                <div className="pd-tip-icon">💡</div>
                <div className="pd-tip-title">Did you know?</div>
                <p className="pd-tip-body">
                  Charaka Samhita lists over 600 medicinal plants. Ask Vaidya about
                  any herb to get its classical use and verse reference.
                </p>
                <Link href="/chat" className="pd-tip-link">Ask Vaidya →</Link>
              </div>

            </aside>

            {/* ── MAIN PANEL ── */}
            <main className="pd-main">

              {/* Section header */}
              <div className="pd-main-header">
                <div>
                  <h2 className="pd-main-title">Consultation Records</h2>
                  <p className="pd-main-sub">
                    {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""}
                    {searchQuery ? ` matching "${searchQuery}"` : " in total"}
                  </p>
                </div>
                <div className="pd-search-wrap">
                  <span className="pd-search-icon">🔍</span>
                  <input
                    type="text"
                    className="pd-search"
                    placeholder="Search past consultations…"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>

              {/* Session grid */}
              <div className="pd-grid">
                {currentSessions.length > 0 ? (
                  currentSessions.map((chat) => (
                    <Link key={chat.id} href={`/chat?sessionId=${chat.id}`} className="pd-card">
                      <div className="pd-card-top">
                        <div className="pd-card-icon">🌿</div>
                        <div className="pd-card-date">📅 {chat.updatedAt}</div>
                      </div>
                      <div className="pd-card-title">{chat.title}</div>
                      <div className="pd-card-cta">View consultation →</div>
                    </Link>
                  ))
                ) : (
                  <div className="pd-empty">
                    <div className="pd-empty-icon">🌱</div>
                    <div className="pd-empty-title">No consultations found</div>
                    <p className="pd-empty-desc">
                      {searchQuery
                        ? `No sessions match "${searchQuery}". Try a different keyword.`
                        : "Start your first consultation and it will appear here."}
                    </p>
                    <Link href="/chat" className="pd-btn-new" style={{ marginTop: 16, display: "inline-block", width: "auto", padding: "10px 24px" }}>
                      Start a consultation →
                    </Link>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pd-pagination">
                  <button
                    className="pd-pag-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Previous
                  </button>
                  <div className="pd-pag-dots">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`pd-pag-dot ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                        aria-label={`Page ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className="pd-pag-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}

            </main>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="pd-footer">
          <span>🌿 Vaidya · Ancient wisdom, responsibly shared · © 2026</span>
        </footer>

      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5EDD8; font-family: 'Inter', sans-serif; }

  .pd-root {
    min-height: 100vh; font-family: 'Inter', sans-serif;
    color: #1B1B14; background: #F5EDD8;
    display: flex; flex-direction: column;
  }

  /* ── NAV ── */
  .pd-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 40px;
    background: rgba(254,252,247,0.93); backdrop-filter: blur(8px);
    border-bottom: 1px solid #E8DCC8;
    position: sticky; top: 0; z-index: 30;
  }
  .pd-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .pd-logo-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(27,67,50,0.1); border: 1.5px solid rgba(27,67,50,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 17px;
  }
  .pd-logo-text { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: #1B4332; }
  .pd-nav-right { display: flex; gap: 24px; }
  .pd-nav-link { font-size: 14px; color: #5C5442; text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .pd-nav-link:hover { color: #1B4332; }

  /* ── HERO BAND ── */
  .pd-hero-band {
    background: linear-gradient(135deg, #1B4332 0%, #0F2B1C 100%);
    padding: 44px 40px 0; position: relative; overflow: hidden;
  }
  .pd-mandala {
    position: absolute; right: -40px; top: 50%;
    transform: translateY(-50%);
    animation: pdRotate 60s linear infinite;
    pointer-events: none;
  }
  @keyframes pdRotate { to { transform: translateY(-50%) rotate(360deg); } }

  .pd-hero-inner {
    display: flex; align-items: center; gap: 20px;
    position: relative; z-index: 2; margin-bottom: 32px;
  }
  .pd-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #2D6A4F, #1B4332);
    border: 3px solid rgba(245,237,216,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700;
    color: #F5EDD8; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  .pd-hero-eyebrow {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
    color: #6B9480; font-weight: 500; margin-bottom: 4px;
  }
  .pd-hero-name {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #F5EDD8; margin-bottom: 4px;
  }
  .pd-hero-email { font-size: 13px; color: #7A9E8A; }

  /* Stats strip */
  .pd-stats {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 0;
    background: rgba(255,255,255,0.06); border-radius: 14px 14px 0 0;
    border: 1px solid rgba(255,255,255,0.1); border-bottom: none;
    padding: 0;
  }
  .pd-stat {
    flex: 1; padding: 18px 24px; text-align: center;
  }
  .pd-stat-divider { width: 1px; background: rgba(255,255,255,0.1); align-self: stretch; }
  .pd-stat-num {
    display: block;
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
    color: #F5EDD8; margin-bottom: 3px;
  }
  .pd-stat-label { font-size: 11px; color: #7A9E8A; text-transform: uppercase; letter-spacing: 0.07em; }

  /* ── BODY ── */
  .pd-body { flex: 1; padding: 32px 40px 48px; }
  .pd-layout { max-width: 1100px; margin: 0 auto; display: flex; gap: 28px; align-items: flex-start; }

  /* ── SIDEBAR ── */
  .pd-sidebar { flex: 0 0 280px; display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }

  .pd-sidebar-card {
    background: #FEFCF7; border: 1px solid #E8DCC8;
    border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(27,67,50,0.05);
  }
  .pd-sidebar-section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #EFE5D0; }
  .pd-sidebar-section:last-of-type { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .pd-sidebar-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.1em; color: #B5A88C; margin-bottom: 10px;
  }
  .pd-sidebar-info { display: flex; align-items: flex-start; gap: 10px; }
  .pd-info-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
  .pd-info-val { font-size: 14px; font-weight: 600; color: #1B1B14; }
  .pd-info-sub { font-size: 12px; color: #8C7B64; word-break: break-all; margin-top: 2px; }

  .pd-prakriti-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(27,67,50,0.08); border: 1px solid rgba(27,67,50,0.18);
    color: #1B4332; border-radius: 20px; padding: 6px 14px;
    font-size: 13px; font-weight: 500;
  }

  .pd-texts { display: flex; flex-direction: column; gap: 6px; }
  .pd-text-pill {
    background: #F5EDD8; border: 1px solid #E0CFA8;
    border-radius: 8px; padding: 6px 10px;
    font-size: 12px; color: #5C5442;
  }

  .pd-btn-new {
    display: block; width: 100%; text-align: center;
    padding: 12px; background: #1B4332; color: #F5EDD8;
    text-decoration: none; border-radius: 10px; font-weight: 600;
    font-size: 14px; margin-top: 20px; letter-spacing: 0.02em;
    transition: background 0.15s, transform 0.1s;
  }
  .pd-btn-new:hover { background: #143626; }
  .pd-btn-new:active { transform: scale(0.98); }

  .pd-sidebar-footer {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 16px; padding-top: 16px; border-top: 1px solid #E8DCC8;
  }
  .pd-footer-link { font-size: 12.5px; color: #8C7B64; text-decoration: none; transition: color 0.15s; }
  .pd-footer-link:hover { color: #1B4332; }
  .pd-signout { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0; }

  /* Tip card */
  .pd-tip-card {
    background: linear-gradient(135deg, #1B4332 0%, #143626 100%);
    border-radius: 14px; padding: 20px;
  }
  .pd-tip-icon { font-size: 22px; margin-bottom: 8px; }
  .pd-tip-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #F5EDD8; margin-bottom: 6px; }
  .pd-tip-body { font-size: 12.5px; color: #7A9E8A; line-height: 1.65; margin-bottom: 12px; }
  .pd-tip-link { font-size: 13px; font-weight: 600; color: #A8C4B0; text-decoration: none; }
  .pd-tip-link:hover { color: #F5EDD8; }

  /* ── MAIN PANEL ── */
  .pd-main { flex: 1; min-width: 0; }

  .pd-main-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .pd-main-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1B4332; }
  .pd-main-sub { font-size: 13px; color: #8C7B64; margin-top: 4px; }

  .pd-search-wrap { position: relative; display: flex; align-items: center; }
  .pd-search-icon { position: absolute; left: 12px; font-size: 14px; pointer-events: none; }
  .pd-search {
    padding: 10px 14px 10px 36px;
    border: 1.5px solid #D4C4A8; border-radius: 12px;
    outline: none; background: #FEFCF7; font-size: 14px;
    color: #1B1B14; font-family: 'Inter', sans-serif;
    width: 256px; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pd-search::placeholder { color: #A89880; }
  .pd-search:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.08); }

  /* ── SESSION GRID ── */
  .pd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

  .pd-card {
    background: #FEFCF7; border: 1px solid #E0CFA8;
    border-radius: 14px; padding: 20px; text-decoration: none; color: inherit;
    display: flex; flex-direction: column; gap: 10px;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    cursor: pointer;
  }
  .pd-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(27,67,50,0.1);
    border-color: #1B4332;
  }
  .pd-card-top { display: flex; align-items: center; justify-content: space-between; }
  .pd-card-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(27,67,50,0.08); border: 1px solid rgba(27,67,50,0.14);
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .pd-card-date { font-size: 11px; color: #B5A88C; }
  .pd-card-title {
    font-size: 14px; font-weight: 600; color: #1B1B14; line-height: 1.45;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .pd-card-cta { font-size: 12px; color: #1B4332; font-weight: 500; margin-top: auto; }

  /* Empty state */
  .pd-empty {
    grid-column: 1 / -1; text-align: center;
    padding: 56px 32px;
    background: rgba(245,237,216,0.5);
    border: 1.5px dashed #D4C4A8; border-radius: 16px;
  }
  .pd-empty-icon { font-size: 40px; margin-bottom: 12px; animation: pdFloat 3s ease-in-out infinite; }
  @keyframes pdFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .pd-empty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1B4332; margin-bottom: 8px; }
  .pd-empty-desc { font-size: 14px; color: #8C7B64; line-height: 1.65; }

  /* ── PAGINATION ── */
  .pd-pagination {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-top: 36px;
  }
  .pd-pag-btn {
    background: transparent; border: 1.5px solid #1B4332; color: #1B4332;
    padding: 8px 18px; font-size: 13px; font-weight: 500;
    border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .pd-pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .pd-pag-btn:not(:disabled):hover { background: rgba(27,67,50,0.07); }
  .pd-pag-dots { display: flex; gap: 6px; align-items: center; }
  .pd-pag-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #D4C4A8; border: none; cursor: pointer;
    transition: background 0.15s, transform 0.15s; padding: 0;
  }
  .pd-pag-dot.active { background: #1B4332; transform: scale(1.3); }

  /* ── FOOTER ── */
  .pd-footer {
    background: #0F2B1C; color: #6B9480;
    padding: 20px 40px; text-align: center; font-size: 12px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .pd-layout { flex-direction: column; }
    .pd-sidebar { flex: none; width: 100%; position: relative; top: 0; }
    .pd-nav-right { display: none; }
    .pd-body { padding: 24px 20px 40px; }
    .pd-hero-band { padding: 36px 20px 0; }
    .pd-mandala { display: none; }
    .pd-stats { border-radius: 12px 12px 0 0; }
    .pd-stat { padding: 14px 16px; }
    .pd-stat-num { font-size: 18px; }
  }
  @media (max-width: 560px) {
    .pd-main-header { flex-direction: column; }
    .pd-search { width: 100%; }
    .pd-search-wrap { width: 100%; }
    .pd-hero-name { font-size: 22px; }
    .pd-stats { flex-direction: column; }
    .pd-stat-divider { width: 100%; height: 1px; }
  }
`;