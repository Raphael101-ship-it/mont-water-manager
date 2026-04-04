"use client";

import { useActionState, useEffect, useState, useMemo } from "react";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { logProduction } from "@/app/actions/production";
import type { ItemWithBalance } from "@/lib/supabase/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductionForm({ finishedGoods }: { finishedGoods: ItemWithBalance[] }) {
  const [state, formAction, pending] = useActionState(logProduction, null);
  const [selectedType, setSelectedType] = useState<"500ml" | "330ml">("500ml");
  const [quantity, setQuantity] = useState<string>("");
  const [actionType, setActionType] = useState<"add" | "replace">("add");
  const [successMsg, setSuccessMsg] = useState("");

  const today = new Date().toISOString().split('T')[0];

  // Derive the target item ID based on the selection so the backend knows where to route the sum.
  const targetItem = useMemo(() => {
    return finishedGoods.find((i) => i.name.includes(selectedType));
  }, [finishedGoods, selectedType]);

  // Handle Rollover logic safely and instantly in the UI
  const currentStockForType = targetItem?.stock_balance || 0;
  const isRolloverWarningVisible = currentStockForType > 0 && quantity !== "" && parseInt(quantity) > 0;

  // Clear success styling after submission
  useEffect(() => {
    if (state?.success) {
      setQuantity("");
      setSuccessMsg("Production logged successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }, [state]);

  return (
    <form action={formAction} className="p-6 md:p-8 space-y-6">
      
      {/* Hidden explicit keys */}
      <input type="hidden" name="item_id" value={targetItem?.id || ""} />
      
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success flex items-center gap-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Production Date</Label>
        <Input id="date" name="date" type="date" defaultValue={today} required />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bottle Type */}
        <div className="space-y-2">
          <Label htmlFor="bottle_type">Bottle Size</Label>
          <select 
            name="bottle_type" 
            id="bottle_type" 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as "500ml" | "330ml")}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="500ml">500ml Bottles</option>
            <option value="330ml">330ml Bottles</option>
          </select>
        </div>
        
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Produced Quantity</Label>
          <Input 
            id="quantity" 
            name="quantity" 
            type="number" 
            min="1" 
            required 
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Rollover Warning Interface */}
      {isRolloverWarningVisible && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-5 animate-in fade-in zoom-in-95 mt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="space-y-3 w-full">
              <div>
                <h4 className="font-bold text-foreground text-sm">Remaining Stock Detected ({currentStockForType.toLocaleString()})</h4>
                <p className="text-xs text-foreground/60 mt-0.5">
                  You are logging {quantity} new units. How should this affect the current stock?
                </p>
              </div>
              
              <div className="flex gap-2 w-full pt-1">
                <input type="hidden" name="action_type" value={actionType} />
                
                <button
                  type="button"
                  onClick={() => setActionType("add")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all border ${
                    actionType === "add" 
                      ? "bg-primary text-primary-foreground border-primary shadow-md" 
                      : "bg-surface text-foreground/70 border-border hover:bg-background"
                  }`}
                >
                  Add to Total
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("replace")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all border ${
                    actionType === "replace" 
                      ? "bg-primary text-primary-foreground border-primary shadow-md" 
                      : "bg-surface text-foreground/70 border-border hover:bg-background"
                  }`}
                >
                  Replace Total
                </button>
              </div>
              
              <div className="text-[11px] font-medium p-2 rounded bg-background/50 text-foreground/60">
                {actionType === "add" 
                  ? `Final stock will become: ${(currentStockForType + parseInt(quantity)).toLocaleString()}`
                  : `Final stock will reset and match exactly: ${parseInt(quantity).toLocaleString()}`
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Error Pipeline */}
      {state?.error && (
        <div className="text-sm font-medium text-danger p-3 bg-danger/10 border border-danger/20 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full h-12 text-base shadow-sm" disabled={pending || !targetItem}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording Production...
            </>
          ) : (
            "Log Daily Production"
          )}
        </Button>
      </div>
    </form>
  );
}
