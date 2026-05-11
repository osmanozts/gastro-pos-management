// ─── Enums ────────────────────────────────────────────────────

export type TableStatus = 'FREE' | 'OCCUPIED' | 'PARTIALLY_PAID';

export type OrderStatus =
  | 'DRAFT'
  | 'SENT_TO_KITCHEN'
  | 'IN_PROGRESS'
  | 'READY'
  | 'SERVED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'CLOSED';

export type OrderItemStatus =
  | 'CREATED'
  | 'SENT_TO_KITCHEN'
  | 'READY'
  | 'SERVED'
  | 'PAID';

export type OrderItemLineType = 'MAIN' | 'ADDON' | 'TOPPING' | 'DRINK' | 'SIDE';

export type MenuItemType = 'MAIN' | 'DRINK' | 'ADDON' | 'TOPPING' | 'SIDE';

export type PaymentMethod = 'CASH' | 'CARD';

// ─── Table ────────────────────────────────────────────────────

export interface Table {
  id: string;
  number: number;
  name: string | null;
  capacity: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Menu ─────────────────────────────────────────────────────

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: { id: string; name: string };
  name: string;
  description: string | null;
  price: string;
  type: MenuItemType;
  available: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────

export interface OrderItemAddon {
  id: string;
  menuItem: { id: string; name: string; price: string; type: string };
  lineType: OrderItemLineType;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  status: OrderItemStatus;
}

export interface OrderItem {
  id: string;
  menuItem: { id: string; name: string; price: string; type: string };
  lineType: OrderItemLineType;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  status: OrderItemStatus;
  createdAt: string;
  updatedAt: string;
  children: OrderItemAddon[];
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: string;
  createdAt: string;
}

export interface Order {
  id: string;
  tableId: string;
  table: { id: string; number: number; name: string | null };
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
}

// ─── Bill ─────────────────────────────────────────────────────

export interface BillAddon {
  id: string;
  menuItem: { id: string; name: string };
  lineType: OrderItemLineType;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  status: OrderItemStatus;
  lineTotal: string;
  paid: string;
  remaining: string;
}

export interface BillItem {
  id: string;
  menuItem: { id: string; name: string };
  lineType: OrderItemLineType;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  status: OrderItemStatus;
  lineTotal: string;
  paid: string;
  remaining: string;
  addons: BillAddon[];
}

export interface Bill {
  orderId: string;
  tableId: string;
  status: OrderStatus;
  notes: string | null;
  items: BillItem[];
  grandTotal: string;
  totalPaid: string;
  remaining: string;
  payments: Payment[];
}

// ─── Payment History ──────────────────────────────────────────

export interface PaymentAllocation {
  id: string;
  orderItemId: string;
  amount: string;
  orderItem: {
    id: string;
    quantity: number;
    unitPrice: string;
    menuItem: { id: string; name: string };
  };
}

export interface PaymentWithAllocations extends Payment {
  allocations: PaymentAllocation[];
}

// ─── Auth ─────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: AuthUser;
}
