document.getElementById('video-input').addEventListener('change', handleVideoUpload);
document.getElementById('generate-captions').addEventListener('click', generateCaptions);

let videoElement = document.getElementById('video');
let audioChunks = [];

function handleVideoUpload(event) {
	const file = event.target.files[0];
	const url = URL.createObjectURL(file);
	videoElement.src = url;
	videoElement.load();
}

async function generateCaptions() {
	if (!videoElement.src) {
		alert('Please upload a video first.');
		return;
	}

	try {
		// Extract audio from video
		const audioBlob = await extractAudioFromVideo();

		// Transcribe audio to text
		const transcription = await transcribeAudio(audioBlob);

		// Format captions into SRT
		const srtContent = formatSRT(transcription);

		// Download SRT file
		downloadSRT(srtContent);
	} catch (error) {
		console.error('Error generating captions:', error);
		alert('Error generating captions: ' + error.message);
	}
}

function extractAudioFromVideo() {
	return new Promise((resolve, reject) => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaElementSource(videoElement);
		const destination = audioContext.createMediaStreamDestination();
		source.connect(destination);
		const recorder = new MediaRecorder(destination.stream);

		recorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		};

		recorder.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
			resolve(audioBlob);
		};

		recorder.onerror = (event) => {
			reject(event.error);
		};

		audioChunks = [];
		recorder.start();
		videoElement.play();
		videoElement.onended = () => {
			recorder.stop();
		};
	});
}

function transcribeAudio(audioBlob) {
	return new Promise((resolve, reject) => {
		const recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
		recognizer.continuous = true;
		recognizer.interimResults = false;

		recognizer.onresult = (event) => {
			const results = Array.from(event.results);
			const transcription = results.map(result => ({
				text: result[0].transcript,
				startTime: result[0].timestamp || 0,  // `timestamp` may not be provided, default to 0
				endTime: (result[0].timestamp || 0) + (result[0].duration || 1)  // `duration` may not be provided, default to 1 second
			}));
			resolve(transcription);
		};

		recognizer.onerror = (event) => {
			reject(event.error);
		};

		const audioURL = URL.createObjectURL(audioBlob);
		const audioElement = new Audio(audioURL);

		audioElement.onplay = () => {
			recognizer.start();
		};

		audioElement.onended = () => {
			recognizer.stop();
		};

		audioElement.onerror = (error) => {
			reject(error);
		};

		audioElement.play();
	});
}

function formatSRT(transcription) {
	let srtContent = '';
	transcription.forEach((t, index) => {
		srtContent += `${index + 1}\n${formatTime(t.startTime)} --> ${formatTime(t.endTime)}\n${t.text}\n\n`;
	});
	return srtContent;
}

function formatTime(seconds) {
	const date = new Date(seconds * 1000);
	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const secs = String(date.getUTCSeconds()).padStart(2, '0');
	const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
	return `${hours}:${minutes}:${secs},${milliseconds}`;
}

function downloadSRT(srtContent) {
	const blob = new Blob([srtContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const link = document.getElementById('download-link');
	link.href = url;
	link.download = 'captions.srt';
	link.style.display = 'block';
	link.textContent = 'Download Captions';
}
