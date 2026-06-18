import { Suspense, type ReactNode } from "react";
import Navbar from "./header/Navbar";
import NavbarSkeleton from "@/components/layout/header/NavbarSkeleton";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
};

export default Layout;
