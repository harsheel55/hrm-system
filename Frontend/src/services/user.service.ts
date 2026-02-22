import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type {
  ApiResponse,
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
} from '../types/api.types';

export const userService = {
  async getAllUsers(): Promise<ApiResponse<UserResponseDto[]>> {
    return apiClient.get<ApiResponse<UserResponseDto[]>>(ENDPOINTS.USERS.BASE);
  },

  async getUserById(id: string): Promise<ApiResponse<UserResponseDto>> {
    return apiClient.get<ApiResponse<UserResponseDto>>(ENDPOINTS.USERS.BY_ID(id));
  },

  async getUserByEmail(email: string): Promise<ApiResponse<UserResponseDto>> {
    return apiClient.get<ApiResponse<UserResponseDto>>(ENDPOINTS.USERS.BY_EMAIL(email));
  },

  async createUser(data: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    if (data.strProfileImage) {
      const formData = new FormData();
      formData.append('strUserName', data.strUserName);
      formData.append('strEmail', data.strEmail);
      formData.append('strPassword', data.strPassword);
      if (data.strPhoneNo) formData.append('strPhoneNo', data.strPhoneNo);
      if (data.dDob) formData.append('dDob', data.dDob);
      if (data.strRoleGUID) formData.append('strRoleGUID', data.strRoleGUID);
      if (data.strPreferredLanguage) formData.append('strPreferredLanguage', data.strPreferredLanguage);
      formData.append('strProfileImage', data.strProfileImage);
      
      return apiClient.postFormData<ApiResponse<UserResponseDto>>(
        ENDPOINTS.USERS.BASE,
        formData
      );
    }
    
    return apiClient.post<ApiResponse<UserResponseDto>>(ENDPOINTS.USERS.BASE, data);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> {
    if (data.strProfileImage) {
      const formData = new FormData();
      formData.append('strUserName', data.strUserName);
      formData.append('strEmail', data.strEmail);
      if (data.strPhoneNo) formData.append('strPhoneNo', data.strPhoneNo);
      if (data.dDob) formData.append('dDob', data.dDob);
      if (data.strRoleGUID) formData.append('strRoleGUID', data.strRoleGUID);
      if (data.strPreferredLanguage) formData.append('strPreferredLanguage', data.strPreferredLanguage);
      formData.append('bolIsActive', String(data.bolIsActive));
      formData.append('strProfileImage', data.strProfileImage);
      
      return apiClient.putFormData<ApiResponse<UserResponseDto>>(
        ENDPOINTS.USERS.BY_ID(id),
        formData
      );
    }
    
    return apiClient.put<ApiResponse<UserResponseDto>>(ENDPOINTS.USERS.BY_ID(id), data);
  },

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.USERS.BY_ID(id));
  },
};
