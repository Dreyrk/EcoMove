import { Loader } from "@/components/ui/loader";

export default function LoadingPage() {
  return (
    <main className="h-screen grid place-items-center">
      <Loader size="xl" />
    </main>
  );
}
