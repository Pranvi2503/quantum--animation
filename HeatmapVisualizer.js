export class HeatmapVisualizer {
  constructor(canvas, engine) {
    this.canvas = canvas;
    // Main context is for *writing* only, no readback.
    this.ctx = canvas.getContext('2d');
    this.engine = engine;

    this.width = canvas.width;
    this.height = canvas.height;

    this.padding = { top: 40, right: 40, bottom: 60, left: 60 };

    this.history = [];
    this.maxHistory = 700; // Number of time steps to show
    
    // Color gradient for the heatmap
    this.colorGradient = [
        { stop: 0.0, color: '#0a0a0f' },  // background
        { stop: 0.1, color: '#2a0a3f' },  // deep purple
        { stop: 0.3, color: '#8a2be2' },  // blue-violet
        { stop: 0.6, color: '#ff00ff' },  // magenta
        { stop: 0.8, color: '#00ffff' },  // cyan
        { stop: 1.0, color: '#ffffff' }   // white hot
    ];
    // Pre-calculate gradient for performance
    this.gradientCanvas = document.createElement('canvas');
    
    // Gradient context *is* read from, so we add the attribute here.
    this.gradientCtx = this.gradientCanvas.getContext('2d', { willReadFrequently: true });
    
    this.gradientCanvas.width = 256;
    this.gradientCanvas.height = 1;
    this.updateGradient();
  }
  
  updateGradient() {
    const grad = this.gradientCtx.createLinearGradient(0, 0, 256, 0);
    this.colorGradient.forEach(stop => {
        grad.addColorStop(stop.stop, stop.color);
    });
    this.gradientCtx.fillStyle = grad;
    this.gradientCtx.fillRect(0, 0, 256, 1);
  }
  
  getColor(value) {
    // Clamp value and get color from pre-calculated gradient
    const scaledValue = Math.min(Math.max(value, 0), 1) * 255;
    const index = Math.floor(scaledValue);
    const colorData = this.gradientCtx.getImageData(index, 0, 1, 1).data;
    return `rgb(${colorData[0]}, ${colorData[1]}, ${colorData[2]})`;
  }

  resize() {
    // ... (unchanged)
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx.scale(dpr, dpr);
  }

  reset() {
    // ... (unchanged)
    this.history = [];
  }

  clear() {
    // ... (unchanged)
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawAxes() {
    // ... (unchanged)
    const rect = this.canvas.getBoundingClientRect();
    const plotWidth = rect.width - this.padding.left - this.padding.right;
    const plotHeight = rect.height - this.padding.top - this.padding.bottom;
    
    this.ctx.strokeStyle = '#2a2a3a';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.rect(this.padding.left, this.padding.top, plotWidth, plotHeight);
    this.ctx.stroke();

    this.ctx.fillStyle = '#888899';
    this.ctx.font = '14px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    
    this.ctx.fillText('x (position)', this.padding.left + plotWidth / 2, this.padding.top + plotHeight + 40);

    this.ctx.save();
    this.ctx.translate(15, this.padding.top + plotHeight / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText('t (time)', 0, 0);
    this.ctx.restore();

    const numXLines = 10;
    for (let i = 0; i <= numXLines; i++) {
        if (i % 2 === 0) {
            const x = this.padding.left + (i / numXLines) * plotWidth;
            const xVal = this.engine.xMin + (i / numXLines) * (this.engine.xMax - this.engine.xMin);
            this.ctx.fillStyle = '#666677';
            this.ctx.font = '11px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(xVal.toFixed(1), x, this.padding.top + plotHeight + 20);
        }
    }
  }

  render() {
    // ... (unchanged)
    const waveData = this.engine.computeWaveData();
    if (!waveData) return;

    if (!this.engine.paused) {
        this.history.push(waveData.probDensity);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    this.clear();
    this.drawAxes();
    
    const rect = this.canvas.getBoundingClientRect();
    const plotWidth = rect.width - this.padding.left - this.padding.right;
    const plotHeight = rect.height - this.padding.top - this.padding.bottom;

    let maxProb = 0;
    for (const data of this.history) {
        for (const prob of data) {
            if (prob > maxProb) maxProb = prob;
        }
    }
    if (maxProb === 0) maxProb = 1;

    const h = this.history.length;
    if (h === 0) return waveData;
    
    const dy = plotHeight / this.maxHistory;
    const dx = plotWidth / this.engine.numPoints;

    for (let t = 0; t < h; t++) {
        const y = this.padding.top + plotHeight * (t / this.maxHistory);
        const row = this.history[t];
        for (let i = 0; i < row.length; i++) {
            const x = this.padding.left + (i / this.engine.numPoints) * plotWidth;
            
            const value = row[i] / maxProb;
            this.ctx.fillStyle = this.getColor(value);
            
            this.ctx.fillRect(x, y, Math.ceil(dx), Math.ceil(dy));
        }
    }
    
    const y_now = this.padding.top + plotHeight * (h / this.maxHistory);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([2, 2]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding.left, y_now);
    this.ctx.lineTo(this.padding.left + plotWidth, y_now);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    return waveData;
  }
}
