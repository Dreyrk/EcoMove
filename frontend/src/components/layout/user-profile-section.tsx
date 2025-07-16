import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserProfileSection({
  user,
  onLogout,
}: {
  user: { name?: string; team?: string } | null;
  onLogout: () => void;
}) {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-sm">{user?.name?.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.team}</div>
        </div>
      </div>
      <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Se déconnecter
      </Button>
    </div>
  );
}
