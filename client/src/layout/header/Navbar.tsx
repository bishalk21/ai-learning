import { navLinks } from "@/utils/constants";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import MobileNavbar from "./MobileNavbar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="sticky h-16 top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
          aria-label="Main Navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2"
            aria-label="Homepage"
          >
            <div className="rounded-lg border border-zinc-700 px-3 py-1 font-mono text-lg font-bold text-white transition-all group-hover:border-white">
              {"< /> "} bishal.dev
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                aria-label={item.ariaLabel}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/contact"
              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105"
              aria-label="Get In Touch"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle Menu"
            className="md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {isOpen && <MobileNavbar navLinks={navLinks} setIsOpen={setIsOpen} />}
      </header>
    </>
  );
};

export default Navbar;
