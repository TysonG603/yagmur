# Yağmur'a Rezerve

Hesap oluşturma, profil iletileri, birebir DM ve grup mesajlaşması sunan basit bir sosyal uygulama.

## Özellikler

- **Hesap sistemi**: Doğrulama kodu gerektirmeden, herhangi bir e-posta ve şifreyle anında kayıt/giriş.
- **İleti**: Her kullanıcının profilinde, herkesin bırakabildiği genel duvar iletileri.
- **DM**: Kullanıcılar arası birebir mesajlaşma, okunmadı rozetiyle.
- **Gruplar**: Grup oluşturma, katılma/ayrılma ve sadece üyelerin görüp yazabildiği grup içi mesajlaşma.

## Teknolojiler

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io) + SQLite (`@prisma/adapter-better-sqlite3`)
- Oturumlar için imzalı JWT cookie ([jose](https://github.com/panva/jose)), şifreler için `bcryptjs`

## Kurulum

```bash
npm install
```

Proje kök dizininde bir `.env` dosyası oluştur:

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<rastgele-uzun-bir-gizli-anahtar>"
```

Veritabanını oluştur:

```bash
npx prisma migrate deploy
```

## Geliştirme sunucusu

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

## Build

```bash
npm run build
npm run start
```
