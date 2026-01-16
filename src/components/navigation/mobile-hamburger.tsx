"use client";

import { Button } from "@/components/ui/button";

interface MobileHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileHamburger({ isOpen, onClick }: MobileHamburgerProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md bg-black p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none md:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span className="sr-only">Open main menu</span>
      <div className="flex h-6 w-6 flex-col items-center justify-around">
        <span
          className={`block h-0.5 w-full transform bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-0.5 w-full transform bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </div>
    </Button>
  );
}
