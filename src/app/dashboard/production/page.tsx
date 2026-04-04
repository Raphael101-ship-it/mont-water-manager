import { getInventoryWithBalances } from "@/lib/supabase/inventory";
import { ProductionForm } from "@/components/production/ProductionForm";

export default async function ProductionPage() {
  const items = await getInventoryWithBalances();
  const finishedGoods = items.filter(i => i.category === "Finished Good");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Daily Production</h1>
        <p className="text-sm text-foreground/70 mt-1">Log the final factory output for 500ml and 330ml products.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        <ProductionForm finishedGoods={finishedGoods} />
      </div>
    </div>
  );
}
