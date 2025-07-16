import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function NavLinkItem({
  name,
  href,
  icon: Icon,
  active,
  onClick,
}: {
  name: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
        )}>
        <Icon className="h-6 w-6 shrink-0" />
        {name}
      </Link>
    </li>
  );
}
