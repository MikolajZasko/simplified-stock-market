import { call_success } from "./info_boxes/success.js";

// wait for the whole page to load 
window.addEventListener('load', function () {
    // call_chaos
    call_chaos()
})

// call /chaos - backend route immediately after loading
async function call_chaos() {
    try {
        const response = await fetch('/chaos', {
            method: 'GET'
        });

        if (!response.ok) {
            call_error(response)
            return
        }

        call_success(response)

        // dispatch a custom event - main.js awaits for pageDataLoaded to remove the loader
        const event = new CustomEvent('pageDataLoaded');
        window.dispatchEvent(event);
    }
    catch (err) {
        error(err.message, 404);
    }
}

