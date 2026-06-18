import type { NavLink } from "@/utils/types";
import { Link } from "react-router";

interface MobileNavbarProps {
  navLinks: NavLink[];
  setIsOpen: (open: boolean) => void;
}

const MobileNavbar = ({ navLinks, setIsOpen }: MobileNavbarProps) => {
  return (
    <div className="border-t border-zinc-800 bg-black md:hidden">
      <div className="flex flex-col gap-4 px-6 py-6">
        {navLinks.map((item: NavLink) => (
          <Link
            key={item.name}
            to={item.href}
            className="text-zinc-300 hover:text-white"
            aria-label={item.ariaLabel}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}

        <Link
          to="/contact"
          className="mt-2 rounded-lg bg-white px-4 py-3 text-center font-medium text-black"
          aria-label="Get In Touch"
          onClick={() => setIsOpen(false)}
        >
          Get In Touch
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
