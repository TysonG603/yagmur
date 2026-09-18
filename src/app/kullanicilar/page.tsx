import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Kullanıcılar · Yağmur'a Rezerve" };

export default async function KullanicilarPage() {
  const currentUser = await requireUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, bio: true, createdAt: true },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold text-zinc-900">Kullanıcılar</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Profillerine ileti bırakabilir veya DM gönderebilirsin.
      </p>

      <ul className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3"
          >
            <div className="min-w-0">
              <Link
                href={`/profil/${u.username}`}
                className="font-medium text-zinc-900 hover:text-sky-800"
              >
                @{u.username}
              </Link>
              {u.bio && <p className="mt-0.5 text-sm text-zinc-500">{u.bio}</p>}
            </div>
            {u.username !== currentUser.username && (
              <Link
                href={`/mesajlar/${u.username}`}
                className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Mesaj gönder
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
