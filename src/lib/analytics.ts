import { createClient } from "@/lib/supabase/server";
import { format, differenceInDays } from "date-fns";
import { getInventoryWithBalances } from "./supabase/inventory";

export async function getDashboardAnalytics(startDate: Date, endDate: Date) {
  const supabase = await createClient();
  
  // Set start of day and end of day implicitly based on pure dates
  const fromStr = new Date(startDate.setHours(0,0,0,0)).toISOString();
  const toStr = new Date(endDate.setHours(23,59,59,999)).toISOString();

  // 1. Fetch Production Data (Bottles Produced)
  const { data } = await supabase
    .from("production_logs")
    .select("bottle_type, quantity, date")
    .gte("date", fromStr)
    .lte("date", toStr);
  const productionLogs = data as any[];

  const dailyProduction: Record<string, { date: string; "500ml": number; "330ml": number }> = {};
  let totalProduced = 0;

  productionLogs?.forEach((log) => {
    const day = format(new Date(log.date), "MMM dd");
    if (!dailyProduction[day]) {
      dailyProduction[day] = { date: day, "500ml": 0, "330ml": 0 };
    }
    // @ts-ignore
    dailyProduction[day][log.bottle_type as "500ml" | "330ml"] += log.quantity;
    totalProduced += log.quantity;
  });

  const productionChartData = Object.values(dailyProduction).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 2. Fetch Raw Material Usage
  const { data: smData } = await supabase
    .from("stock_movements")
    .select("quantity, date, items(name, category)")
    .eq("type", "OUT")
    .in("reason", ["Production", "Internal Use", "Sales"])
    .gte("date", fromStr)
    .lte("date", toStr);
  const stockMovements = smData as any[];

  const dailyUsage: Record<string, any> = {};
  let totalMaterialsUsed = 0;

  stockMovements?.forEach((mov) => {
    // @ts-ignore
    const item = mov.items;
    
    if (item && item.category === "Raw Material") {
      const day = format(new Date(mov.date), "MMM dd");
      if (!dailyUsage[day]) {
        dailyUsage[day] = { date: day };
      }
      if (!dailyUsage[day][item.name]) {
        dailyUsage[day][item.name] = 0;
      }
      dailyUsage[day][item.name] += mov.quantity;
      totalMaterialsUsed += mov.quantity;
    }
  });

  const materialChartData = Object.values(dailyUsage).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 3. Predictive Engine
  const daysDiff = Math.max(1, differenceInDays(endDate, startDate));
  
  const burnRates: Record<string, number> = {};
  stockMovements?.forEach((mov) => {
    // @ts-ignore
     const item = mov.items;
     if (item && item.category === "Raw Material") {
       burnRates[item.name] = (burnRates[item.name] || 0) + mov.quantity;
     }
  });

  Object.keys(burnRates).forEach(k => {
    burnRates[k] = burnRates[k] / daysDiff;
  });

  const currentStock = await getInventoryWithBalances();
  
  const predictiveAlerts = currentStock
    .filter(i => i.category === "Raw Material" && burnRates[i.name])
    .map(i => {
      const dailyBurn = burnRates[i.name];
      const daysUntilEmpty = Math.floor(i.stock_balance / dailyBurn);
      return {
        name: i.name,
        currentStock: i.stock_balance,
        dailyBurn,
        daysUntilEmpty
      };
    })
    .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);

  return {
    totalProduced,
    totalMaterialsUsed,
    productionChartData,
    materialChartData,
    predictiveAlerts
  };
}
