"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">🔥 Habit Tracker</h1>
        <p className="mb-6 text-sm text-slate-500">
          Sign in with a magic link — no password needed.
        </p>

        {status === "sent" ? (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Check your inbox for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-ember-500 px-3 py-2 text-sm font-medium text-white hover:bg-ember-600 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
