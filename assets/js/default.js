
// Initialize CodeMirror on the textarea with dark theme
var codeScript = document.getElementById("code-script");
var comments = document.getElementById('comments');
var ID = deviceID();

window.onresize = function () {
	ID = deviceID();
};

var editor = CodeMirror.fromTextArea(codeScript, {
	lineNumbers: true, // Enable line numbers
	lineWrapping: true,
	mode: "javascript", // Set mode to JavaScript
	theme: "darcula" // Set theme to darcula (dark theme)
});

editor.on('change', (args) => {
	// console.log(args);
});

document.querySelector('.share').addEventListener('click', function (e) {
	const screenshotTarget = document.querySelector('.CodeMirror');

	if (editor.doc.size > 2) {
		if (comments.innerHTML.length) {
			html2canvas(screenshotTarget).then(async (canvas) => {
				var canvasWidth = canvas.width;
				var canvasHeight = canvas.height;
				// Canvas2Image.saveAsImage(canvas, canvasWidth, canvasHeight, 'png', 'code_clearscriptor.jpeg');

				if (navigator.share) {
					const img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
					var imageUrl = img[0].src;
					var response = await fetch(imageUrl);
					var blob = await response.blob();
					var file = new File([blob], ID + 'code_clearscriptor.jpeg', { type: blob.type });
					// Share the image using the Web Share API

					await navigator.share({
						files: [file],
						title: 'Share Code',
						text: comments.innerHTML
					});
				} else {
					// Web Share API is not supported
					console.error('Web Share API is not supported.');
					showAlert('Web Share API is not supported in this browser.', 'bad');
				}
				// shareInGroup();

				/* const base64image = canvas.toDataURL("image/png");
				// window.location.href = base64image;
				var response = await fetch(base64image);
				var blob = await response.blob();
				var file = new File([blob], 'code_clearscriptor.jpg', { type: blob.type });
				// console.log(file);
		
				const pickerOptions = {
					suggestedName: 'code_clearscriptor.jpeg',
					types: [
						{
							description: 'Clear Scriptor - Code Sample',
							accept: {
								'image/png': ['.jpeg'],
							},
						},
					],
				};
				try {
					const fileHandle = await window.showSaveFilePicker(pickerOptions);
					const writableFileStream = await fileHandle.createWritable();
					await writableFileStream.write(file);
					await writableFileStream.close();
				} catch (error) {
					console.error(error);
				} */
			});
		} else {
			showAlert('Please provide your code aspects you want to share!', 'bad');
		}
	} else {
		showAlert('Kindly provide your code before sharing it!', 'bad');
	}

});
