# Server

1. `npm install`, then copy `.env.example` to `.env` (`cp` on Git Bash, `copy` on cmd/PowerShell) and set `MONGO_URI` + `JWT_SECRET`.
2. `npm run dev` (nodemon), then open <http://localhost:5000/api/health>, which should return `{"status":"ok"}`.
