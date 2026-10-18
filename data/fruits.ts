import type { Difficulty, Fruit } from "./types";
import type { Saga } from "./sagas";

type Row = [saga: Saga, difficulty: Difficulty, name: string, power: string, wrong: [string, string, string]];

const ROWS: Row[] = [
  ["east-blue", "facil", "Gomu Gomu no Mi", "Transforma o corpo do usuário em borracha. Em troca, ele nunca mais poderá nadar.", ["Mera Mera no Mi", "Hito Hito no Mi", "Bara Bara no Mi"]],
  ["east-blue", "medio", "Bara Bara no Mi", "Permite dividir o corpo em partes que flutuam, e lâminas não conseguem cortar o usuário.", ["Gomu Gomu no Mi", "Supa Supa no Mi", "Hana Hana no Mi"]],
  ["east-blue", "medio", "Moku Moku no Mi", "Transforma o usuário em fumaça. É uma fruta do tipo Logia.", ["Suna Suna no Mi", "Mera Mera no Mi", "Goro Goro no Mi"]],
  ["arabasta", "medio", "Suna Suna no Mi", "Transforma o usuário em areia e permite controlar o deserto. É uma Logia.", ["Moku Moku no Mi", "Goro Goro no Mi", "Mera Mera no Mi"]],
  ["arabasta", "medio", "Mera Mera no Mi", "Permite criar e controlar o fogo. É uma fruta do tipo Logia.", ["Suna Suna no Mi", "Moku Moku no Mi", "Goro Goro no Mi"]],
  ["arabasta", "medio", "Hito Hito no Mi", "Dá a um animal inteligência humana e a capacidade de se transformar em forma humana.", ["Neko Neko no Mi: Leopardo", "Ushi Ushi no Mi: Girafa", "Baku Baku no Mi"]],
  ["arabasta", "medio", "Hana Hana no Mi", "Permite fazer brotar partes do próprio corpo em qualquer lugar.", ["Bara Bara no Mi", "Mane Mane no Mi", "Doru Doru no Mi"]],
  ["arabasta", "medio", "Mane Mane no Mi", "Permite copiar o rosto e o corpo de qualquer pessoa que o usuário tenha tocado.", ["Hana Hana no Mi", "Doru Doru no Mi", "Baku Baku no Mi"]],
  ["arabasta", "dificil", "Doru Doru no Mi", "Permite criar e moldar cera, inclusive endurecendo-a como armadura.", ["Mane Mane no Mi", "Baku Baku no Mi", "Supa Supa no Mi"]],
  ["arabasta", "dificil", "Baku Baku no Mi", "Permite comer qualquer coisa e fundi-la ao próprio corpo.", ["Doru Doru no Mi", "Mane Mane no Mi", "Hito Hito no Mi"]],
  ["arabasta", "dificil", "Supa Supa no Mi", "Transforma partes do corpo em lâminas de aço.", ["Bara Bara no Mi", "Doru Doru no Mi", "Gomu Gomu no Mi"]],
  ["skypiea", "medio", "Goro Goro no Mi", "Dá ao usuário o poder do raio. É uma fruta do tipo Logia.", ["Mera Mera no Mi", "Suna Suna no Mi", "Moku Moku no Mi"]],
  ["enies-lobby", "dificil", "Neko Neko no Mi: Leopardo", "Transforma o usuário em um felino e dá a ele força e agilidade de um leopardo.", ["Hito Hito no Mi", "Ushi Ushi no Mi: Girafa", "Baku Baku no Mi"]],
  ["enies-lobby", "dificil", "Ushi Ushi no Mi: Girafa", "Permite ao usuário se transformar em uma girafa e em uma forma híbrida.", ["Neko Neko no Mi: Leopardo", "Hito Hito no Mi", "Baku Baku no Mi"]],
];

export const FRUITS: Fruit[] = ROWS.map(([saga, difficulty, name, power, wrong], i) => ({
  id: `fruit-${i + 1}`,
  saga,
  difficulty,
  name,
  power,
  options: [name, ...wrong],
}));
