import React, { useEffect, useRef, useState } from 'react';
import { Mail, Send } from 'lucide-react';

interface ContactSectionProps { brandName: string }
interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi } }

const fieldClass = 'w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20';

export const ContactSection: React.FC<ContactSectionProps> = ({ brandName }) => {
  const [config, setConfig] = useState<{ enabled: boolean; siteKey?: string } | null>(null);
  const [token, setToken] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/contact').then(async response => {
      if (!response.ok) throw new Error('Contact unavailable');
      return response.json() as Promise<{ enabled: boolean; siteKey?: string }>;
    }).then(data => { if (active) setConfig(data); })
      .catch(() => { if (active) setConfig({ enabled: false }); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!config?.enabled || !config.siteKey) return;
    let active = true;
    let script = document.querySelector<HTMLScriptElement>('script[data-jhota-turnstile]');
    const renderWidget = () => {
      if (!active || !window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: config.siteKey,
        theme: 'dark',
        callback: (value: string) => setToken(value),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken('')
      });
    };
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.dataset.jhotaTurnstile = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderWidget);
    renderWidget();
    return () => {
      active = false;
      script?.removeEventListener('load', renderWidget);
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [config?.enabled, config?.siteKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config?.enabled || !token || sending) return;
    const fields = new FormData(event.currentTarget);
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fields.get('nome'), email: fields.get('email'), assunto: fields.get('assunto'),
          mensagem: fields.get('mensagem'), website: fields.get('website'), token
        })
      });
      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Não foi possível enviar sua mensagem.');
      formRef.current?.reset();
      setStatus({ success: true, message: 'Mensagem enviada! Vou responder pelo e-mail informado.' });
    } catch (error) {
      setStatus({ success: false, message: error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem.' });
    } finally {
      setSending(false);
      setToken('');
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#090b10] py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Mail className="h-4 w-4" /> Contato profissional
          </span>
          <h1 className="mb-4 font-cinzel text-3xl font-black text-white sm:text-5xl">
            Contato & <span className="text-amber-400">Parcerias</span>
          </h1>
          <p className="text-zinc-400">Tem uma proposta de parceria ou patrocínio para o {brandName}? Envie sua mensagem diretamente por aqui.</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">Seu nome</label><input className={fieldClass} id="contact-name" name="nome" type="text" minLength={2} maxLength={80} autoComplete="name" placeholder="Como posso chamar você?" required /></div>
            <div><label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">Seu e-mail</label><input className={fieldClass} id="contact-email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="voce@empresa.com" required /></div>
          </div>
          <div><label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">Assunto</label><input className={fieldClass} id="contact-subject" name="assunto" type="text" minLength={3} maxLength={120} placeholder="Ex.: proposta de parceria ou patrocínio" required /></div>
          <div><label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">Sua mensagem</label><textarea className={`${fieldClass} min-h-44 resize-y`} id="contact-message" name="mensagem" minLength={20} maxLength={3000} placeholder="Conte sobre sua proposta, sua marca e como podemos trabalhar juntos." required /></div>
          <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="contact-website">Site</label><input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
          <div ref={widgetRef} aria-label="Verificação de segurança" />
          {config && !config.enabled && <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">O envio de mensagens está temporariamente indisponível. Tente novamente mais tarde.</p>}
          {status && <p role="status" className={`rounded-xl border p-3 text-sm ${status.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'}`}>{status.message}</p>}
          <button type="submit" disabled={!config?.enabled || !token || sending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            <Send className="h-4 w-4" /> {sending ? 'Enviando...' : 'Enviar mensagem'}
          </button>
          <p className="text-xs leading-relaxed text-zinc-500">Seu nome, e-mail e mensagem serão usados apenas para responder ao seu contato. Não envie senhas ou dados sensíveis.</p>
        </form>
      </div>
    </div>
  );
};
