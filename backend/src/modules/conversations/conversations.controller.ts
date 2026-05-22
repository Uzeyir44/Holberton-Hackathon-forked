import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as conversationsService from "./conversations.service";

export async function list(req: AuthRequest, res: Response) {
  const conversations = await conversationsService.listConversations(
    req.businessId!,
    req.query as any,
  );
  res.json({ conversations });
}

export async function getById(req: AuthRequest, res: Response) {
  const conversation = await conversationsService.getConversationById(
    req.params.id,
    req.businessId!,
  );
  res.json({ conversation });
}

export async function reply(req: AuthRequest, res: Response) {
  const result = await conversationsService.replyToConversation(
    req.params.id,
    req.businessId!,
    req.body.text,
  );
  res.json(result);
}

export async function assignUrgent(req: AuthRequest, res: Response) {
  const result = await conversationsService.assignUrgent(req.businessId!);
  res.json(result);
}

export async function markPriority(req: AuthRequest, res: Response) {
  const result = await conversationsService.markPriority(
    req.params.id,
    req.businessId!,
  );
  res.json(result);
}

export async function getUnanswered(req: AuthRequest, res: Response) {
  const conversations = await conversationsService.getUnansweredConversations(
    req.businessId!,
  );
  res.json({ conversations, total: conversations.length });
}
