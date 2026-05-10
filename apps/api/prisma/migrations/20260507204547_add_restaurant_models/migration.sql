-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('FREE', 'OCCUPIED', 'PARTIALLY_PAID');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'SENT_TO_KITCHEN', 'IN_PROGRESS', 'READY', 'SERVED', 'PARTIALLY_PAID', 'PAID', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('CREATED', 'SENT_TO_KITCHEN', 'READY', 'SERVED', 'PAID');

-- CreateEnum
CREATE TYPE "OrderItemLineType" AS ENUM ('MAIN', 'ADDON', 'TOPPING', 'DRINK', 'SIDE');

-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('MAIN', 'DRINK', 'ADDON', 'TOPPING', 'SIDE');

-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- CreateTable
CREATE TABLE "table" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT,
    "capacity" INTEGER NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "parentId" TEXT,
    "lineType" "OrderItemLineType" NOT NULL,
    "status" "OrderItemStatus" NOT NULL DEFAULT 'CREATED',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_item_allocation" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "payment_item_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "type" "MenuItemType" NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_option_group" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "selectionType" "SelectionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "menu_item_option_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_option_group_item" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "menu_item_option_group_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "table_number_key" ON "table"("number");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "order_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_item_allocation" ADD CONSTRAINT "payment_item_allocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_item_allocation" ADD CONSTRAINT "payment_item_allocation_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_option_group" ADD CONSTRAINT "menu_item_option_group_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_option_group_item" ADD CONSTRAINT "menu_item_option_group_item_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "menu_item_option_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_option_group_item" ADD CONSTRAINT "menu_item_option_group_item_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
