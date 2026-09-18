"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendMessageAction, type SendMessageState } from "./actions";

const initialState: SendMessageState = {};

export default function MessageForm({ otherUsername }: { otherUsername: string }) {
  const action = sendMessageAction.bind(null, otherUsername);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="content"
          required
          maxLength={2000}
          placeholder="Bir mesaj yaz..."
          autoComplete="off"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
        >
          Gönder
        </button>
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
