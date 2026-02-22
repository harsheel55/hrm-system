import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type {
  ApiResponse,
  MenuResponseDto,
  CreateMenuDto,
  UpdateMenuDto,
} from '../types/api.types';

export const menuService = {
  async getAllMenus(): Promise<ApiResponse<MenuResponseDto[]>> {
    return apiClient.get<ApiResponse<MenuResponseDto[]>>(ENDPOINTS.MENUS.BASE);
  },

  async getMenuById(id: string): Promise<ApiResponse<MenuResponseDto>> {
    return apiClient.get<ApiResponse<MenuResponseDto>>(ENDPOINTS.MENUS.BY_ID(id));
  },

  async getMenuByKey(key: string): Promise<ApiResponse<MenuResponseDto>> {
    return apiClient.get<ApiResponse<MenuResponseDto>>(ENDPOINTS.MENUS.BY_KEY(key));
  },

  async getMenusByParent(parentId: string): Promise<ApiResponse<MenuResponseDto[]>> {
    return apiClient.get<ApiResponse<MenuResponseDto[]>>(ENDPOINTS.MENUS.BY_PARENT(parentId));
  },

  async createMenu(data: CreateMenuDto): Promise<ApiResponse<MenuResponseDto>> {
    return apiClient.post<ApiResponse<MenuResponseDto>>(ENDPOINTS.MENUS.BASE, data);
  },

  async updateMenu(id: string, data: UpdateMenuDto): Promise<ApiResponse<MenuResponseDto>> {
    return apiClient.put<ApiResponse<MenuResponseDto>>(ENDPOINTS.MENUS.BY_ID(id), data);
  },

  async deleteMenu(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.MENUS.BY_ID(id));
  },
};
