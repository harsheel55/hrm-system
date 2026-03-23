using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public sealed class RegisterRequest
{
    [Required]
    [MaxLength(256)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(256)]
    public string Password { get; set; } = string.Empty;
}
