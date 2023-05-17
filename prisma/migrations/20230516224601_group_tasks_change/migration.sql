/*
  Warnings:

  - You are about to drop the column `userId` on the `GroupTask` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `GroupTask` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `GroupTask` DROP COLUMN `userId`,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
