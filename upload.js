/*
 * Minimal file upload button
 * 
 * @author Paul Warelis <pwarelis@gmail.com>
 * 
 */

!function($){

	var Upload = function (element, options) {
		this.options = $.extend({}, $.fn.Upload.defaults, options);
		this.el = $(element);
		
		var width = this.el.outerWidth();
		var height = this.el.outerHeight();

		var wrapper = $("<div style='position: relative; display: inline-block;'></div>");
		var container = $("<div></div>");
		container.css({
			position: "absolute",
			overflow: "hidden",
			opacity: 0,
			top: 0,
			left: 0
		});
		this.fileInput = $("<input type='file'/>");
		this.fileInput.attr("name", this.options.name);
		// This is the only way to make the button wider
		this.fileInput.css("font-size", "20px");
		
		// Create the file upload input and get its width
		container.append(this.fileInput);
		this.el.wrap(wrapper);
		this.el.before(container);
		var iWidth = container.width();

		container.width(width);
		container.height(height);
		
		this.fileInput.css({
			"margin-left": -(iWidth-width-13)+"px",
			"margin-top": "-3px",
			"height": (height*2)+"px"
		});
		this.listen();
	};

	Upload.prototype = {
		
		listen: function() {
			this.fileInput.change($.proxy(this.onselect, this));
		},
		
		onselect: function(e) {
			this.file = e.currentTarget.files[0];
			if (this.options.onSelect) {
				this.options.onSelect.call(this);
				return;
			}
			this.sendFile();
		},
		
		sendFile: function(data) {
			if (!this.file) return;
			
			var fd = new FormData();
			fd.append(this.options.name, this.file);
			
			if (data) {
				for (var i in data) fd.append(i, data[i]);
			}
			
			this.start = (new Date()).getTime();
			
			var xhr = new XMLHttpRequest();
			xhr.upload.addEventListener("progress", $.proxy(this.update, this), false);
			xhr.addEventListener("load", $.proxy(this.complete, this), false);
			xhr.addEventListener("error", $.proxy(this.failed, this), false);
			xhr.addEventListener("abort", $.proxy(this.cancelled, this), false);
			xhr.open("POST", this.options.url);
			xhr.send(fd);
			this.xhr = xhr;
			
			this.progress = {
				lastBytes: 0,
				total: this.file.size,
				loaded: 0,
				speed: 0
			}

			if (this.options.onUpdate) {
				this.intervalUpdate = $.proxy(this.options.onUpdate, this);
				this.timer = setInterval(this.intervalUpdate, this.options.updateInterval);
			}
		},
		
		getPercentage: function() {
			return Math.round(this.progress.loaded * 100 / this.progress.total);
		},
		
		getThroughput: function() {
			return this.progress.throughput;
		},

		getSpeed: function() {
			return this.progress.speed;
		},

		cancel: function() {
			this.xhr.abort();
		},

		inProgress: function() {
			return !!this.xhr;
		},
		
		update: function(e) {
			if (!e.lengthComputable) return;
			this.progress.total = e.total;
			this.progress.loaded = e.loaded;
			
			this.progress.throughput = Math.round(this.progress.loaded - this.progress.lastBytes);
			this.progress.lastBytes = this.progress.loaded;
			
			var elapsed = (new Date()).getTime() - this.start;
			this.progress.speed = Math.round(1000 * this.progress.loaded / elapsed);
		},
		
		complete: function(e) {
			clearInterval(this.timer);
			this.progress.loaded = this.progress.total;
			this.intervalUpdate();
			if (this.options.onComplete) {
				var data = this.options.parseResponse ? jQuery.parseJSON(this.xhr.responseText) : undefined;
				this.options.onComplete.call(this, data);
			}
			this.xhr = null;
		},
		
		failed: function(e) {
			clearInterval(this.timer);
			if (this.options.onError) {
				this.options.onError.call(this, this.xhr);
			}
			this.xhr = null;
		},
		
		cancelled: function(e) {
			clearInterval(this.timer);
			if (this.options.onCancel) {
				this.options.onCancel.call(this);
			}
			this.xhr = null;
		}
	
	};

	$.fn.Upload = function (option, arg) {
		var $this = $(this),
			data = $this.data('Upload'),
			options = typeof option == 'object' && option;
		if (!data) $this.data('Upload', (data = new Upload(this, options)));
		if (typeof option == 'string') {
			return data[option](arg);
		}
		return data;
	};

	$.fn.Upload.defaults = {
		updateInterval: 500,
		parseResponse: true,
		name: "file"
	}
	
}(window.jQuery);
