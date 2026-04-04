"use client";

import { useState } from "react";
import { Package, Box, PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ItemWithBalance } from "@/lib/supabase/inventory";
import { StockModal } from "./StockModal";

export function InventoryTabs({
  finishedGoods,
  rawMaterials,
}: {
  finishedGoods: ItemWithBalance[];
  rawMaterials: ItemWithBalance[];
}) {
  const [activeTab, setActiveTab] = useState<"finished" | "raw">("finished");
  const [selectedItem, setSelectedItem] = useState<ItemWithBalance | null>(null);
  const [modalType, setModalType] = useState<"IN" | "OUT">("IN");

  const openModal = (item: ItemWithBalance, type: "IN" | "OUT") => {
    setSelectedItem(item);
    setModalType(type);
  };

  return (
    <div className="space-y-6">
      {/* Sleek Tab Navigation */}
      <div className="flex space-x-1 rounded-xl bg-surface p-1 shadow-sm border border-border max-w-md">
        <button
          onClick={() => setActiveTab("finished")}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === "finished"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/70 hover:bg-background hover:text-foreground"
          )}
        >
          <Package className="h-4 w-4" />
          Finished Goods
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === "raw"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/70 hover:bg-background hover:text-foreground"
          )}
        >
          <Box className="h-4 w-4" />
          Raw Materials
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm min-h-[400px]">
        {activeTab === "finished" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-semibold text-foreground">Finished Goods</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {finishedGoods.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onAdd={() => openModal(item, "IN")}
                  onDeduct={() => openModal(item, "OUT")}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "raw" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">Pack Materials (Expliclty Separated)</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rawMaterials.filter(i => i.name.includes("Preforms")).map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    highlight 
                    onAdd={() => openModal(item, "IN")}
                    onDeduct={() => openModal(item, "OUT")}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">General Materials</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rawMaterials.filter(i => !i.name.includes("Preforms")).map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onAdd={() => openModal(item, "IN")}
                    onDeduct={() => openModal(item, "OUT")}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Modal Contextually */}
      {selectedItem && (
        <StockModal 
          item={selectedItem} 
          defaultType={modalType} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

// Reusable card holding the Empty State UI for Add/Deduct Buttons
function ItemCard({ 
  item, 
  highlight = false,
  onAdd,
  onDeduct
}: { 
  item: ItemWithBalance, 
  highlight?: boolean,
  onAdd: () => void,
  onDeduct: () => void
}) {
  const isZero = item.stock_balance === 0;

  return (
    <div className={cn(
      "rounded-xl border bg-background p-4 flex flex-col justify-between space-y-4 transition-all hover:shadow-md",
      highlight ? "border-primary/40 bg-primary/5" : "border-border",
      isZero ? "border-warning/30" : ""
    )}>
      <div>
        <h3 className="font-bold text-foreground">{item.name}</h3>
        <p className="text-sm text-foreground/50 mt-1">
          Current Stock: <span className={cn("font-semibold", isZero ? "text-warning" : "text-foreground")}>
            {item.stock_balance.toLocaleString()}
          </span>
        </p>
      </div>
      
      {/* Interactive state for Add/Deduct Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button onClick={onAdd} variant="outline" size="sm" className="w-full text-foreground hover:border-success/50 hover:text-success hover:bg-success/5 transition-colors">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
        <Button onClick={onDeduct} variant="outline" size="sm" className="w-full text-foreground hover:border-danger/50 hover:text-danger hover:bg-danger/5 transition-colors">
          <MinusCircle className="mr-2 h-4 w-4" />
          Deduct
        </Button>
      </div>
    </div>
  );
}
