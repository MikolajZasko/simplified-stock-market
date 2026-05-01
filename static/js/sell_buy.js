// wait for the whole page to load 
window.addEventListener('load', function () {

});

// perform a post call
function post_call() {
    // read values
    const type_value = document.getElementById("type").value
    const stock_name = document.getElementById("stock_name").value

    // get error box
    const error_message = document.getElementById("error_message")

    // check if valid type
    if (type_value == "buy") {
        // check if stock is available in bank
    }
    else if (type_value == "sell") {
        // check if the given wallet can sell the stock
    }
    else {
        // throw an error - in the erorr box
        erorr("Unknown type of transaction - buy | sell accepted")
    }
}

