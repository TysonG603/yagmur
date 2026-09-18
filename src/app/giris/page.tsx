import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata = { title: "Giriş Yap · Yağmur'a Rezerve" };

export default async function GirisPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/profil/" + user.username);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Giriş yap</h1>
        <p className="mt-1 text-sm text-zinc-500">Hesabına e-posta ve şifrenle giriş yap.</p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-medium text-sky-700 hover:underline">
            Hemen oluştur
          </Link>
        </p>
      </div>
    </div>
  );
}
