-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "customFields" JSONB,
ADD COLUMN     "importId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'Manual',
ALTER COLUMN "stage" SET DEFAULT 'New',
ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "project" DROP NOT NULL,
ALTER COLUMN "assignedTo" DROP NOT NULL,
ALTER COLUMN "value" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "LeadImport" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL DEFAULT 'admin',
    "totalRows" INTEGER NOT NULL,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "skippedRows" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "columnMapping" JSONB,
    "headers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadImportRow" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "rawData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "errorMsg" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadImportRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "columnMapping" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadImportRow_importId_idx" ON "LeadImportRow"("importId");

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- AddForeignKey
ALTER TABLE "LeadImportRow" ADD CONSTRAINT "LeadImportRow_importId_fkey" FOREIGN KEY ("importId") REFERENCES "LeadImport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
