import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as messagesService from "./messages.service";

export async function getByConversation(req: AuthRequest, res: Response) {
  const messages = await messagesService.getMessagesByConversation(
    req.params.convId,
    req.businessId!,
  );
  res.json({ messages });
}
