import { createContext } from "react";
import type { QuizContextType } from "../types";

export const QuizContext =
  createContext<
    QuizContextType | undefined
  >(undefined);
