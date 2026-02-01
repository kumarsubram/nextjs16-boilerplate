import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { APP_NAME, NAV_LINKS, LEGAL_LINKS } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-border/40 w-full border-t">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Responsive grid: 2 cols on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <Logo size="sm" className="mb-3" />
            <p className="text-muted-foreground text-sm">
              A modern Next.js boilerplate for building web applications.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Contact</h3>
            <p className="text-muted-foreground text-sm">
              Get in touch with us for any questions.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-border mt-8 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
