import React, { useState, useEffect } from 'react';
import { BioData, SocialMedia, UsefulLink, Game } from '../types';
import { 
  X, 
  Sliders, 
  Save, 
  RotateCcw, 
  User, 
  Share2, 
  Link as LinkIcon, 
  HelpCircle, 
  Check, 
  Plus, 
  Sparkles,
  Gamepad2,
  Trash2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface LiveCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bio: BioData;
  onUpdateBio: (bio: BioData) => void;
  socials: SocialMedia[];
  onUpdateSocials: (socials: SocialMedia[]) => void;
  usefulLinks: UsefulLink[];
  onUpdateUsefulLinks: (links: UsefulLink[]) => void;
  onResetDefaults: () => void;
}

export const LiveCustomizerModal: React.FC<LiveCustomizerModalProps> = ({
  isOpen,
  onClose,
  bio,
  onUpdateBio,
  socials,
  onUpdateSocials,
  usefulLinks,
  onUpdateUsefulLinks,
  onResetDefaults
}) => {
  if (!isOpen) return null;

  const isInvalidLink = (link: UsefulLink) => {
    const text = `${link.title} ${link.description} ${link.gameRelated || ''} ${link.tags?.join(' ') || ''} ${link.url}`.toLowerCase();
    if (
      text.includes('league of legends') ||
      text.includes('riot games') ||
      text.includes('summoner') ||
      text.includes('op.gg') ||
      text.includes('u.gg') ||
      text.includes('lolalytics') ||
      /\b(lol|moba|rift)\b/i.test(text)
    ) {
      return true;
    }

    const url = (link.url || '').toLowerCase();
    const title = (link.title || '').toLowerCase();
    if (url.includes('lineage2.com') || url.includes('plaync.com') || url.includes('4game.com')) {
      return true;
    }
    if ((title.includes('lineage 2') || title.includes('lineage ii')) && title.includes('oficial') && !title.includes('exilium') && !url.includes('exiliumworld')) {
      return true;
    }

    return false;
  };

  const [activeTab, setActiveTab] = useState<'bio' | 'socials' | 'links' | 'instrucoes'>('bio');
  const [tempBio, setTempBio] = useState<BioData>({ ...bio });
  const [tempSocials, setTempSocials] = useState<SocialMedia[]>(() => socials.filter((s) => s.platform !== 'tiktok'));
  const [tempLinks, setTempLinks] = useState<UsefulLink[]>(() => usefulLinks.filter((l) => !isInvalidLink(l)));
  
  // New link form
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCat, setNewLinkCat] = useState<'sites_oficiais' | 'wikis_databases' | 'ferramentas' | 'comunidades' | 'downloads' | 'servidores'>('ferramentas');
  const [newLinkGame, setNewLinkGame] = useState('Geral');

  const [saveToast, setSaveToast] = useState(false);

  const handleSaveAll = () => {
    onUpdateBio(tempBio);
    onUpdateSocials(tempSocials.filter((s) => s.platform !== 'tiktok'));
    onUpdateUsefulLinks(tempLinks.filter((l) => !isInvalidLink(l)));
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    const newEntry: UsefulLink = {
      id: `custom-link-${Date.now()}`,
      title: newLinkTitle,
      description: newLinkDesc || 'Link adicionado pelo painel de controle.',
      url: newLinkUrl,
      category: newLinkCat,
      gameRelated: newLinkGame,
      tags: ['Personalizado', newLinkGame]
    };

    setTempLinks([newEntry, ...tempLinks]);
    setNewLinkTitle('');
    setNewLinkDesc('');
    setNewLinkUrl('');
  };

  const handleDeleteLink = (id: string) => {
    setTempLinks(tempLinks.filter((l) => l.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0f17] border border-amber-500/40 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Painel de Personalização do Jhota Gamer
              </h2>
              <p className="text-xs text-zinc-400">
                Edite textos provisórios, redes, foto e links com salvamento instantâneo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-zinc-950/60 border-b border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bio')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bio'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Nome, Frase & Biografia</span>
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'socials'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Redes Sociais & Links</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'links'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Gerenciar Links Úteis</span>
          </button>

          <button
            onClick={() => setActiveTab('instrucoes')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'instrucoes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Instruções de Uso</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: BIO & TEXTS */}
          {activeTab === 'bio' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nome da Marca / Canal
                  </label>
                  <input
                    type="text"
                    value={tempBio.brandName}
                    onChange={(e) => setTempBio({ ...tempBio, brandName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    URL da Foto / Avatar do Jhota
                  </label>
                  <input
                    type="text"
                    value={tempBio.avatarUrl}
                    onChange={(e) => setTempBio({ ...tempBio, avatarUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Banner Oficial do Site (Topo)</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-normal">Arquivo local ou Link web</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={tempBio.bannerUrl || ''}
                    onChange={(e) => setTempBio({ ...tempBio, bannerUrl: e.target.value })}
                    placeholder="Ex: https://i.postimg.cc/L4W075s2/banner-limpo.png"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Selecionar banner limpo.png do PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const res = evt.target?.result as string;
                            if (res) {
                              setTempBio({ ...tempBio, bannerUrl: res });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Selecione o arquivo exato enviado do seu computador para atualizar o banner sem nenhuma alteração ou compressão.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Frase de Impacto Principal
                </label>
                <input
                  type="text"
                  value={tempBio.tagline}
                  onChange={(e) => setTempBio({ ...tempBio, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Subtítulo de Especialidade
                </label>
                <input
                  type="text"
                  value={tempBio.subTagline}
                  onChange={(e) => setTempBio({ ...tempBio, subTagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-300">
                  Biografia do Jhota (Parágrafo 1 - História)
                </label>
                <textarea
                  rows={3}
                  value={tempBio.bioParagraphs[0] || ''}
                  onChange={(e) => {
                    const updated = [...tempBio.bioParagraphs];
                    updated[0] = e.target.value;
                    setTempBio({ ...tempBio, bioParagraphs: updated });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />

                <label className="block text-xs font-semibold text-zinc-300">
                  Biografia do Jhota (Parágrafo 2 - Missão do Canal)
                </label>
                <textarea
                  rows={3}
                  value={tempBio.bioParagraphs[1] || ''}
                  onChange={(e) => {
                    const updated = [...tempBio.bioParagraphs];
                    updated[1] = e.target.value;
                    setTempBio({ ...tempBio, bioParagraphs: updated });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />

                <label className="block text-xs font-semibold text-zinc-300">
                  Introdução da Trajetória Gamer (Antes das datas / Marcos)
                </label>
                <textarea
                  rows={3}
                  value={tempBio.trajectoryIntro || ''}
                  onChange={(e) => setTempBio({ ...tempBio, trajectoryIntro: e.target.value })}
                  placeholder="Ex: Comecei a jogar com 14 anos no ano de 2006, jogando em lan house com amigos..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Stats */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Estatísticas do Canal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500">Inscritos</span>
                    <input
                      type="text"
                      value={tempBio.stats.subscribers}
                      onChange={(e) => setTempBio({
                        ...tempBio,
                        stats: { ...tempBio.stats, subscribers: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500">Vídeos</span>
                    <input
                      type="text"
                      value={tempBio.stats.videos}
                      onChange={(e) => setTempBio({
                        ...tempBio,
                        stats: { ...tempBio.stats, videos: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500">Anos de Gamer</span>
                    <input
                      type="text"
                      value={tempBio.stats.yearsGaming}
                      onChange={(e) => setTempBio({
                        ...tempBio,
                        stats: { ...tempBio.stats, yearsGaming: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500">Membros Discord</span>
                    <input
                      type="text"
                      value={tempBio.stats.guildMembers}
                      onChange={(e) => setTempBio({
                        ...tempBio,
                        stats: { ...tempBio.stats, guildMembers: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SOCIALS */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Substitua os links demonstrativos pelos endereços oficiais dos seus canais e perfis:
              </p>

              <div className="space-y-4">
                {tempSocials.map((soc, idx) => (
                  <div key={soc.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase">{soc.name}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{soc.platform}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Nome de Usuário (@handle)</label>
                        <input
                          type="text"
                          value={soc.username}
                          onChange={(e) => {
                            const updated = [...tempSocials];
                            updated[idx] = { ...soc, username: e.target.value };
                            setTempSocials(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">URL Oficial do Perfil</label>
                        <input
                          type="text"
                          value={soc.url}
                          onChange={(e) => {
                            const updated = [...tempSocials];
                            updated[idx] = { ...soc, url: e.target.value };
                            setTempSocials(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Seguidores / Inscritos / Membros</label>
                        <input
                          type="text"
                          value={soc.followers}
                          onChange={(e) => {
                            const updated = [...tempSocials];
                            updated[idx] = { ...soc, followers: e.target.value };
                            setTempSocials(updated);
                          }}
                          placeholder="Ex: 45.8K Inscritos"
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USEFUL LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              
              {/* Add New Link Form */}
              <form onSubmit={handleAddLink} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Link Útil</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Título do Link *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Calculadora de Refino T8"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">URL Completa *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://exemplo.com"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Categoria</label>
                    <select
                      value={newLinkCat}
                      onChange={(e) => setNewLinkCat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="sites_oficiais">Sites Oficiais</option>
                      <option value="wikis_databases">Wikis & Databases</option>
                      <option value="ferramentas">Ferramentas & Calculadoras</option>
                      <option value="comunidades">Comunidades & Fóruns</option>
                      <option value="servidores">Servidores & Recursos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Jogo Relacionado</label>
                    <select
                      value={newLinkGame}
                      onChange={(e) => setNewLinkGame(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="Albion Online">Albion Online</option>
                      <option value="Lineage 2 Exilium World">Lineage 2 Exilium World</option>
                      <option value="Geral">Geral / Todos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Breve Descrição</label>
                  <input
                    type="text"
                    placeholder="Para que serve essa ferramenta ou site..."
                    value={newLinkDesc}
                    onChange={(e) => setNewLinkDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Inserir Link na Lista</span>
                </button>
              </form>

              {/* Existing links list */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Links Atualmente Cadastrados ({tempLinks.length})
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {tempLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-white">{link.title}</span>
                        <div className="text-[11px] text-zinc-500 truncate">{link.url}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors shrink-0"
                        title="Remover link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INSTRUÇÕES CLARAS PARA PERSONALIZAR */}
          {activeTab === 'instrucoes' && (
            <div className="space-y-4 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <h3 className="font-cinzel text-base font-bold text-amber-300 mb-2">
                  Como Personalizar Seu Site Jhota Gamer
                </h3>
                <p>
                  Este site foi totalmente desenvolvido com componentes reativos em TypeScript e Tailwind CSS. Todos os dados estão centralizados de forma modular.
                </p>
              </div>

              <ol className="space-y-3 list-decimal pl-5">
                <li>
                  <strong className="text-white">Edição Rápida no Navegador:</strong> Qualquer alteração feita através deste painel de personalização é aplicada imediatamente na tela e salva no armazenamento local do seu navegador (localStorage).
                </li>
                <li>
                  <strong className="text-white">Banner Oficial:</strong> O banner enviado na sua solicitação foi configurado como o destaque principal do topo do site em alta fidelidade.
                </li>
                <li>
                  <strong className="text-white">Substituir Links Reais:</strong> Na aba "Redes Sociais & Links", você pode inserir seu link oficial do YouTube (ex: youtube.com/@JhotaGamerOficial), Discord e Instagram para que todos os botões direcionem seus inscritos corretamente.
                </li>
                <li>
                  <strong className="text-white">Adicionar Jogos ou Guias:</strong> O código possui o arquivo <code className="text-amber-400 bg-zinc-950 px-1.5 py-0.5 rounded">src/data/initialData.ts</code> com tipos estritos em TypeScript, facilitando adicionar dezenas de novos jogos, builds e notícias.
                </li>
              </ol>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões de Demonstração</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAll}
              className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-xl animate-bounce">
            <Check className="w-4 h-4" />
            <span>Conteúdo salvo com sucesso!</span>
          </div>
        )}

      </div>
    </div>
  );
};
