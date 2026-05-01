// imported in various view related js scripts
//
// show the success_box
export function success(message) {
    // get needed elements
    const successBox = document.getElementById('success_box');
    const successOverlay = document.getElementById('success_overlay');
    const messageElement = document.getElementById('success_message');

    // insert message
    messageElement.textContent = message;

    // remove a class so elements appear
    successBox.classList.remove('d-none');
    successOverlay.classList.remove('d-none');
}

// close the success box
export function close_success() {
    // get needed elements
    const successOverlay = document.getElementById('success_overlay');
    const successBox = document.getElementById('success_box');

    // add a class so elements disappear
    successBox.classList.add('d-none');
    successOverlay.classList.add('d-none');
}