/*
  Warnings:

  - You are about to drop the column `groupTaskId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GroupTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Group_id_idx` ON `Group`;

-- DropIndex
DROP INDEX `User_groupTaskId_idx` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `groupTaskId`;

-- DropTable
DROP TABLE `GroupTask`;

-- DropTable
DROP TABLE `_GroupToUser`;

-- CreateTable
CREATE TABLE `GroupMember` (
    `userId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    INDEX `GroupMember_userId_idx`(`userId`),
    INDEX `GroupMember_groupId_idx`(`groupId`),
    PRIMARY KEY (`userId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
