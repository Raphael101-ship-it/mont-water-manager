import { getDashboardAnalytics } from "@/lib/analytics";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { ProductionAreaChart, MaterialBarChart } from "./DashboardCharts";
import { Package, Droplet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { subDays } from "date-fns";

export default async function DashboardPage(props: { searchParams: Promise<{ from?: string, to?: string }> }) {
  const searchParams = await props.searchParams;
  
  // Parse Dates
  const defaultStartDate = subDays(new Date(), 5);
  const defaultEndDate = new Date();

  const startDate = searchParams.from ? new Date(searchParams.from as string) : defaultStartDate;
  const endDate = searchParams.to ? new Date(searchParams.to as string) : defaultEndDate;

  // Fetch Core Engine data
  const { totalProduced, totalMaterialsUsed, productionChartData, materialChartData, predictiveAlerts } = await getDashboardAnalytics(startDate, endDate);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Header & Date Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
        <div className="pl-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Analytics Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">V2.0 Predictive Forecasting & Production Algorithms</p>
        </div>
        <DateRangePicker />
      </div>

      {/* KPI Core Deck */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Metric 1 */}
        <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
          <div className="flex items-center gap-3 mb-4 text-blue-600 relative z-10">
            <div className="p-3 bg-blue-100 rounded-xl shadow-inner border border-blue-200/50">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-700 tracking-wide text-sm uppercase">Total Produced</h3>
          </div>
          <div className="relative z-10">
            <p className="text-[2.5rem] font-extrabold text-slate-800 leading-none">{totalProduced.toLocaleString()}</p>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">Bottles Manufactured</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/10"></div>
          <div className="flex items-center gap-3 mb-4 text-purple-600 relative z-10">
            <div className="p-3 bg-purple-100 rounded-xl shadow-inner border border-purple-200/50">
              <Droplet className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-700 tracking-wide text-sm uppercase">Burn Rate</h3>
          </div>
          <div className="relative z-10">
            <p className="text-[2.5rem] font-extrabold text-slate-800 leading-none">{totalMaterialsUsed.toLocaleString()}</p>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">Raw Materials Consumed</p>
          </div>
        </div>

        {/* Predictive Warning Metric */}
        <div className="bg-slate-800 rounded-[24px] p-6 border border-slate-700/50 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertTriangle className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Predictive Restock Alert</h3>
              </div>
            </div>

            {predictiveAlerts.length > 0 ? (
              <div className="space-y-3.5">
                {predictiveAlerts.map((alert, index) => (
                  <div key={alert.name} className={`flex justify-between items-center ${index !== predictiveAlerts.length - 1 ? 'border-b border-slate-700/50 pb-3' : ''}`}>
                    <div>
                      <p className="text-[13px] font-bold text-slate-200">{alert.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Stock: {alert.currentStock.toLocaleString()}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${alert.daysUntilEmpty <= 3 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                        {alert.daysUntilEmpty} Days Left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-emerald-400/90 mt-8 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <p className="font-bold text-sm">Inventory burn rate is completely stable. Generous runway available.</p>
              </div>
            )}
          </div>
          {/* Decorative background circle */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-slate-100/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-slate-50 rounded-[24px] p-6 lg:p-8 border border-slate-200 shadow-sm">
           <div className="mb-6 border-b border-slate-200/60 pb-4">
             <h3 className="text-xl font-extrabold text-slate-800">Production Velocity</h3>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Daily Manufactured Bottles</p>
           </div>
           <ProductionAreaChart data={productionChartData} />
        </div>
        
        <div className="bg-slate-50 rounded-[24px] p-6 lg:p-8 border border-slate-200 shadow-sm">
           <div className="mb-6 border-b border-slate-200/60 pb-4">
             <h3 className="text-xl font-extrabold text-slate-800">Material Burn Matrix</h3>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Raw Output Consumption</p>
           </div>
           <MaterialBarChart data={materialChartData} />
        </div>
      </div>

    </div>
  );
}
