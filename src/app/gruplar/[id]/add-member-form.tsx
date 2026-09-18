"use client";

import { useActionState, useRef, useEffect } from "react";
import { addMemberAction, type AddMemberState } from "./actions";

const initialState: AddMemberState = {};

export default function AddMemberForm({ groupId }: { groupId: string }) {
  const action = addMemberAction.bind(null, groupId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="mt-2 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="username"
          required
          maxLength={20}
          placeholder="kullanıcı adı"
          autoComplete="off"
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-60"
        >
          Ekle
        </button>
      </div>
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
