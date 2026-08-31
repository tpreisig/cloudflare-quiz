import express from 'express';
import 'dotenv/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3232;

const app = express();

app.get('/', (_req, res) => {
    res.send('CLOUDFLARE QUIZ');
})

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));