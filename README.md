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
