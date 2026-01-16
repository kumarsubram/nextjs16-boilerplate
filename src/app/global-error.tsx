"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-lg border p-6 text-center shadow-lg">
          <h1 className="text-destructive mb-2 text-2xl font-bold">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-4">
            A critical error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="bg-muted mb-4 overflow-auto rounded-md p-4 text-left text-sm">
              {error.message}
            </pre>
          )}
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
