import type { Character, Difficulty } from "./types";
import type { Saga } from "./sagas";

// name, 3 nomes errados, e as dicas (da mais difícil para a mais fácil)
type Row = [saga: Saga, difficulty: Difficulty, name: string, wrong: [string, string, string], clues: string[]];

const ROWS: Row[] = [
  ["east-blue", "facil", "Luffy", ["Zoro", "Ace", "Buggy"], [
    "Sou o capitão de um bando de piratas.",
    "Meu corpo é feito de borracha.",
    "Meu sonho é encontrar o One Piece.",
    "Vivo pensando em comida e aventura.",
    "Uso um chapéu de palha que ganhei de Shanks.",
  ]],
  ["east-blue", "facil", "Zoro", ["Sanji", "Mihawk", "Smoker"], [
    "Sou espadachim.",
    "Meu sonho é ser o maior espadachim do mundo.",
    "Luto com três espadas, uma delas na boca.",
    "Tenho cabelo verde e me perco com facilidade.",
    "Fui o primeiro a me juntar ao bando de Luffy.",
  ]],
  ["east-blue", "medio", "Nami", ["Vivi", "Robin", "Kaya"], [
    "Sou a navegadora do bando.",
    "Roubava piratas antes de entrar no bando.",
    "Meu sonho é desenhar um mapa do mundo inteiro.",
    "Tenho cabelo laranja e uma tatuagem no ombro.",
    "Amo dinheiro e tangerinas.",
  ]],
  ["east-blue", "medio", "Sanji", ["Zeff", "Usopp", "Patty"], [
    "Sou o cozinheiro do bando.",
    "Fui criado por um chef num restaurante flutuante.",
    "Meu sonho é encontrar o All Blue.",
    "Nunca bato em mulheres e me derreto por elas.",
    "Luto principalmente com os pés e fumo cigarros.",
  ]],
  ["east-blue", "medio", "Usopp", ["Gin", "Kuro", "Buggy"], [
    "Sou o atirador do bando.",
    "Adoro contar histórias exageradas.",
    "Meu pai é um pirata que partiu quando eu era pequeno.",
    "Tenho um nariz bem comprido.",
    "Sou amigo de Kaya, de Syrup Village.",
  ]],
  ["east-blue", "dificil", "Zeff", ["Patty", "Gin", "Don Krieg"], [
    "Sou cozinheiro.",
    "Tenho uma perna de pau.",
    "Fui pirata antes de abrir um restaurante.",
    "Criei Sanji.",
    "Dirijo o Baratie.",
  ]],
  ["arabasta", "medio", "Crocodile", ["Mihawk", "Smoker", "Arlong"], [
    "Sou um pirata respeitado e autorizado pelo Governo.",
    "Tenho um gancho no lugar da mão.",
    "Meu corpo vira areia.",
    "Comando a Baroque Works, conhecido como Mr. 0.",
    "Meu cassino fica em Rainbase.",
  ]],
  ["arabasta", "facil", "Chopper", ["Carue", "Usopp", "Nami"], [
    "Sou o médico do bando.",
    "Não nasci humano, sou um animal.",
    "Comi uma Fruta do Diabo que me deu inteligência.",
    "Uso um chapéu rosa com uma cruz.",
    "Sou uma rena.",
  ]],
  ["arabasta", "medio", "Vivi", ["Nami", "Robin", "Kaya"], [
    "Sou uma princesa.",
    "Meu reino sofre com uma guerra civil provocada por um vilão.",
    "Usei o codinome Miss Wednesday.",
    "Meu melhor amigo é um pato gigante.",
    "Tenho cabelo azul-claro.",
  ]],
  ["arabasta", "medio", "Ace", ["Shanks", "Smoker", "Mihawk"], [
    "Sou irmão de Luffy.",
    "Tenho sardas e uso um chapéu laranja.",
    "Posso me transformar em fogo.",
    "Tenho uma fruta do tipo Logia.",
    "Minha fruta se chama Mera Mera no Mi.",
  ]],
  ["skypiea", "medio", "Enel", ["Wyper", "Gan Fall", "Bellamy"], [
    "Eu me considero um deus.",
    "Domino a ilha do céu.",
    "Meu corpo vira eletricidade.",
    "Ouço as vozes de todos por meio do Mantra.",
    "Comi a Goro Goro no Mi.",
  ]],
  ["skypiea", "dificil", "Montblanc Cricket", ["Bellamy", "Wyper", "Noland"], [
    "Procuro tesouros há muitos anos.",
    "Moro na ilha de Jaya.",
    "Sou da família Montblanc.",
    "Meus companheiros se chamam Masira e Shoujou.",
    "Acredito na cidade de ouro que meu antepassado viu.",
  ]],
  ["water-7", "medio", "Franky", ["Iceburg", "Paulie", "Kokoro"], [
    "Sou carpinteiro e construtor de navios.",
    "Sou parte máquina, um ciborgue.",
    "Lidero uma gangue chamada Franky Family.",
    "Aprendi a construir navios com Tom.",
    "Adoro posar e gritar \"SUPER!\".",
  ]],
  ["water-7", "dificil", "Iceburg", ["Franky", "Paulie", "Zeff"], [
    "Sou uma figura importante em Water 7.",
    "Sou o prefeito da cidade.",
    "Presido a Galley-La Company.",
    "Fui aprendiz de Tom, o mestre carpinteiro.",
  ]],
  ["enies-lobby", "dificil", "Rob Lucci", ["Spandam", "Kaku", "Blueno"], [
    "Sirvo ao Governo Mundial.",
    "Meu companheiro é um pombo chamado Hattori.",
    "Meu poder vem de um felino.",
    "Sou o agente mais forte da CP9.",
    "Lutei contra Luffy em Enies Lobby.",
  ]],
  ["enies-lobby", "medio", "Nico Robin", ["Nami", "Vivi", "Kaya"], [
    "Sou arqueóloga.",
    "Já fui chamada de \"Criança Demônio\".",
    "A ilha onde nasci foi destruída pelo Governo Mundial.",
    "Comi a Hana Hana no Mi.",
    "Fui levada para Enies Lobby pela CP9.",
  ]],
  ["enies-lobby", "dificil", "Kaku", ["Blueno", "Jabra", "Spandam"], [
    "Fingi ser um carpinteiro da Galley-La.",
    "Sou agente da CP9.",
    "Tenho um nariz comprido.",
    "Luto com três espadas, como Zoro.",
    "Minha fruta me transforma em girafa.",
  ]],
];

export const CHARACTERS: Character[] = ROWS.map(([saga, difficulty, name, wrong, clues], i) => ({
  id: `who-${i + 1}`,
  saga,
  difficulty,
  name,
  clues,
  options: [name, ...wrong],
}));
