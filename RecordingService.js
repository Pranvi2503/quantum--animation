// // NEW File: RecordingService.js

// /* global CCapture */ // Tell the linter that CCapture is a global variable

// export class RecordingService {
//   constructor(canvas, format = 'gif') {
//     this.canvas = canvas;
//     this.format = format;
//     this.capturer = null;

//     let settings = {
//       format: this.format,
//       verbose: false,
//       name: `quantum-wave-${Date.now()}`,
//     };

//     if (format === 'gif') {
//       // FIX: Changed this from the unpkg URL to a local relative path.
//       // The user must place gif.worker.js and gif.js in the /public folder.
//       settings.workersPath = './'; 
//       settings.quality = 30; // 1-100, lower is better quality
//       settings.framerate = 60;
//     } else {
//         settings.framerate = 60;
//         settings.quality = 90; // for webm/mp4
//     }

//     try {
//       this.capturer = new CCapture(settings);
//     } catch (e) {
//       console.error("Failed to initialize CCapture:", e);
//       alert("Error: Could not load recording library. Check your internet connection.");
//     }
//   }

//   start() {
//     if (!this.capturer) return;
//     console.log("Recording service started.");
//     this.capturer.start();
//   }

//   captureFrame() {
//     if (!this.capturer) return;
//     this.capturer.capture(this.canvas);
//   }

//   stop() {
//     if (!this.capturer) return;
//     console.log("Stopping and saving video...");
//     this.capturer.stop();
//     this.capturer.save();
//   }
// }

/* global CCapture */

export class RecordingService {
  constructor(canvas, format = 'gif') {
    this.canvas = canvas;
    this.format = format;
    this.capturer = null;
    this.isStopping = false;

    let settings = {
      format: this.format,
      verbose: false,
      name: `quantum-wave-${Date.now()}`,
    };

    if (format === 'gif') {
      // Use local worker files (must be in /public)
      settings.workersPath = './'; 
      settings.quality = 30;
      settings.framerate = 60;
    } else {
        settings.framerate = 60;
        settings.quality = 90;
    }

    try {
      this.capturer = new CCapture(settings);
    } catch (e) {
      console.error("Failed to initialize CCapture:", e);
      alert("Error: Could not load recording library. Make sure gif.worker.js and gif.js are in your /public folder.");
    }
  }

  start() {
    if (!this.capturer) return;
    console.log("Recording service started.");
    this.capturer.start();
  }

  captureFrame() {
    if (!this.capturer || this.isStopping) return;
    try {
        this.capturer.capture(this.canvas);
    } catch (e) {
        console.warn("CCapture frame capture error (often happens on resize, can be ignored):", e);
    }
  }

  // NEW: Stop now takes a callback
  stop(onCompiledCallback) {
    if (!this.capturer || this.isStopping) return;
    this.isStopping = true;
    console.log("Stopping recording and compiling...");
    
    this.capturer.stop();
    
    // The 'save' method now also handles the compilation, which is async.
    // We pass it a callback that CCapture will execute when done.
    // This is a bit of a workaround for its API.
    this.capturer.save((blob) => {
        // This callback means compiling is done!
        // We *don't* trigger the download yet.
        // We just tell main.js that it's ready.
        console.log("Compilation finished.");
        this.isStopping = false;
        
        // Store the blob for the real save button
        this.blob = blob; 
        
        if (onCompiledCallback) {
            onCompiledCallback(true); // Signal success
        }
        
        // We return false to *prevent* CCapture's default download
        return false; 
    });
  }

  // NEW: Save is now a separate function
  save() {
      if (!this.blob) {
          console.error("No recording blob found to save.");
          return;
      }
      
      console.log("Triggering download...");
      
      // Create a link and click it to download the blob
      const url = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.capturer.settings.name + '.' + this.capturer.settings.format;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      this.blob = null; // Clear the stored blob
  }
}
