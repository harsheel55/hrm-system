// API Configuration
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  'http://localhost:5139/api';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Users
  USERS: {
    BASE: '/user',
    BY_ID: (id: string) => `/user/${id}`,
    BY_EMAIL: (email: string) => `/user/email/${email}`,
  },
  // Roles
  ROLES: {
    BASE: '/userrole',
    BY_ID: (id: string) => `/userrole/${id}`,
    BY_NAME: (name: string) => `/userrole/name/${name}`,
  },
  // Rights
  RIGHTS: {
    BASE: '/userrights',
    BY_ID: (id: string) => `/userrights/${id}`,
    BY_ROLE: (roleId: string) => `/userrights/role/${roleId}`,
  },
  // Menus
  MENUS: {
    BASE: '/menu',
    BY_ID: (id: string) => `/menu/${id}`,
    BY_KEY: (key: string) => `/menu/key/${key}`,
    BY_PARENT: (parentId: string) => `/menu/parent/${parentId}`,
  },
  // Blogs
  BLOGS: {
    BASE: '/blog',
    BY_ID: (id: string) => `/blog/${id}`,
    BY_SLUG: (slug: string) => `/blog/slug/${slug}`,
    PUBLISHED: '/blog/published',
    FEATURED: '/blog/featured',
  },
  // Blog Categories
  BLOG_CATEGORIES: {
    BASE: '/blogcategory',
    BY_ID: (id: string) => `/blogcategory/${id}`,
    BY_SLUG: (slug: string) => `/blogcategory/slug/${slug}`,
  },
  // Blog Tags
  BLOG_TAGS: {
    BASE: '/blogtag',
    BY_ID: (id: string) => `/blogtag/${id}`,
    BY_SLUG: (slug: string) => `/blogtag/slug/${slug}`,
  },
  // Leaves
  LEAVE: {
    DASHBOARD: '/leave/dashboard',
    REQUESTS: '/leave/requests',
    ALL_REQUESTS: '/leave/requests/all',
    APPROVE: (id: string) => `/leave/requests/${id}/approve`,
    REJECT: (id: string) => `/leave/requests/${id}/reject`,
  },
  // Recruitment
  RECRUITMENT: {
    JOBS: '/recruitment/jobs',
    CANDIDATES: '/recruitment/candidates',
    CANDIDATE_STAGE: (id: string) => `/recruitment/candidates/${id}/stage`,
  },
  // Payroll
  PAYROLL: {
    EMPLOYEES: '/payroll/employees',
    RUNS: '/payroll/runs',
    RUN_BY_ID: (id: string) => `/payroll/runs/${id}`,
    COMPLIANCE: '/payroll/compliance',
    COMPLIANCE_STATUS: (id: string) => `/payroll/compliance/${id}/status`,
    ANALYTICS: '/payroll/analytics',
  },
};
