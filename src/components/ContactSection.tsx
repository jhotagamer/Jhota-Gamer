import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  brandName: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ brandName }) => (
  <div className="py-16 bg-[#090b10] min-h-[80vh]">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
          Contato & <span className="text-amber-400">Parcerias</span>
        </h1>
        <p className="text-zinc-400 leading-relaxed">
          Quer conversar com o {brandName}, sugerir um guia ou apresentar uma parceria?
        </p>
      </div>
      <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-10 text-center shadow-2xl">
        <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-5" />
        <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Converse pelo Discord</h2>
        <p className="text-zinc-300 leading-relaxed mb-6">
          Entre no servidor da comunidade para conversar com o Jhota e a equipe.
          Para assuntos particulares, peça orientação sobre como falar em privado.
        </p>
        <a href="https://discord.gg/Uq9pnCwDkq" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors">
          Entrar no Discord <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-xs text-zinc-400 mt-5">
          O botão abre o Discord em outra aba. Nenhuma mensagem é enviada por esta página.
        </p>
      </div>
    </div>
  </div>
);
