import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as integrationsService from "./integrations.service";

export async function ingest(req: AuthRequest, res: Response) {
  const { platform, ...payload } = req.body;
  if (!platform) {
    res.status(400).json({ error: "Platform is required" });
    return;
  }

  const result = await integrationsService.ingestMessage(
    req.businessId!,
    platform,
    payload,
  );
  res.status(201).json(result);
}

export async function getChannels(req: AuthRequest, res: Response) {
  const channels = await integrationsService.getChannels(req.businessId!);
  res.json(channels);
}
