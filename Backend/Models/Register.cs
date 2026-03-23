using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public sealed class Register
{
    [Key]
    public int Id { get; set; }

    [MaxLength(256)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(256)]
    public string Password { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
