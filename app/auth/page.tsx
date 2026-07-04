"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) {
          setError("Invalid credentials. Please verify your details.");
        } else {
          router.push("/profile");
          router.refresh();
        }
      } else if (!isVerifyingOtp) {
        const regRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(regData.error || "Registration process failed.");
        setIsVerifyingOtp(true);
      } else {
        const verifyRes = await fetch("/api/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error || "OTP verification failed.");

        const autoLogin = await signIn("credentials", { email, password, redirect: false });
        if (autoLogin?.error) {
          setError("Verified! Please sign in to continue.");
          setIsLogin(true);
          setIsVerifyingOtp(false);
        } else {
          router.push("/chat");
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const title = isVerifyingOtp
    ? "Check your inbox"
    : isLogin
    ? "Welcome back"
    : "Create your account";

  const subtitle = isVerifyingOtp
    ? `We sent a 6-digit code to ${email}`
    : isLogin
    ? "Sign in to access your Ayurvedic guide"
    : "Join Vaidya and explore ancient wisdom";

  return (
    <>
      <style>{STYLES}</style>
      <div className="au-root">

        {/* ── LEFT PANEL ── */}
        <div className="au-left">
          <div className="au-left-inner">
            <a href="/" className="au-logo">
              <span className="au-logo-icon">🌿</span>
              <span className="au-logo-text">Vaidya</span>
            </a>

            {/* Mandala */}
            <div className="au-mandala-wrap" aria-hidden="true">
              <svg className="au-mandala-svg" width="260" height="260" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.25" stroke="#F5EDD8" fill="none" strokeWidth="1">
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map((d) => (
                    <ellipse key={d} cx="140" cy="70" rx="12" ry="30" transform={`rotate(${d} 140 140)`} />
                  ))}
                </g>
                <g opacity="0.2" stroke="#B5C4B0" fill="none" strokeWidth="0.8">
                  {[0,45,90,135,180,225,270,315].map((d) => (
                    <ellipse key={d} cx="140" cy="95" rx="8" ry="20" transform={`rotate(${d} 140 140)`} />
                  ))}
                </g>
                <circle cx="140" cy="140" r="100" fill="none" stroke="#F5EDD8" strokeWidth="0.5" opacity="0.15"/>
                <circle cx="140" cy="140" r="72"  fill="none" stroke="#F5EDD8" strokeWidth="0.5" opacity="0.15"/>
                <circle cx="140" cy="140" r="46"  fill="none" stroke="#B5C4B0" strokeWidth="0.5" opacity="0.2"/>
                <circle cx="140" cy="140" r="120" fill="none" stroke="#F5EDD8" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.1"/>
              </svg>
              <div className="au-mandala-center">🌿</div>
            </div>

            <div className="au-left-content">
              <div className="au-left-eyebrow">5,000 years of wisdom</div>
              <h2 className="au-left-title">Ancient healing,<br /><em>always with you</em></h2>
              <p className="au-left-desc">
                Vaidya brings the knowledge of Charaka, Sushruta, and Vagbhata
                into every conversation — grounded, cited, and always honest.
              </p>
              <div className="au-trust-pills">
                <div className="au-pill">📜 1,200+ remedies</div>
                <div className="au-pill">🔍 Source-cited answers</div>
                <div className="au-pill">🛡️ RAG-grounded AI</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — FORM ── */}
        <div className="au-right">
          <div className="au-card">

            {/* Header */}
            <div className="au-card-header">
              <div className="au-card-icon">
                {isVerifyingOtp ? "📩" : isLogin ? "🙏" : "✨"}
              </div>
              <h1 className="au-card-title">{title}</h1>
              <p className="au-card-sub">{subtitle}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="au-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="au-form">

              {isVerifyingOtp ? (
                /* OTP INPUT */
                <div className="au-field">
                  <label className="au-label">6-digit verification code</label>
                  <div className="au-otp-hint">Check your email — including your spam folder</div>
                  <input
                    className="au-input au-otp-input"
                    type="text"
                    maxLength={6}
                    placeholder="0  0  0  0  0  0"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  {/* NAME — register only */}
                  {!isLogin && (
                    <div className="au-field">
                      <label className="au-label">Full name</label>
                      <div className="au-input-wrap">
                        <span className="au-input-icon">👤</span>
                        <input
                          className="au-input au-input-padded"
                          type="text"
                          placeholder="Arjun Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
                  <div className="au-field">
                    <label className="au-label">Email address</label>
                    <div className="au-input-wrap">
                      <span className="au-input-icon">✉️</span>
                      <input
                        className="au-input au-input-padded"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="au-field">
                    <div className="au-label-row">
                      <label className="au-label">Password</label>
                      {isLogin && (
                        <button type="button" className="au-forgot">Forgot password?</button>
                      )}
                    </div>
                    <div className="au-input-wrap">
                      <span className="au-input-icon">🔒</span>
                      <input
                        className="au-input au-input-padded au-input-pr"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        className="au-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {!isLogin && (
                      <div className="au-password-hint">Minimum 8 characters recommended</div>
                    )}
                  </div>
                </>
              )}

              {/* SUBMIT */}
              <button type="submit" className="au-submit" disabled={loading}>
                {loading ? (
                  <span className="au-spinner-row">
                    <span className="au-btn-spinner" /> Processing…
                  </span>
                ) : isVerifyingOtp ? (
                  "Confirm verification code →"
                ) : isLogin ? (
                  "Sign in to Vaidya →"
                ) : (
                  "Send verification code →"
                )}
              </button>

              {/* DIVIDER */}
              <div className="au-divider"><span>or</span></div>

              {/* GOOGLE */}
              <button
                type="button"
                className="au-google-btn"
                onClick={() => signIn("google", { callbackUrl: "/chat" })}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C37.2 38.4 44 33 44 24c0-1.3-.1-2.7-.4-3.9z"/>
                </svg>
                Continue with Google
              </button>

            </form>

            {/* TOGGLE */}
            {!isVerifyingOtp && (
              <div className="au-toggle-row">
                <span className="au-toggle-text">
                  {isLogin ? "New to Vaidya?" : "Already have an account?"}
                </span>
                <button
                  className="au-toggle-btn"
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </div>
            )}

            {/* Back during OTP */}
            {isVerifyingOtp && (
              <div className="au-toggle-row">
                <button
                  className="au-toggle-btn"
                  onClick={() => { setIsVerifyingOtp(false); setOtpCode(""); setError(""); }}
                >
                  ← Use a different email
                </button>
              </div>
            )}

            <p className="au-disclaimer">
              By continuing you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #F5EDD8; }

  /* ── ROOT ── */
  .au-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Inter', sans-serif;
  }

  /* ── LEFT PANEL ── */
  .au-left {
    background: linear-gradient(160deg, #1B4332 0%, #0F2B1C 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 48px 40px;
    position: relative; overflow: hidden;
  }
  .au-left-inner {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0;
    max-width: 400px; width: 100%;
  }
  .au-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 48px;
  }
  .au-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(245,237,216,0.12); border: 1.5px solid rgba(245,237,216,0.25);
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .au-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #F5EDD8;
  }
  .au-mandala-wrap {
    position: absolute; top: 50%; right: -60px;
    transform: translateY(-50%);
    width: 260px; height: 260px;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; opacity: 0.5;
  }
  .au-mandala-svg { animation: auRotate 50s linear infinite; }
  @keyframes auRotate { to { transform: rotate(360deg); } }
  .au-mandala-center {
    position: absolute; font-size: 44px;
    animation: auFloat 4s ease-in-out infinite;
  }
  @keyframes auFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .au-left-content { position: relative; z-index: 2; }
  .au-left-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6B9480; margin-bottom: 12px;
  }
  .au-left-title {
    font-family: 'Playfair Display', serif;
    font-size: 38px; line-height: 1.15; font-weight: 700;
    color: #F5EDD8; margin-bottom: 16px;
  }
  .au-left-title em { font-style: italic; color: #A8C4B0; }
  .au-left-desc { font-size: 15px; color: #8FA89A; line-height: 1.75; margin-bottom: 28px; }
  .au-trust-pills { display: flex; flex-direction: column; gap: 10px; }
  .au-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(245,237,216,0.08); border: 1px solid rgba(245,237,216,0.15);
    color: #B8D4C0; border-radius: 8px; padding: 8px 14px;
    font-size: 13px; font-weight: 500;
  }

  /* ── RIGHT PANEL ── */
  .au-right {
    background: #FEFCF7;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 32px;
    overflow-y: auto;
  }
  .au-card {
    width: 100%; max-width: 420px;
    display: flex; flex-direction: column; gap: 0;
  }

  /* CARD HEADER */
  .au-card-header { text-align: center; margin-bottom: 32px; }
  .au-card-icon { font-size: 36px; margin-bottom: 12px; animation: auFloat 4s ease-in-out infinite; }
  .au-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #1B1B14; margin-bottom: 8px;
  }
  .au-card-sub { font-size: 14px; color: #6B5E4A; line-height: 1.6; }

  /* ERROR */
  .au-error {
    display: flex; align-items: flex-start; gap: 8px;
    background: rgba(181,99,26,0.08); border: 1px solid rgba(181,99,26,0.28);
    color: #7A3F0A; border-radius: 10px;
    padding: 12px 14px; font-size: 13.5px; line-height: 1.5;
    margin-bottom: 20px;
  }

  /* FORM */
  .au-form { display: flex; flex-direction: column; gap: 18px; }

  /* FIELDS */
  .au-field { display: flex; flex-direction: column; gap: 6px; }
  .au-label {
    font-size: 12px; font-weight: 600; color: #3D2E1A;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .au-label-row { display: flex; justify-content: space-between; align-items: center; }
  .au-forgot {
    background: none; border: none; font-size: 12px; color: #B5631A;
    cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500;
    text-decoration: underline; padding: 0;
  }

  /* INPUT WRAPPER */
  .au-input-wrap {
    position: relative; display: flex; align-items: center;
  }
  .au-input-icon {
    position: absolute; left: 13px; font-size: 15px;
    pointer-events: none; z-index: 1;
  }
  .au-eye-btn {
    position: absolute; right: 12px;
    background: none; border: none; cursor: pointer;
    font-size: 15px; padding: 0; line-height: 1;
  }

  /* INPUTS — clearly visible fields */
  .au-input {
    width: 100%;
    background: #F5EDD8;
    border: 2px solid #C8B89A;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 15px;
    color: #1B1B14;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
  }
  .au-input::placeholder { color: #A08060; }
  .au-input:focus {
    border-color: #1B4332;
    background: #FEFCF7;
    box-shadow: 0 0 0 3px rgba(27,67,50,0.12);
  }
  .au-input-padded { padding-left: 40px; }
  .au-input-pr { padding-right: 40px; }

  /* OTP INPUT */
  .au-otp-input {
    letter-spacing: 10px;
    font-size: 26px;
    font-weight: 700;
    text-align: center;
    padding: 16px 14px;
    border-color: #B5631A;
    background: #FFF8F0;
  }
  .au-otp-input:focus { border-color: #1B4332; box-shadow: 0 0 0 3px rgba(27,67,50,0.12); }
  .au-otp-hint { font-size: 12px; color: #8C7B64; margin-bottom: 2px; }
  .au-password-hint { font-size: 12px; color: #8C7B64; }

  /* SUBMIT */
  .au-submit {
    width: 100%; padding: 14px;
    background: #1B4332; color: #F5EDD8;
    border: none; border-radius: 10px;
    font-size: 15px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s, transform 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }
  .au-submit:hover:not(:disabled) { background: #143626; }
  .au-submit:active:not(:disabled) { transform: scale(0.98); }
  .au-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .au-spinner-row { display: flex; align-items: center; gap: 10px; }
  .au-btn-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(245,237,216,0.3);
    border-top-color: #F5EDD8;
    animation: auSpin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes auSpin { to { transform: rotate(360deg); } }

  /* DIVIDER */
  .au-divider {
    display: flex; align-items: center; gap: 12px;
    color: #B5A88C; font-size: 13px;
  }
  .au-divider::before, .au-divider::after {
    content: ''; flex: 1; height: 1px; background: #E0CFA8;
  }

  /* GOOGLE */
  .au-google-btn {
    width: 100%; padding: 12px 14px;
    background: #FEFCF7; color: #1B1B14;
    border: 2px solid #C8B89A; border-radius: 10px;
    font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.15s, border-color 0.15s;
  }
  .au-google-btn:hover { background: #F5EDD8; border-color: #A89070; }

  /* TOGGLE */
  .au-toggle-row {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 24px;
  }
  .au-toggle-text { font-size: 14px; color: #6B5E4A; }
  .au-toggle-btn {
    background: none; border: none; color: #1B4332;
    font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: 'Inter', sans-serif; text-decoration: underline;
    text-underline-offset: 2px; padding: 0;
  }
  .au-toggle-btn:hover { color: #143626; }

  .au-disclaimer {
    font-size: 11.5px; color: #A89880; text-align: center;
    margin-top: 16px; line-height: 1.6;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .au-root { grid-template-columns: 1fr; }
    .au-left { display: none; }
    .au-right {
      min-height: 100vh;
      background: linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 55%, #F0E8D0 100%);
      padding: 40px 20px;
    }
    .au-card { max-width: 100%; }
  }
`;