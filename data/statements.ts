import type { Difficulty, Statement } from "./types";
import type { Saga } from "./sagas";

type Row = [saga: Saga, difficulty: Difficulty, text: string, isTrue: boolean, explanation?: string];

const ROWS: Row[] = [
  // East Blue
  ["east-blue", "facil", "Luffy comeu a Gomu Gomu no Mi.", true, "Por isso o corpo dele é de borracha."],
  ["east-blue", "facil", "Zoro luta com quatro espadas.", false, "São três espadas, uma delas na boca (Santoryu)."],
  ["east-blue", "facil", "O Baratie é um restaurante flutuante.", true],
  ["east-blue", "facil", "Nami sonha em ser a melhor cozinheira do mundo.", false, "Nami quer desenhar um mapa do mundo."],
  ["east-blue", "medio", "Buggy comeu a Bara Bara no Mi.", true, "Ele divide o corpo em partes."],
  ["east-blue", "facil", "Arlong é um homem-peixe.", true],
  ["east-blue", "medio", "Gol D. Roger foi executado em Loguetown.", true],
  ["east-blue", "facil", "Sanji sonha em encontrar o All Blue.", true],
  ["east-blue", "medio", "Usopp é filho de Shanks.", false, "O pai de Usopp é o pirata Yasopp."],
  ["east-blue", "medio", "Zoro foi derrotado por Mihawk no Baratie.", true],
  ["east-blue", "facil", "Depois de comer a Gomu Gomu no Mi, Luffy continuou sabendo nadar.", false, "Frutas do Diabo tiram a capacidade de nadar."],
  ["east-blue", "dificil", "Smoker comeu a Mera Mera no Mi.", false, "Smoker comeu a Moku Moku no Mi, a fruta da fumaça."],
  ["east-blue", "facil", "Sanji é o médico do bando.", false, "Sanji é o cozinheiro."],
  // Arabasta
  ["arabasta", "facil", "Chopper é um urso.", false, "Chopper é uma rena."],
  ["arabasta", "medio", "Crocodile comeu a Suna Suna no Mi.", true],
  ["arabasta", "facil", "A princesa Vivi é filha do rei Cobra.", true],
  ["arabasta", "medio", "Ace controla o fogo com a Mera Mera no Mi.", true],
  ["arabasta", "medio", "Nico Robin trabalha com Crocodile como Miss All Sunday.", true],
  ["arabasta", "medio", "Whiskey Peak fica no meio do deserto de Arabasta.", false, "Whiskey Peak fica no começo da Grand Line."],
  ["arabasta", "dificil", "O cassino de Crocodile fica em Rainbase.", true],
  // Skypiea
  ["skypiea", "medio", "Enel comeu a Goro Goro no Mi.", true],
  ["skypiea", "facil", "Skypiea fica no fundo do mar.", false, "A ilha fica no céu, acima das nuvens."],
  ["skypiea", "facil", "Luffy toca o sino de ouro no final da saga.", true],
  ["skypiea", "medio", "Bellamy é o capitão do bando de Arlong.", false, "Bellamy é um pirata de Jaya, conhecido como Hiena."],
  ["skypiea", "dificil", "Crocodile é um dos grandes vilões de Skypiea.", false, "Ele é o vilão de Arabasta."],
  // Water 7
  ["water-7", "facil", "Water 7 é chamada de Cidade da Água.", true],
  ["water-7", "medio", "Iceburg é o prefeito de Water 7.", true],
  ["water-7", "dificil", "Tom construiu o Oro Jackson.", true],
  ["water-7", "medio", "A CP9 trabalha para os Piratas do Chapéu de Palha.", false, "A CP9 serve ao Governo Mundial."],
  ["water-7", "medio", "Luffy e Usopp brigam por causa do Going Merry.", true],
  ["water-7", "facil", "Franky lidera a Franky Family.", true],
  // Enies Lobby
  ["enies-lobby", "dificil", "Rob Lucci comeu a Neko Neko no Mi: Modelo Leopardo.", true],
  ["enies-lobby", "medio", "Usopp se disfarça de Sogeking.", true],
  ["enies-lobby", "dificil", "Luffy derrota Lucci usando Gear Second e Gear Third.", true],
  ["enies-lobby", "facil", "Enies Lobby é a ilha judicial do Governo Mundial.", true],
  ["enies-lobby", "medio", "Robin é levada pela CP9 para Skypiea.", false, "Ela é levada para Enies Lobby."],
];

export const STATEMENTS: Statement[] = ROWS.map(([saga, difficulty, text, isTrue, explanation], i) => ({
  id: `tf-${i + 1}`,
  saga,
  difficulty,
  text,
  isTrue,
  explanation,
}));
