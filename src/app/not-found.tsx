import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-5xl font-bold sm:text-6xl">404</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <p className="text-muted-foreground text-sm sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
