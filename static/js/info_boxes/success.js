// imported in various view related js scripts
//
// show the success_box
/**
 * @param {string} message An error message to be displayed
 * @param {number} [status_code=0] An optional status code
 */
export function success(message, status_code = 0) {
    // get needed elements
    const successBox = document.getElementById('success_box');
    const successOverlay = document.getElementById('success_overlay');
    const messageElement = document.getElementById('success_message');
    const successImg = document.getElementById('success_img');
    const success_close_button = document.getElementById('success_close_button');

    // insert message
    messageElement.textContent = message;

    // check if we add a cat as http error code
    if (status_code != 0) {
        successImg.src = "https://http.cat/" + status_code

        // check if d-none if it is d-none remove d-none from img
        if (successImg.classList.contains('d-none')) {
            successImg.classList.remove("d-none")
        }
    }
    else {
        // check if d-none if not add d-none to img
        if (!successImg.classList.contains('d-none')) {
            successImg.classList.add("d-none")
        }
    }

    // remove a class so elements appear
    successBox.classList.remove('d-none');
    successOverlay.classList.remove('d-none');

    // make the close button selected so we can immediately press "enter" and close the box
    success_close_button.focus()
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

// a function used to handle success box popping up, based on response
/**
 * @param {Response} response A response from REST API (for example fetch() - function)
 */
export async function call_success(response) {
    // wait for a json object
    const response_json = await response.json();

    // call the success box
    success(response.status + " - " + response_json.message, response.status)

    // log the success
    console.log("Success: ", response_json.message, " Status: ", response.status)
}