import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CloudSun } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 px-6 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-semibold">Weather Weaver</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
