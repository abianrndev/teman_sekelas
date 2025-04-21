# Backend Teman Satu Kelas

Backend untuk aplikasi web "Teman Satu Kelas" yang memungkinkan mahasiswa berbagi ringkasan materi kuliah dalam satu kelas.

## Teknologi yang Digunakan

- Node.js
- Express.js
- MySQL
- JWT untuk autentikasi
- Multer untuk upload file

## Instalasi

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` dan isi dengan konfigurasi yang sesuai:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=teman_satu_kelas
   JWT_SECRET=rahasia123
   PORT=5000
   ```
4. Import database schema dari file `database.sql`
5. Jalankan server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Autentikasi
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profil user

### Ringkasan
- `POST /api/summaries` - Buat ringkasan baru
- `GET /api/summaries/class/:classCode` - Get semua ringkasan dalam satu kelas
- `GET /api/summaries/:id` - Get detail ringkasan
- `PUT /api/summaries/:id` - Update ringkasan
- `DELETE /api/summaries/:id` - Hapus ringkasan

### Komentar
- `POST /api/comments` - Buat komentar baru
- `GET /api/comments/summary/:summaryId` - Get semua komentar untuk satu ringkasan
- `PUT /api/comments/:id` - Update komentar
- `DELETE /api/comments/:id` - Hapus komentar

## Struktur Database

### Users
- id (INT, PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR)
- password (VARCHAR)
- class_code (VARCHAR)
- created_at (TIMESTAMP)

### Summaries
- id (INT, PRIMARY KEY)
- title (VARCHAR)
- course (VARCHAR)
- meeting_number (INT)
- description (TEXT)
- file_path (VARCHAR)
- user_id (INT, FOREIGN KEY)
- class_code (VARCHAR)
- created_at (TIMESTAMP)

### Comments
- id (INT, PRIMARY KEY)
- content (TEXT)
- summary_id (INT, FOREIGN KEY)
- user_id (INT, FOREIGN KEY)
- created_at (TIMESTAMP) 