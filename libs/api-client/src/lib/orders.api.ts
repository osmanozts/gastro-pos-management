import { del, get, patch, post } from './client';
import type {
  Bill,
  Order,
  OrderItemLineType,
  OrderItemStatus,
  OrderStatus,
} from './types';

export const ordersApi = {
  getAll: (query?: { tableId?: string; status?: OrderStatus }) => {
    const params = new URLSearchParams();
    if (query?.tableId) params.set('tableId', query.tableId);
    if (query?.status) params.set('status', query.status);
    const qs = params.toString();
    return get<Order[]>(`/orders${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    get<Order>(`/orders/${id}`),

  create: (body: { tableId: string; notes?: string }) =>
    post<Order>('/orders', body),

  addItems: (
    orderId: string,
    items: Array<{
      menuItemId: string;
      lineType: OrderItemLineType;
      quantity?: number;
      notes?: string;
      parentId?: string;
    }>,
  ) => post<Order>(`/orders/${orderId}/items`, { items }),

  removeItem: (orderId: string, itemId: string) =>
    del<Order>(`/orders/${orderId}/items/${itemId}`),

  sendToKitchen: (orderId: string) =>
    patch<Order>(`/orders/${orderId}/send`),

  getBill: (orderId: string) =>
    get<Bill>(`/orders/${orderId}/bill`),

  updateItemStatus: (
    orderId: string,
    itemId: string,
    status: OrderItemStatus,
  ) => patch<Order>(`/orders/${orderId}/items/${itemId}/status`, { status }),
};
