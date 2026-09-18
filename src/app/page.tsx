import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/profil/" + user.username);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Yağmur&apos;a Rezerve
      </h1>
      <p className="mt-4 max-w-md text-zinc-600">
        Hesabını oluştur, profiline ileti bırak, arkadaşlarınla DM üzerinden yazış ve
        gruplar kur.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Link
          href="/kayit"
          className="rounded-md bg-sky-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-800"
        >
          Hemen üye ol
        </Link>
        <Link
          href="/giris"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-white"
        >
          Giriş yap
        </Link>
      </div>
    </div>
  );
}
