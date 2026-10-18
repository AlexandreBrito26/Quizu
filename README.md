# Quizu (One Piece até Enies Lobby)

Quiz de fã feito com **Next.js 16 + React 19 + SCSS**, pensado primeiro para celular. Sem spoilers além da saga Enies Lobby.

## Modos
- **Clássico**: 10 perguntas com tempo, bônus de velocidade e de sequência
- **Quem sou eu?**: dicas liberadas aos poucos (menos dicas = mais pontos)
- **Verdadeiro ou falso**: 10 segundos por frase
- **Fruta do Diabo**: leia o poder e descubra a fruta
- **Duelo local**: dois jogadores alternando no mesmo aparelho

Extras: filtro por saga (East Blue, Arabasta, Skypiea, Water 7, Enies Lobby), tema visual por saga (no modo "Grand Line completa" o tema muda a cada pergunta), recompensa em berries, ranking (Grumete → Rei dos Piratas), "seu lugar no bando", recorde salvo no aparelho e botão de compartilhar.

Mobile: layout mobile-first, botões de 48px+, ação principal fixa no rodapé (ao alcance do polegar), suporte a notch (`safe-area`), vibração ao responder e manifest PWA ("Adicionar à tela inicial").

Níveis Fácil, Médio e Difícil podem ser combinados com qualquer saga. O resultado mostra o seu bando ideal (tripulantes das sagas em que você foi melhor).

## Loja, conquistas, desafio diário e ranking
- **Desafio diário** (`/diario`): as mesmas 10 perguntas para todo mundo, sorteadas pela data (horário de Brasília). Só a primeira tentativa do dia vale berries e ranking; as outras são treino. Dias seguidos dão bônus.
- **Loja** (`/loja`): gaste berries em navios (aparecem no mar de todas as telas) e em 50/50 extras.
- **Conquistas** (`/conquistas`): 14 conquistas, cada uma com recompensa em berries.
- **Ranking online** (`/ranking`): top 20 do dia e geral, enviado ao fim do desafio diário.

Carteira, compras e conquistas ficam no `localStorage` do aparelho. O ranking precisa de um banco: sem ele o jogo funciona normalmente e a tela mostra "indisponível".

### Ligando o ranking online (grátis)
1. No projeto da Vercel, vá em **Storage** → **Marketplace** → **Upstash for Redis** e crie um banco gratuito ligado ao projeto.
2. A integração cria as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`). O código aceita as duas.
3. Faça um novo deploy.

Limite conhecido: a pontuação é calculada no aparelho, então um jogador esperto pode enviar um valor falso. A API só aceita 1 envio por aparelho por dia, pontuação máxima possível e data de hoje, mas não é anti-trapaça de verdade.

## Rodar localmente
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Onde mexer
```
data/questions/<saga>.ts   perguntas de múltipla escolha (4 opções, índice da certa)
data/statements.ts         verdadeiro ou falso
data/characters.ts         "Quem sou eu?"
data/fruits.ts             frutas do diabo
styles/globals.scss        temas por saga (variáveis CSS em [data-theme])
lib/scoring.ts             regras de pontuação
```
Cada ponto vale 100 mil berries. Para adicionar perguntas, basta incluir uma linha no arquivo da saga.

## Deploy na Vercel
**Pelo painel (recomendado)**
1. Suba o projeto para o GitHub (`git init`, `git add .`, `git commit`, `git push`).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Deixe as configurações padrão (o `vercel.json` já indica Next.js) e clique em **Deploy**.

**Pela linha de comando**
```bash
npx vercel        # primeira vez: faz login e cria o projeto
npx vercel --prod # publica em produção
```
Não precisa de variáveis de ambiente nem de banco de dados.

> Projeto de fã sem fins lucrativos. One Piece © Eiichiro Oda / Shueisha / Toei Animation.
