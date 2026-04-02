// API Response Types
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Auth Types
export interface LoginDto {
  strEmail: string;
  strPassword: string;
}

export interface LoginResponseDto {
  strToken: string;
  strRefreshToken: string;
  strUserGUID: string;
  strUserName: string;
  strEmail: string;
  strRoleName: string;
}

export interface ChangePasswordDto {
  strCurrentPassword: string;
  strNewPassword: string;
}

export interface ForgotPasswordDto {
  strEmail: string;
}

export interface ResetPasswordDto {
  strEmail: string;
  strOtp: string;
  strNewPassword: string;
}

// User Types
export interface UserResponseDto {
  strUserGUID: string;
  strUserName: string;
  strEmail: string;
  strPhoneNo?: string;
  dDob?: string;
  strRoleGUID?: string;
  strRoleName?: string;
  strProfileImageUrl?: string;
  strPreferredLanguage: string;
  bolIsActive: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateUserDto {
  strUserName: string;
  strEmail: string;
  strPassword: string;
  strPhoneNo?: string;
  dDob?: string;
  strRoleGUID?: string;
  strPreferredLanguage?: string;
  strProfileImage?: File;
}

export interface UpdateUserDto {
  strUserName: string;
  strEmail: string;
  strPhoneNo?: string;
  dDob?: string;
  strRoleGUID?: string;
  strPreferredLanguage?: string;
  bolIsActive: boolean;
  strProfileImage?: File;
}

// Role Types
export interface UserRoleResponseDto {
  strUserRoleGUID: string;
  strRoleName: string;
  strDescription?: string;
  bolIsActive: boolean;
  bolSystemCreated: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateUserRoleDto {
  strRoleName: string;
  strDescription?: string;
  bolIsActive: boolean;
}

export interface UpdateUserRoleDto {
  strRoleName: string;
  strDescription?: string;
  bolIsActive: boolean;
}

// Menu Types
export interface MenuResponseDto {
  strMenuGUID: string;
  strMenuName: string;
  strMenuKey: string;
  strPath?: string;
  strIcon?: string;
  strParentMenuGUID?: string;
  dblSeqNo: number;
  bolIsActive: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateMenuDto {
  strMenuName: string;
  strMenuKey: string;
  strPath?: string;
  strIcon?: string;
  strParentMenuGUID?: string;
  dblSeqNo: number;
  bolIsActive: boolean;
}

export interface UpdateMenuDto {
  strMenuName: string;
  strMenuKey: string;
  strPath?: string;
  strIcon?: string;
  strParentMenuGUID?: string;
  dblSeqNo: number;
  bolIsActive: boolean;
}

// User Rights Types
export interface UserRightResponseDto {
  strUserRightGUID: string;
  strUserRoleGUID: string;
  strRoleName?: string;
  strMenuGUID: string;
  strMenuName?: string;
  bolCanView: boolean;
  bolCanSave: boolean;
  bolCanEdit: boolean;
  bolCanDelete: boolean;
  bolCanPrint?: boolean;
  bolCanExport?: boolean;
  bolCanImport?: boolean;
  bolCanApprove?: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateUserRightDto {
  strUserRoleGUID: string;
  strMenuGUID: string;
  bolCanView: boolean;
  bolCanSave: boolean;
  bolCanEdit: boolean;
  bolCanDelete: boolean;
  bolCanPrint?: boolean;
  bolCanExport?: boolean;
  bolCanImport?: boolean;
  bolCanApprove?: boolean;
}

export interface UpdateUserRightDto {
  bolCanView: boolean;
  bolCanSave: boolean;
  bolCanEdit: boolean;
  bolCanDelete: boolean;
  bolCanPrint?: boolean;
  bolCanExport?: boolean;
  bolCanImport?: boolean;
  bolCanApprove?: boolean;
}

// Blog Types
export interface BlogResponseDto {
  strBlogGUID: string;
  strCategoryGUID?: string;
  strCategoryName?: string;
  strBlogSlug: string;
  strBlogTitle: string;
  strShortDescription?: string;
  strFullContent?: string;
  strFeaturedImageUrl?: string;
  strMetaTitle?: string;
  strMetaDescription?: string;
  strMetaKeywords?: string;
  dtPublishDate?: string;
  bolIsPublished: boolean;
  bolIsFeatured: boolean;
  bolIsActive: boolean;
  intViewCount: number;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateBlogDto {
  strCategoryGUID?: string;
  strBlogSlug: string;
  strBlogTitle: string;
  strShortDescription?: string;
  strFullContent?: string;
  strFeaturedImage?: File;
  strMetaTitle?: string;
  strMetaDescription?: string;
  strMetaKeywords?: string;
  dtPublishDate?: string;
  bolIsPublished: boolean;
  bolIsFeatured: boolean;
  bolIsActive: boolean;
}

export interface UpdateBlogDto {
  strCategoryGUID?: string;
  strBlogSlug: string;
  strBlogTitle: string;
  strShortDescription?: string;
  strFullContent?: string;
  strFeaturedImage?: File;
  strMetaTitle?: string;
  strMetaDescription?: string;
  strMetaKeywords?: string;
  dtPublishDate?: string;
  bolIsPublished: boolean;
  bolIsFeatured: boolean;
  bolIsActive: boolean;
}

// Blog Category Types
export interface BlogCategoryResponseDto {
  strCategoryGUID: string;
  strCategoryName: string;
  strCategorySlug: string;
  strDescription?: string;
  bolIsActive: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateBlogCategoryDto {
  strCategoryName: string;
  strCategorySlug: string;
  strDescription?: string;
  bolIsActive: boolean;
}

export interface UpdateBlogCategoryDto {
  strCategoryName: string;
  strCategorySlug: string;
  strDescription?: string;
  bolIsActive: boolean;
}

// Blog Tag Types
export interface BlogTagResponseDto {
  strTagGUID: string;
  strTagName: string;
  strTagSlug: string;
  bolIsActive: boolean;
  dtCreatedDate: string;
  dtModifiedDate: string;
}

export interface CreateBlogTagDto {
  strTagName: string;
  strTagSlug: string;
  bolIsActive: boolean;
}

export interface UpdateBlogTagDto {
  strTagName: string;
  strTagSlug: string;
  bolIsActive: boolean;
}
