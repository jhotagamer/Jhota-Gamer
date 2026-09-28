import React from 'react';

export function PrivacyPage() {
  return (
    <div className="bg-[#090b10] min-h-[80vh] py-14 text-zinc-300">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed space-y-8">
        <header>
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">Jhota Gamer</p>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-4">Política de privacidade</h1>
          <p>Última atualização: 27 de setembro de 2026.</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Sobre o site</h2>
          <p>O Jhota Gamer publica guias, ferramentas e conteúdos sobre Albion Online e Lineage 2. Esta página explica o uso de armazenamento no navegador e de serviços externos durante a navegação.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Dados salvos no navegador</h2>
          <p>O site usa o armazenamento local do navegador para guardar preferências, favoritos, builds criadas e dados temporários que ajudam as ferramentas a funcionar. Esses dados podem ser apagados nas configurações do navegador.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Formulário de contato</h2>
          <p>Se você usar o formulário, seu nome, e-mail, assunto e mensagem serão enviados pelo serviço de e-mail Resend para o Jhota Gamer analisar e responder ao contato. As mensagens não são publicadas no site. O formulário usa o Cloudflare Turnstile para reduzir envios automáticos; dados da verificação são processados pela Cloudflare. Evite incluir informações sensíveis na mensagem.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Serviços externos</h2>
          <p>Vídeos e transmissões incorporados podem carregar serviços do YouTube ou da Twitch quando você abre o conteúdo. Recursos de mercado e itens do Albion Online consultam serviços externos para obter preços, dados e imagens. Links para redes sociais, Discord e sites dos jogos levam a páginas que possuem suas próprias políticas de privacidade.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Publicidade</h2>
          <p>No momento, o site está preparando a integração com o Google AdSense. Se os anúncios forem ativados, fornecedores terceiros, inclusive o Google, poderão usar cookies e tecnologias semelhantes para exibir anúncios com base em visitas anteriores a este e a outros sites. O Google e seus parceiros poderão exibir anúncios personalizados conforme as preferências de anúncios e os controles aplicáveis. Consulte a <a href="https://policies.google.com/technologies/ads?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">explicação do Google sobre publicidade</a> e as <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">configurações de anúncios</a>.</p>
          <p>Antes da ativação de anúncios, os avisos e controles de consentimento necessários serão configurados conforme as regiões atendidas.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Contato</h2>
          <p>Para dúvidas sobre esta política ou sobre o site, acesse a página de <a href="/contato" className="text-amber-400 underline">contato do Jhota Gamer</a>.</p>
        </section>
      </article>
    </div>
  );
}
