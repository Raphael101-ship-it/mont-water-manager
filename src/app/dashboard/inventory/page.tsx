import { getInventoryWithBalances } from "@/lib/supabase/inventory";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";

export default async function InventoryPage() {
  // Dynamically calculate actual stock from movements table
  const items = await getInventoryWithBalances();

  // Group items to pass to our interactive client components
  const finishedGoods = items.filter(i => i.category === "Finished Good");
  const rawMaterials = items.filter(i => i.category === "Raw Material");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Management</h1>
        <p className="text-sm text-foreground/70 mt-1">View stock, log incoming shipments, and record usage.</p>
      </div>

      <InventoryTabs 
        finishedGoods={finishedGoods} 
        rawMaterials={rawMaterials} 
      />
    </div>
  );
}
