"use client";

import { useActionState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { logStockMovement } from "@/app/actions/inventory";
import { isOffline, saveOfflineData } from "@/components/sync/OfflineSyncProvider";
import type { ItemWithBalance } from "@/lib/supabase/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StockModal({ 
  item, 
  defaultType, 
  onClose 
}: { 
  item: ItemWithBalance; 
  defaultType: "IN" | "OUT"; 
  onClose: () => void 
}) {
  const [state, formAction, pending] = useActionState(logStockMovement, null);

  // Auto-close modal after successful submission
  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  // Today's date as default for the DatePicker
  const today = new Date().toISOString().split('T')[0];

  const interceptAction = (formData: FormData) => {
    if (isOffline()) {
      const rawPayload: Record<string, string> = {};
      formData.forEach((value, key) => { rawPayload[key] = value.toString() });
      
      saveOfflineData("inventory", rawPayload);
      onClose();
      return;
    }
    
    formAction(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
          <div>
            <h2 className="text-lg font-bold text-foreground">Log Movement</h2>
            <p className="text-sm text-foreground/60">{item.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-foreground/50 hover:bg-black/5 hover:text-foreground rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form action={interceptAction} className="p-5 space-y-5">
          <input type="hidden" name="item_id" value={item.id} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Movement Type</Label>
              <select 
                name="type" 
                id="type" 
                defaultValue={defaultType}
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="IN">Stock IN (+)</option>
                <option value="OUT">Stock OUT (-)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                min="1" 
                required 
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <select 
                name="reason" 
                id="reason" 
                required
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="" disabled selected>Select a reason...</option>
                <option value="Production">Production</option>
                <option value="Sales">Sales</option>
                <option value="Supplier Delivery">Supplier Delivery</option>
                <option value="Damage">Damage</option>
                <option value="Internal Use">Internal Use</option>
              </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notes (Optional)</Label>
            <Input id="note" name="note" type="text" placeholder="e.g. Batch #4012" />
          </div>

          {state?.error && (
            <div className="text-sm font-medium text-danger p-3 bg-danger/10 border border-danger/20 rounded-lg">
              {state.error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full h-11 text-base" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Log Movement"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
