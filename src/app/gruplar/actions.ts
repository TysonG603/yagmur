"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { groupNameSchema, groupDescriptionSchema } from "@/lib/validation";

export type CreateGroupState = { error?: string };

export async function createGroupAction(
  _prevState: CreateGroupState,
  formData: FormData,
): Promise<CreateGroupState> {
  const user = await requireUser();

  const nameParsed = groupNameSchema.safeParse(formData.get("name"));
  if (!nameParsed.success) {
    return { error: nameParsed.error.issues[0]?.message ?? "Geçersiz grup adı" };
  }

  const descriptionParsed = groupDescriptionSchema.safeParse(
    formData.get("description") || undefined,
  );
  if (!descriptionParsed.success) {
    return { error: descriptionParsed.error.issues[0]?.message ?? "Geçersiz açıklama" };
  }

  const existing = await prisma.group.findUnique({
    where: { name: nameParsed.data },
    select: { id: true },
  });
  if (existing) {
    return { error: "Bu isimde bir grup zaten var" };
  }

  const group = await prisma.group.create({
    data: {
      name: nameParsed.data,
      description: descriptionParsed.data || null,
      ownerId: user.id,
      members: { create: { userId: user.id, role: "owner" } },
    },
  });

  revalidatePath("/gruplar");
  redirect(`/gruplar/${group.id}`);
}
