import express from "express";
import path, { join } from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { questions } from "../controllers/quizController.js";

const router = express.Router();

router.get('/', (_req, res) => {
    res.sendFile(join(__dirname, '..', 'views', 'index.html'));
});

router.get('/questions', (_req, res) => {
    res.json(questions);
})

export { router };