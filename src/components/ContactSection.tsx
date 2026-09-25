import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Shield, CheckCircle, Sparkles, User, AtSign, FileText } from 'lucide-react';

interface ContactSectionProps {
  brandName: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ brandName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [subject, setSubject] = useState('Parceria Comercial');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-[#090b10] min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Fale com o Jhota Gamer</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Contato & <span className="text-amber-400">Parcerias</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Propostas de patrocínio, recrutamento para clã/guilda, sugestões de novos guias ou mensagens diretas para o criador de conteúdo.
          </p>
        </div>

        {/* Contact Container */}
        <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold text-white">
                Mensagem Enviada com Sucesso!
              </h2>
              <p className="text-zinc-300 text-sm max-w-md mx-auto leading-relaxed">
                Obrigado pelo contato, <strong>{name}</strong>! O Jhota ou a moderação do canal responderá através do email <em>{email}</em> ou pelo Discord <em>{discordTag || 'informado'}</em>.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seu Nome ou Nickname Gamer *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pedro / LordSlayer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seu E-mail para Resposta *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Seu Discord Tag (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: jhota_gamer#0001 ou @jhota"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assunto</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Parceria Comercial">Parceria Comercial / Patrocínio</option>
                    <option value="Sugestão de Conteúdo">Sugestão de Guia ou Jogo</option>
                    <option value="Entrada na Guilda">Recrutamento para Guilda / Clã</option>
                    <option value="Dúvida sobre Build">Dúvida sobre Build ou Estratégia</option>
                    <option value="Outro">Outro Assunto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Sua Mensagem *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escreva sua proposta ou mensagem detalhada..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Seus dados não são compartilhados. Resposta em até 48h úteis.</span>
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
