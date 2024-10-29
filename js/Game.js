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
        this.MIN_GUESS_INTERVAL = 1000;
        this.MAX_GUESS_INTERVAL = 3500;

        this.drawing = new Drawing(document.getElementById('canvas'));
        this.setupControls();
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
        document.getElementById('score').textContent = 'Score: 0';
        this.startNewRound();
        document.getElementById('startBtn').textContent = 'New Word';
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
    }

    getRandomGuessInterval() {
        return this.MIN_GUESS_INTERVAL + Math.random() * (this.MAX_GUESS_INTERVAL - this.MIN_GUESS_INTERVAL);
    }

    makeGuess() {
        if (!this.isActive || !this.drawing.isDrawing) return;
        
        const now = Date.now();
        if (this.startDrawTime === 0) this.startDrawTime = now;
        
        // Initial delay before first guess
        if (now - this.startDrawTime < this.INITIAL_DELAY) return;
        if (now - this.lastGuessTime < this.getRandomGuessInterval()) return;
        
        const usedColors = this.drawing.getUsedColors();
        if (usedColors.length === 0) return;
    
        // First, look for exact color matches
        const exactMatches = words.filter(item => {
            // Check if all the colors we're using are in this word
            const allUsedColorsMatch = usedColors.every(color => item.colors.includes(color));
            // Check if we're using all the colors required for this word
            const allRequiredColorsUsed = item.colors.every(color => usedColors.includes(color));
            return allUsedColorsMatch && allRequiredColorsUsed;
        });
    
        // If we find an exact match and it's our word, that's it!
        if (exactMatches.includes(this.currentWord)) {
            const message = successMessages[Math.floor(Math.random() * successMessages.length)]
                .replace('{word}', this.currentWord);
            document.getElementById('message').textContent = message;
            this.score += this.timeLeft;
            document.getElementById('score').textContent = `Score: ${this.score}`;
            this.isActive = false;
            clearInterval(this.timer);
            setTimeout(() => this.startNewRound(), 2000);
            return;
        }
    
        // If no exact match, look for partial matches
        const partialMatches = words.filter(item =>
            // Find words that contain ANY of the colors we're using
            item.colors.some(color => usedColors.includes(color))
        );
    
        if (partialMatches.length > 0) {
            this.lastGuessTime = now;
            
            // First try words that match most of our colors
            const bestMatches = partialMatches.filter(item => 
                item.colors.filter(color => usedColors.includes(color)).length >= usedColors.length/2
            );
    
            if (bestMatches.length > 0) {
                const guess = bestMatches[Math.floor(Math.random() * bestMatches.length)];
                const guesses = [
                    `Is it a ${guess.word}?`,
                    `Hmm... maybe a ${guess.word}?`,
                    `Looks like a ${guess.word}...`,
                    `Could be a ${guess.word}?`
                ];
                document.getElementById('message').textContent = 
                    guesses[Math.floor(Math.random() * guesses.length)];
            } else {
                // If no good matches, just guess from any partial matches
                const guess = partialMatches[Math.floor(Math.random() * partialMatches.length)];
                document.getElementById('message').textContent = `Maybe a ${guess.word}?`;
            }
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                document.getElementById('message').textContent = 
                    `Time's up! The word was: ${this.currentWord}`;
                this.isActive = false;
                setTimeout(() => this.startNewRound(), 2000);
            }
        }, 1000);
    }
}

// Initialize game
const game = new Game();