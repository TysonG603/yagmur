import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterForm from "./register-form";

export const metadata = { title: "Kayıt Ol · Yağmur'a Rezerve" };

export default async function KayitPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/profil/" + user.username);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Hesap oluştur</h1>
        <p className="mt-1 text-sm text-zinc-500">
          İstediğin herhangi bir e-posta ve şifreyle hemen üye olabilirsin, doğrulama gerekmez.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="font-medium text-sky-700 hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
