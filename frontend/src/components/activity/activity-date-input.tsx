import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface DateInputProps {
  date: string;
  setDate: (date: string) => void;
  hasActivityForDate: boolean;
  error?: string[];
}

export default function DateInput({ date, setDate, hasActivityForDate, error }: DateInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date</Label>
      <Input
        id="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        readOnly
        required
        tabIndex={-1}
        className="cursor-not-allowed pointer-events-none bg-neutral-300/20"
      />
      {error?.length && <p className="text-sm text-red-600">{error.join(", ")}</p>}
      {hasActivityForDate && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Vous avez déjà une activité enregistrée pour cette date.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
