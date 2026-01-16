import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="container flex max-w-screen-2xl flex-col items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:py-20">
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8 xl:max-w-5xl 2xl:max-w-6xl">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
            Next.js 16 Boilerplate
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
            Built with Tailwind CSS v4, shadcn/ui, and React Compiler
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid w-full gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Turbopack</CardTitle>
              <CardDescription className="text-sm">
                2-5x faster builds with the new default bundler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <p className="text-muted-foreground text-sm">
                Turbopack is now the default for both development and production
                builds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                React Compiler
              </CardTitle>
              <CardDescription className="text-sm">
                Automatic memoization for better performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <p className="text-muted-foreground text-sm">
                The React Compiler automatically optimizes your components
                without manual memo() calls.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Tailwind CSS v4
              </CardTitle>
              <CardDescription className="text-sm">
                Next-generation utility-first CSS
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <p className="text-muted-foreground text-sm">
                Faster builds, smaller output, and new features with Tailwind
                CSS v4.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Email Signup Card */}
        <Card className="w-full max-w-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Get Started</CardTitle>
            <CardDescription className="text-sm">
              Enter your email to receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="you@example.com"
                className="flex-1"
              />
              <Button className="w-full sm:w-auto">Subscribe</Button>
            </div>
          </CardContent>
        </Card>

        {/* Button Showcase */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
    </div>
  );
}
