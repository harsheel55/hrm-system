# Email (SMTP) Configuration Guide

## Overview
The application uses SMTP to send emails for:
- **OTP for Password Reset** - Sends a 6-digit OTP when user requests password reset
- **Password Reset Confirmation** - Notifies user after successful password reset
- **Welcome Email** - Can be sent when new users are created (optional)

## Configuration

### 1. Gmail SMTP (Recommended for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **App**: Mail
3. Select **Device**: Windows Computer (or Custom name: "Neminath App")
4. Click **Generate**
5. Copy the 16-character password (remove spaces)

#### Step 3: Update appsettings.Development.json
```json
{
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "Username": "your-email@gmail.com",
    "Password": "your-16-char-app-password",
    "FromEmail": "your-email@gmail.com",
    "FromName": "Neminath Support",
    "EnableSsl": "true"
  }
}
```

**Important:** Never commit your real SMTP password to Git! Keep it in `appsettings.Development.json` which should be in `.gitignore`.

---

### 2. Other SMTP Providers

#### Outlook/Office 365
```json
{
  "Smtp": {
    "Host": "smtp-mail.outlook.com",
    "Port": "587",
    "Username": "your-email@outlook.com",
    "Password": "your-password",
    "FromEmail": "your-email@outlook.com",
    "FromName": "Neminath Support",
    "EnableSsl": "true"
  }
}
```

#### SendGrid
```json
{
  "Smtp": {
    "Host": "smtp.sendgrid.net",
    "Port": "587",
    "Username": "apikey",
    "Password": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "your-verified-sender@yourdomain.com",
    "FromName": "Neminath Support",
    "EnableSsl": "true"
  }
}
```

#### Mailgun
```json
{
  "Smtp": {
    "Host": "smtp.mailgun.org",
    "Port": "587",
    "Username": "postmaster@your-domain.mailgun.org",
    "Password": "your-mailgun-smtp-password",
    "FromEmail": "noreply@your-domain.com",
    "FromName": "Neminath Support",
    "EnableSsl": "true"
  }
}
```

#### AWS SES (Simple Email Service)
```json
{
  "Smtp": {
    "Host": "email-smtp.us-east-1.amazonaws.com",
    "Port": "587",
    "Username": "YOUR_SMTP_USERNAME",
    "Password": "YOUR_SMTP_PASSWORD",
    "FromEmail": "verified-sender@yourdomain.com",
    "FromName": "Neminath Support",
    "EnableSsl": "true"
  }
}
```

---

## Testing Email Functionality

### 1. Test Forgot Password (OTP Email)
```bash
POST http://localhost:5244/api/auth/forgot-password
Content-Type: application/json

{
  "strEmail": "user@example.com"
}
```

**Expected Result:**
- User receives OTP email
- In DEBUG mode, OTP is also returned in response (for testing)
- In RELEASE mode, OTP is only sent via email

### 2. Test Reset Password
```bash
POST http://localhost:5244/api/auth/reset-password
Content-Type: application/json

{
  "strEmail": "user@example.com",
  "strOTP": "123456",
  "strNewPassword": "NewPassword@123",
  "strConfirmPassword": "NewPassword@123"
}
```

**Expected Result:**
- Password is reset
- User receives confirmation email

---

## Email Templates

The application includes beautiful HTML email templates:

### 1. OTP Email Template
- Professional header with branding
- Large, easy-to-read OTP code
- Security warnings and tips
- 10-minute validity notice

### 2. Password Reset Confirmation
- Success message with checkmark
- Security alert for unauthorized changes
- Professional footer

### 3. Welcome Email
- Friendly welcome message
- Account creation confirmation
- Support contact information

---

## Troubleshooting

### Issue: Emails not sending

**Check 1: SMTP Configuration**
- Verify Host, Port, Username, Password are correct
- Check if EnableSsl is set to "true"
- Ensure FromEmail matches Username (for most providers)

**Check 2: Application Logs**
Look for error messages in console:
```
Failed to send email to user@example.com: [Error Message]
```

**Check 3: Gmail Specific**
- Ensure 2FA is enabled
- Use App Password, not your regular password
- Check "Less secure app access" is OFF (use App Password instead)
- Verify your account isn't locked

**Check 4: Network/Firewall**
- Ensure port 587 or 465 is not blocked
- Check if your hosting provider allows SMTP

**Check 5: Email Provider Limits**
- Gmail: 500 emails/day for free accounts
- Check your provider's sending limits

### Issue: Emails go to Spam

**Solutions:**
1. Configure SPF, DKIM, DMARC records for your domain
2. Use a verified sender email address
3. Avoid spam trigger words in subject/body
4. Use a professional email service (SendGrid, AWS SES)
5. Warm up your sending domain gradually

---

## Production Recommendations

### 1. Use Professional Email Service
For production, use dedicated email services:
- **SendGrid** - 100 emails/day free tier
- **AWS SES** - $0.10 per 1,000 emails
- **Mailgun** - 5,000 emails/month free
- **Postmark** - Transactional email specialist

### 2. Security Best Practices
- Store SMTP credentials in **environment variables** or **Azure Key Vault**
- Never commit passwords to Git
- Use different credentials for dev/staging/production
- Rotate passwords regularly

### 3. Monitoring
- Log all email sending attempts
- Track delivery rates
- Monitor bounce rates
- Set up alerts for failed emails

### 4. Email Settings
```json
// Production appsettings.json
{
  "Smtp": {
    "Host": "smtp.sendgrid.net",
    "Port": "587",
    "Username": "apikey",
    "Password": "${SMTP_PASSWORD}", // From environment variable
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Neminath",
    "EnableSsl": "true"
  }
}
```

---

## Environment Variables (Production)

Instead of storing passwords in appsettings.json:

```bash
# Linux/macOS
export SMTP_HOST="smtp.sendgrid.net"
export SMTP_USERNAME="apikey"
export SMTP_PASSWORD="your-api-key"

# Windows PowerShell
$env:SMTP_HOST="smtp.sendgrid.net"
$env:SMTP_USERNAME="apikey"
$env:SMTP_PASSWORD="your-api-key"
```

Update Program.cs to read from environment:
```csharp
builder.Configuration["Smtp:Password"] = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
```

---

## Support

For issues or questions:
1. Check application logs for detailed error messages
2. Test SMTP connection with a simple email client
3. Verify credentials with your email provider
4. Check firewall/network settings

## Quick Start Checklist

- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password
- [ ] Update `appsettings.Development.json` with SMTP credentials
- [ ] Test forgot-password endpoint
- [ ] Verify email received with OTP
- [ ] Test reset-password endpoint
- [ ] Verify confirmation email received
- [ ] (Optional) Configure production SMTP provider
- [ ] Add SMTP password to environment variables
- [ ] Test in production environment
