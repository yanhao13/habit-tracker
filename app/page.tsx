import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HabitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: habit } = await supabase
    .from("habits")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!habit) notFound();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <Link href="/dashboard" className="text-sm text-ember-600">
        ← Back to habits
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{habit.title}</h1>
      {habit.description && (
        <p className="mt-1 text-slate-500">{habit.description}</p>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Current streak</p>
        <p className="text-3xl font-bold text-ember-600">
          🔥 {habit.streak} {habit.streak === 1 ? "day" : "days"}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Last completed:{" "}
          {habit.last_completed_date
            ? new Date(habit.last_completed_date).toLocaleDateString()
            : "Never"}
        </p>
      </div>
    </main>
  );
}
