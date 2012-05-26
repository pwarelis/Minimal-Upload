Minimal Upload Button
============

This is a file input overlay that you can apply to a button. It can be used to upload a single file using the XMLHttpRequest object.
Upload progress can be checked by using the hooks listed in the options below.

How to Use
----------

Making an element upload a file is very simple. By specifying only a url, the file will begin uploading as soon as it is chosen.

```javascript
$("#upload-button").Upload({
	url: "/where/to/upload"
});
```

### Options

In callback functions, where appropriate, you can use the built-in functions for checking progress. These are at your disposal:

- `getPercentage`
	Returns the upload completion percentage as a whole number
- `getThroughput`
	Returns the throughput per interval in bytes
- `getSpeed`
	Returns the total upload speed in bytes per second

On to the options:

- `url`
  Where to send the file.

- `name`
  The name of the file. This has the same function as the name attribute in the file input control. Default is "file".

- `updateInterval`
  The interval in milliseconds the onUpdate function will be called. Default is 500.

- `onUpdate`
  A function that will be called periodically when upload is in progress. Use this to update your UI.

- `onSelect`
  Called when a file is chosen. When you include this callback in your options, you must explicitly call sendFile(). See example below.

- `parseResponse`
  If this is true, the response text is assumed to be a JSON string and will be parsed. The resulting object will be passed as an argument to the onComplete callback. Default is true.

- `onComplete`
  This will be called when the upload is complete.

- `onError`
  Called if there's an upload error.

- `onCancel`
  Called if the upload was cancelled.

### Example

```javascript
$("#upload-button").Upload({
	url: "/where/to/upload",
	name: "myfile",
	updateInterval: 1000,
	onSelect: function() {
		// File has been selected, let's see what it is:
		console.log(this.file);
		
		if (fileIsValid(this.file)) {
			// Begin the upload
			this.sendFile();
		}
	},
	onUpdate: function() {
		// Let's update the user interface!
		$("#bootstrap-progress-bar").css("width", this.getPercentage() + "%");
		$("#throughput").html(this.getThroughput());
		$("#upload-speed").html(this.getSpeed());
		// Need raw progress info for your own calculations?
		console.log(this.progress);
	}
	onComplete: function(dataFromServer) {
		//	By default the response from the server is parsed, and we get it here
		console.log(dataFromServer);
	},
	onError: function(xhr) {
		alert("Some upload error happened");
	},
	onCancel: function() {
		alert("You the man!");
	}
});
```

### API

The upload plugin API can be used by calling it with a method name. For example to cancel an upload:

```javascript
	$("#upload-button").Upload("cancel");
```

To check if an upload is in progress:

```javascript
	var uploading = $("#upload-button").Upload("inProgress");
```

You can also call the upload progress functions in a similar manner:

```javascript
	var speed = $("#upload-button").Upload("getSpeed");
	var percent = $("#upload-button").Upload("getPercentage");
```


Enjoy!
 
Contact
-------

pwarelis at gmail dot com
