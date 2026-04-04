"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCcw } from "lucide-react";

// Import Next.js Server Actions directly
import { logStockMovement } from "@/app/actions/inventory";
import { logProduction } from "@/app/actions/production";

type SyncItem = {
  id: string;
  type: "inventory" | "production";
  payload: Record<string, any>;
};

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    // Safely check navigator status on mount
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const updateQueueSize = () => {
      const q = JSON.parse(localStorage.getItem("offline_queue") || "[]");
      setQueueCount(q.length);
    };
    updateQueueSize();

    // 2. The Auto-Sync Hook Logic
    const handleOnline = async () => {
      setIsOnline(true);
      const queue: SyncItem[] = JSON.parse(localStorage.getItem("offline_queue") || "[]");
      
      if (queue.length > 0) {
        setIsSyncing(true);
        const remainingQueue: SyncItem[] = [];
        
        for (const item of queue) {
          try {
            // Reconstruct the FormData to bridge across Client->Server flawlessly
            const formData = new FormData();
            Object.keys(item.payload).forEach(key => formData.append(key, item.payload[key]));

            let res;
            if (item.type === "inventory") {
              res = await logStockMovement(null, formData);
            } else if (item.type === "production") {
              res = await logProduction(null, formData);
            }

            if (!res?.success) {
              console.error("Sync failed for record", item.id, res?.error);
              remainingQueue.push(item); // Keep it queued if it fails for some reason
            }
          } catch (e) {
            console.error(e);
            remainingQueue.push(item);
          }
        }
        
        // Clear queue of successful items
        localStorage.setItem("offline_queue", JSON.stringify(remainingQueue));
        setQueueCount(remainingQueue.length);
        setIsSyncing(false);
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("storage", updateQueueSize);

    // Initial check incase we mounted while online but have stuck items
    if (typeof navigator !== "undefined" && navigator.onLine && queueCount > 0) {
      handleOnline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage", updateQueueSize);
    };
  }, [queueCount]);

  return (
    <>
      {/* 3. Global elegant UI Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {!isOnline && (
          <div className="flex items-center gap-2 bg-danger text-white px-5 py-2.5 rounded-full shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4 border border-danger/50">
            <WifiOff className="w-4 h-4" />
            Offline - Saving Locally ({queueCount} Pending)
          </div>
        )}
        {isOnline && isSyncing && (
          <div className="flex items-center gap-2 bg-warning text-warning-foreground px-5 py-2.5 rounded-full shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4 border border-warning/50">
            <RefreshCcw className="w-4 h-4 animate-spin" />
            Syncing {queueCount} records to Supabase...
          </div>
        )}
        {/* We fade it out instantly upon success, so a green check remains implicit by returning to the normal navbar */}
      </div>
      {children}
    </>
  );
}

// 1. The Offline Queue Utility
export const saveOfflineData = (type: "inventory" | "production", payload: Record<string, string>) => {
  const queue = JSON.parse(localStorage.getItem("offline_queue") || "[]");
  queue.push({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    type,
    payload
  });
  localStorage.setItem("offline_queue", JSON.stringify(queue));
  window.dispatchEvent(new Event("storage")); // Instantly update badge count
};

// Check utility to let forms bypass Next Action state
export const isOffline = () => {
  return typeof navigator !== "undefined" ? !navigator.onLine : false;
};
