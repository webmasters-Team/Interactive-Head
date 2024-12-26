// -----------
// Defenitions
// -----------

var elem = document.getElementById('bodymovin');
var anim, animationAPI;
var scale = 1;
var windowSize = {
  w: window.innerWidth,
  h: window.innerHeight
};
var elemSize = {
  w: elem.clientWidth,
  h: elem.clientHeight
};

// ---------
// Animation
// ---------

  function init() {
    animationAPI = lottie_api.createAnimationApi(anim);

    // -----
    // Blink
    // -----

    var blinkSlider = animationAPI.getKeyPath('Slider Control,Transform,X Position');
    var blinkDirection = 'down';
    var blinkRange = 0;

    var blink = function() {
      var interval = setInterval(function blinkInterval() {
        if (blinkDirection === 'down') blinkRange += 25;
        if (blinkDirection === 'up') blinkRange -= 25;
  
        if (blinkRange >= 100 && blinkDirection === 'down') blinkDirection = 'up';
        if (blinkRange <= 0 && blinkDirection === 'up') blinkDirection = 'down';
  
        if (blinkRange === 0) clearInterval(interval);
      }, 10);
    };

    setInterval(blink, 4500);

    animationAPI.addValueCallback(blinkSlider, function(currentValue) {
      return blinkRange;
    });

    // -------------
    // Face movement
    // -------------

    var mousePosition = [0,0];
    var joystickSize = {w: null, h: null};
    var joystickPosition = animationAPI.getKeyPath('JoyStkCtrl01,Transform,Position');
    var joystickBounds = animationAPI.getKeyPath('JoyStkCtrl01 Origin,Contents,Group 1, Rectangle Path 1, Size');

    animationAPI.addValueCallback(joystickBounds, function(currentValue) {
      joystickSize.w = currentValue[0];
      joystickSize.h = currentValue[1];

      return [joystickSize.w, joystickSize.h];
    });
    

    animationAPI.addValueCallback(joystickPosition, function(currentValue) {
        return mousePosition;
    });

    window.addEventListener("mousemove", function(e) {
      const mousePercent = {
        w: e.pageX/windowSize.w,
        h: e.pageY/windowSize.h
      }

      mousePosition[0] = (mousePercent.w * joystickSize.w) - joystickSize.w/2;
      mousePosition[1] = (mousePercent.h * joystickSize.h) - joystickSize.h/2;
    });
  }

// ---------------
// Setup animation
// ---------------

var animData = {
    container: elem,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet'
    },
    path: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/face-animation.json'
};
anim = lottie.loadAnimation(animData);
anim.addEventListener('DOMLoaded', init);s