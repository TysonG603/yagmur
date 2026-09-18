import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import CreateGroupForm from "./create-group-form";

export const metadata = { title: "Gruplar · Yağmur'a Rezerve" };

export default async function GruplarPage() {
  const user = await requireUser();

  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true } },
      members: { where: { userId: user.id }, select: { userId: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold text-zinc-900">Gruplar</h1>

      <div className="mt-4">
        <CreateGroupForm />
      </div>

      <ul className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {groups.map((g) => (
          <li key={g.id}>
            <Link
              href={`/gruplar/${g.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">
                  {g.name}
                  {g.members.length > 0 && (
                    <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                      Üyesin
                    </span>
                  )}
                </p>
                {g.description && (
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{g.description}</p>
                )}
              </div>
              <span className="ml-3 shrink-0 text-xs text-zinc-400">
                {g._count.members} üye
              </span>
            </Link>
          </li>
        ))}
        {groups.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-zinc-400">
            Henüz grup yok. İlk grubu sen oluştur.
          </li>
        )}
      </ul>
    </div>
  );
}
