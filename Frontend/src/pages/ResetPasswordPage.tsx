import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPasswordApi, verifyOtpApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const otpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type OtpFormValues = z.infer<typeof otpSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpFormData, setOtpFormData] = useState<OtpFormValues | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleOtpSubmit,
    setValue,
    formState: { errors: otpErrors, isSubmitting: isVerifyingOtp },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isSubmitting: isResetting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setValue("email", email);
    }
  }, [searchParams, setValue]);

  const onVerifyOtp = async (data: OtpFormValues) => {
    setServerError(null);
    setServerMessage(null);

    try {
      const verifyResponse = await verifyOtpApi({
        strEmail: data.email.trim(),
        strOTP: data.otp.trim(),
      });

      setOtpFormData(data);
      setOtpVerified(true);
      setServerMessage(verifyResponse.message || "OTP verified successfully.");
    } catch (error) {
      setOtpVerified(false);
      setOtpFormData(null);
      setServerError(
        error instanceof Error ? error.message : "Unable to verify OTP right now."
      );
    }
  };

  const onResetPassword = async (data: ResetFormValues) => {
    if (!otpFormData) {
      setServerError("Please verify OTP first.");
      return;
    }

    setServerError(null);
    setServerMessage(null);

    try {
      const response = await resetPasswordApi({
        strEmail: otpFormData.email.trim(),
        strOTP: otpFormData.otp.trim(),
        strNewPassword: data.newPassword,
        strConfirmPassword: data.confirmPassword,
      });

      setServerMessage(response.message || "Password reset successful.");
      setOtpVerified(false);
      setOtpFormData(null);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to reset password right now."
      );
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md rounded-3xl border-border bg-card shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="text-sm text-muted-foreground">
              Enter email, OTP, and your new password.
            </p>
          </div>

          {serverMessage && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {serverMessage}
            </div>
          )}

          {serverError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-3" noValidate>
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Work Email"
                className="rounded-xl"
                {...register("email")}
                disabled={otpVerified}
              />
              {otpErrors.email && (
                <p className="text-xs text-destructive">{otpErrors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="text"
                placeholder="6-digit OTP"
                className="rounded-xl"
                {...register("otp")}
                disabled={otpVerified}
              />
              {otpErrors.otp && (
                <p className="text-xs text-destructive">{otpErrors.otp.message}</p>
              )}
            </div>

            {!otpVerified && (
              <Button type="submit" className="w-full rounded-xl" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
              </Button>
            )}
          </form>

          {otpVerified && (
            <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-3" noValidate>
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                OTP verified. Set your new password.
              </div>

              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="New Password"
                  className="rounded-xl"
                  {...registerReset("newPassword")}
                />
                {resetErrors.newPassword && (
                  <p className="text-xs text-destructive">{resetErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="rounded-xl"
                  {...registerReset("confirmPassword")}
                />
                {resetErrors.confirmPassword && (
                  <p className="text-xs text-destructive">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full rounded-xl" disabled={isResetting}>
                {isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Back to{" "}
            <Link to="/login" className="text-foreground underline underline-offset-2">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
