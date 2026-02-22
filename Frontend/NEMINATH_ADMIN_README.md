# Neminath Super Admin Frontend

A comprehensive super admin frontend built with React, TypeScript, Vite, and Shadcn UI to manage the Neminath backend system.

## 🎯 Features

### Authentication
- Secure login system with JWT tokens
- Token refresh mechanism
- Protected routes
- Session management

### User Management
- Create, read, update, and delete users
- User profile image upload
- Role assignment
- User activation/deactivation
- Search and filter capabilities

### Role Management
- Create and manage user roles
- Role descriptions
- Active/inactive status
- System-protected roles (cannot be deleted)

### User Rights Management
- Role-based menu permissions
- Granular permissions (View, Create, Edit, Delete)
- Visual permission matrix
- Bulk permission updates

### Menu Management
- Create and manage navigation menus
- Menu hierarchy support
- Menu ordering with sequence numbers
- Icon and path configuration

### Blog Management
- Blog post creation and management
- Featured image support
- Published/draft status
- Featured posts
- View count tracking
- SEO metadata

### Blog Categories
- Organize blogs by categories
- Category slugs for SEO
- Category descriptions

### Blog Tags
- Tag system for blog posts
- Tag slugs for SEO

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   └── AdminLayout.tsx          # Main admin layout with navigation
│   │   ├── ui/                          # Shadcn UI components
│   │   └── ProtectedRoute.tsx           # Route protection wrapper
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx              # Authentication context & state
│   │
│   ├── pages/
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx       # Super admin login
│   │       ├── AdminDashboard.tsx       # Dashboard home
│   │       ├── UserManagementPage.tsx   # User CRUD operations
│   │       ├── UserFormDialog.tsx       # User creation/edit form
│   │       ├── RoleManagementPage.tsx   # Role management
│   │       ├── UserRightsPage.tsx       # Permission management
│   │       ├── MenuManagementPage.tsx   # Menu configuration
│   │       ├── BlogManagementPage.tsx   # Blog posts management
│   │       ├── BlogCategoryPage.tsx     # Category management
│   │       └── BlogTagPage.tsx          # Tag management
│   │
│   ├── services/
│   │   ├── api.client.ts                # HTTP client wrapper
│   │   ├── api.config.ts                # API endpoints & configuration
│   │   ├── auth.service.ts              # Authentication API calls
│   │   ├── user.service.ts              # User API calls
│   │   ├── role.service.ts              # Role API calls
│   │   ├── rights.service.ts            # User rights API calls
│   │   ├── menu.service.ts              # Menu API calls
│   │   └── blog.service.ts              # Blog, category, tag API calls
│   │
│   ├── types/
│   │   └── api.types.ts                 # TypeScript type definitions
│   │
│   ├── App.tsx                          # Main app with routing
│   └── main.tsx                         # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK (for backend)
- SQL Server (for database)

### Backend Setup

1. **Navigate to the Neminath backend folder:**
   ```bash
   cd "Neminath\Neminath\Backend"
   ```

2. **Update database connection in appsettings.json:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=NeminathDb;Trusted_Connection=True;MultipleActiveResultSets=True;Encrypt=False;TrustServerCertificate=True"
     }
   }
   ```

3. **Run migrations:**
   ```bash
   dotnet ef database update
   ```

4. **Start the backend:**
   ```bash
   dotnet run
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API configuration (if needed):**
   Edit `src/services/api.config.ts`:
   ```typescript
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

**Super Admin:**
- Email: `superadmin@nemsys.local`
- Password: `ChangeMe123!`

⚠️ **Important:** Change these credentials immediately after first login!

## 📚 API Integration

### Authentication Flow

1. **Login:**
   - POST `/api/auth/login`
   - Returns JWT token and user info
   - Token stored in localStorage

2. **Protected Requests:**
   - Include token in Authorization header: `Bearer {token}`
   - Token automatically added by `api.client.ts`

3. **Logout:**
   - Clears tokens from localStorage
   - Redirects to login page

### API Endpoints Reference

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/change-password` - Change password (authenticated)

#### Users
- `GET /api/user` - Get all users
- `GET /api/user/{id}` - Get user by ID
- `POST /api/user` - Create user
- `PUT /api/user/{id}` - Update user
- `DELETE /api/user/{id}` - Delete user

#### Roles
- `GET /api/userrole` - Get all roles
- `GET /api/userrole/{id}` - Get role by ID
- `POST /api/userrole` - Create role
- `PUT /api/userrole/{id}` - Update role
- `DELETE /api/userrole/{id}` - Delete role

#### User Rights
- `GET /api/userrights/role/{roleId}` - Get rights by role
- `POST /api/userrights` - Create right
- `PUT /api/userrights/{id}` - Update right
- `DELETE /api/userrights/{id}` - Delete right

#### Menus
- `GET /api/menu` - Get all menus
- `POST /api/menu` - Create menu
- `PUT /api/menu/{id}` - Update menu
- `DELETE /api/menu/{id}` - Delete menu

#### Blogs
- `GET /api/blog` - Get all blogs
- `POST /api/blog` - Create blog
- `PUT /api/blog/{id}` - Update blog
- `DELETE /api/blog/{id}` - Delete blog

#### Blog Categories
- `GET /api/blogcategory` - Get all categories
- `POST /api/blogcategory` - Create category
- `PUT /api/blogcategory/{id}` - Update category
- `DELETE /api/blogcategory/{id}` - Delete category

#### Blog Tags
- `GET /api/blogtag` - Get all tags
- `POST /api/blogtag` - Create tag
- `PUT /api/blogtag/{id}` - Update tag
- `DELETE /api/blogtag/{id}` - Delete tag

## 🎨 UI Components

This project uses [Shadcn UI](https://ui.shadcn.com/) components built on top of:
- Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons

### Key Components Used
- **Button** - Action buttons
- **Card** - Content containers
- **Dialog** - Modal dialogs for forms
- **Table** - Data tables
- **Input** - Form inputs
- **Select** - Dropdown selections
- **Switch** - Toggle switches
- **Badge** - Status indicators
- **Alert** - Error/info messages
- **Sheet** - Mobile sidebar

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript with `verbatimModuleSyntax` enabled. Always use:
```typescript
import type { TypeName } from 'module'; // For type-only imports
```

### Environment Variables
Create a `.env` file in the Frontend folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📝 Development Guidelines

### Adding New Pages

1. **Create the page component:**
   ```typescript
   // src/pages/admin/NewPage.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Add route in App.tsx:**
   ```typescript
   <Route path="new-page" element={<NewPage />} />
   ```

3. **Add menu item in AdminLayout.tsx:**
   ```typescript
   {
     title: 'New Page',
     icon: IconComponent,
     href: '/admin/new-page',
   }
   ```

### Adding New API Service

1. **Define types in api.types.ts**
2. **Add endpoints in api.config.ts**
3. **Create service in services/ folder**
4. **Import and use in components**

## 🐛 Troubleshooting

### CORS Errors
Ensure backend has CORS configured:
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});
```

### Authentication Issues
- Check if backend is running
- Verify API_BASE_URL is correct
- Check browser console for errors
- Verify token in localStorage

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build -- --force
```

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder.

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)
3. Configure environment variables on the hosting platform

### Backend Deployment
1. Publish the backend: `dotnet publish -c Release`
2. Deploy to IIS, Azure, or your preferred hosting
3. Update connection strings and CORS settings

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the HRM Service System.

---

**Built with ❤️ using React, TypeScript, Vite, and Shadcn UI**
