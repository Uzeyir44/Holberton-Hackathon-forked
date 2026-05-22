import { z } from "zod";

export const replySchema = z.object({
  text: z.string().min(1, "Reply text is required"),
});

export const listQuerySchema = z.object({
  status: z.string().optional(),
  platform: z.string().optional(),
  urgent: z.string().optional(),
});
