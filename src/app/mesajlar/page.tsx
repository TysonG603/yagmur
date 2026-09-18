import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Mesajlar · Yağmur'a Rezerve" };

export default async function MesajlarPage() {
  const user = await requireUser();

  const messages = await prisma.directMessage.findMany({
    where: { OR: [{ senderId: user.id }, { recipientId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { username: true } },
      recipient: { select: { username: true } },
    },
    take: 300,
  });

  const conversations = new Map<
    string,
    { username: string; lastContent: string; lastAt: Date; unread: boolean }
  >();

  for (const m of messages) {
    const otherUsername = m.senderId === user.id ? m.recipient.username : m.sender.username;
    if (!conversations.has(otherUsername)) {
      conversations.set(otherUsername, {
        username: otherUsername,
        lastContent: m.content,
        lastAt: m.createdAt,
        unread: m.recipientId === user.id && !m.readAt,
      });
    }
  }

  const list = Array.from(conversations.values());

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold text-zinc-900">Mesajlar</h1>

      <ul className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {list.map((c) => (
          <li key={c.username}>
            <Link
              href={`/mesajlar/${c.username}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">
                  @{c.username}
                  {c.unread && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-sky-600 align-middle" />
                  )}
                </p>
                <p className="mt-0.5 truncate text-sm text-zinc-500">{c.lastContent}</p>
              </div>
              <span className="ml-3 shrink-0 text-xs text-zinc-400">
                {formatDateTime(c.lastAt)}
              </span>
            </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-zinc-400">
            Henüz mesajın yok.{" "}
            <Link href="/kullanicilar" className="text-sky-700 hover:underline">
              Kullanıcılara göz at
            </Link>
            .
          </li>
        )}
      </ul>
    </div>
  );
}
