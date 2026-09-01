let questions = [];
let currentQuestion = 0;
let score = 0;
let answers = [];

const home = document.querySelector('.home');
const quiz = document.querySelector('.quiz');
const result = document.querySelector('.result');
const leaderboard = document.querySelector('.leaderboard');
const startBtn = document.getElementById('start-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const nextBtn = document.getElementById('next-btn');
const saveScoreBtn = document.getElementById('save-score');
const homeBtn = document.getElementById('home-btn');
const clearScoresBtn = document.getElementById('clear-scores');
const backBtn = document.getElementById('back-btn');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const scoresList = document.getElementById('scores-list');
const saveError = document.getElementById('save-error');

startBtn.addEventListener('click', startQuiz);
leaderboardBtn.addEventListener('click', showLeaderboard);
nextBtn.addEventListener('click', nextQuestion);
saveScoreBtn.addEventListener('click', saveScore);
homeBtn.addEventListener('click', () => showSection(home));
clearScoresBtn.addEventListener('click', clearScores);
backBtn.addEventListener('click', () => showSection(home));

function showSection(section) {
    [home, quiz, result, leaderboard].forEach(s => s.classList.remove('active'));
    section.classList.add('active');
}

async function startQuiz() {
    const res = await fetch('/api/questions');
    questions = await res.json();
    currentQuestion = 0;
    score = 0;
    answers = [];
    showSection(quiz);
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.classList.add('option');
        div.textContent = opt;
        div.onclick = () => selectOption(i);
        optionsEl.appendChild(div);
    });
    nextBtn.disabled = true;
}

async function selectOption(selected) {
    const options = optionsEl.querySelectorAll('.option');
    options.forEach(opt => { opt.onclick = null; });

    const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: currentQuestion, selected })
    });
    const { correct, isCorrect } = await res.json();

    options.forEach((opt, i) => {
        opt.classList.add(i === correct ? 'correct' : 'incorrect');
    });

    answers[currentQuestion] = selected;
    if (isCorrect) score++;
    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showSection(result);
        scoreEl.textContent = `${score} / ${questions.length}`;
        document.getElementById('username').value = '';
        saveError.textContent = '';
    }
}

async function saveScore() {
    const username = document.getElementById('username').value.trim();
    saveError.textContent = '';
    if (!username) {
        saveError.textContent = 'Enter a name!';
        return;
    }
    const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, answers })
    });
    const data = await res.json();
    if (!res.ok) {
        saveError.textContent = data.error || 'Could not save score';
        return;
    }
    renderScores(data);
    showSection(leaderboard);
}

async function showLeaderboard() {
    showSection(leaderboard);
    const res = await fetch('/api/scores');
    renderScores(await res.json());
}

function renderScores(highScores) {
    scoresList.innerHTML = '';
    if (!highScores.length) {
        const li = document.createElement('li');
        li.textContent = 'No scores yet — be the first!';
        scoresList.appendChild(li);
        return;
    }
    highScores.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.name}: ${s.score}${s.total ? ' / ' + s.total : ''}`;
        scoresList.appendChild(li);
    });
}

async function clearScores() {
    const res = await fetch('/api/scores', { method: 'DELETE' });
    renderScores(await res.json());
}