# Blog System - Complete Implementation Guide

## Overview

The Neminath Blog System is a comprehensive ASP.NET Core 10.0 REST API for managing blog posts, categories, and tags with JWT authentication, file uploads, and role-based access control.

**Version**: 1.0.0  
**Framework**: ASP.NET Core 10.0  
**Database**: SQL Server (Entity Framework Core 10.0.1)  
**Authentication**: JWT Bearer Token  
**Last Updated**: January 21, 2026

---

## Features

### ✅ Core Features
- **Blog Management**: Create, read, update, delete blog posts
- **Categories**: Organize blogs with categories
- **Tags**: Label blogs with tags for better organization
- **File Uploads**: Upload featured images for blogs and category images
- **Slug-based URLs**: User-friendly URL slugs for all content
- **Publishing Control**: Publish/unpublish blogs, mark as featured
- **SEO Support**: Meta title, description, and keywords for each blog
- **Activity Tracking**: Created by, updated by, and timestamp tracking

### 🔒 Security Features
- **JWT Authentication**: Secure Bearer token-based authentication
- **Role-Based Access Control**: SuperAdmin-only operations for sensitive endpoints
- **File Validation**: Magic byte validation for image uploads
- **Size Limiting**: 5MB maximum file size for uploads
- **Supported Formats**: JPEG, PNG, GIF, WebP images

### 📊 Data Management
- **Soft Delete Support**: Toggle `bolIsActive` status instead of hard delete
- **Status Tracking**: Separate `bolIsPublished` and `bolIsActive` flags
- **Display Ordering**: Support for category display order
- **Timestamp Auditing**: Track creation and modification times

---

## Database Schema

### Tables

#### `mstBlog`
Main blog posts table with content and metadata.

```sql
mstBlog
├── strBlogGUID (PK) - Unique blog identifier
├── strCategoryGUID (FK) - Reference to blog category
├── strBlogSlug (UNIQUE) - URL-friendly slug
├── strBlogTitle - Blog title
├── strShortDescription - Brief description
├── strFullContent - Full blog content
├── strFeaturedImage - Path to featured image
├── strMetaTitle - SEO meta title
├── strMetaDescription - SEO meta description
├── strMetaKeywords - SEO keywords (comma-separated)
├── dtPublishDate - Publication date/time
├── bolIsPublished - Published flag
├── bolIsFeatured - Featured blog flag
├── bolIsActive - Active/inactive status
├── strCreatedByGUID (FK) - User who created
├── dtCreatedOn - Creation timestamp
├── strUpdatedByGUID (FK) - Last user to update
└── dtUpdatedOn - Last modification timestamp
```

#### `mstBlogCategory`
Blog categories/taxonomy.

```sql
mstBlogCategory
├── strCategoryGUID (PK) - Unique category identifier
├── strCategoryName - Category name
├── strCategorySlug (UNIQUE) - URL-friendly slug
├── strCategoryDescription - Category description
├── strCategoryImage - Path to category image
├── strMetaTitle - SEO meta title
├── strMetaDescription - SEO meta description
├── strMetaKeywords - SEO keywords
├── intDisplayOrder - Display order (sort)
├── bolIsActive - Active/inactive status
├── strCreatedByGUID (FK) - Creator user
├── dtCreatedOn - Creation timestamp
├── strUpdatedByGUID (FK) - Last updater
└── dtUpdatedOn - Last modification timestamp
```

#### `mstBlogTag`
Blog tags for categorization.

```sql
mstBlogTag
├── strTagGUID (PK) - Unique tag identifier
├── strTagName - Tag name
├── strTagSlug (UNIQUE) - URL-friendly slug
├── bolIsActive - Active/inactive status
├── strCreatedByGUID (FK) - Creator user
├── dtCreatedOn - Creation timestamp
├── strUpdatedByGUID (FK) - Last updater
└── dtUpdatedOn - Last modification timestamp
```

---

## Naming Convention

All C# properties follow the database column naming convention:

| Data Type | Prefix | Example |
|-----------|--------|---------|
| String | `str` | `strBlogGUID`, `strBlogTitle` |
| Boolean | `bol` | `bolIsPublished`, `bolIsActive` |
| DateTime | `dt` | `dtCreatedOn`, `dtPublishDate` |
| Integer | `int` | `intDisplayOrder` |
| Decimal | `dec` | *(future use)* |

**Important**: This convention is applied throughout:
- Model properties
- DTO properties
- Service methods
- Controller bindings
- Database queries and filters

---

## Project Structure

```
Backend/
├── Models/
│   ├── Blog.cs
│   ├── BlogCategory.cs
│   └── BlogTag.cs
│
├── DTOs/
│   └── BlogDtos.cs
│       ├── CreateBlogDto
│       ├── UpdateBlogDto
│       ├── BlogResponseDto
│       ├── CreateBlogCategoryDto
│       ├── UpdateBlogCategoryDto
│       ├── BlogCategoryResponseDto
│       ├── CreateBlogTagDto
│       ├── UpdateBlogTagDto
│       └── BlogTagResponseDto
│
├── Services/
│   ├── BlogService.cs
│   ├── BlogCategoryService.cs
│   ├── BlogTagService.cs
│   └── FileUploadService.cs
│
├── Controllers/
│   ├── BlogController.cs
│   ├── BlogCategoryController.cs
│   └── BlogTagController.cs
│
├── Data/
│   └── AppDbContext.cs
│
├── Migrations/
│   └── 20260121104002_AddBlogTables.cs
│
└── Tests/
    └── IntegrationTests/
        └── BlogSystemTests.cs
```

---

## API Endpoints

### Blog Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blog` | Required | Get all blogs |
| GET | `/api/blog/{id}` | Required | Get blog by GUID |
| GET | `/api/blog/slug/{slug}` | Required | Get blog by slug |
| GET | `/api/blog/published` | No | Get published blogs |
| GET | `/api/blog/featured` | No | Get featured blogs |
| GET | `/api/blog/category/{categoryGuid}` | Required | Get blogs by category |
| POST | `/api/blog` | Required* | Create blog |
| PUT | `/api/blog/{id}` | Required* | Update blog |
| DELETE | `/api/blog/{id}` | Required* | Delete blog |

*Requires SuperAdmin role

### Category Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogcategory` | No | Get all categories |
| GET | `/api/blogcategory/{id}` | No | Get category by GUID |
| GET | `/api/blogcategory/slug/{slug}` | No | Get category by slug |
| POST | `/api/blogcategory` | Required* | Create category |
| PUT | `/api/blogcategory/{id}` | Required* | Update category |
| DELETE | `/api/blogcategory/{id}` | Required* | Delete category |

*Requires SuperAdmin role

### Tag Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogtag` | No | Get all tags |
| GET | `/api/blogtag/{id}` | No | Get tag by GUID |
| GET | `/api/blogtag/slug/{slug}` | No | Get tag by slug |
| POST | `/api/blogtag` | Required* | Create tag |
| PUT | `/api/blogtag/{id}` | Required* | Update tag |
| DELETE | `/api/blogtag/{id}` | Required* | Delete tag |

*Requires SuperAdmin role

---

## Setup Instructions

### Prerequisites
- .NET 10.0 SDK or later
- SQL Server 2019 or later
- Visual Studio 2022 or VS Code

### Database Setup

1. **Ensure database exists**:
   ```bash
   # Update connection string in appsettings.json
   "DefaultConnection": "Server=DESKTOP-0E3L0Q5;Database=NeminathDb;Trusted_Connection=true;"
   ```

2. **Apply migrations**:
   ```bash
   cd Backend
   dotnet ef database update
   ```

### Running the Application

```bash
cd Backend
dotnet run
```

Application will start at: `http://localhost:5244`

### API Documentation

- **Detailed API Docs**: See [BLOG_API_DOCUMENTATION.md](./BLOG_API_DOCUMENTATION.md)
- **Postman Collection**: Import [Neminath_Blog_API.postman_collection.json](./Neminath_Blog_API.postman_collection.json)

---

## Usage Examples

### 1. Create a Blog Category

```bash
curl -X POST http://localhost:5244/api/blogcategory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "strCategoryName": "Technology",
    "strCategorySlug": "technology",
    "strCategoryDescription": "Technology and programming posts",
    "intDisplayOrder": 1,
    "bolIsActive": true
  }'
```

### 2. Create a Blog Post with Image

```bash
curl -X POST http://localhost:5244/api/blog \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "strBlogSlug=my-first-blog" \
  -F "strBlogTitle=My First Blog Post" \
  -F "strCategoryGUID=CATEGORY_GUID_HERE" \
  -F "strShortDescription=This is my first blog" \
  -F "strFullContent=Full blog content here..." \
  -F "strFeaturedImage=@path/to/image.jpg" \
  -F "bolIsPublished=true" \
  -F "bolIsFeatured=true"
```

### 3. Get Published Blogs (Public)

```bash
curl -X GET http://localhost:5244/api/blog/published
```

### 4. Update a Blog

```bash
curl -X PUT http://localhost:5244/api/blog/BLOG_GUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "strBlogTitle": "Updated Blog Title",
    "bolIsFeatured": false
  }'
```

### 5. Delete a Blog

```bash
curl -X DELETE http://localhost:5244/api/blog/BLOG_GUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## File Upload

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Constraints
- **Max Size**: 5MB
- **Validation**: Magic byte verification
- **Storage**: `/wwwroot/uploads/`

### Upload Directories
- Blog featured images: `/wwwroot/uploads/blog-featured/`
- Category images: `/wwwroot/uploads/blog-categories/`

### Example Upload Response
```json
{
  "statusCode": 201,
  "message": "Blog created successfully",
  "data": {
    "strBlogGUID": "550e8400-e29b-41d4-a716-446655440000",
    "strFeaturedImage": "/uploads/blog-featured/image-abc123.jpg",
    ...
  }
}
```

---

## Authentication

### Obtaining JWT Token

1. **Login with SuperAdmin credentials**:
   ```bash
   curl -X POST http://localhost:5244/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@test.com",
       "password": "SuperAdmin@123"
     }'
   ```

2. **Response includes token**:
   ```json
   {
     "statusCode": 200,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "refreshToken": "..."
     }
   }
   ```

3. **Use token in requests**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5244/api/blog
   ```

### Token Details
- **Type**: JWT Bearer Token
- **Signature Algorithm**: HS256
- **Claims Required**: `userId`, `role`
- **Expiration**: Configured in appsettings.json

---

## Testing

### Running Integration Tests

```bash
cd Backend
dotnet test Tests/IntegrationTests/BlogSystemTests.cs
```

### Using Postman

1. Import [Neminath_Blog_API.postman_collection.json](./Neminath_Blog_API.postman_collection.json)
2. Set environment variables:
   - `jwt_token`: Your JWT Bearer token
   - `blog_id`: Blog GUID for testing
   - `category_id`: Category GUID for testing
   - `tag_id`: Tag GUID for testing
3. Run requests in sequence

---

## Error Handling

### Common Errors

**400 Bad Request** - Invalid data or duplicate slug
```json
{
  "statusCode": 400,
  "message": "A blog with this slug already exists",
  "data": null
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "statusCode": 401,
  "message": "User not authenticated",
  "data": null
}
```

**403 Forbidden** - Insufficient permissions
```json
{
  "statusCode": 403,
  "message": "Only Super Admin can create blog posts",
  "data": null
}
```

**404 Not Found** - Resource doesn't exist
```json
{
  "statusCode": 404,
  "message": "Blog not found",
  "data": null
}
```

**500 Internal Server Error** - Server-side exception
```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred",
  "data": null
}
```

---

## Best Practices

### 1. Slug Management
- Use lowercase, hyphen-separated slugs
- Ensure slugs are unique across all content types
- Example: `intro-to-aspnet-core`

### 2. Image Optimization
- Upload optimized images (max 5MB)
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Consider WebP for modern browsers

### 3. Content Organization
- Create categories before adding blogs
- Use consistent category and tag naming
- Set display order for categories

### 4. Publishing Workflow
- Create blog as draft (`bolIsPublished=false`)
- Preview content before publishing
- Use `bolIsActive=true` for published content only

### 5. SEO Optimization
- Always provide `strMetaTitle` and `strMetaDescription`
- Use relevant `strMetaKeywords`
- Ensure slug is descriptive
- Add featured image for visual appeal

### 6. Error Recovery
- Implement client-side retry logic for transient failures
- Log all API errors for debugging
- Validate input data before sending requests

---

## Troubleshooting

### Connection Issues
```
Error: A network-related or instance-specific error occurred while establishing a connection
```
**Solution**: Verify SQL Server is running and connection string is correct

### File Upload Failures
```
Error: Invalid file format or File size exceeds 5MB
```
**Solution**: Ensure file is in supported format (JPEG, PNG, GIF, WebP) and under 5MB

### Authentication Failures
```
Error: User not authenticated or Invalid token
```
**Solution**: 
1. Verify JWT token is valid
2. Check token expiration time
3. Ensure Authorization header format: `Bearer <token>`

### Duplicate Slug Error
```
Error: A blog with this slug already exists
```
**Solution**: Use unique slug or include timestamp/random suffix in slug

---

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-0E3L0Q5;Database=NeminathDb;Trusted_Connection=true;"
  },
  "Jwt": {
    "Key": "DEV_SUPER_SECRET_KEY_FOR_JWT_SIGNING_MIN_32_CHARS",
    "Issuer": "Neminath.AuthService",
    "Audience": "Neminath.Clients",
    "ExpirationMinutes": 60
  },
  "FileUpload": {
    "MaxFileSizeBytes": 5242880,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "UploadDirectory": "wwwroot/uploads"
  }
}
```

---

## Performance Considerations

1. **Database Indexing**: Create indexes on frequently queried columns
   - `strBlogSlug` - For slug lookups
   - `strCategoryGUID` - For category filtering
   - `dtPublishDate` - For date-based sorting
   - `bolIsPublished` - For filtering published content

2. **Caching**: Consider caching for:
   - Published blogs list (cache for 1 hour)
   - Category list (cache for 1 day)
   - Tag list (cache for 1 day)

3. **Pagination**: Implement pagination for large result sets

4. **Lazy Loading**: Use `Include()` for related data to avoid N+1 queries

---

## Future Enhancements

- [ ] Blog search functionality
- [ ] Full-text search support
- [ ] Comment system
- [ ] Blog versioning/revisions
- [ ] Scheduled publishing
- [ ] Image optimization pipeline
- [ ] CDN integration for images
- [ ] Rate limiting
- [ ] API key authentication option
- [ ] Multi-language support
- [ ] Blog statistics/analytics
- [ ] Email notifications

---

## Contributing

When making changes to the blog system:

1. Follow naming conventions (strXXX, bolXXX, dtXXX, intXXX)
2. Update models and DTOs simultaneously
3. Update service methods with new properties
4. Update controllers with new DTO properties
5. Add corresponding unit tests
6. Update API documentation
7. Run integration tests before committing

---

## Support & Documentation

- **API Documentation**: [BLOG_API_DOCUMENTATION.md](./BLOG_API_DOCUMENTATION.md)
- **Naming Convention**: [BLOG_NAMING_CONVENTION_REFACTORING_COMPLETE.md](../BLOG_NAMING_CONVENTION_REFACTORING_COMPLETE.md)
- **Postman Collection**: [Neminath_Blog_API.postman_collection.json](./Neminath_Blog_API.postman_collection.json)
- **Integration Tests**: [BlogSystemTests.cs](./Tests/IntegrationTests/BlogSystemTests.cs)

---

## License

This project is part of the Neminath system. All rights reserved.

---

## Version History

### v1.0.0 (January 21, 2026)
- ✅ Initial blog system implementation
- ✅ Blog, Category, and Tag management
- ✅ JWT authentication and authorization
- ✅ File upload support with validation
- ✅ Comprehensive API documentation
- ✅ Integration tests
- ✅ Postman collection for testing

---

**Last Updated**: January 21, 2026  
**Status**: Production Ready ✅
