import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Kullanıcı adı en az 3 karakter olmalı")
  .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
  .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Geçerli bir e-posta adresi girin");

export const passwordSchema = z
  .string()
  .min(4, "Şifre en az 4 karakter olmalı")
  .max(200);

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Şifre gerekli"),
});

export const messageContentSchema = z
  .string()
  .trim()
  .min(1, "Mesaj boş olamaz")
  .max(2000, "Mesaj en fazla 2000 karakter olabilir");

export const groupNameSchema = z
  .string()
  .trim()
  .min(3, "Grup adı en az 3 karakter olmalı")
  .max(50, "Grup adı en fazla 50 karakter olabilir");

export const groupDescriptionSchema = z
  .string()
  .trim()
  .max(300, "Açıklama en fazla 300 karakter olabilir")
  .optional();
