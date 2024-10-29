class Drawing {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 35;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    draw(e) {
        if (!this.isDrawing || !game.isActive) return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
        game.makeGuess();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
    }

    getUsedColors() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        const colors = new Set();
        const colorThresholds = {
            red: ([r, g, b]) => r > 200 && g < 100 && b < 100,
            green: ([r, g, b]) => r < 100 && g > 200 && b < 100,
            blue: ([r, g, b]) => r < 100 && g < 100 && b > 200,
            yellow: ([r, g, b]) => r > 200 && g > 200 && b < 100,
            orange: ([r, g, b]) => r > 200 && g > 100 && b < 50,
            purple: ([r, g, b]) => r > 100 && g < 100 && b > 200,
            black: ([r, g, b]) => r < 50 && g < 50 && b < 50,
            white: ([r, g, b]) => r > 200 && g > 200 && b > 200,
            brown: ([r, g, b]) => r > 100 && r < 200 && g < 100 && b < 100,
            pink: ([r, g, b]) => r > 200 && g > 150 && b > 150
        };

        for (let i = 0; i < imageData.length; i += 4) {
            if (imageData[i + 3] > 0) {
                const rgb = [imageData[i], imageData[i + 1], imageData[i + 2]];
                Object.entries(colorThresholds).forEach(([color, test]) => {
                    if (test(rgb)) colors.add(color);
                });
            }
        }
        return Array.from(colors);
    }
}