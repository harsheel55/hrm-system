using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public sealed class Login
{
    [Key]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(256)]
    public string Password { get; set; } = string.Empty;
}
