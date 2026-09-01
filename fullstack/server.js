import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import path, { join } from 'node:path';
import { questions, dataCheck } from './controllers/quizController.js';
import { router } from './routes/route.js';
import { apiRouter } from './routes/api/quiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

const PORT = process.env.PORT_ASSIGNMENT || 3232;

dataCheck();

app.use('/', router);
app.use('/', apiRouter);

app.use((_req, res) => {
    res.status(404).send("CHECK URL");
});

app.listen(PORT, () => {
    console.log(`Running at http://localhost:${PORT}`);
});
