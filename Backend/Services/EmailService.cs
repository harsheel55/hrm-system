using System.Net;
using System.Net.Mail;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var smtpHost = _configuration["Smtp:Host"];
                var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "587");
                var smtpUsername = _configuration["Smtp:Username"];
                var smtpPassword = _configuration["Smtp:Password"];
                var smtpFromEmail = _configuration["Smtp:FromEmail"];
                var smtpFromName = _configuration["Smtp:FromName"] ?? "Neminath";
                var enableSsl = bool.Parse(_configuration["Smtp:EnableSsl"] ?? "true");

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogError("SMTP configuration is missing. Please configure SMTP settings in appsettings.json");
                    return false;
                }

                // Fix SSL/TLS settings for Gmail
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;

                using var smtpClient = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = enableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Timeout = 30000 // 30 seconds
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpFromEmail ?? smtpUsername, smtpFromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendOtpEmailAsync(string toEmail, string userName, string otp)
        {
            var subject = "Password Reset OTP - Neminath";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }}
        .otp-box {{ background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }}
        .warning {{ color: #ff6b6b; font-size: 14px; margin-top: 20px; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>We received a request to reset your password. Use the OTP code below to complete the password reset process:</p>
            
            <div class='otp-box'>
                <div class='otp-code'>{otp}</div>
            </div>
            
            <p>This OTP is valid for <strong>10 minutes</strong> only.</p>
            
            <div class='warning'>
                <strong>⚠️ Security Notice:</strong>
                <ul style='text-align: left;'>
                    <li>Never share this OTP with anyone</li>
                    <li>Neminath staff will never ask for your OTP</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2026 Neminath. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>";

            return await SendEmailAsync(toEmail, subject, body, true);
        }

        public async Task<bool> SendWelcomeEmailAsync(string toEmail, string userName)
        {
            var subject = "Welcome to Neminath!";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to Neminath! 🎉</h1>
        </div>
        <div class='content'>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>Your account has been successfully created!</p>
            <p>We're excited to have you on board. You can now log in and start using our services.</p>
            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            <p>Best regards,<br>The Neminath Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2026 Neminath. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            return await SendEmailAsync(toEmail, subject, body, true);
        }

        public async Task<bool> SendPasswordResetConfirmationAsync(string toEmail, string userName)
        {
            var subject = "Password Reset Successful - Neminath";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }}
        .success-icon {{ font-size: 48px; text-align: center; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Password Reset Successful</h1>
        </div>
        <div class='content'>
            <div class='success-icon'>✅</div>
            <p>Hello <strong>{userName}</strong>,</p>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in with your new password.</p>
            <p style='color: #ff6b6b;'><strong>If you did not make this change, please contact our support team immediately.</strong></p>
            <p>Best regards,<br>The Neminath Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2026 Neminath. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            return await SendEmailAsync(toEmail, subject, body, true);
        }
    }
}
