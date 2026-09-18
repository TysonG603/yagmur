"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { messageContentSchema } from "@/lib/validation";

export type WallPostState = { error?: string };

export async function postWallMessageAction(
  ownerUsername: string,
  _prevState: WallPostState,
  formData: FormData,
): Promise<WallPostState> {
  const author = await requireUser();

  const parsed = messageContentSchema.safeParse(formData.get("content"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz ileti" };
  }

  const owner = await prisma.user.findUnique({
    where: { username: ownerUsername },
    select: { id: true },
  });
  if (!owner) {
    return { error: "Kullanıcı bulunamadı" };
  }

  await prisma.wallPost.create({
    data: { content: parsed.data, ownerId: owner.id, authorId: author.id },
  });

  revalidatePath(`/profil/${ownerUsername}`);
  return {};
}
