const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`
      relative overflow-hidden rounded-md
      bg-zinc-800
      before:absolute before:inset-0
      before:-translate-x-full
      before:animate-[shimmer_1.6s_infinite]
      before:bg-gradient-to-r
      before:from-transparent
      before:via-zinc-700/60
      before:to-transparent
      ${className}
    `}
  />
);

const NavbarSkeleton = () => {
  return (
    <header className="sticky h-16 top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        aria-hidden="true"
      >
        {/* Logo */}
        <Skeleton className="h-9 w-40 rounded-lg" />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />

          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </nav>
    </header>
  );
};

export default NavbarSkeleton;
