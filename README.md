# MNNews - MERN News Website

Монголын мэдээллийн портал. MERN stack (MongoDB, Express, React, Node.js) дээр суурилсан.

## Боломжууд

- Мэдээ унших, хайх, ангилалаар шүүх
- Админ самбар: мэдээ нэмэх, засах, устгах
- Ангилал удирдах
- Зураг оруулах (Multer)
- JWT authentication
- Pagination, trending, featured мэдээ
- Responsive дизайн (Tailwind CSS)

## Эхлүүлэх

### 1. MongoDB тохируулах

[MongoDB Atlas](https://www.mongodb.com/atlas) дээр үнэгүй cluster үүсгэ.

### 2. Backend

```bash
cd server
cp .env.example .env
# .env файлд MongoDB URI болон JWT secret оруул
npm install
npm run seed    # Жишээ дата оруулах (admin@mnnews.mn / admin123)
npm run dev     # http://localhost:5000
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm start       # http://localhost:3000
```

## Бүтэц

```
mern-news/
├── server/          # Backend API
│   ├── config/      # DB config
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth middleware
│   └── server.js    # Entry point
├── client/          # React Frontend
│   └── src/
│       ├── pages/       # Page components
│       ├── components/  # Reusable components
│       └── services/    # API calls
└── README.md
```

## API Endpoints

| Method | URL | Тайлбар |
|--------|-----|---------|
| POST | /api/auth/register | Бүртгүүлэх |
| POST | /api/auth/login | Нэвтрэх |
| GET | /api/news | Бүх мэдээ (pagination, search, filter) |
| GET | /api/news/trending | Trending мэдээ |
| GET | /api/news/:id | Нэг мэдээ |
| POST | /api/news | Мэдээ нэмэх (admin) |
| PUT | /api/news/:id | Мэдээ засах (admin) |
| DELETE | /api/news/:id | Мэдээ устгах (admin) |
| GET | /api/category | Бүх ангилал |
| POST | /api/category | Ангилал нэмэх (admin) |
| DELETE | /api/category/:id | Ангилал устгах (admin) |

## Deploy

- **Frontend:** Vercel эсвэл Netlify
- **Backend:** Render эсвэл Railway
- **Database:** MongoDB Atlas
