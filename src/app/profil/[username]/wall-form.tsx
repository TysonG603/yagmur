"use client";

import { useActionState, useRef, useEffect } from "react";
import { postWallMessageAction, type WallPostState } from "./actions";

const initialState: WallPostState = {};

export default function WallForm({ ownerUsername }: { ownerUsername: string }) {
  const action = postWallMessageAction.bind(null, ownerUsername);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <textarea
        name="content"
        required
        maxLength={2000}
        rows={3}
        placeholder="Bir ileti bırak..."
        className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
      />
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-md bg-sky-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {pending ? "Gönderiliyor..." : "İleti gönder"}
      </button>
    </form>
  );
}
