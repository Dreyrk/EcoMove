"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Activity } from "@/app/admin/management/page";

interface ActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityModal({ activity, isOpen, onClose }: ActivityModalProps) {
  if (!activity) return null;

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "cycling":
        return "bg-blue-100 text-blue-800";
      case "walking":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDistance = (activity: Activity) => {
    if (activity.type === "walking" || activity.type === "running") {
      return `${activity.distance}km (${activity.steps || Math.round(activity.distance * 1500)} steps)`;
    }
    return `${activity.distance}km`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Activity Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Activity ID</p>
              <p className="text-sm">{activity.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">User</p>
              <p className="text-sm">{activity.userName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm">{new Date(activity.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <Badge className={getActivityTypeColor(activity.type)}>{activity.type}</Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Distance</p>
            <p className="text-sm">{formatDistance(activity)}</p>
          </div>

          {activity.steps && (
            <div>
              <p className="text-sm font-medium text-gray-500">Steps</p>
              <p className="text-sm">{activity.steps.toLocaleString()} steps</p>
            </div>
          )}

          <Separator />

          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-sm">{new Date(activity.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
