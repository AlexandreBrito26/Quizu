import type { Saga } from "../sagas";
import type { Question, QuestionInput } from "../types";
import { ARABASTA } from "./arabasta";
import { EAST_BLUE } from "./east-blue";
import { ENIES_LOBBY } from "./enies-lobby";
import { SKYPIEA } from "./skypiea";
import { WATER_7 } from "./water-7";

function tag(saga: Saga, items: QuestionInput[]): Question[] {
  return items.map((item, i) => ({ ...item, id: `${saga}-${i + 1}`, saga }));
}

export const QUESTIONS: Question[] = [
  ...tag("east-blue", EAST_BLUE),
  ...tag("arabasta", ARABASTA),
  ...tag("skypiea", SKYPIEA),
  ...tag("water-7", WATER_7),
  ...tag("enies-lobby", ENIES_LOBBY),
];
