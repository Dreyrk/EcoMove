"use client";

import { Button } from "@/components/ui/button";
import { Users, Users2, Activity, BarChart3 } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "teams", label: "Équipes", icon: Users2 },
    { id: "activities", label: "Activités", icon: Activity },
    { id: "statistics", label: "Stats", icon: BarChart3 },
  ];

  return (
    <nav className="w-full">
      <div className="w-full">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => setCurrentPage(item.id)}
                    className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
