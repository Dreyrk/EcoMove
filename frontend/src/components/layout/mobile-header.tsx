import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../themes/theme-toggle";

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileHeader({ mobileMenuOpen, toggleMenu }: MobileHeaderProps) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold">EcoMove</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}
