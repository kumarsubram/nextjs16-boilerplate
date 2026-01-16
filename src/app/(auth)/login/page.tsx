import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to callback URL or home if already logged in
  if (session) {
    const redirectUrl = callbackUrl?.startsWith("/") ? callbackUrl : "/";
    redirect(redirectUrl);
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}
