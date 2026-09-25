import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Calendar, 
  Eye, 
  ExternalLink, 
  MessageCircle, 
  Share2,
  ThumbsUp,
  Youtube,
  Check
} from 'lucide-react';
import { VideoItem } from '../types';
import { initialVideos } from '../data/initialData';

export const VideoPage: React.FC = () => {
  const { gameId, videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Busca o vídeo baseado no ID da URL
    const foundVideo = initialVideos.find(v => v.id === videoId);
    setVideo(foundVideo || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [videoId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center text-center px-4">
        <Play className="w-16 h-16 text-red-500 mb-4 opacity-50" />
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Vídeo não encontrado</h1>
        <button onClick={() => navigate('/jogos')} className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 transition-colors cursor-pointer">
          Voltar para Jogos
        </button>
      </div>
    );
  }

  // Extrai o ID do vídeo do YouTube da URL (caso você salve a URL completa)
  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoIdYoutube = video.youtubeId || getYoutubeId(video.url) || video.id;
  const currentGameId = gameId || video.gameId;

  return (
    <div className="bg-[#090b10] min-h-screen text-zinc-100 font-sans pb-20">
      
      {/* Top Navigation */}
      <nav className="bg-zinc-950/80 border-b border-zinc-800 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(`/jogo/${currentGameId}`)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para o Portal do Jogo</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              title="Copiar link do vídeo"
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Video Player Section */}
        <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-800 mb-8">
          <iframe 
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoIdYoutube}`}
            title={video.title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white leading-tight">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-mono py-4 border-y border-zinc-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>{video.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                <span>{video.views} visualizações</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-500" />
                <span>{video.duration}</span>
              </div>
            </div>

            {/* SEO DESCRIPTION AREA */}
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
              <p className="text-lg font-medium text-zinc-100">
                {video.description || "Assista ao vídeo completo para dominar as melhores estratégias deste jogo!"}
              </p>
              
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-amber-400" />
                  O que você vai aprender neste vídeo:
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• Análise detalhada de builds e equipamentos.</li>
                  <li>• Dicas de posicionamento em lutas PvP.</li>
                  <li>• Rotas de farm otimizadas para iniciantes.</li>
                  <li>• Comentários reais sobre o meta atual.</li>
                </ul>
              </div>
            </div>

            {/* Call to Action: YouTube */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-red-900/20 to-zinc-900 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <Youtube className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-white">Gostou do conteúdo?</p>
                  <p className="text-sm text-zinc-400">Inscreva-se no canal para não perder as próximas builds!</p>
                </div>
              </div>
              <a 
                href="https://www.youtube.com/@JhotaGamerOficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-500 transition-all transform hover:scale-105 shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Inscrever-se Agora
              </a>
            </div>
          </div>

          {/* Sidebar: Related Content */}
          <aside className="space-y-8">
            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-cinzel text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Vídeos Relacionados
              </h3>
              <div className="space-y-4">
                {initialVideos.filter(v => v.gameId === currentGameId && v.id !== video.id).slice(0, 4).map(relVideo => (
                  <div 
                    key={relVideo.id} 
                    onClick={() => navigate(`/jogo/${currentGameId}/video/${relVideo.id}`)}
                    className="group flex gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded-xl transition-colors"
                  >
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950">
                      <img src={relVideo.thumbnail} alt={relVideo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-200 line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {relVideo.title}
                      </p>
                      <span className="text-[10px] text-zinc-500">{relVideo.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 text-center">
              <MessageCircle className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Dúvidas sobre este vídeo?</h3>
              <p className="text-xs text-zinc-400 mb-4">Tire suas dúvidas com o Jhota e a comunidade no Discord!</p>
              <a 
                href="https://discord.gg/Uq9pnCwDkq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
              >
                Ir para o Discord
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
