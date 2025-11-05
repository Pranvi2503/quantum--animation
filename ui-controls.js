// // export class UIControls {
// //   constructor(engine, onUpdate) {
// //     this.engine = engine;
// //     this.onUpdate = onUpdate;
// //     this.container = null;
// //     this.sliders = {};
// //     this.presets = this.initializePresets();
// //   }

// //   initializePresets() {
// //     return {
// //       'gaussian': {
// //         name: 'Gaussian Wave Packet',
// //         params: { A: 1.0, k: 5.0, omega: 2.0, sigma: 0.5, v: 0.3, x0: 0 }
// //       },
// //       'fast-packet': {
// //         name: 'Fast Moving Packet',
// //         params: { A: 1.0, k: 10.0, omega: 5.0, sigma: 0.3, v: 0.8, x0: -3 }
// //       },
// //       'wide-packet': {
// //         name: 'Wide Packet',
// //         params: { A: 0.8, k: 3.0, omega: 1.5, sigma: 1.2, v: 0.2, x0: 0 }
// //       },
// //       'narrow-packet': {
// //         name: 'Narrow Packet',
// //         params: { A: 1.5, k: 8.0, omega: 3.0, sigma: 0.2, v: 0.4, x0: 0 }
// //       },
// //       'standing': {
// //         name: 'Standing Wave',
// //         params: { A: 1.0, k: 6.0, omega: 0.0, sigma: 0.6, v: 0.0, x0: 0 }
// //       }
// //     };
// //   }

// //   create() {
// //     this.container = document.createElement('div');
// //     this.container.className = 'controls-panel';

// //     const title = document.createElement('h2');
// //     title.textContent = 'Quantum Wave Controls';
// //     this.container.appendChild(title);

// //     this.createTimeDisplay();
// //     this.createActionButtons();
// //     this.createParameterSliders();
// //     this.createVisibilityToggles();
// //     this.createPhysicsModes();
// //     this.createPresetSelector();
// //     this.createAdvancedOptions();

// //     return this.container;
// //   }

// //   createTimeDisplay() {
// //     const timeSection = document.createElement('div');
// //     timeSection.className = 'control-section time-display';

// //     const label = document.createElement('div');
// //     label.className = 'time-label';
// //     label.textContent = 'Time:';

// //     const value = document.createElement('div');
// //     value.className = 'time-value';
// //     value.id = 'time-value';
// //     value.textContent = '0.00';

// //     timeSection.appendChild(label);
// //     timeSection.appendChild(value);
// //     this.container.appendChild(timeSection);
// //   }

// //   createActionButtons() {
// //     const buttonSection = document.createElement('div');
// //     buttonSection.className = 'control-section button-group';

// //     const pauseBtn = document.createElement('button');
// //     pauseBtn.id = 'pause-btn';
// //     pauseBtn.className = 'control-btn';
// //     pauseBtn.textContent = 'Pause';
// //     pauseBtn.addEventListener('click', () => {
// //       this.engine.togglePause();
// //       pauseBtn.textContent = this.engine.paused ? 'Resume' : 'Pause';
// //     });

// //     const resetBtn = document.createElement('button');
// //     resetBtn.id = 'reset-btn';
// //     resetBtn.className = 'control-btn';
// //     resetBtn.textContent = 'Reset';
// //     resetBtn.addEventListener('click', () => {
// //       this.engine.reset();
// //       this.onUpdate();
// //     });

// //     buttonSection.appendChild(pauseBtn);
// //     buttonSection.appendChild(resetBtn);
// //     this.container.appendChild(buttonSection);
// //   }

// //   createParameterSliders() {
// //     const sliderSection = document.createElement('div');
// //     sliderSection.className = 'control-section';

// //     const title = document.createElement('h3');
// //     title.textContent = 'Wave Parameters';
// //     sliderSection.appendChild(title);

// //     const parameters = [
// //       { name: 'A', label: 'Amplitude (A)', min: 0.1, max: 3, step: 0.1, value: 1.0 },
// //       { name: 'k', label: 'Wave Number (k)', min: 1, max: 20, step: 0.5, value: 5.0 },
// //       { name: 'omega', label: 'Frequency (ω)', min: 0, max: 10, step: 0.5, value: 2.0 },
// //       { name: 'sigma', label: 'Width (σ)', min: 0.1, max: 2, step: 0.1, value: 0.5 },
// //       { name: 'v', label: 'Velocity (v)', min: -1, max: 1, step: 0.1, value: 0.3 }
// //     ];

// //     parameters.forEach(param => {
// //       const sliderGroup = this.createSlider(param);
// //       sliderSection.appendChild(sliderGroup);
// //     });

// //     this.container.appendChild(sliderSection);
// //   }

// //   createSlider(config) {
// //     const group = document.createElement('div');
// //     group.className = 'slider-group';

// //     const label = document.createElement('label');
// //     label.textContent = config.label;

// //     const valueDisplay = document.createElement('span');
// //     valueDisplay.className = 'slider-value';
// //     valueDisplay.textContent = config.value.toFixed(2);

// //     const slider = document.createElement('input');
// //     slider.type = 'range';
// //     slider.className = 'slider';
// //     slider.min = config.min;
// //     slider.max = config.max;
// //     slider.step = config.step;
// //     slider.value = config.value;

// //     slider.addEventListener('input', (e) => {
// //       const value = parseFloat(e.target.value);
// //       valueDisplay.textContent = value.toFixed(2);
// //       this.engine.setParam(config.name, value);
// //       this.onUpdate();
// //     });

// //     this.sliders[config.name] = { slider, valueDisplay, label };

// //     label.appendChild(valueDisplay);
// //     group.appendChild(label);
// //     group.appendChild(slider);

// //     return group;
// //   }

// //   createVisibilityToggles() {
// //     const toggleSection = document.createElement('div');
// //     toggleSection.className = 'control-section';

// //     const title = document.createElement('h3');
// //     title.textContent = 'Display Options';
// //     toggleSection.appendChild(title);

// //     const options = [
// //       { id: 'real', label: 'Re(ψ) - Real Part', checked: true, key: '1' },
// //       { id: 'imag', label: 'Im(ψ) - Imaginary Part', checked: true, key: '2' },
// //       { id: 'probDensity', label: '|ψ|² - Probability Density', checked: true, key: '3' }
// //     ];

// //     options.forEach(option => {
// //       const checkboxGroup = document.createElement('div');
// //       checkboxGroup.className = 'checkbox-group';

// //       const checkbox = document.createElement('input');
// //       checkbox.type = 'checkbox';
// //       checkbox.id = `toggle-${option.id}`;
// //       checkbox.checked = option.checked;
// //       checkbox.addEventListener('change', (e) => {
// //         this.engine.toggleVisibility(option.id);
// //         this.onUpdate();
// //       });

// //       const label = document.createElement('label');
// //       label.htmlFor = `toggle-${option.id}`;
// //       label.innerHTML = `${option.label} <kbd>${option.key}</kbd>`;

// //       checkboxGroup.appendChild(checkbox);
// //       checkboxGroup.appendChild(label);
// //       toggleSection.appendChild(checkboxGroup);
// //     });

// //     this.container.appendChild(toggleSection);
// //   }

// //   createPhysicsModes() {
// //     const physicsSection = document.createElement('div');
// //     physicsSection.className = 'control-section';

// //     const title = document.createElement('h3');
// //     title.textContent = 'Physics Features';
// //     physicsSection.appendChild(title);

// //     const dispersionCheckbox = document.createElement('div');
// //     dispersionCheckbox.className = 'checkbox-group';

// //     const dispersionInput = document.createElement('input');
// //     dispersionInput.type = 'checkbox';
// //     dispersionInput.id = 'toggle-dispersion';
// //     dispersionInput.addEventListener('change', (e) => {
// //       this.engine.physicsMode.dispersion = e.target.checked;
      
// //       // NEW: Disable 'v' slider if dispersion is on
// //       this.updatePhysicsUI();
      
// //       this.onUpdate();
// //     });

// //     const dispersionLabel = document.createElement('label');
// //     dispersionLabel.htmlFor = 'toggle-dispersion';
// //     dispersionLabel.textContent = 'Enable Dispersion (ω = ℏk²/2m)';

// //     dispersionCheckbox.appendChild(dispersionInput);
// //     dispersionCheckbox.appendChild(dispersionLabel);
// //     physicsSection.appendChild(dispersionCheckbox);

// //     const potentialSelect = document.createElement('div');
// //     potentialSelect.className = 'select-group';

// //     const potentialLabel = document.createElement('label');
// //     potentialLabel.textContent = 'Potential:';

// //     const select = document.createElement('select');
// //     select.id = 'potential-select';
// //     select.className = 'potential-select';

// //     const potentials = [
// //       { value: 'none', label: 'None' },
// //       { value: 'barrier', label: 'Potential Barrier' },
// //       { value: 'well', label: 'Potential Well' },
// //       { value: 'step', label: 'Potential Step' }
// //     ];

// //     potentials.forEach(pot => {
// //       const option = document.createElement('option');
// //       option.value = pot.value;
// //       option.textContent = pot.label;
// //       select.appendChild(option);
// //     });

// //     select.addEventListener('change', (e) => {
// //       const type = e.target.value;
// //       this.engine.physicsMode.potential = type; // Save mode
// //       if (type === 'none') {
// //         this.engine.initializePotential();
// //       } else {
// //         // Example params, you could add UI for these
// //         this.engine.setPotential(type, { x: 1.5, width: 0.8, height: 5, depth: -5 });
// //       }
// //       this.onUpdate();
// //     });

// //     potentialSelect.appendChild(potentialLabel);
// //     potentialSelect.appendChild(select);
// //     physicsSection.appendChild(potentialSelect);

// //     const superpositionCheckbox = document.createElement('div');
// //     superpositionCheckbox.className = 'checkbox-group';

// //     const superpositionInput = document.createElement('input');
// //     superpositionInput.type = 'checkbox';
// //     superpositionInput.id = 'toggle-superposition';
// //     superpositionInput.addEventListener('change', (e) => {
// //       this.engine.physicsMode.superposition = e.target.checked; // Save mode
// //       if (e.target.checked) {
// //         // Example params, you could add UI for these
// //         this.engine.enableSuperposition({ k: 8, v: -0.3, x0: 2, A: 1.0, omega: 2.0, sigma: 0.5 });
// //       } else {
// //         this.engine.disableSuperposition();
// //       }
// //       this.onUpdate();
// //     });

// //     const superpositionLabel = document.createElement('label');
// //     superpositionLabel.htmlFor = 'toggle-superposition';
// //     superpositionLabel.textContent = 'Superposition (2 Wave Packets)';

// //     superpositionCheckbox.appendChild(superpositionInput);
// //     superpositionCheckbox.appendChild(superpositionLabel);
// //     physicsSection.appendChild(superpositionCheckbox);

// //     this.container.appendChild(physicsSection);
// //   }

// //   createPresetSelector() {
// //     const presetSection = document.createElement('div');
// //     presetSection.className = 'control-section';

// //     const title = document.createElement('h3');
// //     title.textContent = 'Presets';
// //     presetSection.appendChild(title);

// //     const select = document.createElement('select');
// //     select.className = 'preset-select';

// //     const defaultOption = document.createElement('option');
// //     defaultOption.value = '';
// //     defaultOption.textContent = 'Select a preset...';
// //     select.appendChild(defaultOption);

// //     Object.entries(this.presets).forEach(([key, preset]) => {
// //       const option = document.createElement('option');
// //       option.value = key;
// //       option.textContent = preset.name;
// //       select.appendChild(option);
// //     });

// //     select.addEventListener('change', (e) => {
// //       const presetKey = e.target.value;
// //       if (presetKey && this.presets[presetKey]) {
// //         this.applyPreset(this.presets[presetKey].params);
// //         select.value = '';
// //       }
// //     });

// //     presetSection.appendChild(select);
// //     this.container.appendChild(presetSection);
// //   }

// //   createAdvancedOptions() {
// //     const advancedSection = document.createElement('div');
// //     advancedSection.className = 'control-section';

// //     const title = document.createElement('h3');
// //     title.textContent = 'Advanced';
// //     advancedSection.appendChild(title);

// //     const trailCheckbox = document.createElement('div');
// //     trailCheckbox.className = 'checkbox-group';

// //     const trailInput = document.createElement('input');
// //     trailInput.type = 'checkbox';
// //     trailInput.id = 'toggle-trail';
// //     trailInput.addEventListener('change', (e) => {
// //       this.engine.trail.enabled = e.target.checked;
// //       if (!e.target.checked) {
// //         this.engine.trail.history = [];
// //       }
// //       this.onUpdate();
// //     });

// //     const trailLabel = document.createElement('label');
// //     trailLabel.htmlFor = 'toggle-trail';
// //     trailLabel.textContent = 'Show Wave Trail';

// //     trailCheckbox.appendChild(trailInput);
// //     trailCheckbox.appendChild(trailLabel);
// //     advancedSection.appendChild(trailCheckbox);

// //     const infoDiv = document.createElement('div');
// //     infoDiv.className = 'info-display';
// //     infoDiv.id = 'expectation-values';
// //     advancedSection.appendChild(infoDiv);

// //     this.container.appendChild(advancedSection);
// //   }

// //   applyPreset(params) {
// //     Object.entries(params).forEach(([key, value]) => {
// //       this.engine.setParam(key, value);
// //       if (this.sliders[key]) {
// //         this.sliders[key].slider.value = value;
// //         this.sliders[key].valueDisplay.textContent = value.toFixed(2);
// //       }
// //     });
// //     this.engine.reset();
// //     this.onUpdate();
// //   }

// //   updateTimeDisplay() {
// //     const timeDisplay = document.getElementById('time-value');
// //     if (timeDisplay) {
// //       timeDisplay.textContent = this.engine.time.toFixed(2);
// //     }
// //   }

// //   updateExpectationValues(values) {
// //     const display = document.getElementById('expectation-values');
// //     if (display && values) {
// //       display.innerHTML = `
// //         <div class="expectation-item">⟨x⟩ = ${values.position.toFixed(3)}</div>
// //         <div class="expectation-item">⟨p⟩ = ${values.momentum.toFixed(3)}</div>
// //         <div class="expectation-item">⟨E⟩ = ${values.energy.toFixed(3)}</div>
// //       `;
// //     }
// //   }
  
// //   // New method to update UI based on physics state
// //   updatePhysicsUI() {
// //     const dispersionOn = this.engine.physicsMode.dispersion;
// //     const vSliderGroup = this.sliders['v'];
    
// //     if (vSliderGroup) {
// //       vSliderGroup.slider.disabled = dispersionOn;
// //       vSliderGroup.label.style.color = dispersionOn ? '#888' : '#ccccdd';
// //       vSliderGroup.slider.style.opacity = dispersionOn ? 0.5 : 1.0;
// //       vSliderGroup.valueDisplay.style.color = dispersionOn ? '#888' : '#00ffff';
// //     }

// //     // Also disable omega, as it's also calculated
// //     const omegaSliderGroup = this.sliders['omega'];
// //     if (omegaSliderGroup) {
// //       omegaSliderGroup.slider.disabled = dispersionOn;
// //       omegaSliderGroup.label.style.color = dispersionOn ? '#888' : '#ccccdd';
// //       omegaSliderGroup.slider.style.opacity = dispersionOn ? 0.5 : 1.0;
// //       omegaSliderGroup.valueDisplay.style.color = dispersionOn ? '#888' : '#00ffff';
// //     }
// //   }
// // }



// export class UIControls {
//   constructor(engine, app, onUpdate) { // NEW: pass 'app' for recording
//     this.engine = engine;
//     this.app = app; // NEW
//     this.onUpdate = onUpdate;
//     this.container = null;
//     this.sliders = {};
//     this.potentialSettingsPanel = null; // NEW: To store the panel reference
//     this.presets = this.initializePresets();
//   }

//   initializePresets() {
//     // ... (content unchanged)
//     return {
//       'gaussian': {
//         name: 'Gaussian Wave Packet',
//         params: { A: 1.0, k: 5.0, omega: 2.0, sigma: 0.5, v: 0.3, x0: 0 }
//       },
//       'fast-packet': {
//         name: 'Fast Moving Packet',
//         params: { A: 1.0, k: 10.0, omega: 5.0, sigma: 0.3, v: 0.8, x0: -3 }
//       },
//       'wide-packet': {
//         name: 'Wide Packet',
//         params: { A: 0.8, k: 3.0, omega: 1.5, sigma: 1.2, v: 0.2, x0: 0 }
//       },
//       'narrow-packet': {
//         name: 'Narrow Packet',
//         params: { A: 1.5, k: 8.0, omega: 3.0, sigma: 0.2, v: 0.4, x0: 0 }
//       },
//       'standing': {
//         name: 'Standing Wave',
//         params: { A: 1.0, k: 6.0, omega: 0.0, sigma: 0.6, v: 0.0, x0: 0 }
//       }
//     };
//   }

//   create() {
//     this.container = document.createElement('div');
//     this.container.className = 'controls-panel';

//     const title = document.createElement('h2');
//     title.textContent = 'Quantum Wave Controls';
//     this.container.appendChild(title);

//     this.createTimeDisplay();
//     this.createActionButtons();
//     this.createViewControls(); // NEW
//     this.createParameterSliders();
//     this.createVisibilityToggles();
//     this.createPhysicsModes();
//     this.createPotentialSettings(); // NEW
//     this.createCustomFunctionPanel(); // NEW
//     this.createPresetSelector();
//     this.createAdvancedOptions();
//     this.createRecordingPanel(); // NEW

//     // Initial UI state setup
//     this.updatePotentialUI(); // BUG FIX: This is now safe to call
//     this.updatePhysicsUI();

//     return this.container;
//   }

//   createTimeDisplay() {
//     // ... (content unchanged)
//     const timeSection = document.createElement('div');
//     timeSection.className = 'control-section time-display';
//     const label = document.createElement('div');
//     label.className = 'time-label';
//     label.textContent = 'Time:';
//     const value = document.createElement('div');
//     value.className = 'time-value';
//     value.id = 'time-value';
//     value.textContent = '0.00';
//     timeSection.appendChild(label);
//     timeSection.appendChild(value);
//     this.container.appendChild(timeSection);
//   }

//   createActionButtons() {
//     // ... (content unchanged)
//     const buttonSection = document.createElement('div');
//     buttonSection.className = 'control-section button-group';
//     const pauseBtn = document.createElement('button');
//     pauseBtn.id = 'pause-btn';
//     pauseBtn.className = 'control-btn';
//     pauseBtn.textContent = 'Pause';
//     pauseBtn.addEventListener('click', () => {
//       this.engine.togglePause();
//       pauseBtn.textContent = this.engine.paused ? 'Resume' : 'Pause';
//     });
//     const resetBtn = document.createElement('button');
//     resetBtn.id = 'reset-btn';
//     resetBtn.className = 'control-btn';
//     resetBtn.textContent = 'Reset';
//     resetBtn.addEventListener('click', () => {
//       this.engine.reset();
//       if (this.app.isHeatmap) this.app.heatmapVisualizer.reset();
//       this.onUpdate();
//     });
//     buttonSection.appendChild(pauseBtn);
//     buttonSection.appendChild(resetBtn);
//     this.container.appendChild(buttonSection);
//   }

//   createViewControls() {
//     const viewSection = document.createElement('div');
//     viewSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'View Controls';
//     viewSection.appendChild(title);
//     const buttonGroup = document.createElement('div');
//     buttonGroup.className = 'button-group';
//     const panLeftBtn = document.createElement('button');
//     panLeftBtn.className = 'control-btn';
//     panLeftBtn.textContent = 'Pan Left (<)';
//     panLeftBtn.addEventListener('click', () => {
//       this.engine.panView(-1);
//       this.onUpdate();
//     });
//     const panRightBtn = document.createElement('button');
//     panRightBtn.className = 'control-btn';
//     panRightBtn.textContent = 'Pan Right (>)';
//     panRightBtn.addEventListener('click', () => {
//       this.engine.panView(1);
//       this.onUpdate();
//     });
//     buttonGroup.appendChild(panLeftBtn);
//     buttonGroup.appendChild(panRightBtn);
//     viewSection.appendChild(buttonGroup);
//     this.container.appendChild(viewSection);
//   }

//   createParameterSliders() {
//     // ... (content unchanged)
//     const sliderSection = document.createElement('div');
//     sliderSection.className = 'control-section';
//     sliderSection.id = 'wave-params-section'; // NEW ID
//     const title = document.createElement('h3');
//     title.textContent = 'Wave Parameters';
//     sliderSection.appendChild(title);
//     const parameters = [
//       { name: 'A', label: 'Amplitude (A)', min: 0.1, max: 3, step: 0.1, value: this.engine.params.A },
//       { name: 'k', label: 'Wave Number (k)', min: 1, max: 20, step: 0.5, value: this.engine.params.k },
//       { name: 'omega', label: 'Frequency (ω)', min: 0, max: 10, step: 0.5, value: this.engine.params.omega },
//       { name: 'sigma', label: 'Width (σ)', min: 0.1, max: 2, step: 0.1, value: this.engine.params.sigma },
//       { name: 'v', label: 'Velocity (v)', min: -1, max: 1, step: 0.1, value: this.engine.params.v },
//       { name: 'x0', label: 'Initial Position (x₀)', min: -5, max: 5, step: 0.1, value: this.engine.params.x0 } // NEW x0 slider
//     ];
//     parameters.forEach(param => {
//       const sliderGroup = this.createSlider(param);
//       sliderSection.appendChild(sliderGroup);
//     });
//     this.container.appendChild(sliderSection);
//   }

//   createSlider(config, onChange) {
//     // ... (content unchanged)
//     const group = document.createElement('div');
//     group.className = 'slider-group';
//     const label = document.createElement('label');
//     label.textContent = config.label;
//     const valueDisplay = document.createElement('span');
//     valueDisplay.className = 'slider-value';
//     valueDisplay.textContent = config.value.toFixed(2);
//     const slider = document.createElement('input');
//     slider.type = 'range';
//     slider.className = 'slider';
//     slider.min = config.min;
//     slider.max = config.max;
//     slider.step = config.step;
//     slider.value = config.value;
//     slider.dataset.param = config.name; // NEW: data attribute
//     slider.addEventListener('input', (e) => {
//       const value = parseFloat(e.target.value);
//       valueDisplay.textContent = value.toFixed(2);
//       if (onChange) {
//         onChange(config.name, value);
//       } else {
//         this.engine.setParam(config.name, value);
//       }
//     });
//     slider.addEventListener('change', () => {
//         this.onUpdate();
//     });
//     this.sliders[config.name] = { slider, valueDisplay, label, group };
//     label.appendChild(valueDisplay);
//     group.appendChild(label);
//     group.appendChild(slider);
//     return group;
//   }

//   createVisibilityToggles() {
//     // ... (content unchanged)
//     const toggleSection = document.createElement('div');
//     toggleSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'Display Options';
//     toggleSection.appendChild(title);
//     const options = [
//       { id: 'real', label: 'Re(ψ) - Real Part', checked: true, key: '1' },
//       { id: 'imag', label: 'Im(ψ) - Imaginary Part', checked: true, key: '2' },
//       { id: 'probDensity', label: '|ψ|² - Probability Density', checked: true, key: '3' }
//     ];
//     options.forEach(option => {
//       const checkboxGroup = document.createElement('div');
//       checkboxGroup.className = 'checkbox-group';
//       const checkbox = document.createElement('input');
//       checkbox.type = 'checkbox';
//       checkbox.id = `toggle-${option.id}`;
//       checkbox.checked = option.checked;
//       checkbox.addEventListener('change', (e) => {
//         this.engine.toggleVisibility(option.id);
//         this.onUpdate();
//       });
//       const label = document.createElement('label');
//       label.htmlFor = `toggle-${option.id}`;
//       label.innerHTML = `${option.label} <kbd>${option.key}</kbd>`;
//       checkboxGroup.appendChild(checkbox);
//       checkboxGroup.appendChild(label);
//       toggleSection.appendChild(checkboxGroup);
//     });
//     this.container.appendChild(toggleSection);
//   }

//   createPhysicsModes() {
//     // ... (content unchanged)
//     const physicsSection = document.createElement('div');
//     physicsSection.className = 'control-section';
//     physicsSection.id = 'physics-features-section'; // NEW ID
//     const title = document.createElement('h3');
//     title.textContent = 'Physics Features';
//     physicsSection.appendChild(title);
//     const dispersionCheckbox = document.createElement('div');
//     dispersionCheckbox.className = 'checkbox-group';
//     const dispersionInput = document.createElement('input');
//     dispersionInput.type = 'checkbox';
//     dispersionInput.id = 'toggle-dispersion';
//     dispersionInput.addEventListener('change', (e) => {
//       this.engine.physicsMode.dispersion = e.target.checked;
//       this.updatePhysicsUI();
//       this.onUpdate();
//     });
//     const dispersionLabel = document.createElement('label');
//     dispersionLabel.htmlFor = 'toggle-dispersion';
//     dispersionLabel.textContent = 'Enable Dispersion (ω = ℏk²/2m)';
//     dispersionCheckbox.appendChild(dispersionInput);
//     dispersionCheckbox.appendChild(dispersionLabel);
//     physicsSection.appendChild(dispersionCheckbox);
//     const potentialSelect = document.createElement('div');
//     potentialSelect.className = 'select-group';
//     const potentialLabel = document.createElement('label');
//     potentialLabel.textContent = 'Potential:';
//     const select = document.createElement('select');
//     select.id = 'potential-select';
//     select.className = 'potential-select';
//     const potentials = [
//       { value: 'none', label: 'None' },
//       { value: 'barrier', label: 'Potential Barrier' },
//       { value: 'well', label: 'Potential Well' },
//       { value: 'step', label: 'Potential Step' }
//     ];
//     potentials.forEach(pot => {
//       const option = document.createElement('option');
//       option.value = pot.value;
//       option.textContent = pot.label;
//       select.appendChild(option);
//     });
//     select.addEventListener('change', (e) => {
//       const type = e.target.value;
//       this.engine.setPotential(type); // Engine now uses stored params
//       this.updatePotentialUI(); // NEW: Show/hide sliders
//       this.onUpdate();
//     });
//     potentialSelect.appendChild(potentialLabel);
//     potentialSelect.appendChild(select);
//     physicsSection.appendChild(potentialSelect);
//     const superpositionCheckbox = document.createElement('div');
//     superpositionCheckbox.className = 'checkbox-group';
//     const superpositionInput = document.createElement('input');
//     superpositionInput.type = 'checkbox';
//     superpositionInput.id = 'toggle-superposition';
//     superpositionInput.addEventListener('change', (e) => {
//       this.engine.physicsMode.superposition = e.target.checked;
//       if (e.target.checked) {
//         this.engine.enableSuperposition({ k: 8, v: -0.3, x0: 2, A: 1.0, omega: 2.0, sigma: 0.5 });
//       } else {
//         this.engine.disableSuperposition();
//       }
//       this.updatePhysicsUI();
//       this.onUpdate();
//     });
//     const superpositionLabel = document.createElement('label');
//     superpositionLabel.htmlFor = 'toggle-superposition';
//     superpositionLabel.textContent = 'Superposition (2 Wave Packets)';
//     superpositionCheckbox.appendChild(superpositionInput);
//     superpositionCheckbox.appendChild(superpositionLabel);
//     physicsSection.appendChild(superpositionCheckbox);
//     this.container.appendChild(physicsSection);
//   }

//   // NEW: Potential Settings Panel
//   createPotentialSettings() {
//     const settingsSection = document.createElement('div');
//     settingsSection.className = 'control-section';
//     settingsSection.id = 'potential-settings'; // To show/hide
    
//     // BUG FIX: Store the reference to the panel itself
//     this.potentialSettingsPanel = settingsSection;

//     const title = document.createElement('h3');
//     title.textContent = 'Potential Settings';
//     settingsSection.appendChild(title);
    
//     const potentialParams = [
//       { name: 'x', label: 'Potential Position (x)', min: -5, max: 5, step: 0.1, value: this.engine.potentialParams.x },
//       { name: 'width', label: 'Potential Width', min: 0.1, max: 3, step: 0.1, value: this.engine.potentialParams.width },
//       { name: 'height', label: 'Potential Height', min: 1, max: 20, step: 0.5, value: this.engine.potentialParams.height },
//       { name: 'depth', label: 'Potential Depth', min: -20, max: -1, step: 0.5, value: this.engine.potentialParams.depth }
//     ];

//     const onPotentialChange = (name, value) => {
//         this.engine.setPotentialParam(name, value);
//     };

//     potentialParams.forEach(param => {
//         const sliderGroup = this.createSlider(param, onPotentialChange);
//         settingsSection.appendChild(sliderGroup);
//     });

//     this.container.appendChild(settingsSection);
//   }

//   // NEW: Custom Function Panel
//   createCustomFunctionPanel() {
//     // ... (content unchanged)
//     const customSection = document.createElement('div');
//     customSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'Custom Wave Function';
//     customSection.appendChild(title);
//     const customCheckbox = document.createElement('div');
//     customCheckbox.className = 'checkbox-group';
//     const customInput = document.createElement('input');
//     customInput.type = 'checkbox';
//     customInput.id = 'toggle-custom-psi';
//     customInput.addEventListener('change', (e) => {
//       this.engine.physicsMode.customFunction = e.target.checked;
//       this.updatePhysicsUI(); // Disable other params
//       this.onUpdate();
//     });
//     const customLabel = document.createElement('label');
//     customLabel.htmlFor = 'toggle-custom-psi';
//     customLabel.textContent = 'Enable Custom Function';
//     customCheckbox.appendChild(customInput);
//     customCheckbox.appendChild(customLabel);
//     customSection.appendChild(customCheckbox);
//     const textLabel = document.createElement('label');
//     textLabel.textContent = 'ψ(x, t) =';
//     textLabel.className = 'custom-psi-label';
//     customSection.appendChild(textLabel);
//     const textArea = document.createElement('textarea');
//     textArea.id = 'custom-psi-input';
//     textArea.rows = 4;
//     textArea.placeholder = 'e.g., A * exp(-(x-x0-v*t)^2 / (2*sigma^2)) * exp(i * (k*x - omega*t))';
//     textArea.value = 'A * exp(-(x-x0-v*t)^2 / (2*sigma^2)) * exp(i * (k*x - omega*t))';
//     customSection.appendChild(textArea);
//     const applyBtn = document.createElement('button');
//     applyBtn.className = 'control-btn';
//     applyBtn.textContent = 'Apply Function';
//     applyBtn.style.marginTop = '10px';
//     applyBtn.addEventListener('click', () => {
//         if (this.engine.setCustomFunction(textArea.value)) {
//             this.engine.reset();
//             this.onUpdate();
//         }
//     });
//     customSection.appendChild(applyBtn);
//     this.container.appendChild(customSection);
//   }

//   createPresetSelector() {
//     // ... (content unchanged)
//     const presetSection = document.createElement('div');
//     presetSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'Presets';
//     presetSection.appendChild(title);
//     const select = document.createElement('select');
//     select.className = 'preset-select';
//     const defaultOption = document.createElement('option');
//     defaultOption.value = '';
//     defaultOption.textContent = 'Select a preset...';
//     select.appendChild(defaultOption);
//     Object.entries(this.presets).forEach(([key, preset]) => {
//       const option = document.createElement('option');
//       option.value = key;
//       option.textContent = preset.name;
//       select.appendChild(option);
//     });
//     select.addEventListener('change', (e) => {
//       const presetKey = e.target.value;
//       if (presetKey && this.presets[presetKey]) {
//         this.applyPreset(this.presets[presetKey].params);
//         select.value = '';
//       }
//     });
//     presetSection.appendChild(select);
//     this.container.appendChild(presetSection);
//   }

//   createAdvancedOptions() {
//     // ... (content unchanged)
//     const advancedSection = document.createElement('div');
//     advancedSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'Advanced';
//     advancedSection.appendChild(title);
//     const trailCheckbox = document.createElement('div');
//     trailCheckbox.className = 'checkbox-group';
//     const trailInput = document.createElement('input');
//     trailInput.type = 'checkbox';
//     trailInput.id = 'toggle-trail';
//     trailInput.addEventListener('change', (e) => {
//       this.engine.trail.enabled = e.target.checked;
//       if (!e.target.checked) {
//         this.engine.trail.history = [];
//       }
//       this.onUpdate();
//     });
//     const trailLabel = document.createElement('label');
//     trailLabel.htmlFor = 'toggle-trail';
//     trailLabel.textContent = 'Show Wave Trail';
//     trailCheckbox.appendChild(trailInput);
//     trailCheckbox.appendChild(trailLabel);
//     advancedSection.appendChild(trailCheckbox);
//     const infoDiv = document.createElement('div');
//     infoDiv.className = 'info-display';
//     infoDiv.id = 'expectation-values';
//     advancedSection.appendChild(infoDiv);
//     this.container.appendChild(advancedSection);
//   }
  
//   // NEW: Recording Panel
//   createRecordingPanel() {
//     // ... (content unchanged)
//     const recordSection = document.createElement('div');
//     recordSection.className = 'control-section';
//     const title = document.createElement('h3');
//     title.textContent = 'Recording';
//     recordSection.appendChild(title);
//     const formatSelect = document.createElement('div');
//     formatSelect.className = 'select-group';
//     const formatLabel = document.createElement('label');
//     formatLabel.textContent = 'Format:';
//     const select = document.createElement('select');
//     select.id = 'record-format-select';
//     ['gif', 'mp4', 'webm'].forEach(format => {
//       const option = document.createElement('option');
//       option.value = format;
//       option.textContent = format.toUpperCase();
//       select.appendChild(option);
//     });
//     formatSelect.appendChild(formatLabel);
//     formatSelect.appendChild(select);
//     recordSection.appendChild(formatSelect);
//     const buttonGroup = document.createElement('div');
//     buttonGroup.className = 'button-group';
//     const startBtn = document.createElement('button');
//     startBtn.id = 'start-record-btn';
//     startBtn.className = 'control-btn';
//     startBtn.textContent = 'Start Recording';
//     const stopBtn = document.createElement('button');
//     stopBtn.id = 'stop-record-btn';
//     stopBtn.className = 'control-btn';
//     stopBtn.textContent = 'Stop & Save';
//     stopBtn.disabled = true;
//     startBtn.addEventListener('click', () => {
//         const format = document.getElementById('record-format-select').value;
//         this.app.startRecording(format);
//         startBtn.disabled = true;
//         stopBtn.disabled = false;
//         select.disabled = true;
//     });
//     stopBtn.addEventListener('click', () => {
//         this.app.stopRecording();
//         startBtn.disabled = false;
//         stopBtn.disabled = true;
//         select.disabled = false;
//     });
//     buttonGroup.appendChild(startBtn);
//     buttonGroup.appendChild(stopBtn);
//     recordSection.appendChild(buttonGroup);
//     this.container.appendChild(recordSection);
//   }

//   applyPreset(params) {
//     // ... (content unchanged)
//     Object.entries(params).forEach(([key, value]) => {
//       this.engine.setParam(key, value);
//       if (this.sliders[key]) {
//         this.sliders[key].slider.value = value;
//         this.sliders[key].valueDisplay.textContent = value.toFixed(2);
//       }
//     });
//     this.engine.reset();
//     this.onUpdate();
//   }

//   updateTimeDisplay() {
//     // ... (content unchanged)
//     const timeDisplay = document.getElementById('time-value');
//     if (timeDisplay) {
//       timeDisplay.textContent = this.engine.time.toFixed(2);
//     }
//   }

//   updateExpectationValues(values) {
//     // ... (content unchanged)
//     const display = document.getElementById('expectation-values');
//     if (display && values) {
//       display.innerHTML = `
//         <div class="expectation-item">⟨x⟩ = ${values.position.toFixed(3)}</div>
//         <div class="expectation-item">⟨p⟩ = ${values.momentum.toFixed(3)}</div>
//         <div class="expectation-item">⟨E⟩ = ${values.energy.toFixed(3)}</div>
//       `;
//     }
//   }
  
//   // NEW: Show/hide potential sliders
//   updatePotentialUI() {
//     const potentialType = this.engine.physicsMode.potential;
    
//     // BUG FIX: Use the stored reference instead of getElementById
//     const settingsPanel = this.potentialSettingsPanel;
    
//     // BUG FIX: Add a null check in case panel doesn't exist
//     if (!settingsPanel) {
//         console.warn("Potential settings panel not found during update.");
//         return;
//     }

//     if (potentialType === 'none') {
//         settingsPanel.style.display = 'none';
//         return;
//     }

//     settingsPanel.style.display = 'block';
    
//     const isWell = potentialType === 'well';
    
//     // BUG FIX: Add null checks for sliders, as they might not be created yet
//     if (this.sliders['height'] && this.sliders['height'].group) {
//         this.sliders['height'].group.style.display = isWell ? 'none' : 'block';
//     }
//     if (this.sliders['depth'] && this.sliders['depth'].group) {
//         this.sliders['depth'].group.style.display = isWell ? 'block' : 'none';
//     }
//   }

//   // NEW: Enable/disable sliders based on physics
//   updatePhysicsUI() {
//     // ... (content unchanged)
//     const dispersionOn = this.engine.physicsMode.dispersion;
//     const customFuncOn = this.engine.physicsMode.customFunction;
//     const superpositionOn = this.engine.physicsMode.superposition;
//     this.setSliderEnabled('v', !dispersionOn && !customFuncOn);
//     this.setSliderEnabled('omega', !dispersionOn && !customFuncOn);
//     const waveParamsSection = document.getElementById('wave-params-section');
//     const physicsSection = document.getElementById('physics-features-section');
//     if (waveParamsSection) {
//         Object.keys(this.sliders).forEach(key => {
//             if (key !== 'A') {
//                 this.setSliderEnabled(key, !customFuncOn);
//             }
//         });
//     }
//     if (physicsSection) {
//         document.getElementById('toggle-dispersion').disabled = customFuncOn;
//         document.getElementById('toggle-superposition').disabled = customFuncOn;
//         if(customFuncOn) {
//             document.getElementById('toggle-dispersion').checked = false;
//             document.getElementById('toggle-superposition').checked = false;
//             this.engine.physicsMode.dispersion = false;
//             this.engine.physicsMode.superposition = false;
//             this.engine.disableSuperposition();
//         }
//     }
//     if (!customFuncOn) {
//         this.setSliderEnabled('v', !dispersionOn);
//         this.setSliderEnabled('omega', !dispersionOn);
//     }
//   }

//   // NEW: Helper to enable/disable a slider
//   setSliderEnabled(name, isEnabled) {
//     // ... (content unchanged)
//     const sliderGroup = this.sliders[name];
//     if (sliderGroup) {
//       sliderGroup.slider.disabled = !isEnabled;
//       sliderGroup.label.style.color = isEnabled ? '#ccccdd' : '#888';
//       sliderGroup.slider.style.opacity = isEnabled ? 1.0 : 0.5;
//       sliderGroup.valueDisplay.style.color = isEnabled ? '#00ffff' : '#888';
//     }
//   }
// }

export class UIControls {
  constructor(engine, app, onUpdate) {
    this.engine = engine;
    this.app = app;
    this.onUpdate = onUpdate;
    this.container = null;
    this.sliders = {};
    this.potentialSettingsPanel = null;
    this.presets = this.initializePresets();
    
    // NEW: Store refs for recording buttons
    this.startRecordBtn = null;
    this.stopRecordBtn = null;
    this.downloadRecordBtn = null;
    this.recordStatusEl = null;
  }

  initializePresets() {
    // ... (unchanged)
    return {
      'gaussian': {
        name: 'Gaussian Wave Packet',
        params: { A: 1.0, k: 5.0, omega: 2.0, sigma: 0.5, v: 0.3, x0: 0 }
      },
      'fast-packet': {
        name: 'Fast Moving Packet',
        params: { A: 1.0, k: 10.0, omega: 5.0, sigma: 0.3, v: 0.8, x0: -3 }
      },
      'wide-packet': {
        name: 'Wide Packet',
        params: { A: 0.8, k: 3.0, omega: 1.5, sigma: 1.2, v: 0.2, x0: 0 }
      },
      'narrow-packet': {
        name: 'Narrow Packet',
        params: { A: 1.5, k: 8.0, omega: 3.0, sigma: 0.2, v: 0.4, x0: 0 }
      },
      'standing': {
        name: 'Standing Wave',
        params: { A: 1.0, k: 6.0, omega: 0.0, sigma: 0.6, v: 0.0, x0: 0 }
      }
    };
  }

  create() {
    this.container = document.createElement('div');
    this.container.className = 'controls-panel';

    const title = document.createElement('h2');
    title.textContent = 'Quantum Wave Controls';
    this.container.appendChild(title);

    this.createTimeDisplay();
    this.createVelocityDisplay(); // NEW
    this.createActionButtons();
    // createViewControls() removed
    this.createParameterSliders();
    this.createVisibilityToggles();
    this.createPhysicsModes();
    this.createPotentialSettings();
    this.createCustomFunctionPanel();
    this.createPresetSelector();
    this.createAdvancedOptions();
    this.createRecordingPanel();

    // Initial UI state setup
    this.updatePotentialUI();
    this.updatePhysicsUI();

    return this.container;
  }
  
  // NEW: Helper for creating tooltips
  createTooltip(text) {
      const container = document.createElement('span');
      container.className = 'info-tooltip-container';
      
      const icon = document.createElement('span');
      icon.className = 'info-icon';
      icon.textContent = '?';
      container.appendChild(icon);
      
      const tooltipText = document.createElement('span');
      tooltipText.className = 'info-tooltip-text';
      tooltipText.textContent = text;
      container.appendChild(tooltipText);
      
      return container;
  }

  createTimeDisplay() {
    const timeSection = document.createElement('div');
    timeSection.className = 'control-section info-display-box time-display';

    const label = document.createElement('div');
    label.className = 'info-label';
    label.textContent = 'Time (t):';
    
    const value = document.createElement('div');
    value.className = 'info-value';
    value.id = 'time-value';
    value.textContent = '0.00';

    timeSection.appendChild(label);
    timeSection.appendChild(value);
    this.container.appendChild(timeSection);
  }

  // NEW: Velocity Display Panel
  createVelocityDisplay() {
    const velocitySection = document.createElement('div');
    velocitySection.className = 'control-section info-display-box';
    velocitySection.id = 'velocity-display';
    
    const item1 = document.createElement('div');
    item1.className = 'info-item';
    item1.innerHTML = `<span class="info-item-label">Group Velocity (v_g)</span>
                       <span id="vg-value" class="info-item-value">0.00</span>`;
                       
    const item2 = document.createElement('div');
    item2.className = 'info-item';
    item2.innerHTML = `<span class="info-item-label">Phase Velocity (v_p)</span>
                       <span id="vp-value" class="info-item-value">0.00</span>`;
    
    velocitySection.appendChild(item1);
    velocitySection.appendChild(item2);
    this.container.appendChild(velocitySection);
  }
  
  updateVelocityDisplay(velocities) {
      const display = document.getElementById('velocity-display');
      if (!display) return;
      
      if (velocities) {
          display.style.display = 'block';
          document.getElementById('vg-value').textContent = velocities.v_g.toFixed(2);
          document.getElementById('vp-value').textContent = velocities.v_p.toFixed(2);
      } else {
          // Hide if null (e.g., in heatmap mode)
          display.style.display = 'none';
      }
  }

  createActionButtons() {
    const buttonSection = document.createElement('div');
    buttonSection.className = 'control-section button-group';

    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause-btn';
    pauseBtn.className = 'control-btn';
    pauseBtn.textContent = 'Pause (Space)';
    pauseBtn.addEventListener('click', () => {
      this.engine.togglePause();
      this.updatePauseButton();
    });

    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-btn';
    resetBtn.className = 'control-btn';
    resetBtn.textContent = 'Reset (R)';
    resetBtn.addEventListener('click', () => {
      this.engine.reset();
      if (this.app.isHeatmap) this.app.heatmapVisualizer.reset();
      this.onUpdate();
    });

    buttonSection.appendChild(pauseBtn);
    buttonSection.appendChild(resetBtn);
    this.container.appendChild(buttonSection);
  }
  
  updatePauseButton() {
      const pauseBtn = document.getElementById('pause-btn');
      if (pauseBtn) {
          pauseBtn.textContent = this.engine.paused ? 'Resume (Space)' : 'Pause (Space)';
      }
  }

  createParameterSliders() {
    const sliderSection = document.createElement('div');
    sliderSection.className = 'control-section';
    sliderSection.id = 'wave-params-section';

    const title = document.createElement('h3');
    title.textContent = 'Wave Parameters';
    sliderSection.appendChild(title);

    const parameters = [
      { name: 'A', label: 'Amplitude (A)', min: 0.1, max: 3, step: 0.1, value: this.engine.params.A, 
        tip: 'Controls the height (and overall energy) of the wave packet.' },
      { name: 'k', label: 'Wave Number (k)', min: 1, max: 20, step: 0.5, value: this.engine.params.k,
        tip: 'Controls the spatial frequency (waviness) of the packet. Higher k = shorter wavelength and higher momentum.' },
      { name: 'omega', label: 'Frequency (ω)', min: 0, max: 10, step: 0.5, value: this.engine.params.omega,
        tip: 'Controls the temporal frequency (how fast the wave oscillates in time). Disabled if Dispersion is on.' },
      { name: 'sigma', label: 'Width (σ)', min: 0.1, max: 2, step: 0.1, value: this.engine.params.sigma,
        tip: 'Controls the width of the wave packet envelope. A narrower packet (small σ) has a wider spread in momentum.' },
      { name: 'v', label: 'Velocity (v)', min: -1, max: 1, step: 0.1, value: this.engine.params.v,
        tip: 'The speed of the wave packet envelope (group velocity). Disabled if Dispersion is on.' },
      { name: 'x0', label: 'Initial Position (x₀)', min: -5, max: 5, step: 0.1, value: this.engine.params.x0,
        tip: 'The starting position of the wave packet at t=0. You can also click on the canvas to set this.' }
    ];

    parameters.forEach(param => {
      const sliderGroup = this.createSlider(param, param.tip);
      sliderSection.appendChild(sliderGroup);
    });

    this.container.appendChild(sliderSection);
  }

  createSlider(config, tooltip, onChange) {
    const group = document.createElement('div');
    group.className = 'slider-group';

    const label = document.createElement('label');
    label.textContent = config.label;
    if (tooltip) {
        label.appendChild(this.createTooltip(tooltip));
    }

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = config.value.toFixed(2);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'slider';
    slider.min = config.min;
    slider.max = config.max;
    slider.step = config.step;
    slider.value = config.value;
    slider.dataset.param = config.name;

    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      valueDisplay.textContent = value.toFixed(2);
      if (onChange) {
        onChange(config.name, value);
      } else {
        this.engine.setParam(config.name, value);
      }
    });
    
    slider.addEventListener('change', () => {
        this.onUpdate();
    });

    this.sliders[config.name] = { slider, valueDisplay, label, group };

    label.appendChild(valueDisplay);
    group.appendChild(label);
    group.appendChild(slider);

    return group;
  }

  createVisibilityToggles() {
    const toggleSection = document.createElement('div');
    toggleSection.className = 'control-section';

    const title = document.createElement('h3');
    title.textContent = 'Display Options';
    toggleSection.appendChild(title);

    const options = [
      { id: 'real', label: 'Re(ψ) - Real Part', checked: true, key: '1', 
        tip: 'The real component of the complex wave function. Drawn in cyan.' },
      { id: 'imag', label: 'Im(ψ) - Imaginary Part', checked: true, key: '2',
        tip: 'The imaginary component of the complex wave function. Drawn in pink.' },
      { id: 'probDensity', label: '|ψ|² - Probability Density', checked: true, key: '3',
        tip: 'The probability of finding the particle at position x. Calculated as Re(ψ)² + Im(ψ)². Drawn as a purple filled area.' }
    ];

    options.forEach(option => {
      const checkboxGroup = document.createElement('div');
      checkboxGroup.className = 'checkbox-group';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `toggle-${option.id}`;
      checkbox.checked = option.checked;
      checkbox.addEventListener('change', (e) => {
        this.engine.toggleVisibility(option.id);
        this.onUpdate();
      });

      const label = document.createElement('label');
      label.htmlFor = `toggle-${option.id}`;
      label.innerHTML = `${option.label} <kbd>${option.key}</kbd>`;
      label.appendChild(this.createTooltip(option.tip));

      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
      toggleSection.appendChild(checkboxGroup);
    });

    this.container.appendChild(toggleSection);
  }

  createPhysicsModes() {
    const physicsSection = document.createElement('div');
    physicsSection.className = 'control-section';
    physicsSection.id = 'physics-features-section';

    const title = document.createElement('h3');
    title.textContent = 'Physics Features';
    physicsSection.appendChild(title);

    // ... (Dispersion Checkbox)
    const dispersionCheckbox = document.createElement('div');
    dispersionCheckbox.className = 'checkbox-group';
    const dispersionInput = document.createElement('input');
    dispersionInput.type = 'checkbox';
    dispersionInput.id = 'toggle-dispersion';
    dispersionInput.addEventListener('change', (e) => {
      this.engine.physicsMode.dispersion = e.target.checked;
      this.updatePhysicsUI();
      this.onUpdate();
    });
    const dispersionLabel = document.createElement('label');
    dispersionLabel.htmlFor = 'toggle-dispersion';
    dispersionLabel.textContent = 'Enable Dispersion';
    dispersionLabel.appendChild(this.createTooltip('Use the real-world dispersion relation (ω = ℏk²/2m) instead of a simple slider. This causes the packet to naturally spread out over time. Disables ω and v sliders.'));
    dispersionCheckbox.appendChild(dispersionInput);
    dispersionCheckbox.appendChild(dispersionLabel);
    physicsSection.appendChild(dispersionCheckbox);

    // ... (Potential Select)
    const potentialSelect = document.createElement('div');
    potentialSelect.className = 'select-group';
    const potentialLabel = document.createElement('label');
    potentialLabel.textContent = 'Potential:';
    potentialLabel.appendChild(this.createTooltip('Add a potential energy (V(x)) to the simulation to see reflection and tunneling.'));
    const select = document.createElement('select');
    select.id = 'potential-select';
    select.className = 'potential-select';
    const potentials = [
      { value: 'none', label: 'None' },
      { value: 'barrier', label: 'Potential Barrier' },
      { value: 'well', label: 'Potential Well' },
      { value: 'step', label: 'Potential Step' }
    ];
    potentials.forEach(pot => {
      const option = document.createElement('option');
      option.value = pot.value;
      option.textContent = pot.label;
      select.appendChild(option);
    });
    select.addEventListener('change', (e) => {
      const type = e.target.value;
      this.engine.setPotential(type);
      this.updatePotentialUI();
      this.onUpdate();
    });
    potentialSelect.appendChild(potentialLabel);
    potentialSelect.appendChild(select);
    physicsSection.appendChild(potentialSelect);

    // ... (Superposition Checkbox)
    const superpositionCheckbox = document.createElement('div');
    superpositionCheckbox.className = 'checkbox-group';
    const superpositionInput = document.createElement('input');
    superpositionInput.type = 'checkbox';
    superpositionInput.id = 'toggle-superposition';
    superpositionInput.addEventListener('change', (e) => {
      this.engine.physicsMode.superposition = e.target.checked;
      if (e.target.checked) {
        this.engine.enableSuperposition({ k: 8, v: -0.3, x0: 2, A: 1.0, omega: 2.0, sigma: 0.5 });
      } else {
        this.engine.disableSuperposition();
      }
      this.updatePhysicsUI();
      this.onUpdate();
    });
    const superpositionLabel = document.createElement('label');
    superpositionLabel.htmlFor = 'toggle-superposition';
    superpositionLabel.textContent = 'Superposition';
    superpositionLabel.appendChild(this.createTooltip('Adds a second wave packet to the simulation to demonstrate quantum interference.'));
    superpositionCheckbox.appendChild(superpositionInput);
    superpositionCheckbox.appendChild(superpositionLabel);
    physicsSection.appendChild(superpositionCheckbox);

    this.container.appendChild(physicsSection);
  }

  createPotentialSettings() {
    const settingsSection = document.createElement('div');
    settingsSection.className = 'control-section';
    settingsSection.id = 'potential-settings';
    this.potentialSettingsPanel = settingsSection;

    const title = document.createElement('h3');
    title.textContent = 'Potential Settings';
    settingsSection.appendChild(title);
    
    const potentialParams = [
      { name: 'x', label: 'Potential Position (x)', min: -5, max: 5, step: 0.1, value: this.engine.potentialParams.x,
        tip: 'The center position of the barrier or well.' },
      { name: 'width', label: 'Potential Width', min: 0.1, max: 3, step: 0.1, value: this.engine.potentialParams.width,
        tip: 'The width of the barrier or well.' },
      { name: 'height', label: 'Potential Height', min: 1, max: 20, step: 0.5, value: this.engine.potentialParams.height,
        tip: 'The height (energy) of the potential barrier or step.' },
      { name: 'depth', label: 'Potential Depth', min: -20, max: -1, step: 0.5, value: this.engine.potentialParams.depth,
        tip: 'The depth (negative energy) of the potential well.' }
    ];

    const onPotentialChange = (name, value) => {
        this.engine.setPotentialParam(name, value);
    };

    potentialParams.forEach(param => {
        const sliderGroup = this.createSlider(param, param.tip, onPotentialChange);
        settingsSection.appendChild(sliderGroup);
    });

    this.container.appendChild(settingsSection);
  }

  createCustomFunctionPanel() {
    const customSection = document.createElement('div');
    customSection.className = 'control-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Custom Wave Function';
    customSection.appendChild(title);

    // ... (Enable Checkbox)
    const customCheckbox = document.createElement('div');
    customCheckbox.className = 'checkbox-group';
    const customInput = document.createElement('input');
    customInput.type = 'checkbox';
    customInput.id = 'toggle-custom-psi';
    customInput.addEventListener('change', (e) => {
      this.engine.physicsMode.customFunction = e.target.checked;
      this.updatePhysicsUI();
      this.onUpdate();
    });
    const customLabel = document.createElement('label');
    customLabel.htmlFor = 'toggle-custom-psi';
    customLabel.textContent = 'Enable Custom Function';
    customLabel.appendChild(this.createTooltip('Define ψ(x,t) yourself! Use variables x, t, and slider params (A, k, etc.). Uses math.js syntax. Example: sin(k*x - omega*t)'));
    customCheckbox.appendChild(customInput);
    customCheckbox.appendChild(customLabel);
    customSection.appendChild(customCheckbox);
    
    // ... (Text Area)
    const textLabel = document.createElement('label');
    textLabel.textContent = 'ψ(x, t) =';
    textLabel.className = 'custom-psi-label';
    customSection.appendChild(textLabel);
    
    const textArea = document.createElement('textarea');
    textArea.id = 'custom-psi-input';
    textArea.rows = 4;
    textArea.placeholder = 'e.g., A * exp(-(x-x0-v*t)^2 / (2*sigma^2)) * exp(i * (k*x - omega*t))';
    textArea.value = 'A * exp(-(x-x0-v*t)^2 / (2*sigma^2)) * exp(i * (k*x - omega*t))';
    customSection.appendChild(textArea);
    
    // ... (Apply Button)
    const applyBtn = document.createElement('button');
    applyBtn.className = 'control-btn';
    applyBtn.textContent = 'Apply Function';
    applyBtn.style.marginTop = '10px';
    applyBtn.addEventListener('click', () => {
        if (this.engine.setCustomFunction(textArea.value)) {
            this.engine.reset();
            this.onUpdate();
        }
    });
    customSection.appendChild(applyBtn);
    
    this.container.appendChild(customSection);
  }

  createPresetSelector() {
    // ... (unchanged)
    const presetSection = document.createElement('div');
    presetSection.className = 'control-section';
    const title = document.createElement('h3');
    title.textContent = 'Presets';
    presetSection.appendChild(title);
    const select = document.createElement('select');
    select.className = 'preset-select';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a preset...';
    select.appendChild(defaultOption);
    Object.entries(this.presets).forEach(([key, preset]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = preset.name;
      select.appendChild(option);
    });
    select.addEventListener('change', (e) => {
      const presetKey = e.target.value;
      if (presetKey && this.presets[presetKey]) {
        this.applyPreset(this.presets[presetKey].params);
        select.value = '';
      }
    });
    presetSection.appendChild(select);
    this.container.appendChild(presetSection);
  }

  createAdvancedOptions() {
    const advancedSection = document.createElement('div');
    advancedSection.className = 'control-section';

    const title = document.createElement('h3');
    title.textContent = 'Expectation Values';
    advancedSection.appendChild(title);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-display-box'; // Use new style
    infoDiv.id = 'expectation-values';
    
    infoDiv.innerHTML = `
        <div class="info-item">
            <span class="info-item-label">Position ⟨x⟩</span>
            <span id="exp-x-value" class="info-item-value">0.000</span>
        </div>
        <div class="info-item">
            <span class="info-item-label">Momentum ⟨p⟩</span>
            <span id="exp-p-value" class="info-item-value">0.000</span>
        </div>
        <div class="info-item">
            <span class="info-item-label">Energy ⟨E⟩</span>
            <span id="exp-e-value" class="info-item-value">0.000</span>
        </div>
    `;
    advancedSection.appendChild(infoDiv);

    // Trail checkbox moved here
    const trailCheckbox = document.createElement('div');
    trailCheckbox.className = 'checkbox-group';
    trailCheckbox.style.marginTop = '1rem';
    
    const trailInput = document.createElement('input');
    trailInput.type = 'checkbox';
    trailInput.id = 'toggle-trail';
    trailInput.addEventListener('change', (e) => {
      this.engine.trail.enabled = e.target.checked;
      if (!e.target.checked) {
        this.engine.trail.history = [];
      }
      this.onUpdate();
    });
    const trailLabel = document.createElement('label');
    trailLabel.htmlFor = 'toggle-trail';
    trailLabel.textContent = 'Show Wave Trail';
    trailLabel.appendChild(this.createTooltip('Show a fading "trail" of the probability density to visualize its path over time.'));

    trailCheckbox.appendChild(trailInput);
    trailCheckbox.appendChild(trailLabel);
    advancedSection.appendChild(trailCheckbox);

    this.container.appendChild(advancedSection);
  }
  
  // NEW: Updated Recording Panel
  createRecordingPanel() {
    const recordSection = document.createElement('div');
    recordSection.className = 'control-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Recording';
    title.appendChild(this.createTooltip('Record the canvas animation as a GIF or video file. Note: GIF encoding can be slow.'));
    recordSection.appendChild(title);

    // ... (Format Select)
    const formatSelect = document.createElement('div');
    formatSelect.className = 'select-group';
    const formatLabel = document.createElement('label');
    formatLabel.textContent = 'Format:';
    const select = document.createElement('select');
    select.id = 'record-format-select';
    ['gif', 'mp4', 'webm'].forEach(format => {
      const option = document.createElement('option');
      option.value = format;
      option.textContent = format.toUpperCase();
      select.appendChild(option);
    });
    formatSelect.appendChild(formatLabel);
    formatSelect.appendChild(select);
    recordSection.appendChild(formatSelect);

    // ... (Buttons)
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    this.startRecordBtn = document.createElement('button');
    this.startRecordBtn.className = 'control-btn';
    this.startRecordBtn.textContent = 'Start Recording';
    
    this.stopRecordBtn = document.createElement('button');
    this.stopRecordBtn.className = 'control-btn';
    this.stopRecordBtn.textContent = 'Stop Recording';
    this.stopRecordBtn.disabled = true;

    this.downloadRecordBtn = document.createElement('button');
    this.downloadRecordBtn.className = 'control-btn';
    this.downloadRecordBtn.textContent = 'Download';
    this.downloadRecordBtn.disabled = true;
    this.downloadRecordBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00bbff 100%)';
    this.downloadRecordBtn.style.color = '#000';
    this.downloadRecordBtn.style.borderColor = '#00ff88';

    // ... (Event Listeners)
    this.startRecordBtn.addEventListener('click', () => {
        const format = document.getElementById('record-format-select').value;
        this.app.startRecording(format);
        select.disabled = true;
    });

    this.stopRecordBtn.addEventListener('click', () => {
        this.app.stopRecording();
    });
    
    this.downloadRecordBtn.addEventListener('click', () => {
        this.app.downloadRecording();
        select.disabled = false;
    });

    buttonGroup.appendChild(this.startRecordBtn);
    buttonGroup.appendChild(this.stopRecordBtn);
    buttonGroup.appendChild(this.downloadRecordBtn);
    recordSection.appendChild(buttonGroup);
    
    // ... (Status)
    this.recordStatusEl = document.createElement('p');
    this.recordStatusEl.className = 'record-status';
    this.recordStatusEl.textContent = 'Status: Idle';
    recordSection.appendChild(this.recordStatusEl);
    
    this.container.appendChild(recordSection);
  }
  
  // NEW: Update recording UI state
  updateRecordingStatus(status, isRecording, isReadyToDownload = false) {
      if (this.recordStatusEl) {
          this.recordStatusEl.textContent = `Status: ${status}`;
      }
      if (this.startRecordBtn) {
          this.startRecordBtn.disabled = isRecording || isReadyToDownload;
      }
      if (this.stopRecordBtn) {
          this.stopRecordBtn.disabled = !isRecording;
      }
      if (this.downloadRecordBtn) {
          this.downloadRecordBtn.disabled = !isReadyToDownload;
          this.downloadRecordBtn.textContent = isReadyToDownload ? 'Download' : (isRecording ? '...' : 'Download');
      }
  }

  applyPreset(params) {
    Object.entries(params).forEach(([key, value]) => {
      this.engine.setParam(key, value);
      if (this.sliders[key]) {
        this.sliders[key].slider.value = value;
        this.sliders[key].valueDisplay.textContent = value.toFixed(2);
      }
    });
    this.engine.reset();
    this.onUpdate();
  }

  updateTimeDisplay() {
    const timeDisplay = document.getElementById('time-value');
    if (timeDisplay) {
      timeDisplay.textContent = this.engine.time.toFixed(2);
    }
  }

  updateExpectationValues(values) {
    const display = document.getElementById('expectation-values');
    if (display && values) {
      document.getElementById('exp-x-value').textContent = values.position.toFixed(3);
      document.getElementById('exp-p-value').textContent = values.momentum.toFixed(3);
      document.getElementById('exp-e-value').textContent = values.energy.toFixed(3);
    }
  }
  
  updatePotentialUI() {
    const potentialType = this.engine.physicsMode.potential;
    const settingsPanel = this.potentialSettingsPanel;
    
    if (!settingsPanel) return;

    if (potentialType === 'none') {
        settingsPanel.style.display = 'none';
        return;
    }

    settingsPanel.style.display = 'block';
    const isWell = potentialType === 'well';
    
    if (this.sliders['height'] && this.sliders['height'].group) {
        this.sliders['height'].group.style.display = isWell ? 'none' : 'block';
    }
    if (this.sliders['depth'] && this.sliders['depth'].group) {
        this.sliders['depth'].group.style.display = isWell ? 'block' : 'none';
    }
  }

  updatePhysicsUI() {
    const dispersionOn = this.engine.physicsMode.dispersion;
    const customFuncOn = this.engine.physicsMode.customFunction;

    // --- Disable sliders if dispersion is on ---
    this.setSliderEnabled('v', !dispersionOn && !customFuncOn);
    this.setSliderEnabled('omega', !dispersionOn && !customFuncOn);
    
    // --- Disable sections if custom function is on ---
    const waveParamsSection = document.getElementById('wave-params-section');
    const physicsSection = document.getElementById('physics-features-section');

    if (waveParamsSection) {
        Object.keys(this.sliders).forEach(key => {
            // Only disable k, omega, sigma, v, x0
            if (key !== 'A') {
                this.setSliderEnabled(key, !customFuncOn);
            }
        });
    }
    
    if (physicsSection) {
        const dispersionToggle = document.getElementById('toggle-dispersion');
        const superpositionToggle = document.getElementById('toggle-superposition');
        
        if(dispersionToggle) dispersionToggle.disabled = customFuncOn;
        if(superpositionToggle) superpositionToggle.disabled = customFuncOn;

        if(customFuncOn) {
            if(dispersionToggle) dispersionToggle.checked = false;
            if(superpositionToggle) superpositionToggle.checked = false;
            this.engine.physicsMode.dispersion = false;
            this.engine.physicsMode.superposition = false;
            this.engine.disableSuperposition();
        }
    }
    
    if (!customFuncOn) {
        this.setSliderEnabled('v', !dispersionOn);
        this.setSliderEnabled('omega', !dispersionOn);
    }
  }

  setSliderEnabled(name, isEnabled) {
    const sliderGroup = this.sliders[name];
    if (sliderGroup) {
      sliderGroup.slider.disabled = !isEnabled;
      sliderGroup.label.style.color = isEnabled ? '#ccccdd' : '#888';
      sliderGroup.slider.style.opacity = isEnabled ? 1.0 : 0.5;
      sliderGroup.valueDisplay.style.color = isEnabled ? '#00ffff' : '#888';
    }
  }
}
