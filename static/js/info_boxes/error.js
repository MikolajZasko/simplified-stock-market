// imported in various view related js scripts
//
// show the error_box
export function error(message) {
    // get needed elements
    const errorBox = document.getElementById('error_box');
    const errorOverlay = document.getElementById('error_overlay');
    const messageElement = document.getElementById('error_message');

    // insert message
    messageElement.textContent = message;

    // remove a class so elements appear
    errorBox.classList.remove('d-none');
    errorOverlay.classList.remove('d-none');
}

// close the error box
export function close_error() {
    // get needed elements
    const errorOverlay = document.getElementById('error_overlay');
    const errorBox = document.getElementById('error_box');

    // add a class so elements disappear
    errorBox.classList.add('d-none');
    errorOverlay.classList.add('d-none');
}