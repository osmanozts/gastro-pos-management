import { del, get, patch, post } from './client';
import type { Table, TableStatus } from './types';

export const tablesApi = {
  getAll: () =>
    get<Table[]>('/tables'),

  getById: (id: string) =>
    get<Table>(`/tables/${id}`),

  create: (body: { number: number; name?: string; capacity: number }) =>
    post<Table>('/tables', body),

  update: (id: string, body: { name?: string; capacity?: number }) =>
    patch<Table>(`/tables/${id}`, body),

  updateStatus: (id: string, status: TableStatus) =>
    patch<Table>(`/tables/${id}/status`, { status }),

  delete: (id: string) =>
    del<Table>(`/tables/${id}`),
};
