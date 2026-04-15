const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://localhost:5139/api/auth";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
  role: string;
  roleName?: string;
}

export interface ForgotPasswordPayload {
  strEmail: string;
}

export interface ForgotPasswordResponse {
  message: string;
  expiresAtUtc?: string;
}

export interface ResetPasswordPayload {
  strEmail: string;
  strOTP: string;
  strNewPassword: string;
  strConfirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyOtpPayload {
  strEmail: string;
  strOTP: string;
}

export interface VerifyOtpResponse {
  message: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const message =
      data?.message ?? data?.title ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return handleResponse<T>(res);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot reach backend API. Make sure backend is running and CORS is configured."
      );
    }

    throw error;
  }
}

export async function registerApi(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return postJson<RegisterResponse>(`${BASE_URL}/register`, payload);
}

export async function loginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${BASE_URL}/login`, payload);
}

export async function adminRegisterApi(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return postJson<RegisterResponse>(`${BASE_URL}/admin/register`, payload);
}

export async function adminLoginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${BASE_URL}/admin/login`, payload);
}

export async function userLoginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${BASE_URL}/user/login`, payload);
}

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  return postJson<ForgotPasswordResponse>(`${BASE_URL}/forgot-password`, payload);
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  return postJson<ResetPasswordResponse>(`${BASE_URL}/reset-password`, payload);
}

export async function verifyOtpApi(
  payload: VerifyOtpPayload
): Promise<VerifyOtpResponse> {
  return postJson<VerifyOtpResponse>(`${BASE_URL}/verify-otp`, payload);
}
