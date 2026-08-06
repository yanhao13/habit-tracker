"use client";

import Link from "next/link";
import { useTransition } from "react";
import { markDone, deleteHabit } from "@/app/dashboard/actions";

type Habit = {
  id: string;
  title: string;
  description: string | null;
  streak: number;
  last_completed_date: string | null;
};

export default function HabitCard({ habit }: { habit: Habit }) {
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = habit.last_completed_date === today;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/habits/${habit.id}`}>
        <h3 className="font-semibold">{habit.title}</h3>
        {habit.description && (
          <p className="text-sm text-slate-500">{habit.description}</p>
        )}
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-ember-600">
          🔥 Streak: {habit.streak}
        </span>

        <div className="flex gap-2">
          <button
            disabled={isPending || doneToday}
            onClick={() => startTransition(() => markDone(habit.id))}
            className="rounded-lg bg-ember-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-ember-600 disabled:opacity-50"
          >
            {doneToday ? "Done today ✅" : "Mark done"}
          </button>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => deleteHabit(habit.id))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
