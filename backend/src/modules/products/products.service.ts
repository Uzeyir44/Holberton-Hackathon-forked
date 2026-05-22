import prisma from "../../config/database";

export async function listProducts(businessId: string) {
  const products = await prisma.product.findMany({
    where: { businessId },
    orderBy: { requests: "desc" },
  });

  if (products.length === 0) {
    return [
      { name: "Black hoodie", requests: 42, sales: 31, revenue: 1240, stock: 18, trend: "High demand" },
      { name: "Silver earrings", requests: 31, sales: 22, revenue: 770, stock: 6, trend: "Restock soon" },
      { name: "Lip gloss set", requests: 24, sales: 19, revenue: 608, stock: 14, trend: "Growing" },
      { name: "Gift box", requests: 18, sales: 12, revenue: 240, stock: 40, trend: "Seasonal" },
    ];
  }

  return products;
}

export async function createProduct(businessId: string, data: {
  name: string;
  requests?: number;
  sales?: number;
  revenue?: number;
  stock?: number;
  trend?: string;
}) {
  const product = await prisma.product.upsert({
    where: {
      businessId_name: { businessId, name: data.name },
    },
    update: {
      requests: data.requests ?? undefined,
      sales: data.sales ?? undefined,
      revenue: data.revenue ?? undefined,
      stock: data.stock ?? undefined,
      trend: data.trend ?? undefined,
    },
    create: {
      businessId,
      name: data.name,
      requests: data.requests ?? 0,
      sales: data.sales ?? 0,
      revenue: data.revenue ?? 0,
      stock: data.stock ?? 0,
      trend: data.trend ?? "Manual",
    },
  });

  return product;
}
