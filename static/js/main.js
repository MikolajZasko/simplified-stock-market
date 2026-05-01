import { error, close_error } from "./error.js"

// wait for the whole page to load 
window.addEventListener('load', function () {
    const overlay = document.getElementById('loading-overlay');

    // add the 'hidden' class to trigger CSS transition
    overlay.classList.add('hidden');

    // add close_error function to a button in error_box
    document.getElementById("error_close_button").addEventListener("click", close_error)
});

