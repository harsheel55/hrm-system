import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';
import type {
  ApiResponse,
  BlogResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  BlogCategoryResponseDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  BlogTagResponseDto,
  CreateBlogTagDto,
  UpdateBlogTagDto,
} from '../types/api.types';

// Blog Service
export const blogService = {
  async getAllBlogs(includeInactive = false): Promise<ApiResponse<BlogResponseDto[]>> {
    return apiClient.get<ApiResponse<BlogResponseDto[]>>(
      `${ENDPOINTS.BLOGS.BASE}?includeInactive=${includeInactive}`
    );
  },

  async getBlogById(id: string): Promise<ApiResponse<BlogResponseDto>> {
    return apiClient.get<ApiResponse<BlogResponseDto>>(ENDPOINTS.BLOGS.BY_ID(id));
  },

  async getBlogBySlug(slug: string): Promise<ApiResponse<BlogResponseDto>> {
    return apiClient.get<ApiResponse<BlogResponseDto>>(ENDPOINTS.BLOGS.BY_SLUG(slug));
  },

  async getPublishedBlogs(): Promise<ApiResponse<BlogResponseDto[]>> {
    return apiClient.get<ApiResponse<BlogResponseDto[]>>(ENDPOINTS.BLOGS.PUBLISHED);
  },

  async getFeaturedBlogs(): Promise<ApiResponse<BlogResponseDto[]>> {
    return apiClient.get<ApiResponse<BlogResponseDto[]>>(ENDPOINTS.BLOGS.FEATURED);
  },

  async createBlog(data: CreateBlogDto): Promise<ApiResponse<BlogResponseDto>> {
    if (data.strFeaturedImage) {
      const formData = new FormData();
      if (data.strCategoryGUID) formData.append('strCategoryGUID', data.strCategoryGUID);
      formData.append('strBlogSlug', data.strBlogSlug);
      formData.append('strBlogTitle', data.strBlogTitle);
      if (data.strShortDescription) formData.append('strShortDescription', data.strShortDescription);
      if (data.strFullContent) formData.append('strFullContent', data.strFullContent);
      if (data.strMetaTitle) formData.append('strMetaTitle', data.strMetaTitle);
      if (data.strMetaDescription) formData.append('strMetaDescription', data.strMetaDescription);
      if (data.strMetaKeywords) formData.append('strMetaKeywords', data.strMetaKeywords);
      if (data.dtPublishDate) formData.append('dtPublishDate', data.dtPublishDate);
      formData.append('bolIsPublished', String(data.bolIsPublished));
      formData.append('bolIsFeatured', String(data.bolIsFeatured));
      formData.append('bolIsActive', String(data.bolIsActive));
      formData.append('strFeaturedImage', data.strFeaturedImage);
      
      return apiClient.postFormData<ApiResponse<BlogResponseDto>>(
        ENDPOINTS.BLOGS.BASE,
        formData
      );
    }
    
    return apiClient.post<ApiResponse<BlogResponseDto>>(ENDPOINTS.BLOGS.BASE, data);
  },

  async updateBlog(id: string, data: UpdateBlogDto): Promise<ApiResponse<BlogResponseDto>> {
    if (data.strFeaturedImage) {
      const formData = new FormData();
      if (data.strCategoryGUID) formData.append('strCategoryGUID', data.strCategoryGUID);
      formData.append('strBlogSlug', data.strBlogSlug);
      formData.append('strBlogTitle', data.strBlogTitle);
      if (data.strShortDescription) formData.append('strShortDescription', data.strShortDescription);
      if (data.strFullContent) formData.append('strFullContent', data.strFullContent);
      if (data.strMetaTitle) formData.append('strMetaTitle', data.strMetaTitle);
      if (data.strMetaDescription) formData.append('strMetaDescription', data.strMetaDescription);
      if (data.strMetaKeywords) formData.append('strMetaKeywords', data.strMetaKeywords);
      if (data.dtPublishDate) formData.append('dtPublishDate', data.dtPublishDate);
      formData.append('bolIsPublished', String(data.bolIsPublished));
      formData.append('bolIsFeatured', String(data.bolIsFeatured));
      formData.append('bolIsActive', String(data.bolIsActive));
      formData.append('strFeaturedImage', data.strFeaturedImage);
      
      return apiClient.putFormData<ApiResponse<BlogResponseDto>>(
        ENDPOINTS.BLOGS.BY_ID(id),
        formData
      );
    }
    
    return apiClient.put<ApiResponse<BlogResponseDto>>(ENDPOINTS.BLOGS.BY_ID(id), data);
  },

  async deleteBlog(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.BLOGS.BY_ID(id));
  },
};

// Blog Category Service
export const blogCategoryService = {
  async getAllCategories(includeInactive = false): Promise<ApiResponse<BlogCategoryResponseDto[]>> {
    return apiClient.get<ApiResponse<BlogCategoryResponseDto[]>>(
      `${ENDPOINTS.BLOG_CATEGORIES.BASE}?includeInactive=${includeInactive}`
    );
  },

  async getCategoryById(id: string): Promise<ApiResponse<BlogCategoryResponseDto>> {
    return apiClient.get<ApiResponse<BlogCategoryResponseDto>>(ENDPOINTS.BLOG_CATEGORIES.BY_ID(id));
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<BlogCategoryResponseDto>> {
    return apiClient.get<ApiResponse<BlogCategoryResponseDto>>(ENDPOINTS.BLOG_CATEGORIES.BY_SLUG(slug));
  },

  async createCategory(data: CreateBlogCategoryDto): Promise<ApiResponse<BlogCategoryResponseDto>> {
    return apiClient.post<ApiResponse<BlogCategoryResponseDto>>(ENDPOINTS.BLOG_CATEGORIES.BASE, data);
  },

  async updateCategory(id: string, data: UpdateBlogCategoryDto): Promise<ApiResponse<BlogCategoryResponseDto>> {
    return apiClient.put<ApiResponse<BlogCategoryResponseDto>>(ENDPOINTS.BLOG_CATEGORIES.BY_ID(id), data);
  },

  async deleteCategory(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.BLOG_CATEGORIES.BY_ID(id));
  },
};

// Blog Tag Service
export const blogTagService = {
  async getAllTags(includeInactive = false): Promise<ApiResponse<BlogTagResponseDto[]>> {
    return apiClient.get<ApiResponse<BlogTagResponseDto[]>>(
      `${ENDPOINTS.BLOG_TAGS.BASE}?includeInactive=${includeInactive}`
    );
  },

  async getTagById(id: string): Promise<ApiResponse<BlogTagResponseDto>> {
    return apiClient.get<ApiResponse<BlogTagResponseDto>>(ENDPOINTS.BLOG_TAGS.BY_ID(id));
  },

  async getTagBySlug(slug: string): Promise<ApiResponse<BlogTagResponseDto>> {
    return apiClient.get<ApiResponse<BlogTagResponseDto>>(ENDPOINTS.BLOG_TAGS.BY_SLUG(slug));
  },

  async createTag(data: CreateBlogTagDto): Promise<ApiResponse<BlogTagResponseDto>> {
    return apiClient.post<ApiResponse<BlogTagResponseDto>>(ENDPOINTS.BLOG_TAGS.BASE, data);
  },

  async updateTag(id: string, data: UpdateBlogTagDto): Promise<ApiResponse<BlogTagResponseDto>> {
    return apiClient.put<ApiResponse<BlogTagResponseDto>>(ENDPOINTS.BLOG_TAGS.BY_ID(id), data);
  },

  async deleteTag(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(ENDPOINTS.BLOG_TAGS.BY_ID(id));
  },
};
