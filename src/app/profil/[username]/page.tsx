import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import WallForm from "./wall-form";

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, bio: true, createdAt: true },
  });

  if (!owner) {
    notFound();
  }

  const wallPosts = await prisma.wallPost.findMany({
    where: { ownerId: owner.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { username: true } } },
    take: 100,
  });

  const isOwnProfile = currentUser?.username === owner.username;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-zinc-900">@{owner.username}</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Katılım: {formatDateTime(owner.createdAt)}
        </p>
        {owner.bio && <p className="mt-3 text-sm text-zinc-700">{owner.bio}</p>}

        {!isOwnProfile && currentUser && (
          <Link
            href={`/mesajlar/${owner.username}`}
            className="mt-4 inline-block rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            DM gönder
          </Link>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-zinc-700">İletiler</h2>

        {currentUser ? (
          <div className="mt-3">
            <WallForm ownerUsername={owner.username} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">
            İleti bırakmak için{" "}
            <Link href="/giris" className="text-sky-700 hover:underline">
              giriş yap
            </Link>
            .
          </p>
        )}

        <ul className="mt-4 flex flex-col gap-3">
          {wallPosts.map((post) => (
            <li key={post.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <Link
                  href={`/profil/${post.author.username}`}
                  className="text-sm font-medium text-zinc-900 hover:text-sky-800"
                >
                  @{post.author.username}
                </Link>
                <span className="text-xs text-zinc-400">
                  {formatDateTime(post.createdAt)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">
                {post.content}
              </p>
            </li>
          ))}
          {wallPosts.length === 0 && (
            <li className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-400">
              Henüz ileti yok.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
