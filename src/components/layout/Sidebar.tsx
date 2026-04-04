import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Package, Factory, History } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface px-4 py-6 md:flex h-screen sticky top-0">
      {/* Brand / Logo Area */}
      <div className="mb-8 flex items-center justify-center">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image 
            src="/logo.jpg" 
            alt="Mont Water Logo" 
            width={120} 
            height={40} 
            className="object-contain"
            priority 
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 hover:bg-surface/80 hover:text-foreground transition-colors">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/dashboard/inventory" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 hover:bg-surface/80 hover:text-foreground transition-colors">
          <Package className="h-5 w-5" />
          Inventory
        </Link>
        <Link href="/dashboard/production" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 hover:bg-surface/80 hover:text-foreground transition-colors">
          <Factory className="h-5 w-5" />
          Production
        </Link>
        <Link href="/dashboard/history" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 hover:bg-surface/80 hover:text-foreground transition-colors">
          <History className="h-5 w-5" />
          History
        </Link>
      </nav>
    </aside>
  );
}
