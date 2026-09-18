"use client";

import { useActionState } from "react";
import { createGroupAction, type CreateGroupState } from "./actions";

const initialState: CreateGroupState = {};

export default function CreateGroupForm() {
  const [state, formAction, pending] = useActionState(createGroupAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-700">Yeni grup oluştur</h2>
      <input
        name="name"
        required
        minLength={3}
        maxLength={50}
        placeholder="Grup adı"
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
      />
      <textarea
        name="description"
        maxLength={300}
        rows={2}
        placeholder="Açıklama (opsiyonel)"
        className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
      />
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-sky-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {pending ? "Oluşturuluyor..." : "Grubu oluştur"}
      </button>
    </form>
  );
}
