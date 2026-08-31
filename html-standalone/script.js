let currentQuestion = 0;
let score = 0;

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

function startQuiz() {
    currentQuestion = 0;
    score = 0;
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

function selectOption(selected) {
    const correct = questions[currentQuestion].answer;
    const options = optionsEl.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.classList.add(i === correct ? 'correct' : 'incorrect');
        opt.onclick = null; // Disable
    });
    if (selected === correct) score++;
    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showSection(result);
        scoreEl.textContent = `${score} / ${questions.length}`;
    }
}

function saveScore() {
    const username = document.getElementById('username').value.trim();
    if (!username) return alert('Enter a name!');
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name: username, score });
    highScores.sort((a, b) => b.score - a.score); // Sort descending
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10))); // Top 10
    showLeaderboard();
}

function showLeaderboard() {
    showSection(leaderboard);
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    scoresList.innerHTML = '';
    highScores.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.name}: ${s.score}`;
        scoresList.appendChild(li);
    });
}

function clearScores() {
    localStorage.removeItem('highScores');
    showLeaderboard();
}






const questions = [
    { question: "What is a Cloudflare Worker fundamentally?", options: ["A virtual machine that runs 24/7", "A lightweight serverless JavaScript function that executes on the edge"], answer: 1 },
    { question: "Where do Cloudflare Workers actually run?", options: ["Only in one giant data center in Virginia", "On Cloudflare's global edge network (+300 cities)"], answer: 1 },
    { question: "What is the free tier limit for Cloudflare Workers?", options: ["100,000 requests per month (with generous CPU time)", "100,000 requests per month"], answer: 0 },
    { question: "Which language can you not natively write a Cloudflare Worke in?", options: ["Java", "JavaScript/TypeScript"], answer: 0 },
    { question: "What is are Durable Objects", options: ["Stateful, globally coordinated objects that run on the edge", "A fance name for static files"], answer: 0 },
    { question: "Can Cloudflare Workers access a traditional file system?", options: ["No - they're stateless by design (use KV, R2, or D1 instead)", "Yes, like any normal server"], answer: 0 },
    { question: "What is Durable Objects?", options: ["Stateful, globally coordinated objects that run on the edge", "A fancy name for static files"], answer: 0 },
    { question: "Can Workers access a traditional file system?", options: ["No — they’re stateless by design (use KV, R2, or D1 instead)", "Yes, like any normal server"], answer: 0 },
    { question: "What does the edeg on edeg computing mean?", options: ["The bleeding edge of technology", "Physically close to the end user"], answer: 1 },
    { question: "Which storage option is best for simple key-value dat in Cloudflare Workers?", options: ["A PostgreSQL database you manage yourself", "Workers KV"], answer: 1 },
    { question: "What happens is your Cloudflare Worker execeeds CPU limits on the free plan?", options: ["It keeps running forever", "It gets terminated (but paid plans give more time)"], answer: 1 }
];
