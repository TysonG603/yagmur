import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/cikis/actions";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-sky-800">
          Yağmur&apos;a Rezerve
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/kullanicilar" className="text-zinc-600 hover:text-sky-800">
                Kullanıcılar
              </Link>
              <Link href="/mesajlar" className="text-zinc-600 hover:text-sky-800">
                Mesajlar
              </Link>
              <Link href="/gruplar" className="text-zinc-600 hover:text-sky-800">
                Gruplar
              </Link>
              <Link
                href={`/profil/${user.username}`}
                className="text-zinc-600 hover:text-sky-800"
              >
                Profilim
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-600 hover:bg-zinc-50"
                >
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/giris" className="text-zinc-600 hover:text-sky-800">
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="rounded-md bg-sky-700 px-3 py-1.5 text-white hover:bg-sky-800"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
