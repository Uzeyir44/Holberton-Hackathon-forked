import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

const TEAM_ROLES = [
  { name: "Aysel", role: "Owner", conversations: 86, reply: "5m", status: "Online" },
  { name: "Murad", role: "Sales assistant", conversations: 54, reply: "9m", status: "Online" },
  { name: "Leyla", role: "Support", conversations: 39, reply: "14m", status: "Away" },
];

export async function getTeam(businessId: string) {
  const users = await prisma.user.findMany({
    where: { businessId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (users.length === 0) {
    return TEAM_ROLES;
  }

  return users.map((u) => ({
    name: u.name,
    role: u.role,
    conversations: 0,
    reply: "-",
    status: "Online",
  }));
}

export async function inviteMember(businessId: string) {
  const newMember = {
    name: "New teammate",
    role: "Sales assistant",
    conversations: 0,
    reply: "-",
    status: "Invited",
  };

  return newMember;
}

export async function getPermissions(name: string, businessId: string) {
  const user = await prisma.user.findFirst({
    where: { businessId, name: { equals: name, mode: "insensitive" } },
  });

  const member = user
    ? { name: user.name, role: user.role, conversations: 0, reply: "-", status: "Online" }
    : TEAM_ROLES.find((m) => m.name.toLowerCase() === name.toLowerCase());

  if (!member) {
    throw new NotFoundError("Team member not found");
  }

  const permissions = {
    can_reply: true,
    can_create_sales: member.role !== "Support",
    can_manage_billing: member.role === "Owner",
    can_invite_team: member.role === "Owner",
  };

  return { member, permissions };
}
