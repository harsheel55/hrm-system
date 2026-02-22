import { apiClient } from './api.client';
import { ENDPOINTS, STORAGE_KEYS } from './api.config';
import type {
  ApiResponse,
  LoginDto,
  LoginResponseDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../types/api.types';

export const authService = {
  async login(data: LoginDto): Promise<ApiResponse<LoginResponseDto>> {
    const response = await apiClient.post<ApiResponse<LoginResponseDto>>(
      ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    // Store tokens and user data
    if (response.data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.strToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.strRefreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
    }
    
    return response;
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  async resetPassword(data: ResetPasswordDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  getCurrentUser(): LoginResponseDto | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
};
