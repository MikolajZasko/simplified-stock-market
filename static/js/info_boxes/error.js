// imported in various view related js scripts
//
// show the error_box
/**
 * @param {string} message An error message to be displayed
 * @param {number} [status_code=0] An optional status code
 */
export function error(message, status_code = 0) {
    // get needed elements
    const errorBox = document.getElementById('error_box');
    const errorOverlay = document.getElementById('error_overlay');
    const messageElement = document.getElementById('error_message');
    const errorImg = document.getElementById('error_img');
    const error_close_button = document.getElementById('error_close_button')

    // insert message
    messageElement.textContent = message;

    // check if we add a cat as http error code
    if (status_code != 0) {
        errorImg.src = "https://http.cat/" + status_code

        // check if d-none if it is d-none remove d-none from img
        if (errorImg.classList.contains('d-none')) {
            errorImg.classList.remove("d-none")
        }
    }
    else {
        // check if d-none if not add d-none to img
        if (!errorImg.classList.contains('d-none')) {
            errorImg.classList.add("d-none")
        }
    }

    // remove a class so elements appear
    errorBox.classList.remove('d-none');
    errorOverlay.classList.remove('d-none');

    // make the close button selected so we can immediately press "enter" and close the box
    error_close_button.focus()
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

// a function used to handle error box popping up, based on response
/**
 * @param {Response} response A response from REST API (for example fetch() - function)
 */
export async function call_error(response) {
    // wait for a json object
    const response_json = await response.json();

    // call the error box
    error(response.status + " - " + response_json.message, response.status)

    // log the error
    console.log("Error: ", response_json.message, " Status: ", response.status)

    // check if error field was provided
    if (response.hasOwnProperty('error')) {
        console.log(response.error)
    }
}