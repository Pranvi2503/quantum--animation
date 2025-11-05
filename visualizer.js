// export class Visualizer {
//   constructor(canvas, engine) {
//     this.canvas = canvas;
//     // FIX: Added { willReadFrequently: true } for performance
//     this.ctx = canvas.getContext('2d', { willReadFrequently: true });
//     this.engine = engine;

//     this.width = canvas.width;
//     this.height = canvas.height;

//     this.padding = { top: 40, right: 40, bottom: 60, left: 60 };
//     this.plotWidth = this.width - this.padding.left - this.padding.right;
//     this.plotHeight = this.height - this.padding.top - this.padding.bottom;

//     this.showMomentumSpace = false;
//     this.animationId = null;
//   }

//   resize() {
//     // ... (rest of the file is unchanged)
//     const dpr = window.devicePixelRatio || 1;
//     const rect = this.canvas.getBoundingClientRect();

//     this.canvas.width = rect.width * dpr;
//     this.canvas.height = rect.height * dpr;

//     this.width = this.canvas.width;
//     this.height = this.canvas.height;

//     this.ctx.scale(dpr, dpr);

//     this.plotWidth = rect.width - this.padding.left - this.padding.right;
//     this.plotHeight = rect.height - this.padding.top - this.padding.bottom;
//   }

//   clear() {
//     this.ctx.fillStyle = '#0a0a0f';
//     this.ctx.fillRect(0, 0, this.width, this.height);
//   }

//   drawAxes() {
//     this.ctx.strokeStyle = '#2a2a3a';
//     this.ctx.lineWidth = 2;

//     this.ctx.beginPath();
//     this.ctx.moveTo(this.padding.left, this.padding.top);
//     this.ctx.lineTo(this.padding.left, this.padding.top + this.plotHeight);
//     this.ctx.lineTo(this.padding.left + this.plotWidth, this.padding.top + this.plotHeight);
//     this.ctx.stroke();

//     this.ctx.fillStyle = '#888899';
//     this.ctx.font = '14px Inter, sans-serif';

//     const xLabel = this.showMomentumSpace ? 'k (wave number)' : 'x (position)';
//     const yLabel = this.showMomentumSpace ? '|ψ̃(k)|' : 'ψ(x,t)';

//     this.ctx.textAlign = 'center';
//     this.ctx.fillText(xLabel, this.padding.left + this.plotWidth / 2, this.padding.top + this.plotHeight + 40);

//     this.ctx.save();
//     this.ctx.translate(15, this.padding.top + this.plotHeight / 2);
//     this.ctx.rotate(-Math.PI / 2);
//     this.ctx.fillText(yLabel, 0, 0);
//     this.ctx.restore();

//     this.drawGridLines();
//   }

//   drawGridLines() {
//     this.ctx.strokeStyle = '#1a1a2a';
//     this.ctx.lineWidth = 1;

//     const numXLines = 10;
//     const numYLines = 8;

//     for (let i = 0; i <= numXLines; i++) {
//       const x = this.padding.left + (i / numXLines) * this.plotWidth;
//       this.ctx.beginPath();
//       this.ctx.moveTo(x, this.padding.top);
//       this.ctx.lineTo(x, this.padding.top + this.plotHeight);
//       this.ctx.stroke();

//       if (i % 2 === 0) {
//         const xVal = this.engine.xMin + (i / numXLines) * (this.engine.xMax - this.engine.xMin);
//         this.ctx.fillStyle = '#666677';
//         this.ctx.font = '11px Inter, sans-serif';
//         this.ctx.textAlign = 'center';
//         this.ctx.fillText(xVal.toFixed(1), x, this.padding.top + this.plotHeight + 20);
//       }
//     }

//     for (let i = 0; i <= numYLines; i++) {
//       const y = this.padding.top + (i / numYLines) * this.plotHeight;
//       this.ctx.beginPath();
//       this.ctx.moveTo(this.padding.left, y);
//       this.ctx.lineTo(this.padding.left + this.plotWidth, y);
//       this.ctx.stroke();
//     }
//   }

//   mapX(x) {
//     const xRange = this.engine.xMax - this.engine.xMin;
//     return this.padding.left + ((x - this.engine.xMin) / xRange) * this.plotWidth;
//   }

//   mapY(y, minY, maxY) {
//     const yRange = maxY - minY;
//     if (yRange === 0) return this.padding.top + this.plotHeight / 2;
//     return this.padding.top + this.plotHeight - ((y - minY) / yRange) * this.plotHeight;
//   }

//   drawWaveFunction(waveData) {
//     const allValues = [
//       ...waveData.real,
//       ...waveData.imag,
//       ...waveData.probDensity
//     ];
//     const minY = Math.min(-2, Math.min(...allValues));
//     const maxY = Math.max(2, Math.max(...allValues));

//     if (this.engine.visibility.probDensity) {
//       this.drawProbabilityDensity(waveData, minY, maxY);
//     }

//     if (this.engine.trail.enabled && this.engine.trail.history.length > 0) {
//       this.drawTrails(minY, maxY);
//     }

//     if (this.engine.visibility.real) {
//       this.drawCurve(waveData.x, waveData.real, '#00ffff', minY, maxY, 2.5);
//     }

//     if (this.engine.visibility.imag) {
//       this.drawCurve(waveData.x, waveData.imag, '#ff00ff', minY, maxY, 2.5);
//     }

//     this.drawPotential(minY, maxY);
    
//     this.drawVelocityMarkers(minY, maxY);
//   }

//   drawCurve(xData, yData, color, minY, maxY, lineWidth = 2) {
//     this.ctx.strokeStyle = color;
//     this.ctx.lineWidth = lineWidth;
//     this.ctx.shadowColor = color;
//     this.ctx.shadowBlur = 8;

//     this.ctx.beginPath();
//     for (let i = 0; i < xData.length; i++) {
//       const x = this.mapX(xData[i]);
//       const y = this.mapY(yData[i], minY, maxY);

//       if (i === 0) {
//         this.ctx.moveTo(x, y);
//       } else {
//         this.ctx.lineTo(x, y);
//       }
//     }
//     this.ctx.stroke();

//     this.ctx.shadowBlur = 0;
//   }

//   drawProbabilityDensity(waveData, minY, maxY) {
//     const gradient = this.ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + this.plotHeight);
//     gradient.addColorStop(0, 'rgba(138, 43, 226, 0.5)');
//     gradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)');

//     this.ctx.fillStyle = gradient;
//     this.ctx.beginPath();

//     const baseY = this.mapY(0, minY, maxY);
//     this.ctx.moveTo(this.mapX(waveData.x[0]), baseY);

//     for (let i = 0; i < waveData.x.length; i++) {
//       const x = this.mapX(waveData.x[i]);
//       const y = this.mapY(waveData.probDensity[i], minY, maxY);
//       this.ctx.lineTo(x, y);
//     }

//     this.ctx.lineTo(this.mapX(waveData.x[waveData.x.length - 1]), baseY);
//     this.ctx.closePath();
//     this.ctx.fill();

//     this.ctx.strokeStyle = '#8a2be2';
//     this.ctx.lineWidth = 1.5;
//     this.ctx.beginPath();
//     for (let i = 0; i < waveData.x.length; i++) {
//       const x = this.mapX(waveData.x[i]);
//       const y = this.mapY(waveData.probDensity[i], minY, maxY);
//       if (i === 0) {
//         this.ctx.moveTo(x, y);
//       } else {
//         this.ctx.lineTo(x, y);
//       }
//     }
//     this.ctx.stroke();
//   }

//   drawTrails(minY, maxY) {
//     const history = this.engine.trail.history;

//     for (let h = 0; h < history.length; h++) {
//       const alpha = (h + 1) / history.length * 0.3;
//       this.ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
//       this.ctx.lineWidth = 1;

//       this.ctx.beginPath();
//       for (let i = 0; i < history[h].data.length; i++) {
//         const x = this.mapX(this.engine.xMin + i * this.engine.dx);
//         const y = this.mapY(history[h].data[i], minY, maxY);

//         if (i === 0) {
//           this.ctx.moveTo(x, y);
//         } else {
//           this.ctx.lineTo(x, y);
//         }
//       }
//       this.ctx.stroke();
//     }
//   }

//   drawPotential(minY, maxY) {
//     if (this.engine.physicsMode.potential === 'none') return;

//     this.ctx.strokeStyle = '#ffaa00';
//     this.ctx.lineWidth = 2;
//     this.ctx.setLineDash([5, 5]);

//     this.ctx.beginPath();
//     for (let i = 0; i < this.engine.potential.length; i++) {
//       const x = this.mapX(this.engine.xMin + i * this.engine.dx);
//       // Scale potential for visualization
//       const vScaled = this.engine.potential[i] * 0.2; 
//       const y = this.mapY(vScaled, minY, maxY);

//       if (i === 0) {
//         this.ctx.moveTo(x, y);
//       } else {
//         this.ctx.lineTo(x, y);
//       }
//     }
//     this.ctx.stroke();
//     this.ctx.setLineDash([]);
//   }

//   // NEW: Method to draw velocity markers
//   drawVelocityMarkers(minY, maxY) {
//     // NEW: Don't draw if in momentum space OR custom function mode
//     if (this.showMomentumSpace || this.engine.physicsMode.customFunction) return; 

//     const velocities = this.engine.getVelocities(this.engine.time);
    
//     // Get pixel coordinate of the packet center
//     const x_pixel = this.mapX(velocities.packetCenter);
    
//     // Don't draw if off-screen
//     if (x_pixel < this.padding.left || x_pixel > this.padding.left + this.plotWidth) {
//         return;
//     }

//     // Position markers above and below the x-axis
//     const y_axis = this.mapY(0, minY, maxY);
//     const y_g = y_axis + 15; // Below axis
//     const y_p = y_axis - 15; // Above axis

//     // Draw Group Velocity Marker (v_g)
//     this.ctx.fillStyle = '#ffaa00'; // Orange
//     this.ctx.font = 'bold 12px Inter, sans-serif';
//     this.ctx.textAlign = 'center';
    
//     this.ctx.beginPath();
//     this.ctx.moveTo(x_pixel - 5, y_g - 5);
//     this.ctx.lineTo(x_pixel + 5, y_g + 5);
//     this.ctx.moveTo(x_pixel - 5, y_g + 5);
//     this.ctx.lineTo(x_pixel + 5, y_g - 5);
//     this.ctx.strokeStyle = '#ffaa00';
//     this.ctx.lineWidth = 2;
//     this.ctx.stroke();
//     this.ctx.fillText(`v_g = ${velocities.v_g.toFixed(2)}`, x_pixel, y_g + 20);
    
//     // Draw Phase Velocity Marker (v_p)
//     this.ctx.fillStyle = '#00ffff'; // Cyan
//     this.ctx.font = 'bold 12px Inter, sans-serif';
//     this.ctx.beginPath();
//     this.ctx.arc(x_pixel, y_p, 4, 0, 2 * Math.PI);
//     this.ctx.fill();
//     this.ctx.fillText(`v_p = ${velocities.v_p.toFixed(2)}`, x_pixel, y_p - 10);
//   }

//   drawMomentumSpace(kSpace) {
//     const maxAmplitude = Math.max(...kSpace.amplitude);
//     const minY = 0;
//     const maxY = maxAmplitude > 0 ? maxAmplitude * 1.2 : 1;

//     this.ctx.strokeStyle = '#00ff88';
//     this.ctx.lineWidth = 2.5;
//     this.ctx.shadowColor = '#00ff88';
//     this.ctx.shadowBlur = 8;

//     this.ctx.beginPath();
//     for (let i = 0; i < kSpace.k.length; i++) {
//       const xPos = this.padding.left + (i / (kSpace.k.length - 1)) * this.plotWidth;
//       const yPos = this.mapY(kSpace.amplitude[i], minY, maxY);

//       if (i === 0) {
//         this.ctx.moveTo(xPos, yPos);
//       } else {
//         this.ctx.lineTo(xPos, yPos);
//       }
//     }
//     this.ctx.stroke();
//     this.ctx.shadowBlur = 0;

//     const gradient = this.ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + this.plotHeight);
//     gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
//     gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');

//     this.ctx.fillStyle = gradient;
//     this.ctx.beginPath();

//     const baseY = this.mapY(0, minY, maxY);
//     this.ctx.moveTo(this.padding.left, baseY);

//     for (let i = 0; i < kSpace.k.length; i++) {
//       const xPos = this.padding.left + (i / (kSpace.k.length - 1)) * this.plotWidth;
//       const yPos = this.mapY(kSpace.amplitude[i], minY, maxY);
//       this.ctx.lineTo(xPos, yPos);
//     }

//     this.ctx.lineTo(this.padding.left + this.plotWidth, baseY);
//     this.ctx.closePath();
//     this.ctx.fill();
//   }

//   drawTitle() {
//     this.ctx.fillStyle = '#ffffff';
//     this.ctx.font = 'bold 20px Inter, sans-serif';
//     this.ctx.textAlign = 'left';
//     const title = this.showMomentumSpace ? 'Momentum Space: ψ̃(k)' : 'Position Space: ψ(x,t)';
//     this.ctx.fillText(title, this.padding.left, 25);
//   }

//   render() {
//     this.clear();
    
//     // NEW: Get wave data *before* drawing axes to compute min/max
//     const waveData = this.engine.computeWaveData();
//     if (!waveData) return;

//     this.drawAxes(); // Now draw axes
//     this.drawTitle();

//     if (this.showMomentumSpace) {
//       const kSpace = this.engine.computeFourierTransform(waveData);
//       this.drawMomentumSpace(kSpace);
//     } else {
//       this.drawWaveFunction(waveData);
//     }

//     return waveData;
//   }

//   toggleMomentumSpace() {
//     this.showMomentumSpace = !this.showMomentumSpace;
//   }

//   getCanvasCoordinates(event) {
//     const rect = this.canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     const xRange = this.engine.xMax - this.engine.xMin;
//     const xValue = this.engine.xMin + ((x - this.padding.left) / this.plotWidth) * xRange;

//     return { x: xValue, canvasX: x, canvasY: y };
//   }

//   isInsidePlotArea(canvasX, canvasY) {
//     return canvasX >= this.padding.left &&
//            canvasX <= this.padding.left + this.plotWidth &&
//            canvasY >= this.padding.top &&
//            canvasY <= this.padding.top + this.plotHeight;
//   }
// }

export class Visualizer {
  constructor(canvas, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.engine = engine;

    this.width = canvas.width;
    this.height = canvas.height;

    this.padding = { top: 40, right: 40, bottom: 60, left: 60 };
    this.plotWidth = this.width - this.padding.left - this.padding.right;
    this.plotHeight = this.height - this.padding.top - this.padding.bottom;

    this.showMomentumSpace = false;
    this.animationId = null;
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
    this.plotWidth = rect.width - this.padding.left - this.padding.right;
    this.plotHeight = rect.height - this.padding.top - this.padding.bottom;
  }

  clear() {
    // ... (unchanged)
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawAxes() {
    // ... (unchanged)
    this.ctx.strokeStyle = '#2a2a3a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding.left, this.padding.top);
    this.ctx.lineTo(this.padding.left, this.padding.top + this.plotHeight);
    this.ctx.lineTo(this.padding.left + this.plotWidth, this.padding.top + this.plotHeight);
    this.ctx.stroke();
    this.ctx.fillStyle = '#888899';
    this.ctx.font = '14px Inter, sans-serif';
    const xLabel = this.showMomentumSpace ? 'k (wave number)' : 'x (position)';
    const yLabel = this.showMomentumSpace ? '|ψ̃(k)|' : 'ψ(x,t) / |ψ(x,t)|^2';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(xLabel, this.padding.left + this.plotWidth / 2, this.padding.top + this.plotHeight + 40);
    this.ctx.save();
    this.ctx.translate(15, this.padding.top + this.plotHeight / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(yLabel, 0, 0);
    this.ctx.restore();
    this.drawGridLines();
  }

  drawGridLines() {
    // ... (unchanged)
    this.ctx.strokeStyle = '#1a1a2a';
    this.ctx.lineWidth = 1;
    const numXLines = 10;
    const numYLines = 8;
    for (let i = 0; i <= numXLines; i++) {
      const x = this.padding.left + (i / numXLines) * this.plotWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.padding.top);
      this.ctx.lineTo(x, this.padding.top + this.plotHeight);
      this.ctx.stroke();
      if (i % 2 === 0) {
        const xVal = this.engine.xMin + (i / numXLines) * (this.engine.xMax - this.engine.xMin);
        this.ctx.fillStyle = '#666677';
        this.ctx.font = '11px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(xVal.toFixed(1), x, this.padding.top + this.plotHeight + 20);
      }
    }
    for (let i = 0; i <= numYLines; i++) {
      const y = this.padding.top + (i / numYLines) * this.plotHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(this.padding.left, y);
      this.ctx.lineTo(this.padding.left + this.plotWidth, y);
      this.ctx.stroke();
    }
  }

  mapX(x) {
    // ... (unchanged)
    const xRange = this.engine.xMax - this.engine.xMin;
    return this.padding.left + ((x - this.engine.xMin) / xRange) * this.plotWidth;
  }

  mapY(y, minY, maxY) {
    // ... (unchanged)
    const yRange = maxY - minY;
    if (yRange === 0) return this.padding.top + this.plotHeight / 2;
    return this.padding.top + this.plotHeight - ((y - minY) / yRange) * this.plotHeight;
  }

  drawWaveFunction(waveData) {
    // ... (unchanged)
    const allValues = [
      ...waveData.real,
      ...waveData.imag,
      ...waveData.probDensity
    ];
    const minY = Math.min(-2, Math.min(...allValues));
    const maxY = Math.max(2, Math.max(...allValues));
    if (this.engine.visibility.probDensity) {
      this.drawProbabilityDensity(waveData, minY, maxY);
    }
    if (this.engine.trail.enabled && this.engine.trail.history.length > 0) {
      this.drawTrails(minY, maxY);
    }
    if (this.engine.visibility.real) {
      this.drawCurve(waveData.x, waveData.real, '#00ffff', minY, maxY, 2.5);
    }
    if (this.engine.visibility.imag) {
      this.drawCurve(waveData.x, waveData.imag, '#ff00ff', minY, maxY, 2.5);
    }
    this.drawPotential(minY, maxY);
    this.drawVelocityMarkers(minY, maxY);
  }

  drawCurve(xData, yData, color, minY, maxY, lineWidth = 2) {
    // ... (unchanged)
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    for (let i = 0; i < xData.length; i++) {
      const x = this.mapX(xData[i]);
      const y = this.mapY(yData[i], minY, maxY);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  drawProbabilityDensity(waveData, minY, maxY) {
    // ... (unchanged)
    const gradient = this.ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + this.plotHeight);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.5)');
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    const baseY = this.mapY(0, minY, maxY);
    this.ctx.moveTo(this.mapX(waveData.x[0]), baseY);
    for (let i = 0; i < waveData.x.length; i++) {
      const x = this.mapX(waveData.x[i]);
      const y = this.mapY(waveData.probDensity[i], minY, maxY);
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(this.mapX(waveData.x[waveData.x.length - 1]), baseY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = '#8a2be2';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let i = 0; i < waveData.x.length; i++) {
      const x = this.mapX(waveData.x[i]);
      const y = this.mapY(waveData.probDensity[i], minY, maxY);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }

  drawTrails(minY, maxY) {
    // ... (unchanged)
    const history = this.engine.trail.history;
    for (let h = 0; h < history.length; h++) {
      const alpha = (h + 1) / history.length * 0.3;
      this.ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (let i = 0; i < history[h].data.length; i++) {
        const x = this.mapX(this.engine.xMin + i * this.engine.dx);
        const y = this.mapY(history[h].data[i], minY, maxY);
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
  }

  drawPotential(minY, maxY) {
    // ... (unchanged)
    if (this.engine.physicsMode.potential === 'none') return;
    this.ctx.strokeStyle = '#ffaa00';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    for (let i = 0; i < this.engine.potential.length; i++) {
      const x = this.mapX(this.engine.xMin + i * this.engine.dx);
      const vScaled = this.engine.potential[i] * 0.2; 
      const y = this.mapY(vScaled, minY, maxY);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawVelocityMarkers(minY, maxY) {
    if (this.showMomentumSpace || this.engine.physicsMode.customFunction) return; 

    const velocities = this.engine.getVelocities(this.engine.time);
    const x_pixel = this.mapX(velocities.packetCenter);
    
    if (x_pixel < this.padding.left || x_pixel > this.padding.left + this.plotWidth) {
        return;
    }
    const y_axis = this.mapY(0, minY, maxY);
    const y_g = y_axis + 15;
    const y_p = y_axis - 15; 
    
    // Draw Group Velocity Marker (v_g) - The "X"
    this.ctx.beginPath();
    this.ctx.moveTo(x_pixel - 5, y_g - 5);
    this.ctx.lineTo(x_pixel + 5, y_g + 5);
    this.ctx.moveTo(x_pixel - 5, y_g + 5);
    this.ctx.lineTo(x_pixel + 5, y_g - 5);
    this.ctx.strokeStyle = '#ffaa00';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();
    // REMOVED: this.ctx.fillText(`v_g = ...`)
    
    // Draw Phase Velocity Marker (v_p) - The "O"
    this.ctx.beginPath();
    this.ctx.arc(x_pixel, y_p, 4.5, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();
    // REMOVED: this.ctx.fillText(`v_p = ...`)
  }

  drawMomentumSpace(kSpace) {
    // ... (unchanged)
    const maxAmplitude = Math.max(...kSpace.amplitude);
    const minY = 0;
    const maxY = maxAmplitude > 0 ? maxAmplitude * 1.2 : 1;
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = '#00ff88';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    for (let i = 0; i < kSpace.k.length; i++) {
      const xPos = this.padding.left + (i / (kSpace.k.length - 1)) * this.plotWidth;
      const yPos = this.mapY(kSpace.amplitude[i], minY, maxY);
      if (i === 0) {
        this.ctx.moveTo(xPos, yPos);
      } else {
        this.ctx.lineTo(xPos, yPos);
      }
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    const gradient = this.ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + this.plotHeight);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    const baseY = this.mapY(0, minY, maxY);
    this.ctx.moveTo(this.padding.left, baseY);
    for (let i = 0; i < kSpace.k.length; i++) {
      const xPos = this.padding.left + (i / (kSpace.k.length - 1)) * this.plotWidth;
      const yPos = this.mapY(kSpace.amplitude[i], minY, maxY);
      this.ctx.lineTo(xPos, yPos);
    }
    this.ctx.lineTo(this.padding.left + this.plotWidth, baseY);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawTitle() {
    // ... (unchanged)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 20px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    const title = this.showMomentumSpace ? 'Momentum Space: ψ̃(k)' : 'Position Space: ψ(x,t)';
    this.ctx.fillText(title, this.padding.left, 25);
  }

  render() {
    // ... (unchanged)
    this.clear();
    const waveData = this.engine.computeWaveData();
    if (!waveData) return;
    this.drawAxes();
    this.drawTitle();
    if (this.showMomentumSpace) {
      const kSpace = this.engine.computeFourierTransform(waveData);
      this.drawMomentumSpace(kSpace);
    } else {
      this.drawWaveFunction(waveData);
    }
    return waveData;
  }

  toggleMomentumSpace() {
    // ... (unchanged)
    this.showMomentumSpace = !this.showMomentumSpace;
  }

  getCanvasCoordinates(event) {
    // ... (unchanged)
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xRange = this.engine.xMax - this.engine.xMin;
    const xValue = this.engine.xMin + ((x - this.padding.left) / this.plotWidth) * xRange;
    return { x: xValue, canvasX: x, canvasY: y };
  }

  isInsidePlotArea(canvasX, canvasY) {
    // ... (unchanged)
    return canvasX >= this.padding.left &&
           canvasX <= this.padding.left + this.plotWidth &&
           canvasY >= this.padding.top &&
           canvasY <= this.padding.top + this.plotHeight;
  }
}
