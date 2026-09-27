import React, { useEffect, useRef, useState } from 'react';
import { Heart, Copy } from 'lucide-react';

const PIX = '00020126580014br.gov.bcb.pix01360a7a225d-317f-4b9b-9d79-b15aa00fc8bb5204000053039865802BR5925JOAO FELIPE TENORIO DE SO6006RECIFE62070503***63042256';

export function SupportPage() {
  const [message, setMessage] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = 'Apoie o Jhota Gamer | Apoio voluntário via Pix';
    return () => { document.title = previous; };
  }, []);
  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX);
      setMessage('Código Pix copiado! Abra o aplicativo do seu banco e escolha Pix Copia e Cola.');
    } catch {
      input.current?.focus();
      input.current?.select();
      setMessage('Não foi possível copiar automaticamente. Copie o código selecionado abaixo.');
    }
  }
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-3xl mb-10">
        <span className="text-amber-400 text-sm font-bold uppercase tracking-widest">Faça parte dessa jornada</span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mt-4 mb-6">Apoie o Jhota Gamer</h1>
        <p className="text-zinc-300 text-lg leading-relaxed">Se os guias, as ferramentas ou os vídeos te ajudam, você pode contribuir para manter o site e apoiar a produção de novos conteúdos para a comunidade.</p>
        <p className="text-zinc-400 mt-4">O apoio é voluntário, com o valor que você escolher. Você também fortalece o projeto acompanhando o canal e compartilhando nossos conteúdos.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="rounded-3xl border border-amber-500/20 bg-zinc-900/60 p-5 sm:p-8 shadow-xl">
          <div className="rounded-2xl bg-white p-3 max-w-sm mx-auto"><img src="/apoio/pix-jhota-limpo.svg" alt="QR code Pix para apoiar o Jhota Gamer" className="w-full h-auto" /></div>
          <a href="/apoio/pix-jhota-limpo.svg" target="_blank" rel="noopener noreferrer" className="block text-center text-amber-300 underline py-3">Abrir QR code em tamanho original</a>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-6 sm:p-8">
          <Heart className="text-amber-400 w-8 h-8 mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-white mb-4">Contribua pelo Pix</h2>
          <ol className="list-decimal pl-5 text-zinc-300 space-y-3">
            <li>Leia o QR code pelo aplicativo do seu banco ou copie o código abaixo.</li>
            <li>Escolha o valor que deseja enviar.</li>
            <li>Confira o beneficiário no banco antes de confirmar.</li>
          </ol>
          <div className="my-6 rounded-xl bg-zinc-950 p-4 text-sm">
            <p className="text-zinc-400">Beneficiário</p>
            <p className="text-white font-semibold mt-1">João Felipe T de S</p>
            <p className="text-zinc-400 mt-2">O nome completo será exibido pelo seu banco.</p>
          </div>
          <button onClick={copyPix} className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-4 px-4 cursor-pointer">
            <Copy className="w-5 h-5" aria-hidden="true" /> Copiar código Pix
          </button>
          <p role="status" className="text-sm text-amber-300 mt-3">{message}</p>
          <label htmlFor="pix-code" className="block text-zinc-400 text-sm mt-6 mb-2">Pix Copia e Cola</label>
          <textarea id="pix-code" ref={input} readOnly value={PIX} rows={5} className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs p-3 break-all" />
          <p className="text-zinc-500 text-sm mt-5">O pagamento é feito no aplicativo do seu banco. Esta página não confirma automaticamente o recebimento.</p>
          <p className="text-amber-300 font-semibold mt-6">Obrigado por apoiar a comunidade!</p>
        </div>
      </div>
    </section>
  );
}
