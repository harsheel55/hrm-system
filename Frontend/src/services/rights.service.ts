import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type {
  ApiResponse,
  UserRightResponseDto,
  CreateUserRightDto,
  UpdateUserRightDto,
} from '../types/api.types';

export const rightsService = {
  async getRightById(id: string): Promise<ApiResponse<UserRightResponseDto>> {
    return apiClient.get<ApiResponse<UserRightResponseDto>>(ENDPOINTS.RIGHTS.BY_ID(id));
  },

  async getRightsByRole(roleId: string): Promise<ApiResponse<UserRightResponseDto[]>> {
    return apiClient.get<ApiResponse<UserRightResponseDto[]>>(ENDPOINTS.RIGHTS.BY_ROLE(roleId));
  },

  async createRight(data: CreateUserRightDto): Promise<ApiResponse<UserRightResponseDto>> {
    return apiClient.post<ApiResponse<UserRightResponseDto>>(ENDPOINTS.RIGHTS.BASE, data);
  },

  async updateRight(id: string, data: UpdateUserRightDto): Promise<ApiResponse<UserRightResponseDto>> {
    return apiClient.put<ApiResponse<UserRightResponseDto>>(ENDPOINTS.RIGHTS.BY_ID(id), data);
  },

  async deleteRight(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.RIGHTS.BY_ID(id));
  },
};
