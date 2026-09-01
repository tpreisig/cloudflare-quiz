import express from "express";
import { readScores, computeScore, writeScores } from "../../controllers/scoreController.js";
import { questions } from "../../controllers/quizController.js";

const apiRouter = express.Router();

// GET requests
apiRouter.get('/api/questions', (_req, res) => {
    res.json(
        questions.map(({ question, options }, id) => ({ id, question, options }))
    );
});

apiRouter.get('/api/scores', (_req, res) => {
    res.json(readScores());
});


// POST requests
apiRouter.post('/api/check', (req, res) => {
    try {
        const { index, selected } = req.body;
        if (
            typeof index !== 'number' ||
            index < 0 ||
            index >= questions.length ||
            typeof selected !== 'number'
        ) {
            return res.status(400).json({ error: 'Invalid answer payload' });
        }

        const correct = questions[index].answer;
        return res.json({ correct, isCorrect: selected === correct });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

apiRouter.post('/api/scores', (req, res) => {
    const { name, answers } = req.body ?? {};
    const safeName = typeof name === 'string' ? name.trim() : '';

    if (!safeName) {
        return res.status(400).json({ error: 'Name is required' });
    }

    if (!Array.isArray(answers) || answers.length !== questions.length) {
        return res.status(400).json({ error: 'Invalid answers array' });
    }

    const score = computeScore(answers, questions);
    if (score === null) {
        return res.status(400).json({ error: 'Invalid answers array' });
    }

    const scores = readScores();
    const newScores = [...scores, { name: safeName, score, total: questions.length }]
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    writeScores(newScores);
    return res.json(newScores);
});

// DELETE requests
apiRouter.delete('/api/scores', (_req, res) => {
    writeScores([]);
    return res.json([]);
});


export { apiRouter };