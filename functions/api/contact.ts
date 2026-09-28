const RECIPIENT = 'jhotagameroficial@gmail.com';

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface Context { request: Request; env: Env }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function configured(env: Env) {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL &&
    env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

export function onRequestGet({ env }: Context) {
  return json({ enabled: configured(env), siteKey: configured(env) ? env.TURNSTILE_SITE_KEY : null });
}

export async function onRequestPost({ request, env }: Context) {
  if (!configured(env)) return json({ message: 'O envio de mensagens está temporariamente indisponível.' }, 503);
  if (request.headers.get('Origin') && request.headers.get('Origin') !== new URL(request.url).origin) {
    return json({ message: 'Solicitação inválida.' }, 403);
  }
  if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ message: 'Formato inválido.' }, 415);

  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 7000) return json({ message: 'Mensagem muito longa.' }, 413);
    data = JSON.parse(body);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid payload');
  } catch {
    return json({ message: 'Revise os dados do formulário.' }, 400);
  }

  // Campo invisível que impede envios automáticos simples.
  if (data.website) return json({ ok: true });

  const nome = typeof data.nome === 'string' ? data.nome.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const assunto = typeof data.assunto === 'string' ? data.assunto.trim() : '';
  const mensagem = typeof data.mensagem === 'string' ? data.mensagem.trim() : '';
  const token = typeof data.token === 'string' ? data.token : '';

  if (nome.length < 2 || nome.length > 80 || /[\r\n]/.test(nome) ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      assunto.length < 3 || assunto.length > 120 || /[\r\n]/.test(assunto) ||
      mensagem.length < 20 || mensagem.length > 3000 || !token || token.length > 2048) {
    return json({ message: 'Preencha nome, e-mail, assunto e mensagem corretamente.' }, 400);
  }

  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || undefined })
    });
    if (!verification.ok || !(await verification.json() as { success: boolean }).success) {
      return json({ message: 'Verificação expirada. Tente novamente.' }, 400);
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [RECIPIENT],
        reply_to: email,
        subject: `[Jhota Gamer] ${assunto}`,
        text: `Contato pelo site Jhota Gamer\n\nNome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\n\nMensagem:\n${mensagem}`
      })
    });
    const result = await response.json() as { id?: string };
    if (!response.ok || !result.id) {
      console.error('Falha ao enviar mensagem de contato.', response.status);
      return json({ message: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.' }, 502);
    }
    return json({ ok: true });
  } catch (error) {
    console.error('Falha no formulário de contato:', error);
    return json({ message: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.' }, 502);
  }
}
