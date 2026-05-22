import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as productsService from "./products.service";

export async function list(req: AuthRequest, res: Response) {
  const products = await productsService.listProducts(req.businessId!);
  res.json({ products });
}

export async function create(req: AuthRequest, res: Response) {
  const { name, requests, sales, revenue, stock, trend } = req.body;
  if (!name) {
    res.status(400).json({ error: "Product name is required" });
    return;
  }

  const product = await productsService.createProduct(req.businessId!, {
    name,
    requests: Number(requests) || 0,
    sales: Number(sales) || 0,
    revenue: Number(revenue) || 0,
    stock: Number(stock) || 0,
    trend: trend || "Manual",
  });

  res.status(201).json({ created: true, product });
}
