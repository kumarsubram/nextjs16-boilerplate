import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { useMobileMenu } from "./use-mobile-menu";

describe("useMobileMenu", () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    // Cleanup
    document.body.style.overflow = "unset";
  });

  it("initializes with menu closed", () => {
    const { result } = renderHook(() => useMobileMenu());

    expect(result.current.isOpen).toBe(false);
  });

  it("toggles menu open and closed", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("opens menu with openMenu", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("closes menu with closeMenu", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeMenu();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("locks body scroll when menu is open", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("unlocks body scroll when menu is closed", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      result.current.closeMenu();
    });
    expect(document.body.style.overflow).toBe("unset");
  });

  it("closes menu on resize to desktop width", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });
    expect(result.current.isOpen).toBe(true);

    // Simulate resize to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("keeps menu open on resize to mobile width", () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.openMenu();
    });

    // Simulate resize but still mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isOpen).toBe(true);
  });
});
