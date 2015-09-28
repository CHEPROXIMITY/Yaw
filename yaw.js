/**
 * Constructs a new Yaw instance.
 * @constructor
 * @param {HTMLElement} element - An element containing Yaw components.
 * @param {Object} options - An options object.
 * @param {function} options.onLoadProgress - A callback to run when a frame is loaded. Passed the percent loaded as a decimal.
 * @classdesc Yaw turns a figure into a horizontally pannable scene using canvas and an image sequence.
 * @see https://github.com/CHEPROXIMITY/Yaw
 * @version 0.1.0
 * @author Jayden Seric
 * @copyright 2015 CHE Proximity
 * @license MIT
 */
function Yaw(element, options) {
  this.element       = element;
  this.frameCount    = element.getAttribute('data-frames');
  this.frame         = element.getAttribute('data-frame');
  this.framePath     = element.getAttribute('data-path');
  this.frameFormat   = element.getAttribute('data-format');
  this.canvas        = element.querySelector('canvas');
  this.canvasContext = this.canvas.getContext('2d');
  this.loadButton    = element.querySelector('button');
  // Handle options
  if (typeof options === 'object') for (var key in options) this[key] = options[key];
  // Enable load button
  this.loadButton.addEventListener('click', this.preload.bind(this));
}

/**
 * Preloads all frames, updates the loading state and enables interactions. Although this happens when the load button is clicked you can call it manually.
 */
Yaw.prototype.preload = function() {
  var self   = this,
      loaded = 0;
  self.element.classList.add('loading');
  self.frames = [];
  for (var i = 1; i <= self.frameCount; i++) {
    var img = new Image();
    img.onload = function() {
      loaded++;
      if (typeof self.onLoadProgress === 'function') self.onLoadProgress(loaded / self.frameCount);
      if (loaded == self.frameCount) {
        self.element.classList.remove('loading');
        self.element.classList.add('loaded');
        self.setSize();
        self.setFrame();
        self.enable();
      }
    };
    img.src = self.framePath + i + '.' + self.frameFormat;
    self.frames.push(img);
  }
};

/**
 * Sizes the canvas.
 */
Yaw.prototype.setSize = function() {
  var self = this;
  var frameImage = self.frames[self.frame - 1];
  self.canvas.width = frameImage.width;
  self.canvas.height = frameImage.height;
};

/**
 * Renders a frame.
 * @param {number} frame - Position of the frame in the image sequence.
 */
Yaw.prototype.setFrame = function(frame) {
  var self = this;
  if (typeof frame === 'number') self.frame = frame;
  self.canvasContext.clearRect(0, 0, self.canvas.width, self.canvas.height);
  self.canvasContext.drawImage(self.frames[self.frame - 1], 0, 0);
};

/**
 * Sets up and enables interactions.
 */
Yaw.prototype.enable = function() {
  var self = this;
  function loopNumber(value, min, max) {
    var gap = max - min + 1,
        mod = (value - min) % gap;
    if (mod < 0) mod += gap;
    return min + mod;
  }
  function handle(startEventName, panEventName, endEventName) {
    self.element.addEventListener(startEventName, function(event) {
      // Ignore mouse right click
      if (startEventName == 'mousedown' && event.which != 1) return;
      self.element.classList.add('panning');
      var bounds       = event.currentTarget.getBoundingClientRect(),
          panScheduled = false,
          offset;
      function pan(event) {
        var relativeEventX = (event.type == 'touchmove' ? event.touches[0].clientX : event.clientX) - bounds.left,
            portion        = relativeEventX / bounds.width,
            shift          = Math.round(portion * self.frameCount);
        if (offset == undefined) offset = self.frame - shift;
        self.setFrame(loopNumber(shift + offset, 1, self.frameCount));
        panScheduled = false;
      }
      function schedulePan(event) {
        if (!panScheduled) {
          panScheduled = true;
          requestAnimationFrame(function() { pan(event) });
        }
      }
      function done() {
        document.removeEventListener(panEventName, schedulePan);
        document.removeEventListener(endEventName, done);
        self.element.classList.remove('panning');
      }
      document.addEventListener(panEventName, schedulePan);
      document.addEventListener(endEventName, done);
    });
  }
  handle('mousedown', 'mousemove', 'mouseup');
  handle('touchstart', 'touchmove', 'touchend');
};
