# NEOTIK v3 — GitHub + Vercel

Versi ini menggunakan:
- Frontend static
- Vercel Serverless Function di `api/tiktok-stalk.js`
- GitHub sebagai repository/source
- Vercel sebagai hosting

## 1. Upload ke GitHub

Buat repository baru, lalu upload seluruh isi folder ini ke repository.

## 2. Deploy ke Vercel

Di Vercel pilih **Add New Project** → import repository GitHub tersebut → Deploy.

Tidak perlu VPS dan tidak perlu `npm start`.

## 3. Atur popup kunci

Buka `script.js`, cari:

```js
const GATE_CONFIG = {
  channelUrl: "https://whatsapp.com/channel/REPLACE_WITH_YOUR_CHANNEL",
  shareText: "Cek profil TikTok ini di NEOTIK: " + window.location.origin
};
```

Ganti `channelUrl` dengan link saluran WhatsApp milikmu.

Tombol **Share ke Teman** memakai Web Share API pada perangkat yang mendukungnya. Jika tidak tersedia, akan membuka WhatsApp share.

Catatan: popup ini adalah access gate berbasis browser. Klik tombol tidak dapat memverifikasi secara teknis apakah seseorang benar-benar follow saluran atau mengirim share; status 2/2 hanya menandai bahwa kedua langkah telah dijalankan.

## 4. Reset popup

Popup menyimpan status unlock di localStorage. Untuk menampilkan lagi, hapus site data/localStorage browser, atau hapus key `neotik_gate_v3` dari `script.js` jika ingin mengubah perilakunya.

## Scraper

API tetap mengambil data profil publik dari `user.tikmatrix.com`. Struktur HTML situs sumber dapat berubah sehingga selector scraper mungkin perlu diperbarui.
