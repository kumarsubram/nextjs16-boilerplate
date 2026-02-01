"use client";

import { useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthButton } from "@/components/auth/auth-button";
import { MobileHamburger } from "@/components/navigation/mobile-hamburger";
import { MobileNavPanel } from "@/components/navigation/mobile-nav-panel";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/constants";
import { useMobileMenu } from "@/hooks/use-mobile-menu";

export function Navbar() {
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeMenu]);

  return (
    <>
      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center space-x-6 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden items-center space-x-4 md:flex">
            <AuthButton />
          </div>

          {/* Mobile Hamburger */}
          <MobileHamburger isOpen={isOpen} onClick={toggleMenu} />
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <MobileNavPanel isOpen={isOpen} onClose={closeMenu} links={NAV_LINKS} />
    </>
  );
}
