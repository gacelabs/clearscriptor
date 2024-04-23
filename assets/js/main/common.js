function shareInGroup() {
	// Replace [URL] with the URL you want to share and [GROUP_ID] with the ID of the Facebook group
	var url = "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/&share_channel=group&group_id=688727327989718";
	window.open(url, "_blank");
}

var deviceID = function (code) {
	if (code == undefined) code = '';
	if (code.trim() != '') code += '-';
	var navigator_info = window.navigator;
	var screen_info = window.screen;
	var uid = navigator_info.mimeTypes.length;
	uid += navigator_info.userAgent.replace(/\D+/g, '');
	uid += navigator_info.plugins.length;
	uid += screen_info.height || '';
	uid += screen_info.width || '';
	uid += screen_info.pixelDepth || '';
	// console.log(uid);
	return code + uid;
}

function showAlert(message, type) {
	if (type == undefined) type = 'good';
	// Get the snackbar DIV
	var snackbar = document.createElement("div");
	snackbar.className = 'snackbar';
	snackbar.className += " show " + type;
	snackbar.innerHTML = message;

	var body = document.body;
	body.parentNode.insertBefore(snackbar, body.nextSibling);

	setTimeout(function () {
		snackbar.className = snackbar.className.replace("show", "out"); setTimeout(() => {
			snackbar.style = '';
			snackbar.remove();
		}, 300);
	}, 3000);
}