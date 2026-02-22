import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type {
  ApiResponse,
  UserRoleResponseDto,
  CreateUserRoleDto,
  UpdateUserRoleDto,
} from '../types/api.types';

export const roleService = {
  async getAllRoles(): Promise<ApiResponse<UserRoleResponseDto[]>> {
    return apiClient.get<ApiResponse<UserRoleResponseDto[]>>(ENDPOINTS.ROLES.BASE);
  },

  async getRoleById(id: string): Promise<ApiResponse<UserRoleResponseDto>> {
    return apiClient.get<ApiResponse<UserRoleResponseDto>>(ENDPOINTS.ROLES.BY_ID(id));
  },

  async getRoleByName(name: string): Promise<ApiResponse<UserRoleResponseDto>> {
    return apiClient.get<ApiResponse<UserRoleResponseDto>>(ENDPOINTS.ROLES.BY_NAME(name));
  },

  async createRole(data: CreateUserRoleDto): Promise<ApiResponse<UserRoleResponseDto>> {
    return apiClient.post<ApiResponse<UserRoleResponseDto>>(ENDPOINTS.ROLES.BASE, data);
  },

  async updateRole(id: string, data: UpdateUserRoleDto): Promise<ApiResponse<UserRoleResponseDto>> {
    return apiClient.put<ApiResponse<UserRoleResponseDto>>(ENDPOINTS.ROLES.BY_ID(id), data);
  },

  async deleteRole(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.ROLES.BY_ID(id));
  },
};
