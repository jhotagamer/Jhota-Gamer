# Integração de YouTube e Twitch — Jhota Gamer

## Estado desta entrega

Código preparado para **Cloudflare Pages com Pages Functions**. Não publicar antes de confirmar o tipo do projeto na Cloudflare. Se a hospedagem for Workers com Static Assets, os endpoints precisam de um adaptador de Worker; copiar a pasta functions não basta.

A integração só funcionará após configurar as variáveis abaixo e fazer novo deploy. As credenciais reais e a apresentação no navegador ainda não foram testadas. Build, TypeScript e testes com respostas simuladas passaram.

## Como funciona

- Aba Vídeos: últimos 50 uploads públicos do canal @JhotaGamerOficial, excluindo os itens presentes na playlist de Shorts.
- Aba Shorts: até 50 itens recentes da playlist pública configurada, validando que pertencem ao mesmo canal. A classificação não usa a duração do vídeo. Adicione cada novo Short à playlist; sem isso, ele poderá aparecer na aba Vídeos.
- A playlist é consultada em até 10 páginas (500 itens) para classificar os uploads. Se ultrapassar esse limite, a consulta falha explicitamente; amplie a integração antes disso.
- YouTube: consulta na abertura e a cada 10 minutos com a página visível; cache de 10 minutos por localidade da Cloudflare. A propagação do próprio YouTube pode acrescentar atraso. Não é um agendamento que roda com o site fechado.
- Twitch: consulta ao abrir a aba e a cada minuto com a página visível, com cache de 60 segundos. Falha não é interpretada como offline.
- Player Twitch só é carregado ao clicar no botão. O parâmetro parent usa o domínio atual. Testar no domínio HTTPS final; o embed pode não funcionar na prévia local/IP.
- A página inicial mostra todos os conteúdos; as páginas dos jogos usam palavras do título/descrição (Albion, Lineage ou Exilium). Sem essas palavras, o item fica em Comunidade. Esta classificação é simples e não interpreta o conteúdo do vídeo.
- Os dados antigos do navegador são apenas fallback em falhas. Uma consulta válida substitui o catálogo, inclusive se vazio. Nenhuma senha ou chave é enviada ao navegador.

## Variáveis na Cloudflare Pages

Em Workers & Pages, abra o projeto Pages > Settings > Variables and Secrets. Configure no ambiente de produção e repita na prévia se desejar testá-la. Faça novo deploy após salvar.

| Nome | Tipo | Conteúdo |
| --- | --- | --- |
| YOUTUBE_API_KEY | Secret | Chave da YouTube Data API v3 |
| YOUTUBE_SHORTS_PLAYLIST_ID | Texto | ID de uma playlist pública contendo somente seus Shorts |
| TWITCH_CLIENT_ID | Texto | Client ID de seu aplicativo Twitch |
| TWITCH_CLIENT_SECRET | Secret | Client Secret desse aplicativo |

Não usar prefixo VITE_ nessas variáveis. Não colocar chaves em arquivos do GitHub ou enviá-las pelo chat. Nunca usar a chave de transmissão da Twitch.

### YouTube

1. No Google Cloud Console, selecione/crie um projeto e ative YouTube Data API v3.
2. Em APIs e serviços > Credenciais, crie uma chave de API e restrinja a API permitida a YouTube Data API v3. Esta chave é usada no servidor, portanto restrições de referenciador de navegador não se aplicam a este fluxo.
3. Guarde-a como YOUTUBE_API_KEY na Cloudflare.
4. No YouTube, crie uma playlist pública para Shorts e adicione seus Shorts nela. Copie somente o valor depois de list= da URL e guarde como YOUTUBE_SHORTS_PLAYLIST_ID.
5. O código resolve o canal pelo handle @JhotaGamerOficial, sem depender do ID antigo presente no projeto.

### Twitch

1. Abra https://dev.twitch.tv/console/apps e registre um aplicativo para seu site, seguindo os requisitos da conta Twitch.
2. Use a categoria Website Integration se disponível. Se o cadastro exigir URL de redirecionamento, use https://jhotagamer.com.br — este fluxo não utiliza redirecionamento de login de usuário.
3. Escolha aplicativo confidencial, se houver escolha de tipo, para gerar um Client Secret de servidor.
4. Cadastre Client ID e Client Secret na Cloudflare. O servidor obtém um token de aplicativo automaticamente e consulta exclusivamente jhotagameroficial.

## Instalação e verificação

Copie as pastas src, functions, server e tests e os arquivos vite.config.ts e .gitignore para o projeto, mesclando as pastas. Preserve alterações locais antes de substituir arquivos.

Execute:

    npm run build
    npm run lint
    node --import tsx tests/media.test.ts

npm run preview mostra o frontend, mas NÃO executa Pages Functions. Para testar APIs localmente, use Wrangler Pages com a pasta dist e credenciais em .dev.vars, arquivo ignorado pelo Git:

    npx wrangler pages dev dist

Depois da configuração e publicação, valide /api/youtube e /api/twitch no domínio. Teste um vídeo comum curto (não deve virar Short), um Short incluído na playlist, uma transmissão offline e uma ao vivo. Confira as três abas no celular e desktop.

## Limites e operação

- Respeitar as cotas das APIs; cache reduz requisições, mas não garante uma cota global entre todas as localidades. Acompanhe utilização no Google Cloud e Cloudflare.
- Conteúdos privados/excluídos e vídeos de outros canais não entram no catálogo.
- Incorporação pode ter restrições por vídeo, região ou plataforma; os links externos permanecem disponíveis.
- A atualização é por consulta, não instantânea por webhook.

Referências:
- https://developers.google.com/youtube/v3/docs/channels/list
- https://developers.google.com/youtube/v3/docs/playlistItems/list
- https://developers.google.com/youtube/v3/docs/videos
- https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
- https://dev.twitch.tv/docs/api/reference/#get-streams
- https://dev.twitch.tv/docs/embed/video-and-clips/
- https://developers.cloudflare.com/pages/functions/bindings/
