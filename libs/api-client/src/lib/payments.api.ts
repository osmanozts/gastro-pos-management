import { get, post } from './client';
import type { Payment, PaymentMethod, PaymentWithAllocations } from './types';

export const paymentsApi = {
  create: (body: {
    orderId: string;
    method: PaymentMethod;
    allocations: Array<{ orderItemId: string; amount: number }>;
  }) => post<Payment>('/payments', body),

  getByOrder: (orderId: string) =>
    get<PaymentWithAllocations[]>(`/payments/order/${orderId}`),
};
