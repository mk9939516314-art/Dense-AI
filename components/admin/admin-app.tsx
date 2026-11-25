"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Check, Copy, Headset, LifeBuoy, Loader2, LogOut, Mail, Send, Ticket } from "lucide-react";
import { ago, cx } from "@/lib/util";

type Status = "bot" | "requested" | "live" | "closed";
type Sess = { id: string; at: number; upd: number; page: string; name: string; email: string; status: Status; expAt?: number; agent?: string; reason?: string; ticket?: string; missed?: boolean; last: { role: string; text: string; at: number } | null };
type Msg = { id: string; role: "user" | "bot" | "agent" | "system"; text: string; at: number; by?: string; hide?: boolean };
type Tk = { token: string; name: string; email: string; topic: string; message: string; page: string; sid: string; at: number; status: "open" | "closed"; note: string; sent: boolean };
type Overview = { db: string; now: number; sessions: Sess[]; tickets: Tk[] };

async function api<T>(url: string, body?: unknown) {
  const res = await fetch(url, body === undefined ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export default function AdminApp() {
  const [me, setMe] = useState<{ ok: boolean; agent: string } | null>(null);

  useEffect(() => {
    api<{ ok: boolean; agent: string }>("/api/admin/me").then((r) => setMe(r.data.ok ? r.data : { ok: false, agent: "" }));
  }, []);

  if (!me) return <Center><Loader2 className="animate-spin text-muted" aria-label="Loading" /></Center>;
  if (!me.ok) return <Login onDone={(agent) => setMe({ ok: true, agent })} />;
  return <Console agent={me.agent} onOut={() => setMe({ ok: false, agent: "" })} />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh place-items-center bg-paper p-6">{children}</div>;
}

function Login({ onDone }: { onDone: (agent: string) => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await api<{ detail?: string }>("/api/admin/login", { user, pass });
    if (!r.ok) {
      setErr(r.data.detail || "Could not sign in.");
      setBusy(false);
      return;
    }
    const m = await api<{ ok: boolean; agent: string }>("/api/admin/me");
    onDone(m.data.agent || user);
  };

  return (
    <Center>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_30px_60px_-34px_rgba(10,15,36,0.4)]">
        <h1 className="display-3">Executive sign-in</h1>
        <p className="mt-2 text-[0.95rem] text-body">Handle live chats and support tokens for Dense AI.</p>
        <label className="mt-7 block text-[0.9rem] font-semibold text-ink">
          ID
          <input className="field mt-2" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" name="user" spellCheck={false} autoCapitalize="none" required />
        </label>
        <label className="mt-5 block text-[0.9rem] font-semibold text-ink">
          Password
          <input className="field mt-2" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" name="pass" required />
        </label>
        {err && <p className="mt-4 text-sm font-medium text-[#C2223F]" role="alert">{err}</p>}
        <button className="btn btn-ink mt-7 w-full disabled:opacity-60" type="submit" disabled={busy || !user || !pass}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Center>
  );
}

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.start();
    o.stop(ctx.currentTime + 0.5);
  } catch {
    /* audio not available */
  }
}

type Tab = "chats" | "tokens" | "brain";

function Console({ agent, onOut }: { agent: string; onOut: () => void }) {
  const [tab, setTab] = useState<Tab>("chats");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [sel, setSel] = useState("");
  const [, tick] = useState(0);
  const seen = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    const r = await api<Overview & { error?: string }>("/api/admin/overview");
    if (r.status === 401) return onOut();
    if (!r.ok) return setError(r.data.error === "store" ? "The chat database is unreachable." : "Could not load.");
    setError("");
    setData(r.data);
    const fresh = r.data.sessions.filter((s) => s.status === "requested" && !seen.current.has(s.id + s.expAt));
    fresh.forEach((s) => seen.current.add(s.id + s.expAt));
    if (fresh.length) beep();
  }, [onOut]);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 3000);
    const t = setInterval(() => tick((v) => v + 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(t);
    };
  }, [load]);

  const waiting = data?.sessions.filter((s) => s.status === "requested").length || 0;
  useEffect(() => {
    document.title = waiting ? `(${waiting}) Executive request · Dense AI` : "Admin";
  }, [waiting]);

  const openTickets = data?.tickets.filter((t) => t.status === "open").length || 0;
  const current = data?.sessions.find((s) => s.id === sel) || null;

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <header className="flex items-center gap-4 border-b border-line bg-surface px-4 py-3 sm:px-6">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">Dense AI <span className="font-sans text-sm font-medium text-muted">executive desk</span></h1>
        <nav className="ml-4 hidden gap-1 sm:flex" aria-label="Sections">
          <TabBtn on={tab === "chats"} onClick={() => setTab("chats")} icon={<Headset size={16} />} badge={waiting}>Chats</TabBtn>
          <TabBtn on={tab === "tokens"} onClick={() => setTab("tokens")} icon={<Ticket size={16} />} badge={openTickets}>Support tokens</TabBtn>
          <TabBtn on={tab === "brain"} onClick={() => setTab("brain")} icon={<BookOpen size={16} />}>Bot brain</TabBtn>
        </nav>
        <span className="ml-auto text-sm text-muted">{agent}</span>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5"
          aria-label="Sign out"
          onClick={async () => {
            await api("/api/admin/logout", {});
            onOut();
          }}
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 sm:hidden" aria-label="Sections">
        <TabBtn on={tab === "chats"} onClick={() => setTab("chats")} icon={<Headset size={16} />} badge={waiting}>Chats</TabBtn>
        <TabBtn on={tab === "tokens"} onClick={() => setTab("tokens")} icon={<Ticket size={16} />} badge={openTickets}>Tokens</TabBtn>
        <TabBtn on={tab === "brain"} onClick={() => setTab("brain")} icon={<BookOpen size={16} />}>Brain</TabBtn>
      </nav>

      {data && data.db === "memory" && (
        <p className="border-b border-[#F0D9A0] bg-[#FFF6E0] px-4 py-2 text-sm text-[#6B4E00]">
          Chats are stored in server memory, which is unreliable on Vercel. Add Upstash Redis variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) so handoff works every time.
        </p>
      )}
      {error && <p className="border-b border-[#F3B7C0] bg-[#FFF1F3] px-4 py-2 text-sm text-[#8F1D33]" role="alert">{error}</p>}

      {tab === "chats" && (
        <div className="grid min-h-0 flex-1 md:grid-cols-[22rem_1fr]">
          <ul className={cx("min-h-0 overflow-y-auto border-r border-line bg-surface", current && "hidden md:block")}>
            {!data && <li className="p-6 text-sm text-muted">Loading…</li>}
            {data && !data.sessions.length && <li className="p-6 text-sm text-muted">No chats yet. They appear here as visitors use the assistant.</li>}
            {data?.sessions.map((s) => (
              <li key={s.id} className="border-b border-line">
                <button type="button" onClick={() => setSel(s.id)} className={cx("w-full px-4 py-3.5 text-left transition-colors hover:bg-paper", sel === s.id && "bg-paper")}>
                  <div className="flex items-center gap-2">
                    <StatusDot s={s} />
                    <span className="truncate font-semibold text-ink">{s.name || "Visitor"}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted">{ago(s.upd, data.now)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-body">{s.last?.text || s.reason || "No messages"}</p>
                  {s.status === "requested" && (
                    <p className="mt-1.5 text-xs font-semibold text-[#9A6400]">Wants an executive · {Math.max(0, Math.ceil(((s.expAt || 0) - Date.now()) / 1000))}s left</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <section className={cx("min-h-0", !current && "hidden md:grid md:place-items-center")}>
            {current ? <Conversation key={current.id} sess={current} onBack={() => setSel("")} onChange={load} /> : <p className="text-sm text-muted">Select a chat.</p>}
          </section>
        </div>
      )}
      {tab === "tokens" && <Tokens tickets={data?.tickets || []} onChange={load} />}
      {tab === "brain" && <Brain />}
    </div>
  );
}

function TabBtn({ on, onClick, icon, badge, children }: { on: boolean; onClick: () => void; icon: React.ReactNode; badge?: number; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-current={on ? "page" : undefined} className={cx("inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors", on ? "bg-ink text-white" : "text-body hover:bg-ink/5")}>
      {icon} {children}
      {!!badge && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1.5 text-[0.7rem] font-bold text-white">{badge}</span>}
    </button>
  );
}

function StatusDot({ s }: { s: Sess }) {
  const c = s.status === "requested" ? "bg-amber animate-pulse" : s.status === "live" ? "bg-blue" : "bg-mint";
  return <span className={cx("h-2.5 w-2.5 shrink-0 rounded-full", c)} title={s.status} />;
}

function Conversation({ sess, onBack, onChange }: { sess: Sess; onBack: () => void; onChange: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [info, setInfo] = useState<Sess>(sess);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const n = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  const pull = useCallback(async () => {
    const r = await api<{ sess: Sess; total: number; msgs: Msg[] }>(`/api/admin/session?sid=${sess.id}&n=${n.current}`);
    if (!r.ok) return;
    setInfo((p) => ({ ...p, ...r.data.sess }));
    if (r.data.msgs.length) {
      n.current = r.data.total;
      setMsgs((p) => {
        const ids = new Set(p.map((m) => m.id));
        return [...p, ...r.data.msgs.filter((m) => !ids.has(m.id))];
      });
    }
  }, [sess.id]);

  useEffect(() => {
    void pull();
    const id = setInterval(() => void pull(), 1500);
    return () => clearInterval(id);
  }, [pull]);

  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length]);

  const act = async (action: string, extra: object = {}) => {
    setErr("");
    const r = await api<{ detail?: string }>("/api/admin/act", { action, sid: sess.id, ...extra });
    if (!r.ok) setErr(r.data.detail || "That did not work.");
    await pull();
    onChange();
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    await act("send", { text: t });
  };

  const requested = info.status === "requested";
  const live = info.status === "live";

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 md:hidden" onClick={onBack} aria-label="Back to chats"><ArrowLeft size={18} aria-hidden="true" /></button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{info.name || "Visitor"} {info.email && <span className="font-normal text-muted">· {info.email}</span>}</p>
          <p className="truncate text-xs text-muted">Page: {info.page || "home"} · {info.status}{info.ticket ? ` · token ${info.ticket}` : ""}</p>
        </div>
        {requested && (
          <>
            <button type="button" className="btn btn-ink !min-h-9 !px-4 !py-2 !text-sm" onClick={() => act("accept")}>Accept</button>
            <button type="button" className="btn btn-line !min-h-9 !px-4 !py-2 !text-sm" onClick={() => act("decline")}>Decline</button>
          </>
        )}
        {!requested && !live && <button type="button" className="btn btn-line !min-h-9 !px-4 !py-2 !text-sm" onClick={() => act("takeover")}>Take over</button>}
        {live && <button type="button" className="btn btn-line !min-h-9 !px-4 !py-2 !text-sm" onClick={() => act("end")}>End chat</button>}
      </div>
      {info.reason && <p className="border-b border-line bg-surface px-4 py-2 text-sm text-body">Reason: {info.reason}</p>}

      <div ref={box} className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {msgs.map((m) =>
          m.role === "system" ? (
            <p key={m.id} className="text-center text-xs text-muted">{m.text}{m.hide ? " (internal)" : ""}</p>
          ) : (
            <div key={m.id} className={cx("flex", m.role === "agent" ? "justify-end" : "justify-start")}>
              <div className={cx("max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed", m.role === "agent" ? "bg-ink text-white" : m.role === "bot" ? "border border-line bg-surface text-body" : "bg-[#E4EAFF] text-ink")}>
                <span className={cx("mb-0.5 block text-[0.7rem] font-semibold", m.role === "agent" ? "text-white/60" : "text-muted")}>
                  {m.role === "agent" ? m.by || "You" : m.role === "bot" ? "Assistant" : info.name || "Visitor"} · {ago(m.at)}
                </span>
                {m.text}
              </div>
            </div>
          ),
        )}
      </div>
      {err && <p className="px-4 pb-1 text-sm font-medium text-[#C2223F]" role="alert">{err}</p>}
      <form onSubmit={send} className="flex gap-2 border-t border-line bg-surface p-3">
        <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder={live ? "Reply to the visitor…" : "Replying takes over the chat…"} maxLength={2000} aria-label="Reply" autoComplete="off" name="reply" />
        <button type="submit" className="btn btn-ink !px-4" disabled={!text.trim()} aria-label="Send reply"><Send size={18} aria-hidden="true" /></button>
      </form>
    </div>
  );
}

function Tokens({ tickets, onChange }: { tickets: Tk[]; onChange: () => void }) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");
  const save = async (t: Tk, status?: "open" | "closed") => {
    await api("/api/admin/act", { action: "ticket", token: t.token, ...(status ? { status } : {}), note: notes[t.token] ?? t.note });
    onChange();
  };
  const sorted = useMemo(() => [...tickets].sort((a, b) => (a.status === b.status ? b.at - a.at : a.status === "open" ? -1 : 1)), [tickets]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      {!sorted.length && <p className="text-sm text-muted">No support tokens yet.</p>}
      <ul className="mx-auto grid max-w-4xl gap-4">
        {sorted.map((t) => (
          <li key={t.token} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 font-mono text-lg font-semibold text-ink"
                onClick={() => navigator.clipboard?.writeText(t.token).then(() => { setCopied(t.token); setTimeout(() => setCopied(""), 1200); })}
                aria-label={`Copy token ${t.token}`}
              >
                {t.token} {copied === t.token ? <Check size={16} aria-hidden="true" /> : <Copy size={16} className="text-muted" aria-hidden="true" />}
              </button>
              <span className={cx("rounded-full px-2.5 py-1 text-xs font-semibold", t.status === "open" ? "bg-amber/30 text-[#7A5200]" : "bg-mint/20 text-[#0B7A58]")}>{t.status}</span>
              {!t.sent && <span className="rounded-full bg-[#FFF1F3] px-2.5 py-1 text-xs font-semibold text-[#8F1D33]">email not delivered</span>}
              <span className="ml-auto text-xs text-muted">{ago(t.at)}</span>
            </div>
            <p className="mt-3 font-semibold text-ink">{t.topic || "Support request"}</p>
            <p className="mt-1 whitespace-pre-wrap text-[0.95rem] text-body">{t.message}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span>{t.name || "No name"}</span>
              {t.email && <a className="inline-flex items-center gap-1 font-medium text-blue" href={`mailto:${t.email}?subject=${encodeURIComponent(`[${t.token}] ${t.topic || "Support request"}`)}`}><Mail size={14} aria-hidden="true" /> {t.email}</a>}
              <span>Page: {t.page || "home"}</span>
            </p>
            <label className="mt-4 block text-sm font-semibold text-ink">
              Internal note
              <textarea className="field mt-1.5" rows={2} defaultValue={t.note} onChange={(e) => setNotes((p) => ({ ...p, [t.token]: e.target.value }))} name={`note-${t.token}`} />
            </label>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn btn-line !min-h-9 !px-4 !py-2 !text-sm" onClick={() => save(t)}>Save note</button>
              <button type="button" className="btn btn-ink !min-h-9 !px-4 !py-2 !text-sm" onClick={() => save(t, t.status === "open" ? "closed" : "open")}>{t.status === "open" ? "Close token" : "Reopen"}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Brain() {
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"loading" | "idle" | "saving" | "saved">("loading");
  useEffect(() => {
    api<{ notes: string }>("/api/admin/know").then((r) => {
      setNotes(r.data.notes || "");
      setState("idle");
    });
  }, []);
  const save = async () => {
    setState("saving");
    await api("/api/admin/act", { action: "know", notes });
    setState("saved");
    setTimeout(() => setState("idle"), 1500);
  };
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="display-3 flex items-center gap-2"><LifeBuoy size={22} aria-hidden="true" /> Bot brain</h2>
        <p className="mt-2 text-[0.95rem] text-body">Notes here have the highest priority. The assistant reads them on every message, so write facts you want it to state exactly: offers, contacts, policies, corrections.</p>
        <textarea className="field mt-5 font-mono !text-[0.9rem]" rows={16} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={12000} aria-label="Bot notes" name="notes" disabled={state === "loading"} />
        <div className="mt-3 flex items-center gap-3">
          <button type="button" className="btn btn-ink" onClick={save} disabled={state === "loading" || state === "saving"}>{state === "saving" ? "Saving…" : "Save notes"}</button>
          {state === "saved" && <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0B7A58]"><Check size={16} aria-hidden="true" /> Saved</span>}
          <span className="ml-auto text-xs text-muted">{notes.length} / 12000</span>
        </div>
      </div>
    </div>
  );
}
