import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Sleek Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        {/* Dynamic Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        {/* Centered Icon */}
        <Loader2 className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground tracking-tight">Syncing Database...</h3>
        <p className="text-sm text-foreground/50 mt-1">Retrieving live stock metrics</p>
      </div>
    </div>
  );
}
