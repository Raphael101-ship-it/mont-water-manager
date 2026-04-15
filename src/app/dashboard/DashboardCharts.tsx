"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function ProductionAreaChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-foreground/50">No production data for this window.</div>;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="color500" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="color330" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36}/>
          <Area type="monotone" dataKey="500ml" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#color500)" />
          <Area type="monotone" dataKey="330ml" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#color330)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MaterialBarChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-foreground/50">No material usage logged in this window.</div>;

  // Extract all dynamic material keys to generate Bars
  const keys = Array.from(new Set(data.flatMap(d => Object.keys(d).filter(k => k !== 'date'))));
  const colors = ["#f43f5e", "#8b5cf6", "#eab308", "#14b8a6", "#64748b", "#f97316"];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36}/>
          {keys.map((key, i) => (
             <Bar key={key} dataKey={key} stackId="a" fill={colors[i % colors.length]} radius={[i === keys.length - 1 ? 4 : 0, i === keys.length - 1 ? 4 : 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
