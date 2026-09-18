"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { messageContentSchema } from "@/lib/validation";

export async function joinGroupAction(groupId: string): Promise<void> {
  const user = await requireUser();

  const group = await prisma.group.findUnique({ where: { id: groupId }, select: { id: true } });
  if (!group) return;

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId, userId: user.id } },
    update: {},
    create: { groupId, userId: user.id, role: "member" },
  });

  revalidatePath(`/gruplar/${groupId}`);
  revalidatePath("/gruplar");
}

export async function leaveGroupAction(groupId: string): Promise<void> {
  const user = await requireUser();

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });
  if (!group || group.ownerId === user.id) return;

  await prisma.groupMember.deleteMany({ where: { groupId, userId: user.id } });

  revalidatePath(`/gruplar/${groupId}`);
  revalidatePath("/gruplar");
}

export type PostGroupMessageState = { error?: string };

export async function postGroupMessageAction(
  groupId: string,
  _prevState: PostGroupMessageState,
  formData: FormData,
): Promise<PostGroupMessageState> {
  const user = await requireUser();

  const parsed = messageContentSchema.safeParse(formData.get("content"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz mesaj" };
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    select: { userId: true },
  });
  if (!membership) {
    return { error: "Mesaj göndermek için gruba üye olmalısın" };
  }

  await prisma.groupMessage.create({
    data: { content: parsed.data, groupId, senderId: user.id },
  });

  revalidatePath(`/gruplar/${groupId}`);
  return {};
}
