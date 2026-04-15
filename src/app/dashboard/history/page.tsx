import { createClient } from "@/lib/supabase/server";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();

  // Fetch all stock movements and join with items and users table via foreign keys!
  // Force cast `as any` to ignore strict typescript schema conflicts on complex joins
  const { data: rawMovements, error } = await (supabase.from("stock_movements") as any)
    .select(`
      id,
      quantity,
      type,
      reason,
      batch_number,
      date,
      items (name),
      users (email)
    `)
    .order("date", { ascending: false });

  if (error) {
    return <div className="p-8 text-danger">Failed to load history logs. Please check connection.</div>;
  }

  const movements = rawMovements || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">History Logs</h1>
        <p className="text-sm text-foreground/70 mt-1">A complete and unalterable audit trail of every stock movement.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/60 uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Item Name</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-center">Type</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider text-right">Quantity</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider">Batch No.</th>
                <th scope="col" className="px-6 py-5 font-semibold tracking-wider">User Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movements.map((movement: any) => {
                const dateObj = new Date(movement.date);
                const isIN = movement.type === "IN";

                return (
                  <tr key={movement.id} className="hover:bg-background/50 transition-colors">
                    {/* Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-foreground/90">
                      <div className="font-medium">
                        {dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-foreground/40 text-xs mt-0.5">
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    
                    {/* Object ID */}
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {movement.items?.name || "Unknown Item"}
                    </td>

                    {/* Color Coded Status Pills */}
                    <td className="px-6 py-4 align-middle text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border border-transparent ${
                        isIN 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-danger/10 text-danger border-danger/20"
                      }`}>
                        {isIN ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {movement.type}
                      </span>
                    </td>

                    {/* Big Numbers */}
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-foreground font-mono text-base tracking-tight">
                      {isIN ? "+" : "-"}{movement.quantity.toLocaleString()}
                    </td>

                    {/* Meta Reason */}
                    <td className="px-6 py-4 text-foreground/70">
                      {movement.reason || "-"}
                    </td>

                    {/* Batch Number */}
                    <td className="px-6 py-4 text-foreground/60 font-mono text-xs">
                      {movement.batch_number ? (
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold">{movement.batch_number}</span>
                      ) : (
                        <span className="italic text-foreground/30">—</span>
                      )}
                    </td>

                    {/* Auth Integration */}
                    <td className="px-6 py-4 text-foreground/60 text-xs">
                      {movement.users?.email || <span className="italic">System Process</span>}
                    </td>
                  </tr>
                );
              })}

              {movements.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-foreground/50">
                    No history logs found. Start logging inventory to populate this audit trail.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
