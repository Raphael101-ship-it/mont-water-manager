"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logProduction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in", success: false };

  const itemId = formData.get("item_id") as string;
  const bottleType = formData.get("bottle_type") as "500ml" | "330ml"; 
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const actionType = formData.get("action_type") as "add" | "replace";
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

  if (!itemId || !bottleType || !quantity || !actionType) {
    return { error: "Missing required fields", success: false };
  }

  // 1. Log explicitly to production_logs
  const { error: prodError } = await (supabase.from("production_logs") as any).insert({
    bottle_type: bottleType,
    quantity,
    date,
    action_type: actionType,
    user_id: user.id
  });

  if (prodError) return { error: prodError.message, success: false };

  // 2. Logic for strict "Replace Total" handling
  // If replacing, we must insert a neutralizing OUT movement to mathematically zero the stock exactly
  if (actionType === "replace") {
    const { data: rawMovements } = await (supabase.from("stock_movements") as any).select("quantity, type").eq("item_id", itemId);
    let currentStock = 0;
    
    const movements: any[] = rawMovements || [];
    movements.forEach((m) => {
      if (m.type === "IN") currentStock += m.quantity;
      else if (m.type === "OUT") currentStock -= m.quantity;
    });

    if (currentStock > 0) {
       await (supabase.from("stock_movements") as any).insert({
         item_id: itemId,
         quantity: currentStock,
         type: "OUT",
         reason: "Internal Use", // Mapping to existing constraint reasoning
         note: "System Auto-Zero for Daily Production Replacement",
         date,
         user_id: user.id
       });
    }
  }

  // 3. Insert the new IN movement representing the actual new production quantity
  const { error: stockError } = await (supabase.from("stock_movements") as any).insert({
    item_id: itemId,
    quantity,
    type: "IN",
    reason: "Production",
    note: `Daily production entry for ${bottleType}`,
    date,
    user_id: user.id
  });

  if (stockError) return { error: stockError.message, success: false };

  // 4. Instantly refresh any active dashboard viewers
  revalidatePath("/dashboard", "layout");
  return { error: null, success: true };
}
