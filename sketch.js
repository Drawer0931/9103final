let circleManager;
let canvasScale = 1;
let audioInput;

// Storing audio file uploaded
let song;

let button
let interval_input_pause;
let uploadButton;
const playbutton_correction_value = 10;
let audioAnalyzer;

// When playing, continuously updating
// When not playing, stop updating
let ifPlaying;

function setup() {
  createCanvas(windowWidth, windowHeight);

  canvasScale = min(width / 1280, height / 720);

  // Create one shared manager.
  circleManager = new CircleManager();


  initialiseCircles(1, circleManager);

  interval_input_pause = 0.08*windowHeight;
  button = createButton("Play/Pause");

  // Create audio input button
  audioInput = createFileInput(handleFile);
  audioInput.position((windowWidth - audioInput.width)/2, abs(button.height - windowHeight) - interval_input_pause);
  audioInput.attribute("accept", "audio/*");
  audioInput.hide();

  // Use another self created button to replace default audio input button
  // Avoiding black "No file chosen" words
  uploadButton = createButton("Upload Audio");
  uploadButton.position(windowWidth/2, abs(button.height - windowHeight) - interval_input_pause);
  uploadButton.style("transform", "translate(-50%, -50%)");
  uploadButton.style("padding", "12px 24px");
  uploadButton.style("font-size", "18px");
  uploadButton.style("border-radius", "5px");
  uploadButton.style("background", "#ffffff");
  
  // Transplanting function to the new button
  uploadButton.mousePressed(() => {
    audioInput.elt.click();
  });
  
  // Customize play pause button style
  // Keep it the same with upload button
  button.position(windowWidth/2, abs(button.height - windowHeight) - playbutton_correction_value);
  button.style("transform", "translate(-50%, -50%)");
  button.style("padding", "12px 24px");
  button.style("font-size", "18px");
  button.style("border-radius", "5px");
  button.style("background", "#ffffff");
  button.mousePressed(playPause);
}

// Ensure the audio file has finished uploading
// Check the format is audio
async function handleFile(file){
  if (file.type === "audio"){
    if (song){
      song.stop();
    }
    song = await loadSound(file);
    console.log("upload succeed");
  }
}

// Control play and pause
function playPause(){
  if (song){
    if (song.isPlaying()){
      song.pause();
      ifPlaying = false;
    }
    else{
      song.loop();
      ifPlaying = true;
    }
  }
}

function draw() {
  background(16, 18, 27);

  // Update the shared circles.
  updateNoise(circleManager);

  // Draw the shared circles.
  circleManager.displayCircles();
}