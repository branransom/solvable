import type { Chapter } from "../types";
import { lesson1 } from "./lesson1";
import { lesson2 } from "./lesson2";
import { lesson3 } from "./lesson3";

export const chapter9: Chapter = {
  id: "ch9-decision-systems",
  title: "The System Around the Solver",
  description: "Input validation, monitoring, explainability, and the engineering that makes optimization reliable",
  lessons: [lesson1, lesson2, lesson3],
};
