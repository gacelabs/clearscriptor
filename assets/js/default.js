
// Initialize CodeMirror on the textarea with dark theme
var codeScript = document.getElementById("code-script");
var comments = document.getElementById('comments');
var ID = deviceID();

window.onresize = function () {
	ID = deviceID();
	document.body.onload();
};

var editor = CodeMirror.fromTextArea(codeScript, {
	lineNumbers: true, // Enable line numbers
	lineWrapping: true,
	mode: "javascript", // Set mode to JavaScript
	theme: "darcula" // Set theme to darcula (dark theme)
});

editor.on('change', (args) => {
	// console.log(args);
	if (args.doc.size > 1) {
		args.setSize('auto', 'auto');
	} else {
		args.setSize('auto', 300);
	}
});

document.body.onload = function (params) {
	document.querySelector('.year-value').innerHTML = new Date().getFullYear();
	/* document.querySelector('.share').style.display = 'none';
	if (mobileCheck()) {
		document.querySelector('.share').style.display = 'block';
	} */
}

document.querySelector('.share').addEventListener('click', function (e) {
	const screenshotTarget = document.querySelector('.CodeMirror');
	// const screenshotTarget = document.getElementById('clearscriptor-panel');

	if (editor.doc.size > 1) {
		// if (comments.value.length) {
			html2canvas(screenshotTarget).then(async (canvas) => {
				var canvasWidth = canvas.width;
				var canvasHeight = canvas.height;
				// Canvas2Image.saveAsImage(canvas, canvasWidth, canvasHeight, 'png', 'code_clearscriptor.jpeg');

				if (navigator.share) {
					const img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
					var imageUrl = img.src;
					var response = await fetch(imageUrl);
					var blob = await response.blob();
					var file = new File([blob], ID + 'code_clearscriptor.jpeg', { type: blob.type });
					// Share the image using the Web Share API

					await navigator.share({
						files: [file],
						title: 'Share Code',
						// text: comments.value
					});
				} else {
					// Web Share API is not supported
					console.error('Web Share API is not supported.');
					showAlert('Web Share API is not supported in this browser.', 'bad');
				}
			});
		// } else {
		// 	showAlert('Please provide your code aspects you want to share!', 'bad');
		// }
	} else {
		showAlert('Kindly provide your code before sharing it!', 'bad');
	}
});

document.querySelector('.copy').addEventListener('click', function (e) {
	const screenshotTarget = document.querySelector('.CodeMirror');
	// const screenshotTarget = document.getElementById('clearscriptor-panel');

	if (editor.doc.size > 1) {
		// if (comments.value.length) {
			html2canvas(screenshotTarget).then(async (canvas) => {
				const base64image = canvas.toDataURL("image/png");
				try {
					const blob = await fetch(base64image).then(response => response.blob());
					const items = [{ type: 'image/png', blob: blob }];
					const clipboardData = new ClipboardItem({ [blob.type]: blob });
					await navigator.clipboard.write([clipboardData]);
					showAlert('Code converted to Image & copied to clipboard, Share it to social media groups and collaboratively find a solution!', 'good');
				} catch (error) {
					console.error(error);
					showAlert('Web Clipboard API is not supported in this browser!', 'bad');
				}

				// var imagePath = ID + 'code_clearscriptor.jpeg';
				/* // window.location.href = base64image;
				var response = await fetch(base64image);
				var blob = await response.blob();
				var file = new File([blob], imagePath, { type: blob.type });
				// console.log(file);
		
				const pickerOptions = {
					suggestedName: imagePath,
					types: [
						{
							// description: comments.value,
							accept: {
								'image/png': ['.jpeg'],
							},
						},
					],
				};
		
				document.querySelector('[property="og:image"]').content = window.location.origin + window.location.pathname + imagePath;
				try {
					const fileHandle = await window.showSaveFilePicker(pickerOptions);
					const writableFileStream = await fileHandle.createWritable();
					await writableFileStream.write(file);
					console.log(writableFileStream, fileHandle);
					await writableFileStream.close();
				} catch (error) {
					console.error(error);
					showAlert('Save file picker is not supported in this browser.', 'bad');
				} */
			});
		// } else {
		// 	showAlert('Please provide your code aspects you want to share!', 'bad');
		// }
	} else {
		showAlert('Kindly provide your code before sharing it!', 'bad');
	}
});
