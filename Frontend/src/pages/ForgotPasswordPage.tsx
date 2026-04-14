import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setServerMessage(null);

    try {
      const email = data.email.trim();
      const response = await forgotPasswordApi({ strEmail: email });
      setServerMessage(response.message || "If the email exists, an OTP has been sent.");
      setLastEmail(email);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to send OTP right now."
      );
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md rounded-3xl border-border bg-card shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we will send you an OTP to reset your password.
            </p>
          </div>

          {serverMessage && (
            <div className="space-y-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <p>{serverMessage}</p>
              <Button
                type="button"
                className="w-full rounded-xl"
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(lastEmail)}`)}
              >
                Verify OTP and reset password
              </Button>
            </div>
          )}

          {serverError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Work Email"
                className="rounded-xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have OTP?{" "}
            <Link to="/reset-password" className="text-foreground underline underline-offset-2">
              Reset password
            </Link>
          </div>
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
