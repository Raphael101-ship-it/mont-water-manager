"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, subDays } from "date-fns";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Default to Past 5 Days as requested
  const defaultFrom = format(subDays(new Date(), 5), "yyyy-MM-dd");
  const defaultTo = format(new Date(), "yyyy-MM-dd");

  const [from, setFrom] = useState(searchParams.get("from") || defaultFrom);
  const [to, setTo] = useState(searchParams.get("to") || defaultTo);

  const applyRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from);
    params.set("to", to);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface px-4 py-3 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">From</label>
        <input 
          type="date" 
          value={from} 
          onChange={(e) => setFrom(e.target.value)}
          className="text-sm bg-background border border-border/50 text-foreground rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">To</label>
        <input 
          type="date" 
          value={to} 
          onChange={(e) => setTo(e.target.value)}
          className="text-sm bg-background border border-border/50 text-foreground rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
        />
      </div>
      <button 
        onClick={applyRange}
        className="px-5 py-2 bg-slate-800 text-slate-50 text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm ml-auto"
      >
        Update Analytics
      </button>
    </div>
  );
}
