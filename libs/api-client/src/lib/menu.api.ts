import { del, get, patch, post } from './client';
import type { MenuCategory, MenuItem, MenuItemType } from './types';

export const menuApi = {
  getCategories: () =>
    get<MenuCategory[]>('/menu/categories'),

  getCategoryById: (id: string) =>
    get<MenuCategory>(`/menu/categories/${id}`),

  createCategory: (body: { name: string; sortOrder?: number }) =>
    post<MenuCategory>('/menu/categories', body),

  updateCategory: (id: string, body: { name?: string; sortOrder?: number }) =>
    patch<MenuCategory>(`/menu/categories/${id}`, body),

  deleteCategory: (id: string) =>
    del<MenuCategory>(`/menu/categories/${id}`),

  getItems: (query?: {
    categoryId?: string;
    type?: MenuItemType;
    available?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (query?.categoryId) params.set('categoryId', query.categoryId);
    if (query?.type) params.set('type', query.type);
    if (query?.available !== undefined)
      params.set('available', String(query.available));
    const qs = params.toString();
    return get<MenuItem[]>(`/menu/items${qs ? `?${qs}` : ''}`);
  },

  getItemById: (id: string) =>
    get<MenuItem>(`/menu/items/${id}`),

  createItem: (body: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    type: MenuItemType;
    available?: boolean;
    sortOrder?: number;
  }) => post<MenuItem>('/menu/items', body),

  updateItem: (
    id: string,
    body: {
      categoryId?: string;
      name?: string;
      description?: string;
      price?: number;
      type?: MenuItemType;
      available?: boolean;
      sortOrder?: number;
    },
  ) => patch<MenuItem>(`/menu/items/${id}`, body),

  toggleItemAvailability: (id: string) =>
    patch<MenuItem>(`/menu/items/${id}/toggle`),

  deleteItem: (id: string) =>
    del<MenuItem>(`/menu/items/${id}`),
};
