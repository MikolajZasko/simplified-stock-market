import { error, close_error } from "./error.js"

// hides loading screen when applicable
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');

    // add the 'hidden' class to trigger CSS transition
    overlay.classList.add('hidden');
}

// wait for the whole page to load 
window.addEventListener('load', function () {
    // add close_error function to a button in error_box
    document.getElementById("error_close_button").addEventListener("click", close_error)

    // Check if we are on a page that needs to wait for data
    const needsData = document.querySelector('script[src*="get_stocks.js"]');

    if (needsData) {
        // Wait for the custom signal from get_stocks.js
        window.addEventListener('pageDataLoaded', hideLoading);
    } else {
        // No special data needed, hide now
        hideLoading();
    }
});

