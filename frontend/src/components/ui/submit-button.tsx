import { Button } from "./button";

export default function SubmitButton({
  isPending,
  pendingText,
  text,
}: {
  isPending: boolean;
  pendingText: string;
  text: string;
}) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? pendingText : text}
    </Button>
  );
}
