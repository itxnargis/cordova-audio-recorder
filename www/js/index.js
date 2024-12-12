document.addEventListener('deviceready', onDeviceReady, false);

let mediaRec;
let recordingPath;
let isRecording = false;
let startTime;
let timerInterval;
let visualizerInterval;

function onDeviceReady() {
    console.log('Device is ready');

    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const statusDiv = document.getElementById('status');
    const timerDiv = document.getElementById('timer');
    const visualizer = document.getElementById('visualizer');

    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    playButton.addEventListener('click', playRecording);

    function startRecording() {
        recordingPath = cordova.file.externalDataDirectory + 'recording.mp3';
        mediaRec = new Media(recordingPath,
            () => console.log('Recording successful'),
            (err) => console.error('Recording failed: ', err)
        );

        mediaRec.startRecord();
        isRecording = true;
        recordButton.disabled = true;
        stopButton.disabled = false;
        playButton.disabled = true;
        statusDiv.textContent = 'Recording...';

        startTime = Date.now();
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        visualizerInterval = setInterval(updateVisualizer, 100);
    }

    function stopRecording() {
        if (isRecording) {
            mediaRec.stopRecord();
            isRecording = false;
            recordButton.disabled = false;
            stopButton.disabled = true;
            playButton.disabled = false;
            statusDiv.textContent = 'Recording stopped';
            mediaRec.release();
            mediaRec = null;

            clearInterval(timerInterval);
            clearInterval(visualizerInterval);
            visualizer.innerHTML = ''; // Clear the visualizer
        }
    }

    function playRecording() {
        if (recordingPath) {
            const playback = new Media(recordingPath,
                () => {
                    statusDiv.textContent = 'Playback finished';
                    playButton.disabled = false;
                    recordButton.disabled = false; // Re-enable record button
                },
                (err) => console.error('Playback failed: ', err)
            );

            playback.play();
            statusDiv.textContent = 'Playing...';
            playButton.disabled = true;
            recordButton.disabled = true; // Disable record button while playing
        } else {
            statusDiv.textContent = 'No recording available';
        }
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        timerDiv.textContent = `${minutes}:${seconds}`;
    }

    function updateVisualizer() {
        const bars = 20;
        visualizer.innerHTML = '';
        for (let i = 0; i < bars; i++) {
            const bar = document.createElement('div');
            bar.style.width = `${100 / bars}%`;
            bar.style.height = `${Math.random() * 100}%`;
            bar.style.backgroundColor = '#ffffff';
            bar.style.opacity = '0.7';
            bar.style.display = 'inline-block';
            visualizer.appendChild(bar);
        }
    }
}