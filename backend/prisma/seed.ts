import { PrismaClient, Platform, SenderType, ConversationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const business = await prisma.business.upsert({
    where: { id: "demo-business-id" },
    update: {},
    create: {
      id: "demo-business-id",
      name: "Aysel Shop",
      subscription: "starter",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "aysel@shop.az" },
    update: {},
    create: {
      email: "aysel@shop.az",
      passwordHash: "$2a$10$dummy_hash_for_demo_only_do_not_use_in_production",
      name: "Aysel",
      role: "owner",
      businessId: business.id,
    },
  });

  const integrations = [
    { platform: Platform.INSTAGRAM, accountName: "aysel_shop_az" },
    { platform: Platform.WHATSAPP, accountName: "+994501234567" },
    { platform: Platform.TELEGRAM, accountName: "Aysel Shop Bot" },
  ];

  for (const integration of integrations) {
    await prisma.platformIntegration.upsert({
      where: {
        businessId_platform_accountName: {
          businessId: business.id,
          platform: integration.platform as Platform,
          accountName: integration.accountName,
        },
      },
      update: { isConnected: true },
      create: {
        businessId: business.id,
        platform: integration.platform as Platform,
        accountName: integration.accountName,
        isConnected: true,
      },
    });
  }

  const products = [
    { name: "Black hoodie", requests: 42, sales: 31, revenue: 1240, stock: 18, trend: "High demand" },
    { name: "Silver earrings", requests: 31, sales: 22, revenue: 770, stock: 6, trend: "Restock soon" },
    { name: "Lip gloss set", requests: 24, sales: 19, revenue: 608, stock: 14, trend: "Growing" },
    { name: "Gift box", requests: 18, sales: 12, revenue: 240, stock: 40, trend: "Seasonal" },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        businessId_name: { businessId: business.id, name: product.name },
      },
      update: product,
      create: { businessId: business.id, ...product },
    });
  }

  const conv1 = await prisma.conversation.upsert({
    where: {
      businessId_platform_platformId: {
        businessId: business.id,
        platform: Platform.INSTAGRAM,
        platformId: "ig-conv-1",
      },
    },
    update: {},
    create: {
      businessId: business.id,
      platform: Platform.INSTAGRAM,
      platformId: "ig-conv-1",
      customerName: "Lara Accessories",
      customerId: "ig-user-lara",
      status: ConversationStatus.ACTIVE,
      lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv1.id, senderType: SenderType.CUSTOMER, content: "Hi, do you have black hoodies? I need 2 pieces.", sentAt: new Date(Date.now() - 10 * 60 * 1000) },
      { conversationId: conv1.id, senderType: SenderType.BUSINESS, content: "Hi, yes. Please send the sizes and delivery address.", sentAt: new Date(Date.now() - 8 * 60 * 1000) },
      { conversationId: conv1.id, senderType: SenderType.CUSTOMER, content: "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami.", sentAt: new Date(Date.now() - 2 * 60 * 1000) },
    ],
  });

  await prisma.aIExtraction.create({
    data: {
      conversationId: conv1.id,
      productName: "Black hoodie",
      quantity: 2,
      revenue: 80,
      currency: "AZN",
      rawMessage: "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami.",
    },
  });

  const conv2 = await prisma.conversation.upsert({
    where: {
      businessId_platform_platformId: {
        businessId: business.id,
        platform: Platform.WHATSAPP,
        platformId: "wa-conv-1",
      },
    },
    update: {},
    create: {
      businessId: business.id,
      platform: Platform.WHATSAPP,
      platformId: "wa-conv-1",
      customerName: "Nigar M.",
      customerId: "wa-user-nigar",
      status: ConversationStatus.NEEDS_ATTENTION,
      isUrgent: true,
      lastMessageAt: new Date(Date.now() - 34 * 60 * 1000),
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv2.id, senderType: SenderType.CUSTOMER, content: "Do you still have silver earrings in stock?", sentAt: new Date(Date.now() - 34 * 60 * 1000) },
      { conversationId: conv2.id, senderType: SenderType.CUSTOMER, content: "I need 3 pairs today if possible.", sentAt: new Date(Date.now() - 33 * 60 * 1000) },
    ],
  });

  await prisma.aIExtraction.create({
    data: {
      conversationId: conv2.id,
      productName: "Silver earrings",
      quantity: 3,
      revenue: 105,
      currency: "AZN",
      rawMessage: "I need 3 pairs today if possible.",
    },
  });

  const conv3 = await prisma.conversation.upsert({
    where: {
      businessId_platform_platformId: {
        businessId: business.id,
        platform: Platform.TELEGRAM,
        platformId: "tg-conv-1",
      },
    },
    update: {},
    create: {
      businessId: business.id,
      platform: Platform.TELEGRAM,
      platformId: "tg-conv-1",
      customerName: "Elmir Boutique",
      customerId: "tg-user-elmir",
      status: ConversationStatus.ACTIVE,
      lastMessageAt: new Date(Date.now() - 48 * 60 * 1000),
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv3.id, senderType: SenderType.CUSTOMER, content: "Need 5 gift boxes by tomorrow morning.", sentAt: new Date(Date.now() - 48 * 60 * 1000) },
      { conversationId: conv3.id, senderType: SenderType.BUSINESS, content: "We have matte black and rose gift boxes available.", sentAt: new Date(Date.now() - 45 * 60 * 1000) },
    ],
  });

  await prisma.aIExtraction.create({
    data: {
      conversationId: conv3.id,
      productName: "Gift box",
      quantity: 5,
      revenue: 50,
      currency: "AZN",
      rawMessage: "Need 5 gift boxes by tomorrow morning.",
    },
  });

  const conv4 = await prisma.conversation.upsert({
    where: {
      businessId_platform_platformId: {
        businessId: business.id,
        platform: Platform.INSTAGRAM,
        platformId: "ig-conv-2",
      },
    },
    update: {},
    create: {
      businessId: business.id,
      platform: Platform.INSTAGRAM,
      platformId: "ig-conv-2",
      customerName: "Sabina Aliyeva",
      customerId: "ig-user-sabina",
      status: ConversationStatus.ACTIVE,
      lastMessageAt: new Date(Date.now() - 60 * 60 * 1000),
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv4.id, senderType: SenderType.CUSTOMER, content: "Please send price for rose lip gloss set.", sentAt: new Date(Date.now() - 60 * 60 * 1000) },
      { conversationId: conv4.id, senderType: SenderType.BUSINESS, content: "The rose lip gloss set is 32 AZN and delivery is available today.", sentAt: new Date(Date.now() - 55 * 60 * 1000) },
    ],
  });

  await prisma.aIExtraction.create({
    data: {
      conversationId: conv4.id,
      productName: "Lip gloss set",
      quantity: 1,
      revenue: 32,
      currency: "AZN",
      rawMessage: "Please send price for rose lip gloss set.",
    },
  });

  console.log("Seed complete!");
  console.log("Demo business ID: demo-business-id");
  console.log("Demo user email: aysel@shop.az");
  console.log("Conversations, messages, products, and extractions created.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
