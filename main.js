// // import './style.css'
// import { QuantumEngine } from './quantum-engine.js'
// import { UIControls } from './ui-controls.js'
// import { Visualizer } from './visualizer.js'
// import { HeatmapVisualizer } from './HeatmapVisualizer.js' // NEW
// import { RecordingService } from './RecordingService.js'   // NEW

// class QuantumWaveApp {
//   constructor() {
//     this.engine = new QuantumEngine();
    
//     // Pass 'this' (the app) to controls for recorder access
//     this.controls = new UIControls(this.engine, this, () => this.render());
    
//     this.setupDOM(); 
    
//     // Primary 1D visualizer
//     this.visualizer = new Visualizer(this.canvas, this.engine);
//     // NEW: Secondary 2D heatmap visualizer
//     this.heatmapVisualizer = new HeatmapVisualizer(this.canvas, this.engine);
//     this.isHeatmap = false;

//     // NEW: Recording state
//     this.recorder = null;
//     this.isRecording = false;
    
//     this.setupEventListeners();
//     this.loadStateFromURL();
//     this.animate();
//   }

//   setupDOM() {
//     this.canvas = document.getElementById('quantum-canvas');
//     if (!this.canvas) {
//       console.error('Canvas element not found!');
//       return;
//     }
//     this.setCanvasSize();

//     const controlsContainer = document.getElementById('controls-container');
//     if (controlsContainer) {
//       const controlsPanel = this.controls.create();
//       controlsContainer.appendChild(controlsPanel);
//     } else {
//       console.error('Controls container not found!');
//     }
//   }

//   setCanvasSize() {
//     const container = this.canvas.parentElement;
//     const rect = container.getBoundingClientRect();
//     this.canvas.width = rect.width;
//     this.canvas.height = rect.height;
//   }

//   setupEventListeners() {
//     window.addEventListener('resize', () => {
//       this.setCanvasSize();
//       this.visualizer.resize();
//       this.heatmapVisualizer.resize(); // NEW
//       this.render();
//     });

//     this.canvas.addEventListener('click', (e) => {
//       // NEW: Only allow click-to-place in 1D mode
//       if (this.isHeatmap) return; 

//       const coords = this.visualizer.getCanvasCoordinates(e);
//       if (this.visualizer.isInsidePlotArea(coords.canvasX, coords.canvasY)) {
//         this.engine.setWavePacketPosition(coords.x);
//         this.engine.reset();
//         this.render();
//       }
//     });

//     document.addEventListener('keydown', (e) => {
//       // Prevent scrolling if arrow keys are used
//       if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
//           e.preventDefault();
//       }
        
//       switch(e.key) {
//         case ' ':
//           this.engine.togglePause();
//           const pauseBtn = document.getElementById('pause-btn');
//           if (pauseBtn) {
//             pauseBtn.textContent = this.engine.paused ? 'Resume' : 'Pause';
//           }
//           break;
//         case 'r':
//         case 'R':
//           this.engine.reset();
//           if (this.isHeatmap) this.heatmapVisualizer.reset(); // NEW
//           this.render();
//           break;
//         case '1':
//           this.engine.toggleVisibility('real');
//           document.getElementById('toggle-real').checked = this.engine.visibility.real;
//           this.render();
//           break;
//         case '2':
//           this.engine.toggleVisibility('imag');
//           document.getElementById('toggle-imag').checked = this.engine.visibility.imag;
//           this.render();
//           break;
//         case '3':
//           this.engine.toggleVisibility('probDensity');
//           document.getElementById('toggle-probDensity').checked = this.engine.visibility.probDensity;
//           this.render();
//           break;
//         case 'm':
//         case 'M':
//           this.visualizer.toggleMomentumSpace();
//           this.render();
//           break;
          
//         // NEW: Keyboard panning
//         case 'ArrowLeft':
//           this.engine.panView(-1);
//           this.render();
//           break;
//         case 'ArrowRight':
//           this.engine.panView(1);
//           this.render();
//           break;
//       }
//     });

//     // NEW: Toggle Heatmap
//     const toggleHeatmapBtn = document.getElementById('toggle-heatmap');
//     if (toggleHeatmapBtn) {
//       toggleHeatmapBtn.addEventListener('click', () => {
//         this.isHeatmap = !this.isHeatmap;
//         this.engine.reset();
//         this.heatmapVisualizer.reset();
//         // Disable momentum space if heatmap is on
//         document.getElementById('toggle-momentum').disabled = this.isHeatmap;
//         this.render();
//       });
//     }

//     const toggleMomentumBtn = document.getElementById('toggle-momentum');
//     if (toggleMomentumBtn) {
//       toggleMomentumBtn.addEventListener('click', () => {
//         if (this.isHeatmap) return; // Don't toggle if in heatmap mode
//         this.visualizer.toggleMomentumSpace();
//         this.render();
//       });
//     }

//     const shareBtn = document.getElementById('share-state');
//     if (shareBtn) {
//       shareBtn.addEventListener('click', () => {
//         this.shareState();
//       });
//     }
//   }

//   // --- NEW: Recording Methods ---
//   startRecording(format) {
//     if (this.isRecording) return;
    
//     // Force a resize to ensure canvas is correct size before recording
//     this.setCanvasSize();
//     this.render();

//     this.recorder = new RecordingService(this.canvas, format);
//     this.recorder.start();
//     this.isRecording = true;
//     console.log(`Recording started... (format: ${format})`);
//   }

//   stopRecording() {
//     if (!this.isRecording || !this.recorder) return;
//     this.recorder.stop();
//     this.isRecording = false;
//     this.recorder = null;
//     console.log("Recording stopped and saved.");
//   }
  
//   // --- End Recording Methods ---

//   shareState() {
//     const state = {
//       params: this.engine.params,
//       time: this.engine.time,
//       physics: this.engine.physicsMode,
//       potentialParams: this.engine.potentialParams, // NEW
//       customPsi: this.engine.customPsiString // NEW
//     };

//     const stateString = btoa(JSON.stringify(state));
//     const url = `${window.location.origin}${window.location.pathname}?state=${stateString}`;

//     navigator.clipboard.writeText(url).then(() => {
//       alert('Simulation state copied to clipboard!');
//     }).catch(() => {
//       prompt('Copy this URL to share your simulation:', url);
//     });
//   }

//   loadStateFromURL() {
//     const params = new URLSearchParams(window.location.search);
//     const stateParam = params.get('state');

//     if (stateParam) {
//       try {
//         const state = JSON.parse(atob(stateParam));
//         this.engine.params = state.params;
//         this.engine.time = state.time || 0;
        
//         if (state.physics) {
//           this.engine.physicsMode = state.physics;
//           document.getElementById('toggle-dispersion').checked = state.physics.dispersion;
//           document.getElementById('potential-select').value = state.physics.potential;
//           document.getElementById('toggle-superposition').checked = state.physics.superposition;
//           document.getElementById('toggle-custom-psi').checked = state.physics.customFunction;
//         }

//         if (state.potentialParams) { // NEW
//           this.engine.potentialParams = state.potentialParams;
//           this.engine.setPotential(this.engine.physicsMode.potential); // Re-apply potential with loaded params
//         }
        
//         if (state.customPsi) { // NEW
//            this.engine.setCustomFunction(state.customPsi);
//            document.getElementById('custom-psi-input').value = state.customPsi;
//         }
        
//         this.controls.applyPreset(state.params); 
//         this.controls.updatePhysicsUI();
//         this.controls.updatePotentialUI();

//         this.render();
//       } catch (e) {
//         console.error('Failed to load state from URL:', e);
//       }
//     }
//   }

//   animate() {
//     this.engine.update();
    
//     let waveData;
//     // NEW: Render correct visualizer
//     if (this.isHeatmap) {
//       waveData = this.heatmapVisualizer.render();
//     } else {
//       waveData = this.visualizer.render();
//     }

//     this.controls.updateTimeDisplay();

//     if (waveData) {
//       const expectationValues = this.engine.computeExpectationValues(waveData);
//       this.controls.updateExpectationValues(expectationValues);
//     }

//     // NEW: Capture frame if recording
//     if (this.isRecording && !this.engine.paused) {
//       this.recorder.captureFrame();
//     }

//     requestAnimationFrame(() => this.animate());
//   }

//   render() {
//     // This is now just a static render call, logic moved to animate()
//     if (this.isHeatmap) {
//       return this.heatmapVisualizer.render();
//     } else {
//       return this.visualizer.render();
//     }
//   }
// }

// new QuantumWaveApp();


// import './style.css'
import { QuantumEngine } from './quantum-engine.js'
import { UIControls } from './ui-controls.js'
import { Visualizer } from './visualizer.js'
import { HeatmapVisualizer } from './HeatmapVisualizer.js'
import { RecordingService } from './RecordingService.js'

class QuantumWaveApp {
  constructor() {
    this.engine = new QuantumEngine();
    
    this.controls = new UIControls(this.engine, this, () => this.render());
    
    this.setupDOM(); 
    
    this.visualizer = new Visualizer(this.canvas, this.engine);
    this.heatmapVisualizer = new HeatmapVisualizer(this.canvas, this.engine);
    this.isHeatmap = false;
    this.isMomentumSpace = false; // NEW: Track momentum space state

    this.recorder = null;
    this.isRecording = false;
    
    this.setupEventListeners();
    this.loadStateFromURL();
    this.animate();
  }

  setupDOM() {
    this.canvas = document.getElementById('quantum-canvas');
    if (!this.canvas) {
      console.error('Canvas element not found!');
      return;
    }
    this.setCanvasSize();

    // Find new pan buttons
    this.panLeftBtn = document.getElementById('pan-left-btn');
    this.panRightBtn = document.getElementById('pan-right-btn');

    const controlsContainer = document.getElementById('controls-container');
    if (controlsContainer) {
      const controlsPanel = this.controls.create();
      controlsContainer.appendChild(controlsPanel);
    } else {
      console.error('Controls container not found!');
    }
  }

  setCanvasSize() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.setCanvasSize();
      this.visualizer.resize();
      this.heatmapVisualizer.resize();
      this.render();
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.isHeatmap || this.isMomentumSpace) return; 

      const coords = this.visualizer.getCanvasCoordinates(e);
      if (this.visualizer.isInsidePlotArea(coords.canvasX, coords.canvasY)) {
        this.engine.setWavePacketPosition(coords.x);
        this.engine.reset();
        this.render();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
      }
        
      switch(e.key) {
        case ' ':
          this.engine.togglePause();
          this.controls.updatePauseButton();
          break;
        case 'r':
        case 'R':
          this.engine.reset();
          if (this.isHeatmap) this.heatmapVisualizer.reset();
          this.render();
          break;
        case '1':
          this.engine.toggleVisibility('real');
          document.getElementById('toggle-real').checked = this.engine.visibility.real;
          this.render();
          break;
        case '2':
          this.engine.toggleVisibility('imag');
          document.getElementById('toggle-imag').checked = this.engine.visibility.imag;
          this.render();
          break;
        case '3':
          this.engine.toggleVisibility('probDensity');
          document.getElementById('toggle-probDensity').checked = this.engine.visibility.probDensity;
          this.render();
          break;
        case 'm':
        case 'M':
          this.toggleMomentumSpace();
          break;
        case 'ArrowLeft':
          this.panView(-1);
          break;
        case 'ArrowRight':
          this.panView(1);
          break;
      }
    });

    // --- Button Listeners ---
    
    // NEW: On-canvas pan button listeners
    if (this.panLeftBtn) {
        this.panLeftBtn.addEventListener('click', () => this.panView(-1));
    }
    if (this.panRightBtn) {
        this.panRightBtn.addEventListener('click', () => this.panView(1));
    }

    const toggleHeatmapBtn = document.getElementById('toggle-heatmap');
    if (toggleHeatmapBtn) {
      toggleHeatmapBtn.addEventListener('click', () => {
        this.isHeatmap = !this.isHeatmap;
        this.engine.reset();
        this.heatmapVisualizer.reset();
        
        // Disable momentum space if heatmap is on
        document.getElementById('toggle-momentum').disabled = this.isHeatmap;
        if (this.isHeatmap && this.isMomentumSpace) {
            this.toggleMomentumSpace(); // Force momentum off
        }
        this.updateCanvasButtonVisibility();
        this.render();
      });
    }

    const toggleMomentumBtn = document.getElementById('toggle-momentum');
    if (toggleMomentumBtn) {
      toggleMomentumBtn.addEventListener('click', () => {
        if (this.isHeatmap) return;
        this.toggleMomentumSpace();
      });
    }

    const shareBtn = document.getElementById('share-state');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareState());
    }
  }

  // --- NEW: Helper functions ---

  panView(direction) {
      if (this.isHeatmap || this.isMomentumSpace) return; // No pan in these modes
      this.engine.panView(direction);
      this.render();
  }

  toggleMomentumSpace() {
      if (this.isHeatmap) return;
      this.isMomentumSpace = !this.isMomentumSpace;
      this.visualizer.toggleMomentumSpace();
      this.updateCanvasButtonVisibility();
      this.render();
  }
  
  updateCanvasButtonVisibility() {
      const isHidden = this.isHeatmap || this.isMomentumSpace;
      if (this.panLeftBtn) this.panLeftBtn.classList.toggle('hidden', isHidden);
      if (this.panRightBtn) this.panRightBtn.classList.toggle('hidden', isHidden);
  }

  // --- NEW: Updated Recording Methods ---
  
  startRecording(format) {
    if (this.isRecording) return;
    this.setCanvasSize(); // Ensure size
    this.render();

    this.recorder = new RecordingService(this.canvas, format);
    this.recorder.start();
    this.isRecording = true;
    this.controls.updateRecordingStatus('Recording...', true);
    console.log(`Recording started... (format: ${format})`);
  }

  stopRecording() {
    if (!this.isRecording || !this.recorder) return;
    
    this.controls.updateRecordingStatus('Compiling... Please wait.', true);
    
    // Use a short timeout to allow the "Compiling" message to render
    setTimeout(() => {
        this.recorder.stop((success) => {
            if (success) {
                console.log("Recording compiled.");
                this.controls.updateRecordingStatus('Ready to Download!', false, true);
            } else {
                console.error("Recording failed to compile.");
                this.controls.updateRecordingStatus('Error! Check console.', false, false);
            }
        });
        this.isRecording = false;
    }, 100);
  }
  
  downloadRecording() {
      if (this.recorder) {
          this.recorder.save();
          this.controls.updateRecordingStatus('Idle', false, false);
      }
  }

  // --- End Recording Methods ---

  shareState() {
    // ... (unchanged)
    const state = {
      params: this.engine.params,
      time: this.engine.time,
      physics: this.engine.physicsMode,
      potentialParams: this.engine.potentialParams,
      customPsi: this.engine.customPsiString
    };
    const stateString = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?state=${stateString}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Simulation state copied to clipboard!');
    }).catch(() => {
      prompt('Copy this URL to share your simulation:', url);
    });
  }

  loadStateFromURL() {
    // ... (unchanged)
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    if (stateParam) {
      try {
        const state = JSON.parse(atob(stateParam));
        this.engine.params = state.params;
        this.engine.time = state.time || 0;
        
        if (state.physics) {
          this.engine.physicsMode = state.physics;
          document.getElementById('toggle-dispersion').checked = state.physics.dispersion;
          document.getElementById('potential-select').value = state.physics.potential;
          document.getElementById('toggle-superposition').checked = state.physics.superposition;
          document.getElementById('toggle-custom-psi').checked = state.physics.customFunction;
        }

        if (state.potentialParams) {
          this.engine.potentialParams = state.potentialParams;
          this.engine.setPotential(this.engine.physicsMode.potential);
        }
        
        if (state.customPsi) {
           this.engine.setCustomFunction(state.customPsi);
           document.getElementById('custom-psi-input').value = state.customPsi;
        }
        
        this.controls.applyPreset(state.params); 
        this.controls.updatePhysicsUI();
        this.controls.updatePotentialUI();

        this.render();
      } catch (e) {
        console.error('Failed to load state from URL:', e);
      }
    }
  }

  animate() {
    this.engine.update();
    
    let waveData;
    if (this.isHeatmap) {
      waveData = this.heatmapVisualizer.render();
    } else {
      waveData = this.visualizer.render();
    }

    this.controls.updateTimeDisplay();
    
    // NEW: Update velocity display
    if (!this.isHeatmap && !this.isMomentumSpace) {
        const velocities = this.engine.getVelocities(this.engine.time);
        this.controls.updateVelocityDisplay(velocities);
    } else {
        this.controls.updateVelocityDisplay(null); // Hide it
    }

    if (waveData) {
      const expectationValues = this.engine.computeExpectationValues(waveData);
      this.controls.updateExpectationValues(expectationValues);
    }

    if (this.isRecording && !this.engine.paused) {
      this.recorder.captureFrame();
    }

    requestAnimationFrame(() => this.animate());
  }

  render() {
    if (this.isHeatmap) {
      return this.heatmapVisualizer.render();
    } else {
      return this.visualizer.render();
    }
  }
}

new QuantumWaveApp();
