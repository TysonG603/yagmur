import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import AutoRefresh from "@/components/auto-refresh";
import MessageForm from "./message-form";

export default async function MesajThreadPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await requireUser();

  const other = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true },
  });

  if (!other || other.username === currentUser.username) {
    notFound();
  }

  await prisma.directMessage.updateMany({
    where: { senderId: other.id, recipientId: currentUser.id, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderId: currentUser.id, recipientId: other.id },
        { senderId: other.id, recipientId: currentUser.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
      <AutoRefresh />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">
          <Link href={`/profil/${other.username}`} className="hover:text-sky-800">
            @{other.username}
          </Link>
        </h1>
        <Link href="/mesajlar" className="text-sm text-zinc-500 hover:text-sky-800">
          Tüm mesajlar
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4">
        {messages.map((m) => {
          const mine = m.senderId === currentUser.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  mine ? "bg-sky-700 text-white" : "bg-zinc-100 text-zinc-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p
                  className={`mt-1 text-[11px] ${mine ? "text-sky-100" : "text-zinc-400"}`}
                >
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="m-auto text-sm text-zinc-400">Henüz mesaj yok, ilk mesajı sen gönder.</p>
        )}
      </div>

      <div className="mt-3">
        <MessageForm otherUsername={other.username} />
      </div>
    </div>
  );
}
