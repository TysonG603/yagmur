"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/cikis/actions";

type MobileNavProps = {
  username: string | null;
};

export default function MobileNav({ username }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menüyü aç/kapat"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-10 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <nav className="flex flex-col gap-1 text-sm">
            {username ? (
              <>
                <Link
                  href="/kullanicilar"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Kullanıcılar
                </Link>
                <Link
                  href="/mesajlar"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Mesajlar
                </Link>
                <Link
                  href="/gruplar"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Gruplar
                </Link>
                <Link
                  href={`/profil/${username}`}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Profilim
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-md px-2 py-2 text-left text-zinc-700 hover:bg-zinc-50"
                  >
                    Çıkış
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
