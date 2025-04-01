
import * as z from "zod";

export const flashcardSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.enum(["easy", "medium", "hard"])
});

export type FlashcardFormValues = z.infer<typeof flashcardSchema>;
