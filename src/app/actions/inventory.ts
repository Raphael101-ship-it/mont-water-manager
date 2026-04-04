"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logStockMovement(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // 1. Authenticate user securely
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to log stock movements.", success: false };
  }

  // 1.5 Ensure user exists in public.users to satisfy the Foreign Key constraint
  const { data: publicUser } = await supabase.from("users").select("id").eq("id", user.id).single();
  
  if (!publicUser) {
    // If they just signed up and aren't in the public table yet, insert them
    const { error: insertUserError } = await (supabase.from("users") as any).insert({
      id: user.id,
      email: user.email || "unknown@email.com",
      role: "admin"
    });
    
    if (insertUserError) {
      return { error: "Failed to verify user profile setup: " + insertUserError.message, success: false };
    }
  }

  // 2. Extract Data
  const itemId = formData.get("item_id") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const type = formData.get("type") as "IN" | "OUT";
  const reason = formData.get("reason") as string;
  const note = (formData.get("note") as string) || null;
  const dateStr = formData.get("date") as string;
  
  // Default to now if no date provided
  const date = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

  // 3. Validation
  if (!itemId || !quantity || !type || !reason) {
    return { error: "Missing required fields.", success: false };
  }
  if (quantity <= 0) {
    return { error: "Quantity must be greater than 0.", success: false };
  }

  // 4. Database Insertion
  const { error } = await (supabase.from("stock_movements") as any).insert({
    item_id: itemId,
    quantity,
    type,
    reason,
    note,
    date,
    user_id: user.id
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // 5. Instantly invalidate cache to update UI quantities!
  revalidatePath("/dashboard", "layout");
  
  return { error: null, success: true };
}
