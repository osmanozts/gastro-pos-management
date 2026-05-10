/*
  Warnings:

  - You are about to drop the `menu_item_option_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_item_option_group_item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "menu_item_option_group" DROP CONSTRAINT "menu_item_option_group_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "menu_item_option_group_item" DROP CONSTRAINT "menu_item_option_group_item_groupId_fkey";

-- DropForeignKey
ALTER TABLE "menu_item_option_group_item" DROP CONSTRAINT "menu_item_option_group_item_menuItemId_fkey";

-- DropTable
DROP TABLE "menu_item_option_group";

-- DropTable
DROP TABLE "menu_item_option_group_item";

-- DropEnum
DROP TYPE "SelectionType";
