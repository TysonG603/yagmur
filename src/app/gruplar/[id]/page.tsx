import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import AutoRefresh from "@/components/auto-refresh";
import GroupMessageForm from "./group-message-form";
import { joinGroupAction, leaveGroupAction } from "./actions";

export default async function GrupDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      owner: { select: { username: true } },
      members: {
        orderBy: { joinedAt: "asc" },
        include: { user: { select: { username: true } } },
      },
    },
  });

  if (!group) {
    notFound();
  }

  const isMember = group.members.some((m) => m.userId === user.id);
  const isOwner = group.ownerId === user.id;

  const messages = isMember
    ? await prisma.groupMessage.findMany({
        where: { groupId: id },
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { username: true } } },
        take: 500,
      })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      {isMember && <AutoRefresh />}

      <div className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{group.name}</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kurucu: @{group.owner.username} · {group.members.length} üye
          </p>
          {group.description && (
            <p className="mt-3 text-sm text-zinc-700">{group.description}</p>
          )}
        </div>

        {!isMember && (
          <form action={joinGroupAction.bind(null, group.id)}>
            <button
              type="submit"
              className="shrink-0 rounded-md bg-sky-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-800"
            >
              Katıl
            </button>
          </form>
        )}
        {isMember && !isOwner && (
          <form action={leaveGroupAction.bind(null, group.id)}>
            <button
              type="submit"
              className="shrink-0 rounded-md border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Ayrıl
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 grid flex-1 grid-cols-1 gap-6 sm:grid-cols-[1fr_180px]">
        <div className="flex flex-1 flex-col">
          {isMember ? (
            <>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4">
                {messages.map((m) => {
                  const mine = m.senderId === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          mine ? "bg-sky-700 text-white" : "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {!mine && (
                          <p className="mb-0.5 text-xs font-medium text-sky-700">
                            @{m.sender.username}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            mine ? "text-sky-100" : "text-zinc-400"
                          }`}
                        >
                          {formatDateTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <p className="m-auto text-sm text-zinc-400">
                    Henüz mesaj yok, ilk mesajı sen gönder.
                  </p>
                )}
              </div>

              <div className="mt-3">
                <GroupMessageForm groupId={group.id} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400">
              Grup mesajlarını görmek ve yazmak için gruba katılmalısın.
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Üyeler
          </h2>
          <ul className="mt-2 flex flex-col gap-1">
            {group.members.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/profil/${m.user.username}`}
                  className="text-sm text-zinc-700 hover:text-sky-800"
                >
                  @{m.user.username}
                  {m.role === "owner" && (
                    <span className="ml-1 text-xs text-zinc-400">(kurucu)</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
