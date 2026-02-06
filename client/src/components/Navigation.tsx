import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/rsvp", label: "Register" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm">
      <Link href="/" className="text-xl font-display font-bold tracking-[0.2em] text-white hover:opacity-80 transition-opacity">
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
