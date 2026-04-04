import Link from "next/link";
import { LayoutDashboard, Package, Factory, History } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-border bg-surface p-3 pb-safe md:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-[10px] font-medium">Dashboard</span>
      </Link>
      <Link href="/dashboard/inventory" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
        <Package className="h-6 w-6" />
        <span className="text-[10px] font-medium">Inventory</span>
      </Link>
      <Link href="/dashboard/production" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
        <Factory className="h-6 w-6" />
        <span className="text-[10px] font-medium">Production</span>
      </Link>
      <Link href="/dashboard/history" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
        <History className="h-6 w-6" />
        <span className="text-[10px] font-medium">History</span>
      </Link>
    </nav>
  );
}
