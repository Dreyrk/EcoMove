"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

import MobileHeader from "./mobile-header";
import Sidebar from "./sidebar";
import logout from "@/actions/auth/logout";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader mobileMenuOpen={mobileMenuOpen} toggleMenu={() => setMobileMenuOpen((o) => !o)} />

      <div className="lg:flex">
        <Sidebar
          pathname={pathname}
          user={user}
          onLogout={logout}
          mobileMenuOpen={mobileMenuOpen}
          closeMobileMenu={() => setMobileMenuOpen(false)}
        />

        <div className="lg:pl-72 w-full">
          <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
