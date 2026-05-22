import { Request, Response } from "express";
import { getBootstrapData } from "./bootstrap.service";

export async function bootstrap(_req: Request, res: Response) {
  const data = await getBootstrapData();
  res.json(data);
}
