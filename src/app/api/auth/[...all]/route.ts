import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Force dynamic rendering - auth requires runtime environment variables
export const dynamic = "force-dynamic";

export const { POST, GET } = toNextJsHandler(auth);
