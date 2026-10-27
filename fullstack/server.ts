import express, { Express, Request, Response } from 'express';
import https from 'https';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { dataCheck } from './controllers/quizController.js';
import { router } from './routes/route.js';
import { apiRouter } from './routes/api/quiz.js';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

const PORT = process.env.PORT_ASSIGNMENT || 3232;

dataCheck();

app.use('/', router);
app.use('/', apiRouter);

app.use((_req: Request, res: Response) => {
    res.status(404).send("CHECK URL");
});

const options = {
    key: fs.readFileSync(join(__dirname, 'certificates', 'localhost-key.pem')),
    cert: fs.readFileSync(join(__dirname, 'certificates', 'localhost.pem')),
}

https.createServer(options, app).listen(PORT, () => {
    console.log(`Application running on 'https://localhost:${PORT}'.`);
})

