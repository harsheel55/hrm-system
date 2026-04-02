using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Login> Logins => Set<Login>();
    public DbSet<Register> Registers => Set<Register>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<UserRight> UserRights => Set<UserRight>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<BlogTag> BlogTags => Set<BlogTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Login>(entity =>
        {
            entity.ToTable("Login");
            entity.HasKey(e => e.Email);
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Password).HasColumnName("pass");
        });

        modelBuilder.Entity<Register>(entity =>
        {
            entity.ToTable("Registers");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("Id").ValueGeneratedOnAdd();
            entity.Property(e => e.FullName).HasColumnName("FullName").HasMaxLength(256).IsRequired();
            entity.Property(e => e.Email).HasColumnName("Email").HasMaxLength(256).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Password).HasColumnName("Password").HasMaxLength(256).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.strUserGUID);
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasData(
                new UserRole
                {
                    strUserRoleGUID = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    strRoleName = "Super Admin",
                    strDesc = "System Administrator with full access",
                    bolIsActive = true,
                    bolSystemCreated = true,
                    dtCreatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    dtUpdatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserRole
                {
                    strUserRoleGUID = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    strRoleName = "HR",
                    strDesc = "Human Resources with management access",
                    bolIsActive = true,
                    bolSystemCreated = true,
                    dtCreatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    dtUpdatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserRole
                {
                    strUserRoleGUID = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    strRoleName = "Employee",
                    strDesc = "Standard employee access",
                    bolIsActive = true,
                    bolSystemCreated = true,
                    dtCreatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    dtUpdatedOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        });
    }
}
