import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCORES_FILE = join(__dirname, '..', 'data', 'scores.json');

const readScores = () => {
    try {
        const raw = readFileSync(SCORES_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading scores:', error);
        return [];
    }
};

const writeScores = (scores) => {
    mkdirSync(join(__dirname, '..', 'data'), { recursive: true });
    writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf-8');
};

const computeScore = (answers, questions = []) => {
    if (!Array.isArray(answers) || !Array.isArray(questions)) {
        return null;
    }

    if (answers.length !== questions.length) {
        return null;
    }

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) {
            score += 1;
        }
    }

    return score;
};

export { readScores, writeScores, computeScore };