-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'WHATSAPP', 'TELEGRAM', 'MANUAL');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('CUSTOMER', 'BUSINESS');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'NEEDS_ATTENTION', 'RESOLVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "businessId" TEXT NOT NULL,
    "avatar" TEXT,
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subscription" TEXT NOT NULL DEFAULT 'starter',
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformIntegration" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "accountName" TEXT NOT NULL,
    "accessToken" TEXT,
    "webhookSecret" TEXT,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "platformId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerAvatar" TEXT,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "content" TEXT NOT NULL,
    "platformMsgId" TEXT,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIExtraction" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "productName" TEXT,
    "quantity" INTEGER,
    "revenue" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'AZN',
    "confidence" DOUBLE PRECISION,
    "rawMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requests" INTEGER NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "trend" TEXT NOT NULL DEFAULT 'Manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSummary" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "estimatedRevenue" DOUBLE PRECISION,
    "topProducts" JSONB,
    "urgentCount" INTEGER,
    "avgReplyTime" INTEGER,
    "recommendations" TEXT,
    "rawSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_businessId_idx" ON "User"("businessId");

-- CreateIndex
CREATE INDEX "PlatformIntegration_businessId_idx" ON "PlatformIntegration"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformIntegration_businessId_platform_accountName_key" ON "PlatformIntegration"("businessId", "platform", "accountName");

-- CreateIndex
CREATE INDEX "Conversation_businessId_status_idx" ON "Conversation"("businessId", "status");

-- CreateIndex
CREATE INDEX "Conversation_businessId_isUrgent_idx" ON "Conversation"("businessId", "isUrgent");

-- CreateIndex
CREATE INDEX "Conversation_businessId_lastMessageAt_idx" ON "Conversation"("businessId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_businessId_platform_platformId_key" ON "Conversation"("businessId", "platform", "platformId");

-- CreateIndex
CREATE INDEX "Message_conversationId_sentAt_idx" ON "Message"("conversationId", "sentAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_senderType_idx" ON "Message"("conversationId", "senderType");

-- CreateIndex
CREATE INDEX "AIExtraction_conversationId_idx" ON "AIExtraction"("conversationId");

-- CreateIndex
CREATE INDEX "AIExtraction_productName_idx" ON "AIExtraction"("productName");

-- CreateIndex
CREATE INDEX "Product_businessId_idx" ON "Product"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_businessId_name_key" ON "Product"("businessId", "name");

-- CreateIndex
CREATE INDEX "AnalyticsSummary_businessId_type_idx" ON "AnalyticsSummary"("businessId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSummary_businessId_type_periodStart_key" ON "AnalyticsSummary"("businessId", "type", "periodStart");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformIntegration" ADD CONSTRAINT "PlatformIntegration_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIExtraction" ADD CONSTRAINT "AIExtraction_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSummary" ADD CONSTRAINT "AnalyticsSummary_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
