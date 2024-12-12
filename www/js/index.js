document.addEventListener('deviceready', onDeviceReady, false);

let mediaRec;
const audioFile = 'myrecording.mp3';
let isRecording = false;
let isPlaying = false;
let visualizer;

function onDeviceReady() {
    console.log('Device is ready');
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
    if (!window.Media) {
        console.error("Media plugin is not available.");
        return;
    }

    const path = cordova.file.externalDataDirectory + audioFile;
    console.log('Recording path:', path);

    try {
        mediaRec = new Media(
            path,
            () => {
                console.log("Recording successful");
                updateUI(false);
            },
            (err) => {
                console.error("Recording failed: ", err);
                updateUI(false);
            }
        );

        mediaRec.startRecord();
        isRecording = true;
        updateUI(true);
        startVisualization();
        console.log("Recording started");

    } catch (error) {
        console.error("Error initializing recording: " + error.message);
        updateUI(false);
    }
}

function stopRecording() {
    if (mediaRec && isRecording) {
        try {
            mediaRec.stopRecord();
            console.log("Recording stopped");
            isRecording = false;
            updateUI(false);
            stopVisualization();

            // Release the media resource
            mediaRec.release();
        } catch (error) {
            console.error("Error stopping recording: " + error.message);
        }
    } else {
        console.error("No recording in progress to stop.");
    }
}

function playRecording() {
    if (isPlaying) {
        console.log("Already playing");
        return;
    }

    const path = cordova.file.externalDataDirectory + audioFile;
    console.log('Playback path:', path);

    try {
        const media = new Media(
            path,
            () => {
                console.log("Playback finished");
                isPlaying = false;
                updateUI(false);
            },
            (err) => {
                console.error("Playback failed: ", err);
                isPlaying = false;
                updateUI(false);
            }
        );

        media.play();
        isPlaying = true;
        updateUI(false, true);
        console.log("Playback started");

    } catch (error) {
        console.error("Error playing recording: " + error.message);
        updateUI(false);
    }
}

function updateUI(recording, playing = false) {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');

    recordButton.disabled = recording || playing;
    stopButton.disabled = !recording && !playing;
    playButton.disabled = recording || isPlaying;

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