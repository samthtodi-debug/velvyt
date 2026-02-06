import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => setClickCount(0), 2000); // Reset after 2 seconds
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 10) {
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Secret Website
    }
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/rsvp", label: "Register" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm">
      <Link
        href="/"
        className="text-xl font-display font-bold tracking-[0.2em] text-white hover:opacity-80 transition-opacity select-none"
        onClick={handleLogoClick}
      >
        VELVYT
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-xs font-medium uppercase tracking-widest transition-all duration-300 hover:text-white",
              location === link.href ? "text-white" : "text-white/40"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Placeholder - keeping it simple for MVP */}
      <div className="md:hidden">
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </div>
    </nav>
  );
}
