import { cn } from "@/lib/utils";
import { LayoutDashboard, Plus, BarChart3, Leaf } from "lucide-react";
import NavLinkItem from "./nav-link-item";
import UserProfileSection from "./user-profile-section";
import ThemeToggle from "../themes/theme-toggle";
import { User } from "../providers/auth-provider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Enregistrer une activité", href: "/activity/new", icon: Plus },
  { name: "Stats & Classements", href: "/stats", icon: BarChart3 },
];

export default function Sidebar({
  pathname,
  user,
  onLogout,
  mobileMenuOpen,
  closeMobileMenu,
}: {
  pathname: string;
  user: User | null;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}) {
  return (
    <div
      className={cn(
        "lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
        mobileMenuOpen ? "block" : "hidden lg:block"
      )}>
      <div className="h-full flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center space-x-2">
          <div className="bg-primary rounded-lg p-2">
            <span className="text-primary-foreground font-bold">
              <Leaf />
            </span>
          </div>
          <div>
            <div className="font-bold text-nowrap">EcoMove Challenge</div>
            <div className="text-xs text-muted-foreground">Suivez votre impact</div>
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <NavLinkItem
                    key={item.name}
                    name={item.name}
                    href={item.href}
                    icon={item.icon}
                    active={pathname === item.href}
                    onClick={closeMobileMenu}
                  />
                ))}
              </ul>
            </li>

            <li className="mt-auto">
              <UserProfileSection user={user} onLogout={onLogout} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
