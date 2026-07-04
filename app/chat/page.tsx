"use client";

import { useState, useRef, useEffect, Suspense } from "react"; // 🚀 Added Suspense
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

type Message = {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
};

const SUGGESTED = [
    "Remedy for cold & cough?",
    "Turmeric milk benefits?",
    "Ashwagandha for stress?",
    "Triphala for digestion?",
];

const LANGUAGES = [
    { code: "hi-IN", label: "हिन्दी / Hinglish" },
    { code: "en-IN", label: "English" },
    { code: "ta-IN", label: "தமிழ் (Tamil)" }
];

function formatTime(date: Date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const TypingDots = () => (
    <div className="vc-typing">
        <span /><span /><span />
    </div>
);

// 🚀 MOVE EXCLUSIVE CHAT ENGINE CORE LOGIC INTO AN ISOLATED CONTENT CHILD
function ChatPageContent() {
    const searchParams = useSearchParams();
    
    const urlSessionId = searchParams.get("sessionId");
    const prefill = searchParams?.get("q") ?? "";

    const [activeSessionId, setActiveSessionId] = useState<string | null>(urlSessionId);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Namaste 🌿 I am Vaidya, your Ayurvedic guide. Ask me about ancient home remedies, herbal nushkas, or any health concern — I'll share wisdom from the classical texts.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState(prefill);
    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState("hi-IN");
    const [isListening, setIsListening] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setActiveSessionId(urlSessionId);
        
        if (urlSessionId) {
            async function loadPastConsultation() {
                setLoading(true);
                try {
                    const res = await fetch(`/api/chat/history?id=${urlSessionId}`);
                    if (!res.ok) throw new Error("Could not sync conversation");
                    
                    const data = await res.json();
                    if (data && data.messages && data.messages.length > 0) {
                        const processedMessages = data.messages.map((m: any) => ({
                            ...m,
                            timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
                        }));
                        setMessages(processedMessages);
                    }
                } catch (err) {
                    console.error("Historical retrieval breakdown:", err);
                } finally {
                    setLoading(false);
                }
            }
            loadPastConsultation();
        } else {
            setMessages([
                {
                    role: "assistant",
                    content: "Namaste 🌿 I am Vaidya, your Ayurvedic guide. Ask me about ancient home remedies, herbal nushkas, or any health concern — I'll share wisdom from the classical texts.",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [urlSessionId]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;

            rec.onstart = () => setIsListening(true);
            rec.onend = () => setIsListening(false);
            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                sendMessage(transcript);
            };

            recognitionRef.current = rec;
        }
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = selectedLang;
        }
    }, [selectedLang]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (prefill) {
            const t = setTimeout(() => sendMessage(prefill), 400);
            return () => clearTimeout(t);
        }
    }, []);

    function toggleVoiceListening() {
        if (!recognitionRef.current) {
            alert("Voice search features are not supported by your current browser profile.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    }

    function autoResize() {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    async function sendMessage(override?: string) {
        const text = (override ?? input).trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
        setMessages((p) => [...p, userMsg]);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setLoading(true);

        try {
            const activeLangLabel = LANGUAGES.find(l => l.code === selectedLang)?.label || "English";
            const extendedMessagePayload = `${text} (Please format response to match: ${activeLangLabel})`;

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: extendedMessagePayload,
                    sessionId: activeSessionId
                }),
            });
            const data = await res.json();
            
            setMessages((p) => [
                ...p,
                { role: "assistant", content: data.answer || "No response received.", timestamp: new Date() },
            ]);

            if (data.sessionId && !activeSessionId) {
                setActiveSessionId(data.sessionId);
                window.history.replaceState(null, "", `/chat?sessionId=${data.sessionId}`);
            }
        } catch {
            setMessages((p) => [
                ...p,
                { role: "assistant", content: "Something went wrong. Please try again.", timestamp: new Date() },
            ]);
        }
        setLoading(false);
    }

    return (
        <div className="vc-root">
            {/* ── HEADER ── */}
            <header className="vc-header">
                <a href="/" className="vc-header-left">
                    <div className="vc-logo-icon">🌿</div>
                    <div>
                        <div className="vc-header-title">Vaidya</div>
                        <div className="vc-header-sub">Ayurvedic · RAG-powered</div>
                    </div>
                </a>

                <div className="vc-header-center">
                    <div className="vc-header-badge">
                        <div className="vc-dot" />
                        Ancient texts active · Charaka · Sushruta · Ashtanga
                    </div>
                </div>

                <div className="flex items-center gap-3" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            backgroundColor: "#f4f4f5",
                            border: "1px solid #e4e4e7",
                            borderRadius: "6px",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                    </select>

                    <a href="/profile" className="vc-back-btn">
                        ← <span>Profile</span>
                    </a>
                </div>
            </header>

            {/* ── MESSAGES ── */}
            <div className="vc-messages">
                <div className="vc-date-divider">Today</div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`vc-row ${msg.role}`}>
                        <div className={`vc-avatar ${msg.role === "assistant" ? "ai" : "user"}`}>
                            {msg.role === "assistant" ? "🌿" : "👤"}
                        </div>
                        <div className="vc-bwrap">
                            <span className="vc-sender">
                                {msg.role === "assistant" ? "Vaidya" : "You"}
                            </span>
                            <div
                                className={`vc-bubble ${msg.role === "assistant" ? "ai" : "user"}`}
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {msg.content}
                            </div>
                            {msg.timestamp && mounted && (
                                <span className="vc-time">{formatTime(msg.timestamp)}</span>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="vc-row">
                        <div className="vc-avatar ai">🌿</div>
                        <div className="vc-bwrap">
                            <span className="vc-sender">Vaidya</span>
                            <div className="vc-typing-bubble">
                                <TypingDots />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* ── SUGGESTIONS ── */}
            <div style={{ clear: "both" }} />
            {messages.length <= 2 && !loading && (
                <div className="vc-suggestions">
                    <div className="vc-suggestions-label">Try asking</div>
                    <div className="vc-chips">
                        {SUGGESTED.map((q) => (
                            <button key={q} className="vc-chip" onClick={() => sendMessage(q)}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── INPUT BAR ── */}
            <div className="vc-input-bar">
                <div className="vc-disclaimer">
                    ⚠️ For informational purposes only. Always consult a qualified vaidya or doctor for serious conditions.
                </div>
                <div className="vc-input-inner" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                        type="button"
                        onClick={toggleVoiceListening}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #e4e4e7",
                            backgroundColor: isListening ? "#ef4444" : "#f4f4f5",
                            color: isListening ? "#ffffff" : "#52525b",
                            cursor: "pointer",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                        }}
                        className={isListening ? "animate-pulse" : ""}
                        title="Toggle voice speech recognition search"
                    >
                        {isListening ? "🛑" : "🎤"}
                    </button>

                    <textarea
                        ref={textareaRef}
                        placeholder={isListening ? "Listening... Speak now..." : "Ask about a remedy, herb, or Ayurvedic practice…"}
                        value={input}
                        rows={1}
                        disabled={isListening}
                        onChange={(e) => { setInput(e.target.value); autoResize(); }}
                        onKeyDown={handleKeyDown}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="vc-send-btn"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || loading || isListening}
                        aria-label="Send message"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
                <p className="vc-input-hint">Enter to send · Shift+Enter for new line</p>
            </div>
        </div>
    );
}

// 🚀 THE ULTIMATE EXPORT BLOCK WRAPPED CLEANLY INSIDE AN INDEPENDENT SUSPENSE BOUNDARY
export default function ChatPage() {
    return (
        <>
            <style>{STYLES}</style>
            <Suspense fallback={
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FEFCF7",
                    color: "#1B4332",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px"
                }}>
                    🌿 Aligning Vaidya chat engine streams...
                </div>
            }>
                <ChatPageContent />
            </Suspense>
        </>
    );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vc-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #FEFCF7;
    font-family: 'Inter', sans-serif;
    color: #1B1B14;
  }

  .vc-header {
    position: sticky; top: 0; z-index: 30;
    background: rgba(254,252,247,0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #E8DCC8;
    padding: 0 24px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .vc-header-left {
    display: flex; align-items: center; gap: 12px;
    text-decoration: none; color: inherit;
  }
  .vc-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(27,67,50,0.1);
    border: 1.5px solid rgba(27,67,50,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .vc-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700; color: #1B4332;
  }
  .vc-header-sub {
    font-size: 11px; color: #8C7B64; margin-top: 1px;
  }
  .vc-header-center {
    flex: 1; display: flex; justify-content: center;
  }
  .vc-header-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(27,67,50,0.08);
    border: 1px solid rgba(27,67,50,0.18);
    border-radius: 20px; padding: 5px 14px;
    font-size: 12px; color: #1B4332; font-weight: 500;
    white-space: nowrap;
  }
  .vc-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #1B4332;
    animation: vcPulse 2s ease-in-out infinite;
  }
  @keyframes vcPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.45; transform: scale(0.75); }
  }
  .vc-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: transparent;
    border: 1.5px solid #1B4332; color: #1B4332;
    border-radius: 8px; padding: 7px 14px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'Inter', sans-serif;
    text-decoration: none; white-space: nowrap;
    transition: background 0.15s;
  }
  .vc-back-btn:hover { background: rgba(27,67,50,0.06); }

  .vc-messages {
    flex: 1;
    overflow-y: auto;
    padding: 28px 16px 12px;
    display: flex; flex-direction: column; gap: 20px;
    max-width: 820px; width: 100%; margin: 0 auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(27,67,50,0.15) transparent;
  }
  .vc-messages::-webkit-scrollbar { width: 4px; }
  .vc-messages::-webkit-scrollbar-thumb { background: rgba(27,67,50,0.15); border-radius: 4px; }

  .vc-date-divider {
    display: flex; align-items: center; gap: 12px;
    color: #8C7B64; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.07em; margin: 4px 0;
  }
  .vc-date-divider::before, .vc-date-divider::after {
    content: ''; flex: 1; height: 1px; background: #E8DCC8;
  }

  .vc-row { display: flex; gap: 10px; align-items: flex-start; }
  .vc-row.user { flex-direction: row-reverse; }

  .vc-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0; margin-top: 2px;
  }
  .vc-avatar.ai   { background: rgba(27,67,50,0.1);   border: 1px solid rgba(27,67,50,0.2); }
  .vc-avatar.user { background: rgba(181,99,26,0.12); border: 1px solid rgba(181,99,26,0.25); }

  .vc-bwrap { display: flex; flex-direction: column; gap: 4px; max-width: calc(100% - 48px); }
  .vc-row.user .vc-bwrap { align-items: flex-end; }

  .vc-bubble {
    padding: 12px 16px;
    font-size: 14.5px; line-height: 1.7; word-break: break-word;
    border-radius: 16px;
  }
  .vc-bubble.ai {
    background: #F5EDD8;
    border: 1px solid #E0CFA8;
    border-radius: 4px 16px 16px 16px;
    color: #2A2318;
  }
  .vc-bubble.user {
    background: #1B4332;
    border: 1px solid rgba(27,67,50,0.5);
    border-radius: 16px 4px 16px 16px;
    color: #F0EBD8;
  }

  .vc-sender {
    font-size: 11px; font-weight: 500;
    color: #8C7B64; padding: 0 4px; text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .vc-row.user .vc-sender { color: #B5631A; }
  .vc-time { font-size: 11px; color: #B5A88C; padding: 0 4px; }

  .vc-typing-bubble {
    background: #F5EDD8; border: 1px solid #E0CFA8;
    border-radius: 4px 16px 16px 16px;
    padding: 14px 18px; display: inline-flex; align-items: center;
  }
  .vc-typing { display: flex; gap: 5px; align-items: center; }
  .vc-typing span {
    width: 8px; height: 8px; border-radius: 50%; background: #1B4332;
    animation: vcBounce 1.2s ease-in-out infinite;
  }
  .vc-typing span:nth-child(2) { animation-delay: 0.2s; }
  .vc-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes vcBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.4; }
    30%          { transform: translateY(-7px); opacity: 1; }
  }

  .vc-suggestions {
    padding: 0 16px 8px;
    max-width: 820px; width: 100%; margin: 0 auto;
  }
  .vc-suggestions-label {
    font-size: 11px; color: #8C7B64; margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .vc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .vc-chip {
    background: rgba(27,67,50,0.07);
    border: 1px solid rgba(27,67,50,0.18);
    color: #1B4332; border-radius: 20px;
    padding: 6px 14px; font-size: 13px; cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .vc-chip:hover { background: rgba(27,67,50,0.14); transform: translateY(-1px); }
  .vc-chip:active { transform: translateY(0); }

  .vc-input-bar {
    position: sticky; bottom: 0;
    background: rgba(254,252,247,0.97);
    backdrop-filter: blur(10px);
    border-top: 1px solid #E8DCC8;
    padding: 14px 16px 16px;
  }
  .vc-input-inner {
    max-width: 820px; margin: 0 auto;
    display: flex; align-items: flex-end; gap: 10px;
    background: #FEFCF7;
    border: 1.5px solid #D4C4A8;
    border-radius: 16px;
    padding: 10px 10px 10px 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .vc-input-inner:focus-within {
    border-color: #1B4332;
    box-shadow: 0 0 0 3px rgba(27,67,50,0.08);
  }
  .vc-input-inner textarea {
    flex: 1; background: transparent; border: none; outline: none;
    resize: none; font-family: 'Inter', sans-serif;
    font-size: 15px; line-height: 1.6; color: #1B1B14;
    caret-color: #1B4332; min-height: 24px; max-height: 120px;
    padding: 2px 0;
  }
  .vc-input-inner textarea::placeholder { color: #A89880; }
  .vc-send-btn {
    width: 40px; height: 40px; border-radius: 10px; border: none;
    background: #1B4332; color: #F5EDD8;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: opacity 0.15s, transform 0.15s;
  }
  .vc-send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .vc-send-btn:not(:disabled):hover  { opacity: 0.88; transform: scale(1.04); }
  .vc-send-btn:not(:disabled):active { transform: scale(0.96); }

  .vc-input-hint {
    text-align: center; font-size: 11px; color: #C4B49C;
    margin-top: 8px; max-width: 820px; margin-left: auto; margin-right: auto;
  }

  .vc-disclaimer {
    background: rgba(181,99,26,0.08);
    border: 1px solid rgba(181,99,26,0.2);
    border-radius: 10px; padding: 10px 14px;
    font-size: 12px; color: #8C5A1A; line-height: 1.5;
    max-width: 820px; margin: 0 auto 8px;
  }

  @media (max-width: 600px) {
    .vc-header { padding: 0 14px; }
    .vc-header-center { display: none; }
    .vc-header-title { font-size: 16px; }
    .vc-back-btn span { display: none; }
    .vc-messages { padding: 20px 12px 8px; gap: 16px; }
    .vc-bubble { font-size: 14px; padding: 10px 13px; }
    .vc-suggestions { padding: 0 12px 6px; }
    .vc-input-bar { padding: 10px 12px 12px; }
    .vc-input-inner textarea { font-size: 14px; }
    .vc-input-hint { display: none; }
  }

  @media (min-width: 1200px) {
    .vc-messages, .vc-suggestions, .vc-input-inner, .vc-disclaimer { max-width: 900px; }
  }
`;