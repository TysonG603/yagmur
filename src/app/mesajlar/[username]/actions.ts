"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { messageContentSchema } from "@/lib/validation";

export type SendMessageState = { error?: string };

export async function sendMessageAction(
  otherUsername: string,
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const sender = await requireUser();

  const parsed = messageContentSchema.safeParse(formData.get("content"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz mesaj" };
  }

  if (otherUsername === sender.username) {
    return { error: "Kendine mesaj gönderemezsin" };
  }

  const recipient = await prisma.user.findUnique({
    where: { username: otherUsername },
    select: { id: true },
  });
  if (!recipient) {
    return { error: "Kullanıcı bulunamadı" };
  }

  await prisma.directMessage.create({
    data: { content: parsed.data, senderId: sender.id, recipientId: recipient.id },
  });

  revalidatePath(`/mesajlar/${otherUsername}`);
  revalidatePath("/mesajlar");
  return {};
}
