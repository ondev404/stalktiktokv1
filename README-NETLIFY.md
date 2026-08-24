# NEOTIK — Netlify Edition

## Deploy paling mudah

1. Extract ZIP ini.
2. Masuk ke Netlify.
3. Pilih **Add new project / Deploy manually**.
4. Upload folder `NEOTIK-Netlify` (atau ZIP sesuai opsi upload yang tersedia).
5. Netlify akan membaca `netlify.toml`.
6. Setelah selesai, buka URL Netlify kamu.

## Jika deploy melalui GitHub

Upload seluruh isi folder ke repository, lalu import repository tersebut ke Netlify.

Tidak perlu menjalankan `npm start`.

Netlify akan menggunakan:
- Frontend: file di root
- API: `netlify/functions/tiktok-stalk.js`
- Route API: `/api/tiktok/stalk`

## Catatan

Function mengambil data dari `https://user.tikmatrix.com`. Jika struktur HTML situs sumber berubah atau situs tersebut memblokir request serverless, selector/API perlu disesuaikan.

Gunakan hanya untuk informasi profil publik dan sesuai ketentuan layanan situs yang bersangkutan.
