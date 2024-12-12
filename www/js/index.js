document.addEventListener('deviceready', onDeviceReady, false);

let mediaRec;
const audioFile = 'myrecording.mp3';

function onDeviceReady() {
    document.getElementById('recordButton').addEventListener('click', startRecording);
    document.getElementById('stopButton').addEventListener('click', stopRecording);
    document.getElementById('playButton').addEventListener('click', playRecording);
}

function startRecording() {
    const path = cordova.file.externalDataDirectory + audioFile;
    mediaRec = new Media(path,
        () => console.log("Recording successful"),
        (err) => console.error("Recording failed: " + err.code)
    );
    mediaRec.startRecord();
}

function stopRecording() {
    if (mediaRec) {
        mediaRec.stopRecord();
    }
}

function playRecording() {
    const path = cordova.file.externalDataDirectory + audioFile;
    const media = new Media(path,
        () => console.log("Playback successful"),
        (err) => console.error("Playback failed: " + err.code)
    );
    media.play();
}