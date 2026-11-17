import React, { useEffect, useRef, useState } from 'react';
import API from '../api/client';
import { Sparkles, Send, AlertCircle } from 'lucide-react';

const SUGGESTIONS = [
  "What are today's sales?",
  'Which products are low on stock?',
  'What is expiring in the next 90 days?',
  'How much do customers owe me?',
  'What should I reorder first?',
];

export default function Assistant() {
  const [status, setStatus] = useState(null);           // { enabled, model }
  const [messages, setMessages] = useState([]);         // { role, content }
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { API.get('/api/assistant/status').then(({ data }) => setStatus(data)).catch(() => setStatus({ enabled: false })); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;
    const history = messages.slice(-8);
    setMessages(m => [...m, { role: 'user', content: question }]);
    setInput('');
    setSending(true);
    try {
      const { data } = await API.post('/api/assistant/ask', { question, history });
      setMessages(m => [...m, { role: 'assistant', content: data.answer || '(no answer)' }]);
      if (data.configured === false && status?.enabled) setStatus({ ...status, enabled: false });
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-violet-600 flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="page-title">Ask MediCloud</h1>
          <p className="page-subtitle">Your AI business assistant — ask about sales, stock, expiry and more</p>
        </div>
      </div>

      {status && !status.enabled && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>The AI assistant isn’t configured yet. Add an <code className="font-mono">ANTHROPIC_API_KEY</code> to the backend environment (Render → Environment) and redeploy to enable it.</span>
        </div>
      )}

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto card p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
            <Sparkles size={32} className="text-teal-400" />
            <p className="text-gray-500 dark:text-slate-400 text-sm">Ask anything about your business. Try:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-bl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-400 dark:text-slate-500">
              Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(); }} className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your sales, stock, expiry…"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="submit" disabled={sending || !input.trim()}
          className="w-12 h-12 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors">
          <Send size={18} />
        </button>
      </form>
      {status?.model && (
        <p className="text-[11px] text-gray-400 dark:text-slate-600 mt-1.5 text-center">
          Answers are generated from your live business data. AI can make mistakes — verify important numbers.
        </p>
      )}
    </div>
  );
}
