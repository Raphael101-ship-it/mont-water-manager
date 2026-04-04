import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineSyncProvider } from "@/components/sync/OfflineSyncProvider";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OfflineSyncProvider>
      <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Shared Desktop Sidebar */}
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Top Header (Logo shown prominently on mobile) */}
        <div className="flex items-center justify-center border-b border-border bg-surface p-4 md:hidden shadow-sm z-40">
            <Link href="/dashboard">
                <Image 
                  src="/logo.jpg" 
                  alt="Mont Water Logo" 
                  width={100} 
                  height={30} 
                  className="object-contain"
                  priority 
                />
            </Link>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0 p-4 md:p-8">
          {children}
        </main>

        {/* Shared Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
    </OfflineSyncProvider>
  );
}
