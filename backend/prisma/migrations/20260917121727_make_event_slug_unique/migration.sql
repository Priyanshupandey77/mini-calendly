/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Event_userId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
