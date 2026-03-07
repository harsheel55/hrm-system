import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { registerApi } from "@/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSX, SVGProps } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms of Service",
  }),
});

type FormValues = z.infer<typeof schema>;

const Logo = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" height="48" viewBox="0 0 40 48" width="40" {...props}>
    <clipPath id="a">
      <path d="m0 0h40v48h-40z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
      <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
      <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
      <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
      <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
      <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
    </g>
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", agreeToTerms: false },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      await registerApi({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-background text-foreground transition-colors duration-300">
      <Card className="w-full max-w-sm rounded-4xl px-6 py-10 pt-14 bg-card text-card-foreground border-border shadow-sm transition-colors duration-300">
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            <Logo />

            <div className="space-y-2 text-center">
              <h1 className="text-balance text-3xl font-semibold text-foreground">
                Create Account
              </h1>
              <p className="text-pretty text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-foreground hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Server error banner */}
            {serverError && (
              <div className="w-full rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div className="w-full rounded-xl bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-700">
                Account created! Redirecting to login...
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="w-full space-y-4"
            >
              {/* Full Name */}
              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <Input
                  type="email"
                  placeholder="Work Email"
                  className="w-full rounded-xl"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="space-y-1">
                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded mt-0.5"
                    {...register("agreeToTerms")}
                  />
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-foreground hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-foreground hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl"
                size="lg"
                disabled={isSubmitting || success}
              >
                {isSubmitting ? "Creating account..." : "Create My Account"}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                size="lg"
              >
                Single sign-on (SSO)
              </Button>
            </form>

            <p className="text-pretty text-center text-xs w-11/12 text-muted-foreground">
              No credit card required for trial. Get started in less than 2 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}