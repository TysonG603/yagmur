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

export type AddMemberState = { error?: string };

export async function addMemberAction(
  groupId: string,
  _prevState: AddMemberState,
  formData: FormData,
): Promise<AddMemberState> {
  const user = await requireUser();

  const usernameRaw = formData.get("username");
  const username = typeof usernameRaw === "string" ? usernameRaw.trim() : "";
  if (!username) {
    return { error: "Kullanıcı adı gerekli" };
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    select: { role: true },
  });
  if (!membership || membership.role === "member") {
    return { error: "Üye eklemek için grup yöneticisi veya kurucusu olmalısın" };
  }

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!target) {
    return { error: "Bu kullanıcı adında biri bulunamadı" };
  }

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: target.id } },
    select: { userId: true },
  });
  if (existing) {
    return { error: "Bu kullanıcı zaten grupta" };
  }

  await prisma.groupMember.create({
    data: { groupId, userId: target.id, role: "member" },
  });

  revalidatePath(`/gruplar/${groupId}`);
  revalidatePath("/gruplar");
  return {};
}

export async function removeMemberAction(groupId: string, targetUserId: string): Promise<void> {
  const user = await requireUser();
  if (targetUserId === user.id) return;

  const [actor, target] = await Promise.all([
    prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
      select: { role: true },
    }),
    prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: targetUserId } },
      select: { role: true },
    }),
  ]);
  if (!actor || !target || actor.role === "member") return;
  if (target.role === "owner") return;
  if (actor.role === "admin" && target.role === "admin") return;

  await prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId: targetUserId } } });

  revalidatePath(`/gruplar/${groupId}`);
  revalidatePath("/gruplar");
}

export async function setMemberRoleAction(
  groupId: string,
  targetUserId: string,
  role: "admin" | "member",
): Promise<void> {
  const user = await requireUser();

  const group = await prisma.group.findUnique({ where: { id: groupId }, select: { ownerId: true } });
  if (!group || group.ownerId !== user.id) return;
  if (targetUserId === group.ownerId) return;

  const target = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
    select: { role: true },
  });
  if (!target || target.role === "owner") return;

  await prisma.groupMember.update({
    where: { groupId_userId: { groupId, userId: targetUserId } },
    data: { role },
  });

  revalidatePath(`/gruplar/${groupId}`);
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
