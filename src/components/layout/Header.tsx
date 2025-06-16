
import Link from 'next/link';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CloudSun } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 px-6 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CloudSun className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-headline font-semibold hover:text-primary transition-colors">
            Weather Weaver
          </Link>
        </div>
        <nav className="flex gap-x-4 sm:gap-x-6 items-center">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
