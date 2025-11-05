// export class QuantumEngine {
//   constructor() {
//     this.params = {
//       A: 1.0,
//       k: 5.0,
//       omega: 2.0,
//       sigma: 0.5,
//       v: 0.3,
//       x0: 0
//     };

//     this.time = 0;
//     this.dt = 0.016;
//     this.paused = false;

//     this.xMin = -5;
//     this.xMax = 5;
//     this.numPoints = 500;
//     this.dx = (this.xMax - this.xMin) / this.numPoints;

//     this.visibility = {
//       real: true,
//       imag: true,
//       probDensity: true
//     };

//     this.physicsMode = {
//       dispersion: false,
//       potential: 'none',
//       superposition: false
//     };

//     this.potential = [];
//     this.secondWavePacket = null;

//     this.trail = {
//       enabled: false,
//       history: [],
//       maxLength: 50
//     };

//     this.initializePotential();
//   }

//   initializePotential() {
//     this.potential = new Array(this.numPoints).fill(0);
//   }

//   setPotential(type, params = {}) {
//     this.physicsMode.potential = type;

//     for (let i = 0; i < this.numPoints; i++) {
//       const x = this.xMin + i * this.dx;

//       switch(type) {
//         case 'barrier':
//           const barrierX = params.x || 0;
//           const barrierWidth = params.width || 0.5;
//           const barrierHeight = params.height || 5;
//           this.potential[i] = (Math.abs(x - barrierX) < barrierWidth / 2) ? barrierHeight : 0;
//           break;

//         case 'well':
//           const wellX = params.x || 0;
//           const wellWidth = params.width || 1.0;
//           const wellDepth = params.depth || -5;
//           this.potential[i] = (Math.abs(x - wellX) < wellWidth / 2) ? wellDepth : 0;
//           break;

//         case 'step':
//           const stepX = params.x || 0;
//           const stepHeight = params.height || 3;
//           this.potential[i] = (x > stepX) ? stepHeight : 0;
//           break;

//         default:
//           this.potential[i] = 0;
//       }
//     }
//   }

//   // Refactored to accept params object for safer superposition calculation
//   evaluateWaveFunction(x, t, params) {
//     const { A, k, omega, sigma, v, x0 } = params;
//     const hbar = 1.0;
//     const m = 1.0;

//     let effectiveOmega = omega;
//     let groupVelocity = v; // Use slider 'v' by default
    
//     // If dispersion is on, 'v' is ignored and v_g is calculated from k
//     if (this.physicsMode.dispersion) {
//       effectiveOmega = (hbar * k * k) / (2 * m);
//       groupVelocity = (hbar * k) / m; // True group velocity: d(omega)/dk
//     }

//     const xCenter = x0 + groupVelocity * t; // Use correct group velocity
//     const exponent = -Math.pow(x - xCenter, 2) / (2 * sigma * sigma);
//     const envelope = A * Math.exp(exponent);

//     const phase = k * x - effectiveOmega * t;
//     const real = envelope * Math.cos(phase);
//     const imag = envelope * Math.sin(phase);

//     return { real, imag };
//   }

//   evaluateSuperposition(x, t) {
//     // Call with main params
//     const psi1 = this.evaluateWaveFunction(x, t, this.params);

//     if (!this.secondWavePacket) {
//       return psi1;
//     }

//     // Call with second packet params - no more this.params switching
//     const psi2 = this.evaluateWaveFunction(x, t, this.secondWavePacket);

//     return {
//       real: (psi1.real + psi2.real) / Math.sqrt(2),
//       imag: (psi1.imag + psi2.imag) / Math.sqrt(2)
//     };
//   }

//   computeWaveData() {
//     const waveData = {
//       x: [],
//       real: [],
//       imag: [],
//       probDensity: []
//     };

//     for (let i = 0; i < this.numPoints; i++) {
//       const x = this.xMin + i * this.dx;
//       waveData.x.push(x);

//       const psi = this.physicsMode.superposition
//         ? this.evaluateSuperposition(x, this.time)
//         : this.evaluateWaveFunction(x, this.time, this.params); // Pass main params

//       waveData.real.push(psi.real);
//       waveData.imag.push(psi.imag);
//       waveData.probDensity.push(psi.real * psi.real + psi.imag * psi.imag);
//     }

//     if (this.trail.enabled) {
//       this.trail.history.push({
//         time: this.time,
//         data: [...waveData.probDensity]
//       });

//       if (this.trail.history.length > this.trail.maxLength) {
//         this.trail.history.shift();
//       }
//     }

//     return waveData;
//   }

//   // New method to get velocities for the visualizer
//   getVelocities(t) {
//     // Reports velocities for the *main* wave packet
//     const { k, omega, v, x0 } = this.params;
//     const hbar = 1.0;
//     const m = 1.0;

//     let effectiveOmega = omega;
//     let groupVelocity = v;
    
//     if (this.physicsMode.dispersion) {
//       effectiveOmega = (hbar * k * k) / (2 * m);
//       groupVelocity = (hbar * k) / m;
//     }

//     const phaseVelocity = (k === 0) ? 0 : effectiveOmega / k;
//     const packetCenter = x0 + groupVelocity * t;

//     return {
//         v_g: groupVelocity,
//         v_p: phaseVelocity,
//         packetCenter: packetCenter
//     };
//   }

//   computeFourierTransform(waveData) {
//     const N = waveData.real.length;
//     const kSpace = {
//       k: [],
//       amplitude: []
//     };

//     const kMin = -20;
//     const kMax = 20;
//     const numKPoints = 200;
//     const dk = (kMax - kMin) / numKPoints;

//     for (let i = 0; i < numKPoints; i++) {
//       const k = kMin + i * dk;
//       kSpace.k.push(k);

//       let realSum = 0;
//       let imagSum = 0;

//       for (let j = 0; j < N; j++) {
//         const x = waveData.x[j];
//         const phase = -k * x;
//         const cosPhase = Math.cos(phase);
//         const sinPhase = Math.sin(phase);

//         realSum += (waveData.real[j] * cosPhase - waveData.imag[j] * sinPhase) * this.dx;
//         imagSum += (waveData.real[j] * sinPhase + waveData.imag[j] * cosPhase) * this.dx;
//       }

//       const amplitude = Math.sqrt(realSum * realSum + imagSum * imagSum) / Math.sqrt(2 * Math.PI);
//       kSpace.amplitude.push(amplitude);
//     }

//     return kSpace;
//   }

//   computeExpectationValues(waveData) {
//     let normalization = 0;
//     let expectX = 0;
//     let expectP = 0;
//     let expectE = 0;

//     for (let i = 0; i < waveData.x.length; i++) {
//       const probDensity = waveData.probDensity[i];
//       normalization += probDensity * this.dx;
//       expectX += waveData.x[i] * probDensity * this.dx;
//     }

//     if (normalization === 0) normalization = 1; // Avoid divide by zero
//     expectX /= normalization;

//     for (let i = 1; i < waveData.x.length - 1; i++) {
//       const psiReal = waveData.real[i];
//       const psiImag = waveData.imag[i];
//       const dPsiReal = (waveData.real[i + 1] - waveData.real[i - 1]) / (2 * this.dx);
//       const dPsiImag = (waveData.imag[i + 1] - waveData.imag[i - 1]) / (2 * this.dx);

//       const momentumDensity = -(psiReal * dPsiImag - psiImag * dPsiReal);
//       expectP += momentumDensity * this.dx;
//     }
//     expectP /= normalization;


//     // Simplified Energy: KE + PE
//     const kineticEnergy = expectP * expectP / 2; // Assuming m=1
    
//     // Approximate potential energy at expectation value of x
//     let potentialEnergy = 0;
//     const potentialIndex = Math.floor((expectX - this.xMin) / this.dx);
//     if (potentialIndex >= 0 && potentialIndex < this.potential.length) {
//        potentialEnergy = this.potential[potentialIndex];
//     }

//     expectE = kineticEnergy + potentialEnergy;

//     return {
//       position: expectX,
//       momentum: expectP,
//       energy: expectE
//     };
//   }

//   update() {
//     if (!this.paused) {
//       this.time += this.dt;
//     }
//   }

//   reset() {
//     this.time = 0;
//     this.trail.history = [];
//   }

//   setParam(name, value) {
//     if (this.params.hasOwnProperty(name)) {
//       this.params[name] = value;
//     }
//   }

//   toggleVisibility(component) {
//     if (this.visibility.hasOwnProperty(component)) {
//       this.visibility[component] = !this.visibility[component];
//     }
//   }

//   togglePause() {
//     this.paused = !this.paused;
//   }

//   setWavePacketPosition(x) {
//     this.params.x0 = x;
//   }

//   enableSuperposition(secondPacketParams) {
//     this.physicsMode.superposition = true;
//     this.secondWavePacket = { ...this.params, ...secondPacketParams };
//   }

//   disableSuperposition() {
//     this.physicsMode.superposition = false;
//     this.secondWavePacket = null;
//   }
// }

export class QuantumEngine {
  constructor() {
    // NEW: Initialize math.js parser
    try {
      this.mathParser = math.create(math.all);
      this.customPsiNode = null;
      this.customPsiString = null;
    } catch (e) {
      console.error("Failed to initialize math.js", e);
      this.mathParser = null;
    }

    this.params = {
      A: 1.0,
      k: 5.0,
      omega: 2.0,
      sigma: 0.5,
      v: 0.3,
      x0: 0 // x0 is now a standard param
    };

    this.time = 0;
    this.dt = 0.016;
    this.paused = false;

    this.xMin = -5;
    this.xMax = 5;
    this.numPoints = 500;
    this.dx = (this.xMax - this.xMin) / this.numPoints;

    this.visibility = {
      real: true,
      imag: true,
      probDensity: true
    };

    this.physicsMode = {
      dispersion: false,
      potential: 'none',
      superposition: false,
      customFunction: false // NEW
    };
    
    // NEW: Stored parameters for potentials
    this.potentialParams = {
      x: 1.5,
      width: 0.8,
      height: 5,
      depth: -5
    };

    this.potential = [];
    this.secondWavePacket = null;

    this.trail = {
      enabled: false,
      history: [],
      maxLength: 50
    };

    this.initializePotential();
  }

  initializePotential() {
    this.potential = new Array(this.numPoints).fill(0);
    this.setPotential(this.physicsMode.potential); // Re-apply current potential
  }

  // NEW: Update potential parameter
  setPotentialParam(name, value) {
    if (this.potentialParams.hasOwnProperty(name)) {
      this.potentialParams[name] = value;
      this.setPotential(this.physicsMode.potential); // Re-calculate potential
    }
  }

  // NEW: Now uses potentialParams
  setPotential(type) {
    this.physicsMode.potential = type;
    const params = this.potentialParams;

    for (let i = 0; i < this.numPoints; i++) {
      const x = this.xMin + i * this.dx;

      switch(type) {
        case 'barrier':
          const barrierX = params.x || 0;
          const barrierWidth = params.width || 0.5;
          const barrierHeight = params.height || 5;
          this.potential[i] = (Math.abs(x - barrierX) < barrierWidth / 2) ? barrierHeight : 0;
          break;

        case 'well':
          const wellX = params.x || 0;
          const wellWidth = params.width || 1.0;
          const wellDepth = params.depth || -5;
          this.potential[i] = (Math.abs(x - wellX) < wellWidth / 2) ? wellDepth : 0;
          break;

        case 'step':
          const stepX = params.x || 0;
          const stepHeight = params.height || 3;
          this.potential[i] = (x > stepX) ? stepHeight : 0;
          break;

        default:
          this.potential[i] = 0;
      }
    }
  }
  
  // --- NEW: Custom Wave Function Logic ---
  setCustomFunction(functionString) {
    if (!this.mathParser) return false;
    try {
      this.customPsiNode = this.mathParser.parse(functionString);
      this.customPsiString = functionString;
      console.log("Custom function parsed successfully.");
      return true;
    } catch (e) {
      console.error("Failed to parse custom function:", e);
      alert("Custom Function Error:\n" + e.message);
      this.customPsiNode = null;
      this.customPsiString = functionString; // Keep string to show in UI
      return false;
    }
  }

  evaluateCustomFunction(x, t) {
    const scope = {
      ...this.params, // A, k, omega, sigma, v, x0
      x: x,
      t: t,
      i: this.mathParser.complex(0, 1), // Complex number i
      pi: Math.PI,
      exp: Math.exp,
      sin: Math.sin,
      cos: Math.cos,
      pow: Math.pow,
      sqrt: Math.sqrt
    };

    try {
      const result = this.customPsiNode.evaluate(scope);
      if (typeof result === 'number') {
        return { real: result, imag: 0 };
      }
      if (result.isComplex) {
        return { real: result.re, imag: result.im };
      }
      // Fallback for non-complex/number results
      return { real: 0, imag: 0 };
    } catch (e) {
      // Don't flood console, error was shown on apply
      return { real: 0, imag: 0 };
    }
  }
  // --- End Custom Function Logic ---

  // Refactored to accept params object for safer superposition calculation
  evaluateWaveFunction(x, t, params) {
    // NEW: Check if custom function is active
    if (this.physicsMode.customFunction && this.customPsiNode && params === this.params) {
        return this.evaluateCustomFunction(x, t);
    }
    
    // --- Original Gaussian Logic ---
    const { A, k, omega, sigma, v, x0 } = params;
    const hbar = 1.0;
    const m = 1.0;

    let effectiveOmega = omega;
    let groupVelocity = v; // Use slider 'v' by default
    
    if (this.physicsMode.dispersion) {
      effectiveOmega = (hbar * k * k) / (2 * m);
      groupVelocity = (hbar * k) / m;
    }

    const xCenter = x0 + groupVelocity * t;
    const exponent = -Math.pow(x - xCenter, 2) / (2 * sigma * sigma);
    const envelope = (sigma === 0) ? 0 : A * Math.exp(exponent); // Avoid NaN if sigma is 0

    const phase = k * x - effectiveOmega * t;
    const real = envelope * Math.cos(phase);
    const imag = envelope * Math.sin(phase);

    return { real, imag };
  }

  evaluateSuperposition(x, t) {
    // Call with main params
    const psi1 = this.evaluateWaveFunction(x, t, this.params);

    if (!this.secondWavePacket) {
      return psi1;
    }

    // Call with second packet params
    const psi2 = this.evaluateWaveFunction(x, t, this.secondWavePacket);

    return {
      real: (psi1.real + psi2.real) / Math.sqrt(2),
      imag: (psi1.imag + psi2.imag) / Math.sqrt(2)
    };
  }

  computeWaveData() {
    const waveData = {
      x: [],
      real: [],
      imag: [],
      probDensity: []
    };

    for (let i = 0; i < this.numPoints; i++) {
      const x = this.xMin + i * this.dx;
      waveData.x.push(x);

      const psi = this.physicsMode.superposition
        ? this.evaluateSuperposition(x, this.time)
        : this.evaluateWaveFunction(x, this.time, this.params); // Pass main params

      waveData.real.push(psi.real);
      waveData.imag.push(psi.imag);
      waveData.probDensity.push(psi.real * psi.real + psi.imag * psi.imag);
    }

    if (this.trail.enabled) {
      this.trail.history.push({
        time: this.time,
        data: [...waveData.probDensity]
      });

      if (this.trail.history.length > this.trail.maxLength) {
        this.trail.history.shift();
      }
    }

    return waveData;
  }

  getVelocities(t) {
    // Reports velocities for the *main* wave packet
    const { k, omega, v, x0 } = this.params;
    const hbar = 1.0;
    const m = 1.0;

    let effectiveOmega = omega;
    let groupVelocity = v;
    
    // Don't show calculated velocities if custom function is on
    if (this.physicsMode.dispersion && !this.physicsMode.customFunction) {
      effectiveOmega = (hbar * k * k) / (2 * m);
      groupVelocity = (hbar * k) / m;
    }

    const phaseVelocity = (k === 0) ? 0 : effectiveOmega / k;
    const packetCenter = x0 + groupVelocity * t;

    return {
        v_g: groupVelocity,
        v_p: phaseVelocity,
        packetCenter: packetCenter
    };
  }

  computeFourierTransform(waveData) {
    // ... (content unchanged)
    const N = waveData.real.length;
    const kSpace = {
      k: [],
      amplitude: []
    };
    const kMin = -20;
    const kMax = 20;
    const numKPoints = 200;
    const dk = (kMax - kMin) / numKPoints;
    for (let i = 0; i < numKPoints; i++) {
      const k = kMin + i * dk;
      kSpace.k.push(k);
      let realSum = 0;
      let imagSum = 0;
      for (let j = 0; j < N; j++) {
        const x = waveData.x[j];
        const phase = -k * x;
        const cosPhase = Math.cos(phase);
        const sinPhase = Math.sin(phase);
        realSum += (waveData.real[j] * cosPhase - waveData.imag[j] * sinPhase) * this.dx;
        imagSum += (waveData.real[j] * sinPhase + waveData.imag[j] * cosPhase) * this.dx;
      }
      const amplitude = Math.sqrt(realSum * realSum + imagSum * imagSum) / Math.sqrt(2 * Math.PI);
      kSpace.amplitude.push(amplitude);
    }
    return kSpace;
  }

  computeExpectationValues(waveData) {
    // ... (content unchanged, but added normalization check)
    let normalization = 0;
    let expectX = 0;
    let expectP = 0;
    let expectE = 0;
    for (let i = 0; i < waveData.x.length; i++) {
      const probDensity = waveData.probDensity[i];
      normalization += probDensity * this.dx;
      expectX += waveData.x[i] * probDensity * this.dx;
    }
    if (normalization === 0) normalization = 1; // Avoid divide by zero
    expectX /= normalization;
    for (let i = 1; i < waveData.x.length - 1; i++) {
      const psiReal = waveData.real[i];
      const psiImag = waveData.imag[i];
      const dPsiReal = (waveData.real[i + 1] - waveData.real[i - 1]) / (2 * this.dx);
      const dPsiImag = (waveData.imag[i + 1] - waveData.imag[i - 1]) / (2 * this.dx);
      const momentumDensity = -(psiReal * dPsiImag - psiImag * dPsiReal);
      expectP += momentumDensity * this.dx;
    }
    expectP /= normalization;
    const kineticEnergy = expectP * expectP / 2; // Assuming m=1
    let potentialEnergy = 0;
    const potentialIndex = Math.floor((expectX - this.xMin) / this.dx);
    if (potentialIndex >= 0 && potentialIndex < this.potential.length) {
       potentialEnergy = this.potential[potentialIndex];
    }
    expectE = kineticEnergy + potentialEnergy;
    return {
      position: expectX,
      momentum: expectP,
      energy: expectE
    };
  }

  update() {
    if (!this.paused) {
      this.time += this.dt;
    }
  }

  reset() {
    this.time = 0;
    this.trail.history = [];
  }

  setParam(name, value) {
    if (this.params.hasOwnProperty(name)) {
      this.params[name] = value;
    }
  }
  
  panView(direction) {
    const panAmount = (this.xMax - this.xMin) * 0.1;
    this.xMin += panAmount * direction;
    this.xMax += panAmount * direction;
    this.initializePotential();
  }

  toggleVisibility(component) {
    if (this.visibility.hasOwnProperty(component)) {
      this.visibility[component] = !this.visibility[component];
    }
  }

  togglePause() {
    this.paused = !this.paused;
  }

  setWavePacketPosition(x) {
    this.setParam('x0', x);
    const x0Slider = document.querySelector('.slider[data-param="x0"]');
    if (x0Slider) {
        x0Slider.value = x;
        const valueDisplay = x0Slider.previousElementSibling.querySelector('.slider-value');
        if (valueDisplay) {
            valueDisplay.textContent = x.toFixed(2);
        }
    }
  }

  enableSuperposition(secondPacketParams) {
    this.physicsMode.superposition = true;
    this.secondWavePacket = { ...this.params, ...secondPacketParams };
  }

  disableSuperposition() {
    this.physicsMode.superposition = false;
    this.secondWavePacket = null;
  }
}