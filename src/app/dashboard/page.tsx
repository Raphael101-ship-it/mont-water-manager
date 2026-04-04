import { getInventoryWithBalances, type ItemWithBalance } from "@/lib/supabase/inventory";
import { Package, Box } from "lucide-react";

export default async function DashboardPage() {
  let items: ItemWithBalance[] = [];
  let error = false;

  try {
    items = await getInventoryWithBalances();
  } catch (e) {
    error = true;
  }

  // Fallback if there's an error fetching
  if (error) {
    return <div className="p-8 text-danger font-medium">Failed to load inventory data. Please check your Supabase connection.</div>;
  }

  // Safely group items by category based on your SQL schema
  const finishedGoods = items?.filter(item => item.category === "Finished Good") || [];
  const rawMaterials = items?.filter(item => item.category === "Raw Material") || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-foreground/70 mt-1">Live stock metrics for Mont Water.</p>
      </div>

      <div className="space-y-8">
        {/* Finished Goods Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Finished Goods
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finishedGoods.map((item) => (
              <MetricCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Raw Materials Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            Raw Materials
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rawMaterials.map((item) => (
              <MetricCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Clean, modern SaaS-style metric card component
function MetricCard({ item }: { item: ItemWithBalance }) {
  // Simple heuristic for generic health: Yellow if 0, Red if negative, Green otherwise
  const isZero = item.stock_balance === 0;
  const isCritical = item.stock_balance < 0;

  return (
    <div className={`rounded-2xl border bg-surface p-5 shadow-sm transition-all hover:shadow-md ${isZero ? 'border-warning/30 hover:border-warning/50' : isCritical ? 'border-danger/30 hover:border-danger/50' : 'border-border hover:border-primary/20'}`}>
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-foreground/80 line-clamp-1">{item.name}</h3>
        {/* Status Indicator mapped to live stock checks */}
        <span className={`mt-1 flex h-2.5 w-2.5 rounded-full shrink-0 ring-4 ${isZero ? 'bg-warning ring-warning/20' : isCritical ? 'bg-danger ring-danger/20' : 'bg-success ring-success/20'}`}></span>
      </div>
      
      {/* Real Stock Quantity injected dynamically */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">
          {item.stock_balance.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-foreground/50 uppercase tracking-widest">Units</span>
      </div>
      
      <div className="mt-4 flex items-center gap-1.5 text-xs text-foreground/60">
        <div className={`px-2 py-0.5 rounded-md font-semibold border ${isZero ? 'bg-warning/10 text-warning border-warning/20' : isCritical ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'}`}>
          {isZero ? 'No Stock' : isCritical ? 'Critical' : 'Healthy'}
        </div>
        <span>stock level</span>
      </div>
    </div>
  );
}
