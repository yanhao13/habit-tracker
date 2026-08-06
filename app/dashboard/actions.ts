"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createHabit(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title) throw new Error("Title is required");

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    title,
    description,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function markDone(habitId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: habit, error: fetchError } = await supabase
    .from("habits")
    .select("streak, last_completed_date")
    .eq("id", habitId)
    .single();

  if (fetchError || !habit) throw new Error("Habit not found");

  const today = new Date().toISOString().slice(0, 10);

  if (habit.last_completed_date === today) {
    return; // already marked done today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreak =
    habit.last_completed_date === yesterdayStr ? habit.streak + 1 : 1;

  const { error } = await supabase
    .from("habits")
    .update({ streak: newStreak, last_completed_date: today })
    .eq("id", habitId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath(`/habits/${habitId}`);
}

export async function deleteHabit(habitId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("habits").delete().eq("id", habitId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
