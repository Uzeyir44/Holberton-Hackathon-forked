import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as analyticsService from "./analytics.service";

export async function getSales(req: AuthRequest, res: Response) {
  const data = await analyticsService.getSalesAnalytics(req.businessId!);
  res.json(data);
}

export async function getProducts(req: AuthRequest, res: Response) {
  const products = await analyticsService.getProductDemand(req.businessId!);
  res.json({ products });
}

export async function getMetrics(req: AuthRequest, res: Response) {
  const metrics = await analyticsService.getMetrics(req.businessId!);
  res.json(metrics);
}

export async function demoUpdateMetrics(req: AuthRequest, res: Response) {
  const metrics = await analyticsService.getMetrics(req.businessId!);
  metrics.backend_revision = (metrics.backend_revision || 0) + 1;
  metrics.estimated_sales += 137;
  res.json(metrics);
}
