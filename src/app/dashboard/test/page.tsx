import { createClient } from "@/lib/supabase/server";

export default async function TestConnectionPage() {
  const supabase = await createClient();
  
  // Fetching from the items table that we seeded earlier
  const { data: items, error } = await supabase.from("items").select("*");

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Supabase Connection Test</h1>
      
      {error ? (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger text-danger mb-6">
          <h2 className="font-bold">Error connecting:</h2>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-success bg-success/10 text-success mb-6 shadow-sm inline-flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span className="font-semibold text-lg">Connection Successful! Found {items?.length || 0} items.</span>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <ul className="divide-y divide-border">
          {items?.map((item) => (
            <li key={item.id} className="p-4 hover:bg-background transition-colors flex justify-between items-center">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {item.category}
              </span>
            </li>
          ))}
          {items?.length === 0 && (
            <li className="p-6 text-center text-foreground/50">
              No items found. Remember that you must be Logged In for the RLS policies to let you see data!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
