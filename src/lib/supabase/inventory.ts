import { createClient } from "./server";

export type ItemWithBalance = {
  id: string;
  name: string;
  category: "Finished Good" | "Raw Material";
  stock_balance: number;
};

export async function getInventoryWithBalances(): Promise<ItemWithBalance[]> {
  const supabase = await createClient();
  
  const { data: rawItems, error: itemsError } = await supabase.from("items").select("*");
  if (itemsError || !rawItems) throw new Error("Failed to fetch items.");
  
  // Force cast so TS compilation doesn't fail on reduce
  const items: any[] = rawItems;

  const { data: rawMovements, error: movementsError } = await supabase.from("stock_movements").select("item_id, quantity, type");
  if (movementsError || !rawMovements) return items.map(i => ({ ...i, stock_balance: 0 }));

  const movements: any[] = rawMovements;

  const balanceMap = movements.reduce((acc, movement) => {
    if (!acc[movement.item_id]) acc[movement.item_id] = 0;
    
    if (movement.type === "IN") {
      acc[movement.item_id] += movement.quantity;
    } else if (movement.type === "OUT") {
      acc[movement.item_id] -= movement.quantity;
    }
    
    return acc;
  }, {} as Record<string, number>);

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    stock_balance: balanceMap[item.id] || 0,
  }));
}
