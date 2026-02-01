"use client";

import { useState } from "react";

import Link from "next/link";

import { Loader2 } from "lucide-react";

import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });
    } catch (err) {
      setError("An error occurred during sign in. Please try again.");
      console.error("Error during Google login:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm shadow-lg sm:max-w-md">
        <CardHeader className="space-y-1 p-6 sm:p-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Welcome!
          </h2>
          <p className="text-muted-foreground mt-2 text-center text-sm sm:text-base">
            We respect your privacy. No spam, no data selling, ever.
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <div className="flex w-full items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                <span>
                  {isLoading ? "Please wait..." : "Sign in with Google"}
                </span>
              </div>
            </Button>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              <Link
                href="/privacy"
                className="hover:text-foreground underline transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
