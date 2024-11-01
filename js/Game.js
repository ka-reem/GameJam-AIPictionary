class Game {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.currentWord = '';
        this.isActive = false;
        this.startDrawTime = 0;
        this.lastGuessTime = 0;
        this.timer = null;
        this.INITIAL_DELAY = 4000;
        this.MIN_GUESS_INTERVAL = 2000;
        this.MAX_GUESS_INTERVAL = 5000;
        this.guessTimer = null;
        this.lastRelevantColors = [];
        this.drawing = new Drawing(document.getElementById('canvas'));
        this.setupControls();
        this.guessedWords = new Set();
        this.isThinking = false;
    }

    setupControls() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('clearBtn').addEventListener('click', () => this.drawing.clear());
        document.getElementById('brushSize').addEventListener('input', (e) => 
            this.drawing.ctx.lineWidth = e.target.value
        );

        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => 
                    opt.classList.remove('selected')
                );
                option.classList.add('selected');
                this.drawing.ctx.strokeStyle = option.style.background;
            });
        });
    }

    start() {
        this.score = 0;
        this.guessedWords.clear();
        document.getElementById('score').textContent = 'Score: 0';
        this.startNewRound();
        document.getElementById('startBtn').textContent = 'New Word';
        if (this.guessTimer) clearInterval(this.guessTimer);
        this.lastRelevantColors = [];
    }

    startNewRound() {
        this.timeLeft = 30;
        this.currentWord = words[Math.floor(Math.random() * words.length)].word;
        document.getElementById('word').textContent = `Draw: ${this.currentWord}`;
        document.getElementById('message').textContent = 'Start drawing!';
        this.isActive = true;
        this.startDrawTime = 0;
        this.lastGuessTime = 0;
        this.drawing.clear();
        this.startTimer();
        this.startContinuousGuessing();
    }

    startContinuousGuessing() {
        if (this.guessTimer) clearInterval(this.guessTimer);
        
        const makeTimedGuess = () => {
            if (!this.isActive || this.isThinking) return;
            const currentColors = this.drawing.getUsedColors();
            if (currentColors.length > 0) {
                this.lastRelevantColors = currentColors;
            }
            const colorsToUse = currentColors.length > 0 ? currentColors : this.lastRelevantColors;
            if (colorsToUse.length > 0) {
                const matchedWord = findMatchingWord(colorsToUse);
                if (matchedWord && !this.guessedWords.has(matchedWord.word)) {
                    this.makeGuess(true);
                }
            }
            this.guessTimer = setTimeout(makeTimedGuess, 
                this.MIN_GUESS_INTERVAL + Math.random() * (this.MAX_GUESS_INTERVAL - this.MIN_GUESS_INTERVAL)
            );
        };
        makeTimedGuess();
    }

    makeGuess(isAutomatic = false) {
        if (!this.isActive || this.isThinking) return;
        const usedColors = this.drawing.getUsedColors();
        const colorsToUse = usedColors.length > 0 ? usedColors : this.lastRelevantColors;
        if (colorsToUse.length === 0) return;

        const matchedWord = findMatchingWord(colorsToUse);
        if (matchedWord && !this.guessedWords.has(matchedWord.word)) {
            this.lastGuessTime = Date.now();
            this.guessedWords.add(matchedWord.word);
            const currentWordObj = words.find(w => w.word === this.currentWord);
            
            if (matchedWord.word === currentWordObj.word) {
                this.isThinking = true;
                document.getElementById('message').textContent = "Hmm... I think I know what it is...";
                setTimeout(() => {
                    const message = successMessages[Math.floor(Math.random() * successMessages.length)]
                        .replace('{word}', this.currentWord);
                    document.getElementById('message').textContent = message;
                    this.score += this.timeLeft;
                    document.getElementById('score').textContent = `Score: ${this.score}`;
                    this.isActive = false;
                    this.isThinking = false;
                    this.drawing.clear();
                    clearInterval(this.timer);
                    setTimeout(() => this.startNewRound(), 2000);
                }, 1500);
                return;
            }

            const guesses = [
                `Is it a ${matchedWord.word}?`,
                `Hmm... maybe a ${matchedWord.word}?`,
                `Looks like a ${matchedWord.word}...`,
                `Could be a ${matchedWord.word}?`,
                isAutomatic ? `I'm thinking... ${matchedWord.word}?` : null,
                isAutomatic ? `Still guessing... ${matchedWord.word}?` : null
            ].filter(guess => guess !== null);
            document.getElementById('message').textContent = guesses[Math.floor(Math.random() * guesses.length)];
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                document.getElementById('message').textContent = `Time's up! The word was: ${this.currentWord}`;
                this.isActive = false;
                setTimeout(() => this.startNewRound(), 2000);
            }
        }, 1000);
    }
}

function getColors(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = {
        red: 0, green: 0, blue: 0, yellow: 0, brown: 0, 
        orange: 0, black: 0, white: 0, purple: 0
    };
    let totalPixels = 0;

    for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] > 20) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            totalPixels++;

            if (r < 60 && g < 60 && b < 60) colors.black++;
            else if (r > 200 && g > 200 && b > 200) colors.white++;
            else if (r > 180 && g < 100 && b < 100) colors.red++;
            else if (r < 100 && g > 150 && b < 100) colors.green++;
            else if (r > 180 && g > 180 && b < 100) colors.yellow++;
            else if (r < 100 && g < 100 && b > 180) colors.blue++;
            else if (r > 180 && g > 100 && b < 50) colors.orange++;
            else if (r > 120 && g < 100 && b < 50) colors.brown++;
            else if (r > 120 && g < 100 && b > 120) colors.purple++;
        }
    }

    return Object.entries(colors)
        .filter(([_, count]) => count / totalPixels > 0.03)
        .map(([color]) => color);
}

function findMatchingWord(detectedColors) {
    if (detectedColors.length === 0) return null;
    let bestMatch = null;
    let bestScore = 0;

    for (const wordObj of words) {
        const requiredColors = wordObj.colors;
        const matchingColors = detectedColors.filter(color => requiredColors.includes(color));
        const missingColors = requiredColors.filter(color => !detectedColors.includes(color));
        const extraColors = detectedColors.filter(color => !requiredColors.includes(color));

        const colorCoverage = matchingColors.length / requiredColors.length;
        const colorPrecision = matchingColors.length / detectedColors.length;
        const missingPenalty = missingColors.length * 0.15;
        const extraPenalty = extraColors.length * 0.08;
        const score = (colorCoverage * 0.7) + (colorPrecision * 0.3) - missingPenalty - extraPenalty;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = wordObj;
        }
    }

    return bestScore > 0.4 ? bestMatch : null;
}

const game = new Game();