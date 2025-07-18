import { Leaf } from "lucide-react";

export default function AuthLogo() {
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-primary rounded-full p-3">
        <Leaf className="h-8 w-8 text-primary-foreground" />
      </div>
    </div>
  );
}
