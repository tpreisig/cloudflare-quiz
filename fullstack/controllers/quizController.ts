import path, { join } from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const questionsPath = join(__dirname, '..', 'data', 'questions.json');

const questions = (await import(questionsPath, { with: { type: 'json' } })).default ?? [];

const dataCheck = () => {
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error(`${questionsPath} must be a non-empty JSON array`);
    }
    questions.forEach((q, i) => {
        if (typeof q.question !== 'string' || !q.question.trim()) {
            throw new Error(`Question ${i} is missing a "question" string`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
            throw new Error(`Question ${i} needs at least 2 options`);
        }
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
            throw new Error(`Question ${i} has an invalid "answer" index`);
        }
    });

}


export { questions, dataCheck };