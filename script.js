// script.js
// Interactive quantum wave: psi(x,t) = A * exp(-(x-x0-vt)^2/(2*sigma^2)) * exp(i*(k x - omega t))
// Shows Re(psi), Im(psi), and optionally |psi|^2

// --- helpers: DOM nodes ---
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

const kSlider = document.getElementById('kSlider');
const omegaSlider = document.getElementById('omegaSlider');
const sigmaSlider = document.getElementById('sigmaSlider');
const ampSlider = document.getElementById('ampSlider');
const vSlider = document.getElementById('vSlider');

const kVal = document.getElementById('kVal');
const omegaVal = document.getElementById('omegaVal');
const sigmaVal = document.getElementById('sigmaVal');
const ampVal = document.getElementById('ampVal');
const vVal = document.getElementById('vVal');
const timeVal = document.getElementById('timeVal');

const showReal = document.getElementById('showReal');
const showImag = document.getElementById('showImag');
const showProb = document.getElementById('showProb');

const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');

let DPR = window.devicePixelRatio || 1;

// responsive canvas
function resizeCanvas(){
  DPR = window.devicePixelRatio || 1;
  canvas.width = Math.floor((window.innerWidth - 380) * DPR); // leave room for controls
  if(window.innerWidth < 1000) canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor((window.innerHeight - 160) * DPR);
  canvas.style.width = (canvas.width / DPR) + 'px';
  canvas.style.height = (canvas.height / DPR) + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0); // handle high-DPI
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// simulation parameters (initial)
let params = {
  k: parseFloat(kSlider.value),       // wave number
  omega: parseFloat(omegaSlider.value),
  sigma: parseFloat(sigmaSlider.value),
  A: parseFloat(ampSlider.value),
  v: parseFloat(vSlider.value),
  x0: -6,    // initial center in "physics x" units
};

// map pixels to physical x range
function pixelToX(px){
  // we want x from -12 .. +12 mapped to canvas width
  const w = canvas.width / DPR;
  const xMin = -12, xMax = 12;
  return xMin + (px / w) * (xMax - xMin);
}
function xToPixel(x){
  const w = canvas.width / DPR;
  const xMin = -12, xMax = 12;
  return ((x - xMin) / (xMax - xMin)) * w;
}

// UI updates
function pushUI(){
  kVal.textContent = params.k.toFixed(2);
  omegaVal.textContent = params.omega.toFixed(2);
  sigmaVal.textContent = params.sigma.toFixed(2);
  ampVal.textContent = params.A.toFixed(2);
  vVal.textContent = params.v.toFixed(2);
}

// attach sliders
kSlider.oninput = e => { params.k = parseFloat(e.target.value); pushUI(); };
omegaSlider.oninput = e => { params.omega = parseFloat(e.target.value); pushUI(); };
sigmaSlider.oninput = e => { params.sigma = parseFloat(e.target.value); pushUI(); };
ampSlider.oninput = e => { params.A = parseFloat(e.target.value); pushUI(); };
vSlider.oninput = e => { params.v = parseFloat(e.target.value); pushUI(); };

// state
let t = 0;
let paused = false;
pushUI();

// UI buttons
toggleBtn.onclick = () => {
  paused = !paused;
  toggleBtn.textContent = paused ? '▶️ Resume' : '⏸ Pause';
};
resetBtn.onclick = () => { t = 0; };

// draw function
function draw(){
  // clear, dark background
  const w = canvas.width / DPR;
  const h = canvas.height / DPR;
  ctx.clearRect(0,0,w,h);

  // nice black-blue gradient
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'rgba(0,8,20,0.7)');
  g.addColorStop(1,'rgba(0,0,0,0.6)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // center line
  const centerY = h/2;

  // compute psi(x,t) across pixel columns
  const cols = Math.floor(w); // one value per pixel for smoothness
  const xs = new Float32Array(cols);
  const re = new Float32Array(cols);
  const im = new Float32Array(cols);
  const prob = new Float32Array(cols);

  for(let i=0;i<cols;i++){
    const x = pixelToX(i);
    xs[i] = x;
    // envelope centered at x0 + v t
    const env = Math.exp(-( (x - (params.x0 + params.v * t))**2 ) / (2 * params.sigma * params.sigma));
    const phase = params.k * x - params.omega * t;
    // psi = A * env * exp(i phase)
    const real = params.A * env * Math.cos(phase);
    const imag = params.A * env * Math.sin(phase);
    re[i] = real;
    im[i] = imag;
    prob[i] = real*real + imag*imag;
  }

  // determine scaling: find max amplitude to scale drawing nicely
  let maxAbs = 1e-9;
  for(let i=0;i<cols;i++){
    maxAbs = Math.max(maxAbs, Math.abs(re[i]), Math.abs(im[i]));
  }
  // scaleFactor: how many pixels per unit amplitude
  const scale = Math.min(180, (h/3) / Math.max(0.2, maxAbs));

  // draw probability density (optional)
  if(showProb.checked){
    ctx.beginPath();
    for(let i=0;i<cols;i++){
      const px = i;
      // map prob to vertical height (top-filled)
      const height = Math.min(h*0.9, prob[i] * 400 * params.A * params.A);
      const y = centerY + 180 + (180 - height); // place below center (visual choice)
      if(i===0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.lineTo(cols-1, h);
    ctx.lineTo(0,h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, centerY, 0, h);
    grad.addColorStop(0, 'rgba(0,200,255,0.08)');
    grad.addColorStop(1, 'rgba(0,120,180,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // draw real part: thicker glow line
  if(showReal.checked){
    ctx.beginPath();
    for(let i=0;i<cols;i++){
      const px = i;
      const y = centerY - re[i] * scale;
      if(i===0) ctx.moveTo(px,y); else ctx.lineTo(px,y);
    }
    // glow by stroke + shadow
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = 'rgba(0,230,255,0.95)';
    ctx.shadowColor = 'rgba(0,200,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.stroke();

    // add a thin bright top line for that neon look
    ctx.beginPath();
    for(let i=0;i<cols;i++){
      const px = i;
      const y = centerY - re[i] * scale;
      if(i===0) ctx.moveTo(px,y); else ctx.lineTo(px,y);
    }
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(180,255,255,1)';
    ctx.stroke();
  }

  // draw imaginary part: different color
  if(showImag.checked){
    ctx.beginPath();
    for(let i=0;i<cols;i++){
      const px = i;
      const y = centerY - im[i] * scale;
      if(i===0) ctx.moveTo(px,y); else ctx.lineTo(px,y);
    }
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = 'rgba(255,120,200,0.92)';
    ctx.shadowColor = 'rgba(255,100,180,0.8)';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // thin bright
    ctx.beginPath();
    for(let i=0;i<cols;i++){
      const px = i;
      const y = centerY - im[i] * scale;
      if(i===0) ctx.moveTo(px,y); else ctx.lineTo(px,y);
    }
    ctx.lineWidth = 0.9;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,200,230,0.95)';
    ctx.stroke();
  }

  // small axis / center line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, centerY);
  ctx.lineTo(cols, centerY);
  ctx.stroke();

  // labels
  ctx.fillStyle = 'rgba(220,255,255,0.9)';
  ctx.font = '14px monospace';
  ctx.fillText('Re(ψ)', 14, 28);
  ctx.fillText('Im(ψ)', 14, 48);

  // show time
  timeVal.textContent = t.toFixed(2);

  // advance time only if not paused
  if(!paused) {
    // use omega to control how fast we march t (makes behavior intuitive)
    // dt set small so animation is smooth
    const dt = 0.016; // 60 FPS baseline
    t += dt;
  }

  // continue loop
  requestAnimationFrame(draw);
}

// Start draw loop (always running; pause stops time advance)
requestAnimationFrame(draw);
