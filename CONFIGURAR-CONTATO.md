# Ativar o formulário de contato sem plano pago da Cloudflare

As propostas enviadas pelo formulário vão para **jhotagameroficial@gmail.com**. O site continua hospedado na Cloudflare Pages; apenas o envio do e-mail é feito pelo Resend. O plano gratuito do Resend aceita até **3.000 e-mails por mês e 100 por dia** (limites consultados em setembro de 2026). O formulário exige a proteção gratuita Cloudflare Turnstile.

**Não ative Cloudflare Email Routing nem Email Sending para esta configuração. Não remova nem altere os registros MX atuais de `jhotagamer.com.br`.**

## 1. Criar o remetente gratuito

1. Crie uma conta gratuita em [resend.com](https://resend.com/).
2. Em **Domains**, adicione o subdomínio **`mail.jhotagamer.com.br`** para envio. Use a opção de **envio** (Sending), sem ativar recebimento (Receiving).
3. O Resend mostrará os registros DNS de verificação. Adicione **exatamente os nomes e valores mostrados na sua conta** no DNS da Cloudflare. Registros em `mail.jhotagamer.com.br`, `send.mail.jhotagamer.com.br` ou outros nomes específicos indicados pelo Resend não substituem o registro MX de `jhotagamer.com.br` (raiz). Confira o nome completo antes de salvar.
4. Aguarde o domínio aparecer como **Verified** no Resend. Crie uma API key com permissão de envio e copie a chave para o passo 3. **Não coloque a chave em arquivos do site nem a compartilhe em capturas de tela.**

O endereço usado como remetente será **`contato@mail.jhotagamer.com.br`**. O endereço preenchido pela pessoa aparecerá no campo **Responder para** do e-mail recebido no Gmail.

## 2. Preparar a proteção contra spam

No painel da Cloudflare, abra **Turnstile** e crie um widget para `jhotagamer.com.br` (inclua `www.jhotagamer.com.br`, se usar). Guarde a **Site Key** e a **Secret Key**. Inclua o domínio de prévia do Pages se quiser testar nele.

## 3. Configurar o projeto Pages

Abra o projeto do site em **Workers & Pages > Settings > Variables and Secrets** e adicione estas quatro variáveis no ambiente **Production**:

| Nome | Valor | Tipo |
| --- | --- | --- |
| `RESEND_API_KEY` | Chave criada no Resend | **Secret / Encrypt** |
| `CONTACT_FROM_EMAIL` | `contato@mail.jhotagamer.com.br` | Variável |
| `TURNSTILE_SITE_KEY` | Chave pública do widget | Variável |
| `TURNSTILE_SECRET_KEY` | Chave privada do widget | **Secret / Encrypt** |

Remova as variáveis `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_EMAIL_API_TOKEN` se tiver adicionado essas duas seguindo o guia antigo; o formulário não as utiliza mais. Salve as alterações e faça **Redeploy** do site. Não publique segredos no Git.

## 4. Fazer um envio de teste

Abra `/contato`, preencha o formulário e confirme que recebeu a mensagem em **jhotagameroficial@gmail.com** (veja também a pasta Spam). Se o botão ficar desativado, abra `https://jhotagamer.com.br/api/contact`: o JSON deve conter `"enabled":true`. A chave exibida nesse JSON é a *Site Key pública* do Turnstile, não é um segredo. O site só confirma o envio quando a API do Resend aceita a mensagem; a entrega final ainda depende do serviço de e-mail e pode levar algum tempo.
