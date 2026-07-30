# Alumni Association Platform — Full Project

A complete full-stack Alumni Association Platform.
Backend: Node.js + Express + MongoDB (Atlas) + JWT + bcrypt.
Frontend: Vanilla HTML/CSS/JS (no framework, no build step).

## What's included

- Authentication (register, login, JWT, protected routes, basic forgot/reset password)
- Alumni Profile (view, edit, delete account, upload profile photo)
- Dashboard (total alumni, upcoming events, latest jobs, recent alumni)
- Alumni Search (name, department, graduation year, company, location filters + pagination)
- Events (create, view, register, delete)
- Job Portal (post, view, apply, delete)
- Networking (send / accept / reject connection requests, connected list)
- Contact page (public contact form)

## 1. Extract & open

Extract this ZIP somewhere simple, e.g. `Downloads\alumni-platform`.
Make sure the path looks like `Downloads\alumni-platform\backend\server.js`
(no doubled `alumni-platform\alumni-platform\...` folder — if your extractor
created that, move the inner folder's contents up one level).

Open the `alumni-platform` folder in VS Code.

## 2. Backend setup

```
cd backend
```

Rename `.env.example` to `.env`, then open it and:
- Replace `<your_username>` and `<your_password>` in `MONGO_URI` with your
  own MongoDB Atlas database user credentials (Atlas -> Database Access).
- Leave `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` as they are
  (or change them if you want).

Install dependencies and start the server:
```
npm install
npm start
```

You should see:
```
Server running on http://localhost:5000
MongoDB Connected: ...
```

If you get a MongoDB connection error, check:
- Atlas -> Network Access -> IP Access List has `0.0.0.0/0` (allow from anywhere)
- Your Atlas database user password is correct and doesn't need extra URL-encoding
- Your Atlas cluster is not paused

## 3. Frontend setup

The frontend is plain HTML/CSS/JS — no build step needed. Because it makes
API calls to `http://localhost:5000`, open it through a local server (not by
double-clicking the file) to avoid CORS issues:

- In VS Code, install the **Live Server** extension
- Right-click `frontend/index.html` -> **Open with Live Server**
- It will open at something like `http://127.0.0.1:5500`

Make sure the backend (`npm start` in the `backend` folder) is running at
the same time.

## 4. Try it out

1. Go to the Register page, create an account
2. You'll land on the Dashboard
3. Edit your profile, upload a photo
4. Create an event, post a job
5. Open the Search page, use "Connect" to send a connection request
   (register a second test account in an incognito window to test
   accepting/rejecting requests from the Network page)

## Project structure

```
alumni-platform/
├── backend/
│   ├── config/db.js
│   ├── controllers/       (auth, profile, alumni, event, job, connection, dashboard, contact)
│   ├── middleware/        (auth, error handling, file upload)
│   ├── models/            (User, Event, Job, Connection, Contact)
│   ├── routes/
│   ├── utils/generateToken.js
│   ├── uploads/           (profile photos land here)
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── css/style.css
    ├── js/                (config, auth, sidebar + one file per page)
    ├── pages/              (13+ HTML pages)
    └── index.html
```

## REST API reference

| Method | Endpoint                     | Auth | Description                  |
|--------|-------------------------------|------|-------------------------------|
| POST   | /api/auth/register             | No   | Register                     |
| POST   | /api/auth/login                | No   | Login                        |
| GET    | /api/auth/me                   | Yes  | Current user                 |
| POST   | /api/auth/forgot-password       | No   | Get a reset token             |
| PUT    | /api/auth/reset-password        | No   | Reset password with token     |
| GET    | /api/profile                    | Yes  | My profile                   |
| PUT    | /api/profile                    | Yes  | Update my profile            |
| DELETE | /api/profile                    | Yes  | Delete my account            |
| PUT    | /api/profile/photo               | Yes  | Upload profile photo (form-data) |
| GET    | /api/profile/:id                 | Yes  | View another alumnus's profile |
| GET    | /api/alumni                      | Yes  | Paginated alumni list        |
| GET    | /api/search                      | Yes  | Search alumni with filters   |
| GET    | /api/dashboard                   | Yes  | Dashboard summary            |
| POST/GET | /api/events                     | Yes  | Create / list events          |
| GET/PUT/DELETE | /api/events/:id             | Yes  | Event details / edit / delete |
| POST   | /api/events/:id/register          | Yes  | Register for an event         |
| POST/GET | /api/jobs                       | Yes  | Post / list jobs              |
| GET/PUT/DELETE | /api/jobs/:id                | Yes  | Job details / edit / delete   |
| POST   | /api/jobs/:id/apply                | Yes  | Apply to a job                |
| POST/GET | /api/connections                 | Yes  | Send request / list connections |
| PUT    | /api/connections/:id/accept        | Yes  | Accept request                |
| PUT    | /api/connections/:id/reject        | Yes  | Reject request                |
| POST   | /api/contact                      | No   | Submit contact form           |

## Security note

Never commit or share your real `.env` file — anyone who sees your MongoDB
username/password can access and modify your database. `.gitignore` already
excludes `.env` and `node_modules/` from version control.
