import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
export default class CKUploadAdapter extends Plugin {
	constructor(editor) {
		super(editor);
		editor.config.define("ckImageUpload");
		this.editor = editor;
	}
	init() {
		const url = this.editor.config.get("ckImageUpload.uploadUrl");
		const formField = this.editor.config.get("ckImageUpload.formField");
		const withCredentials = this.editor.config.get(
			"ckImageUpload.withCredentials"
		);

		if (!url || !formField) {
			return;
		}

		// Register CKFinderAdapter
		this.editor.plugins.get(FileRepository).createUploadAdapter = loader =>
			new UploadAdapter(loader, url, formField, withCredentials);
	}
}

class UploadAdapter {
	constructor(loader, url, formField, withCredentials) {
		// The FileLoader instance to use during the upload. It sounds scary but do not
		// worry — the loader will be passed into the adapter later on in this guide.
		this.loader = loader;

		// The upload URL in your server back-end. This is the address the XMLHttpRequest
		// will send the image data to.
		this.url = url;

		this.formField = formField;

		this.withCredentials = withCredentials;
	}

	upload() {
		return this.loader.file.then(
			file =>
				new Promise((resolve, reject) => {
					this._initRequest();
					this._initListeners(resolve, reject, file);
					this._sendRequest(file);
				})
		);
	}

	// Aborts the upload process.
	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}

	_initRequest() {
		const xhr = (this.xhr = new XMLHttpRequest());

		// Note that your request may look different. It is up to you and your editor
		// integration to choose the right communication channel. This example uses
		// the POST request with JSON as a data structure but your configuration
		// could be different.
		xhr.open("POST", this.url, true);
		xhr.responseType = "json";
	}

	// Initializes XMLHttpRequest listeners.
	_initListeners(resolve, reject) {
		const xhr = this.xhr;
		const loader = this.loader;
		const genericErrorText =
			"Couldn't upload file:" + ` ${loader.file.name}.`;

		xhr.addEventListener("error", () => reject(genericErrorText));
		xhr.addEventListener("abort", () => reject());
		xhr.addEventListener("load", () => {
			const response = xhr.response;

			// This example assumes the XHR server's "response" object will come with
			// an "error" which has its own "message" that can be passed to reject()
			// in the upload promise.
			//
			// Your integration may handle upload errors in a different way so make sure
			// it is done properly. The reject() function must be called when the upload fails.

			if (response && response.error) {
				return reject(
					response && response.error
						? response.error.message
						: genericErrorText
				);
			}

			// If the upload is successful, resolve the upload promise with an object containing
			// at least the "default" URL, pointing to the image on the server.
			// This URL will be used to display the image in the content. Learn more in the
			// UploadAdapter#upload documentation.
			resolve(response);
		});

		// Upload progress when it is supported. The FileLoader has the #uploadTotal and #uploaded
		// properties which are used e.g. to display the upload progress bar in the editor
		// user interface.
		if (xhr.upload) {
			xhr.upload.addEventListener("progress", evt => {
				if (evt.lengthComputable) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			});
		}
	}

	// Prepares the data and sends the request.
	_sendRequest(file) {
		// Prepare the form data.
		const data = new FormData();
		console.log(file);
		data.append(this.formField, file);
		this.xhr.withCredentials = this.withCredentials || false;
		// Send the request.
		this.xhr.send(data);
	}
}
