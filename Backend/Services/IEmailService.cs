namespace Backend.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
        Task<bool> SendOtpEmailAsync(string toEmail, string userName, string otp);
        Task<bool> SendWelcomeEmailAsync(string toEmail, string userName);
        Task<bool> SendPasswordResetConfirmationAsync(string toEmail, string userName);
    }
}
