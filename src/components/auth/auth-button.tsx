"use client";

import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (session?.user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    );
  }

  return (
    <Button asChild size="sm">
      <Link href="/login">Sign in</Link>
    </Button>
  );
}
