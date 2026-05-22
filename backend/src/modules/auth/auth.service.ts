import prisma from "../../config/database";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  businessName: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new BadRequestError("Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  const business = await prisma.business.create({
    data: { name: data.businessName },
  });

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      businessId: business.id,
    },
  });

  const token = signToken({
    userId: user.id,
    businessId: business.id,
    role: user.role,
  });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    business: { id: business.id, name: business.name },
  };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    businessId: user.businessId,
    role: user.role,
  });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}
