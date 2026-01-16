"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { AuthButton } from "@/components/auth/auth-button";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function MobileNavPanel({
  isOpen,
  onClose,
  links,
}: MobileNavPanelProps) {
  const pathname = usePathname();

  const backdropVariants: Variants = {
    initial: { x: "100%" },
    animate: {
      x: "0%",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 },
    },
  };

  const middleLayerVariants: Variants = {
    initial: { x: "100%" },
    animate: {
      x: 30,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
    },
  };

  const menuVariants: Variants = {
    initial: { x: "100%" },
    animate: {
      x: 60,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0 },
    },
  };

  const linkVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.5 + i * 0.1, duration: 0.3 },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* First layer - Green */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 z-40 bg-green-500"
            onClick={onClose}
          />

          {/* Second layer - Black (light) / White (dark) */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={middleLayerVariants}
            className="fixed inset-0 z-40 bg-black dark:bg-white"
            onClick={onClose}
          />

          {/* Main content panel */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuVariants}
            className="bg-background fixed inset-0 z-40"
          >
            <div className="flex h-full flex-col pt-20">
              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="space-y-2">
                  {links.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={linkVariants}
                      >
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={`block rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                            isActive
                              ? "text-foreground underline decoration-green-500 decoration-2 underline-offset-4"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground hover:underline hover:decoration-green-500 hover:decoration-2 hover:underline-offset-4"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom section */}
              <div className="border-border border-t px-6 py-6">
                <div className="flex justify-center">
                  <AuthButton />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
