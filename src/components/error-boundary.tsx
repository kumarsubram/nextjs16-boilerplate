"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to your error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-destructive text-lg sm:text-xl">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
          {process.env.NODE_ENV === "development" && (
            <pre className="bg-muted overflow-auto rounded-md p-3 text-xs sm:p-4 sm:text-sm">
              {error.message}
            </pre>
          )}
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
