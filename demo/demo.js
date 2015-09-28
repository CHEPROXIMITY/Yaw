// Runs callback when document is ready
function ready(callback) {
  if (document.readyState != 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
}

// Initialize Yaw on document ready
ready(function() {
  var yaw                = document.querySelector('.yaw'),
      yawProgress        = yaw.querySelector('.progress'),
      yawProgressPortion = yawProgress.querySelector('div');
  new Yaw(yaw, {
    onLoadProgress: function(portion) {
      yawProgress.setAttribute('aria-valuenow', portion * 100);
      yawProgressPortion.style.width = portion * 100 + '%';
    }
  });
});
