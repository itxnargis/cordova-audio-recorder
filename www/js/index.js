document.addEventListener('deviceready', onDeviceReady, false);

let mediaRec;
const audioFile = 'myrecording.mp3';
let isRecording = false;
let visualizer;

function onDeviceReady() {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    visualizer = document.getElementById('visualizer');

    recordButton.addEventListener('click', toggleRecording);
    stopButton.addEventListener('click', stopRecording);
    playButton.addEventListener('click', playRecording);
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (!Media) {
        console.error("Media plugin is not available.");
        return;
    }

    const audioFile = "myRecording.mp3"; // Example file name
    const path = cordova.file.externalDataDirectory + audioFile;

    try {
        const mediaRec = new Media(
            path,
            () => console.log("Recording successful"),
            (err) => console.error("Recording failed: " + err.code)
        );

        mediaRec.startRecord();
        isRecording = true;
        updateUI(true);
        startVisualization();

    } catch (error) {
        console.error("Error initializing recording: " + error.message);
    }
}


function stopRecording() {
    if (mediaRec) {
        mediaRec.stopRecord();
        isRecording = false;
        updateUI(false);
        stopVisualization();
    }
}

function playRecording() {
    const path = cordova.file.externalDataDirectory + audioFile;
    const media = new Media(path,
        () => {
            console.log("Playback successful");
            updateUI(false);
        },
        (err) => console.error("Playback failed: " + err.code)
    );
    media.play();
    updateUI(true, true);
}

function updateUI(recording, playing = false) {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');

    recordButton.disabled = recording || playing;
    stopButton.disabled = !recording && !playing;
    playButton.disabled = recording || playing;

    recordButton.querySelector('.text').textContent = recording ? 'Recording...' : 'Record';
    playButton.querySelector('.text').textContent = playing ? 'Playing...' : 'Play';
}

function startVisualization() {
    let bars = 30;
    visualizer.innerHTML = '';
    for (let i = 0; i < bars; i++) {
        let bar = document.createElement('div');
        bar.style.width = (100 / bars) + '%';
        bar.style.height = '100%';
        bar.style.display = 'inline-block';
        bar.style.background = 'rgba(255, 255, 255, 0.5)';
        visualizer.appendChild(bar);
    }
    animateVisualizer();
}

function animateVisualizer() {
    if (!isRecording) return;
    const bars = visualizer.children;
    for (let bar of bars) {
        let height = Math.random() * 100;
        bar.style.height = height + '%';
    }
    requestAnimationFrame(animateVisualizer);
}

function stopVisualization() {
    visualizer.innerHTML = '';
}
