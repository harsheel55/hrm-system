# Blog System API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:5244/api`  
**Authentication**: JWT Bearer Token (required except for GET endpoints marked as `[AllowAnonymous]`)

---

## Table of Contents
1. [Blog Endpoints](#blog-endpoints)
2. [Blog Category Endpoints](#blog-category-endpoints)
3. [Blog Tag Endpoints](#blog-tag-endpoints)
4. [Error Responses](#error-responses)
5. [Data Models](#data-models)

---

## Blog Endpoints

### 1. Get All Blogs
Retrieve all blogs with optional filtering for inactive blogs.

```
GET /api/blog
```

**Authorization**: Required (Bearer Token)

**Query Parameters**:
- `includeInactive` (boolean, optional, default: false) - Include inactive blogs

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "strBlogGUID": "550e8400-e29b-41d4-a716-446655440000",
      "strCategoryGUID": "550e8400-e29b-41d4-a716-446655440001",
      "strCategoryName": "Technology",
      "strBlogSlug": "intro-to-aspnet-core",
      "strBlogTitle": "Introduction to ASP.NET Core",
      "strShortDescription": "Learn the basics of ASP.NET Core",
      "strFullContent": "ASP.NET Core is a modern framework...",
      "strFeaturedImage": "/uploads/blog-featured/image-123.jpg",
      "strMetaTitle": "ASP.NET Core Tutorial",
      "strMetaDescription": "Learn ASP.NET Core development",
      "strMetaKeywords": "aspnet,core,tutorial",
      "dtPublishDate": "2026-01-21T10:00:00Z",
      "bolIsPublished": true,
      "bolIsFeatured": true,
      "bolIsActive": true,
      "strCreatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
      "dtCreatedOn": "2026-01-20T08:00:00Z",
      "strUpdatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
      "dtUpdatedOn": "2026-01-21T09:00:00Z"
    }
  ]
}
```

---

### 2. Get Blog by ID
Retrieve a specific blog by its GUID.

```
GET /api/blog/{id}
```

**Authorization**: Required (Bearer Token)

**Path Parameters**:
- `id` (string, required) - Blog GUID (strBlogGUID)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Blog retrieved successfully",
  "data": {
    "strBlogGUID": "550e8400-e29b-41d4-a716-446655440000",
    "strCategoryGUID": "550e8400-e29b-41d4-a716-446655440001",
    "strCategoryName": "Technology",
    "strBlogSlug": "intro-to-aspnet-core",
    "strBlogTitle": "Introduction to ASP.NET Core",
    "strShortDescription": "Learn the basics of ASP.NET Core",
    "strFullContent": "ASP.NET Core is a modern framework...",
    "strFeaturedImage": "/uploads/blog-featured/image-123.jpg",
    "strMetaTitle": "ASP.NET Core Tutorial",
    "strMetaDescription": "Learn ASP.NET Core development",
    "strMetaKeywords": "aspnet,core,tutorial",
    "dtPublishDate": "2026-01-21T10:00:00Z",
    "bolIsPublished": true,
    "bolIsFeatured": true,
    "bolIsActive": true,
    "strCreatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
    "dtCreatedOn": "2026-01-20T08:00:00Z",
    "strUpdatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
    "dtUpdatedOn": "2026-01-21T09:00:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Blog not found",
  "data": null
}
```

---

### 3. Get Blog by Slug
Retrieve a blog using its URL slug.

```
GET /api/blog/slug/{slug}
```

**Authorization**: Required (Bearer Token)

**Path Parameters**:
- `slug` (string, required) - Blog slug (strBlogSlug)

**Success Response** (200 OK):
Same as Get Blog by ID response.

**Error Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Blog not found",
  "data": null
}
```

---

### 4. Get Published Blogs
Retrieve all published and active blogs (public endpoint).

```
GET /api/blog/published
```

**Authorization**: Not Required (AllowAnonymous)

**Success Response** (200 OK):
Returns array of BlogResponseDto objects filtered by `bolIsPublished = true && bolIsActive = true`, ordered by `dtPublishDate` descending.

---

### 5. Get Featured Blogs
Retrieve all featured blogs (public endpoint).

```
GET /api/blog/featured
```

**Authorization**: Not Required (AllowAnonymous)

**Success Response** (200 OK):
Returns array of BlogResponseDto objects filtered by `bolIsFeatured = true && bolIsPublished = true && bolIsActive = true`, ordered by `dtPublishDate` descending.

---

### 6. Get Blogs by Category
Retrieve all blogs in a specific category.

```
GET /api/blog/category/{categoryGuid}
```

**Authorization**: Required (Bearer Token)

**Path Parameters**:
- `categoryGuid` (string, required) - Category GUID (strCategoryGUID)

**Success Response** (200 OK):
Returns array of active blogs in the specified category.

---

### 7. Create Blog
Create a new blog post with optional featured image upload.

```
POST /api/blog
Content-Type: multipart/form-data
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required (inherited from SuperAdmin check in service)

**Request Body** (multipart/form-data):
```
strCategoryGUID: (optional) "550e8400-e29b-41d4-a716-446655440001"
strBlogSlug: (required) "intro-to-aspnet-core"
strBlogTitle: (required) "Introduction to ASP.NET Core"
strShortDescription: (optional) "Learn the basics of ASP.NET Core"
strFullContent: (optional) "ASP.NET Core is a modern framework..."
strFeaturedImage: (optional) <file>
strMetaTitle: (optional) "ASP.NET Core Tutorial"
strMetaDescription: (optional) "Learn ASP.NET Core development"
strMetaKeywords: (optional) "aspnet,core,tutorial"
dtPublishDate: (optional) "2026-01-21T10:00:00Z"
bolIsPublished: (optional, default: false) true
bolIsFeatured: (optional, default: false) true
bolIsActive: (optional, default: true) true
```

**Success Response** (201 Created):
```json
{
  "statusCode": 201,
  "message": "Blog created successfully",
  "data": {
    "strBlogGUID": "550e8400-e29b-41d4-a716-446655440000",
    "strCategoryGUID": "550e8400-e29b-41d4-a716-446655440001",
    "strBlogSlug": "intro-to-aspnet-core",
    "strBlogTitle": "Introduction to ASP.NET Core",
    "strShortDescription": "Learn the basics of ASP.NET Core",
    "strFullContent": "ASP.NET Core is a modern framework...",
    "strFeaturedImage": "/uploads/blog-featured/image-123.jpg",
    "strMetaTitle": "ASP.NET Core Tutorial",
    "strMetaDescription": "Learn ASP.NET Core development",
    "strMetaKeywords": "aspnet,core,tutorial",
    "dtPublishDate": "2026-01-21T10:00:00Z",
    "bolIsPublished": true,
    "bolIsFeatured": true,
    "bolIsActive": true,
    "strCreatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
    "dtCreatedOn": "2026-01-21T10:30:00Z",
    "strUpdatedByGUID": null,
    "dtUpdatedOn": null
  }
}
```

**Error Responses**:
- 400 Bad Request - Duplicate slug or invalid category
- 401 Unauthorized - User not authenticated
- 400 Bad Request - Invalid model state

---

### 8. Update Blog
Update an existing blog post with optional featured image upload.

```
PUT /api/blog/{id}
Content-Type: multipart/form-data
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Blog GUID (strBlogGUID)

**Request Body** (multipart/form-data):
All fields optional (same as Create Blog but all nullable).

**Success Response** (200 OK):
Returns updated BlogResponseDto.

**Error Responses**:
- 404 Not Found - Blog not found
- 400 Bad Request - Duplicate slug or invalid category
- 401 Unauthorized - User not authenticated

---

### 9. Delete Blog
Delete a blog post.

```
DELETE /api/blog/{id}
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Blog GUID (strBlogGUID)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Blog deleted successfully",
  "data": true
}
```

**Error Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Blog not found",
  "data": false
}
```

---

## Blog Category Endpoints

### 1. Get All Categories
Retrieve all blog categories.

```
GET /api/blogcategory
```

**Authorization**: Not Required (AllowAnonymous)

**Query Parameters**:
- `includeInactive` (boolean, optional, default: false)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "strCategoryGUID": "550e8400-e29b-41d4-a716-446655440001",
      "strCategoryName": "Technology",
      "strCategorySlug": "technology",
      "strCategoryDescription": "Technology related posts",
      "strCategoryImage": "/uploads/blog-categories/tech.jpg",
      "strMetaTitle": "Technology Blog",
      "strMetaDescription": "Technology posts and tutorials",
      "strMetaKeywords": "tech,technology,programming",
      "intDisplayOrder": 1,
      "bolIsActive": true,
      "strCreatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
      "dtCreatedOn": "2026-01-20T08:00:00Z",
      "strUpdatedByGUID": null,
      "dtUpdatedOn": null
    }
  ]
}
```

---

### 2. Get Category by ID
Retrieve a specific category by GUID.

```
GET /api/blogcategory/{id}
```

**Authorization**: Not Required (AllowAnonymous)

**Path Parameters**:
- `id` (string, required) - Category GUID (strCategoryGUID)

**Success Response** (200 OK):
Returns single BlogCategoryResponseDto.

---

### 3. Get Category by Slug
Retrieve a category using its URL slug.

```
GET /api/blogcategory/slug/{slug}
```

**Authorization**: Not Required (AllowAnonymous)

**Path Parameters**:
- `slug` (string, required) - Category slug (strCategorySlug)

**Success Response** (200 OK):
Returns single BlogCategoryResponseDto.

---

### 4. Create Category
Create a new blog category with optional category image upload.

```
POST /api/blogcategory
Content-Type: multipart/form-data
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Request Body** (multipart/form-data):
```
strCategoryName: (required) "Technology"
strCategorySlug: (required) "technology"
strCategoryDescription: (optional) "Technology related posts"
strCategoryImage: (optional) <file>
strMetaTitle: (optional) "Technology Blog"
strMetaDescription: (optional) "Technology posts and tutorials"
strMetaKeywords: (optional) "tech,technology,programming"
intDisplayOrder: (optional, default: 0) 1
bolIsActive: (optional, default: true) true
```

**Success Response** (201 Created):
Returns created BlogCategoryResponseDto.

**Error Responses**:
- 400 Bad Request - Duplicate slug
- 401 Unauthorized - User not authenticated
- 403 Forbidden - Only SuperAdmin can create categories

---

### 5. Update Category
Update an existing blog category.

```
PUT /api/blogcategory/{id}
Content-Type: multipart/form-data
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Category GUID (strCategoryGUID)

**Request Body**: All fields optional (same as Create Category).

**Success Response** (200 OK):
Returns updated BlogCategoryResponseDto.

**Error Responses**:
- 404 Not Found - Category not found
- 400 Bad Request - Duplicate slug
- 403 Forbidden - Only SuperAdmin can update categories

---

### 6. Delete Category
Delete a blog category.

```
DELETE /api/blogcategory/{id}
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Category GUID (strCategoryGUID)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Category deleted successfully",
  "data": true
}
```

**Error Responses**:
- 404 Not Found - Category not found
- 400 Bad Request - Category has associated blogs (cannot delete)
- 403 Forbidden - Only SuperAdmin can delete categories

---

## Blog Tag Endpoints

### 1. Get All Tags
Retrieve all blog tags.

```
GET /api/blogtag
```

**Authorization**: Not Required (AllowAnonymous)

**Query Parameters**:
- `includeInactive` (boolean, optional, default: false)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Tags retrieved successfully",
  "data": [
    {
      "strTagGUID": "550e8400-e29b-41d4-a716-446655440003",
      "strTagName": "C#",
      "strTagSlug": "csharp",
      "bolIsActive": true,
      "strCreatedByGUID": "550e8400-e29b-41d4-a716-446655440002",
      "dtCreatedOn": "2026-01-20T08:00:00Z",
      "strUpdatedByGUID": null,
      "dtUpdatedOn": null
    }
  ]
}
```

---

### 2. Get Tag by ID
Retrieve a specific tag by GUID.

```
GET /api/blogtag/{id}
```

**Authorization**: Not Required (AllowAnonymous)

**Path Parameters**:
- `id` (string, required) - Tag GUID (strTagGUID)

**Success Response** (200 OK):
Returns single BlogTagResponseDto.

---

### 3. Get Tag by Slug
Retrieve a tag using its URL slug.

```
GET /api/blogtag/slug/{slug}
```

**Authorization**: Not Required (AllowAnonymous)

**Path Parameters**:
- `slug` (string, required) - Tag slug (strTagSlug)

**Success Response** (200 OK):
Returns single BlogTagResponseDto.

---

### 4. Create Tag
Create a new blog tag.

```
POST /api/blogtag
Content-Type: application/json
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Request Body**:
```json
{
  "strTagName": "C#",
  "strTagSlug": "csharp",
  "bolIsActive": true
}
```

**Success Response** (201 Created):
Returns created BlogTagResponseDto.

**Error Responses**:
- 400 Bad Request - Duplicate slug
- 401 Unauthorized - User not authenticated

---

### 5. Update Tag
Update an existing blog tag.

```
PUT /api/blogtag/{id}
Content-Type: application/json
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Tag GUID (strTagGUID)

**Request Body** (all fields optional):
```json
{
  "strTagName": "C#",
  "strTagSlug": "csharp",
  "bolIsActive": true
}
```

**Success Response** (200 OK):
Returns updated BlogTagResponseDto.

**Error Responses**:
- 404 Not Found - Tag not found
- 400 Bad Request - Duplicate slug

---

### 6. Delete Tag
Delete a blog tag.

```
DELETE /api/blogtag/{id}
```

**Authorization**: Required (Bearer Token) - SuperAdmin role required

**Path Parameters**:
- `id` (string, required) - Tag GUID (strTagGUID)

**Success Response** (200 OK):
```json
{
  "statusCode": 200,
  "message": "Tag deleted successfully",
  "data": true
}
```

**Error Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Tag not found",
  "data": false
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Invalid request data | Duplicate slug | Invalid category",
  "data": null
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "User not authenticated | User not found",
  "data": null
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Only Super Admin can create/update/delete blog resources",
  "data": null
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Blog/Category/Tag not found",
  "data": null
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred",
  "data": null
}
```

---

## Data Models

### BlogResponseDto
```csharp
{
  "strBlogGUID": "string (UUID)",
  "strCategoryGUID": "string (UUID, nullable)",
  "strCategoryName": "string (nullable)",
  "strBlogSlug": "string (unique, required)",
  "strBlogTitle": "string (required)",
  "strShortDescription": "string (nullable)",
  "strFullContent": "string (nullable)",
  "strFeaturedImage": "string (file path)",
  "strMetaTitle": "string (nullable)",
  "strMetaDescription": "string (nullable)",
  "strMetaKeywords": "string (nullable)",
  "dtPublishDate": "datetime (nullable)",
  "bolIsPublished": "boolean",
  "bolIsFeatured": "boolean",
  "bolIsActive": "boolean",
  "strCreatedByGUID": "string (UUID)",
  "dtCreatedOn": "datetime",
  "strUpdatedByGUID": "string (UUID, nullable)",
  "dtUpdatedOn": "datetime (nullable)"
}
```

### BlogCategoryResponseDto
```csharp
{
  "strCategoryGUID": "string (UUID)",
  "strCategoryName": "string (required)",
  "strCategorySlug": "string (unique, required)",
  "strCategoryDescription": "string (nullable)",
  "strCategoryImage": "string (file path)",
  "strMetaTitle": "string (nullable)",
  "strMetaDescription": "string (nullable)",
  "strMetaKeywords": "string (nullable)",
  "intDisplayOrder": "integer",
  "bolIsActive": "boolean",
  "strCreatedByGUID": "string (UUID)",
  "dtCreatedOn": "datetime",
  "strUpdatedByGUID": "string (UUID, nullable)",
  "dtUpdatedOn": "datetime (nullable)"
}
```

### BlogTagResponseDto
```csharp
{
  "strTagGUID": "string (UUID)",
  "strTagName": "string (required)",
  "strTagSlug": "string (unique, required)",
  "bolIsActive": "boolean",
  "strCreatedByGUID": "string (UUID)",
  "dtCreatedOn": "datetime",
  "strUpdatedByGUID": "string (UUID, nullable)",
  "dtUpdatedOn": "datetime (nullable)"
}
```

---

## File Upload Details

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Upload Constraints
- Maximum file size: 5MB
- Validation: Magic bytes (file signature) verification
- Storage location: `/wwwroot/uploads/`
- Upload subdirectories:
  - Blog featured images: `/wwwroot/uploads/blog-featured/`
  - Category images: `/wwwroot/uploads/blog-categories/`

### Image Upload Examples

**Blog with Featured Image (cURL)**:
```bash
curl -X POST http://localhost:5244/api/blog \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "strBlogSlug=intro-to-aspnet-core" \
  -F "strBlogTitle=Introduction to ASP.NET Core" \
  -F "strCategoryGUID=550e8400-e29b-41d4-a716-446655440001" \
  -F "strFeaturedImage=@path/to/image.jpg" \
  -F "bolIsPublished=true"
```

**Category with Image (cURL)**:
```bash
curl -X POST http://localhost:5244/api/blogcategory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "strCategoryName=Technology" \
  -F "strCategorySlug=technology" \
  -F "strCategoryImage=@path/to/image.png"
```

---

## Authentication

### Required Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Token Claims
The JWT token should include:
- `userId` or `NameIdentifier` claim - User GUID (strUserGUID)
- `role` claim - User role (e.g., "SuperAdmin")

### Example Token Payload
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "role": "SuperAdmin",
  "iat": 1674289200,
  "exp": 1674375600
}
```

---

## Rate Limiting & Throttling
*(To be implemented in future versions)*

---

## Versioning
API version: `1.0.0`  
Last Updated: January 21, 2026

For updates and changes, refer to the main project README.md.
