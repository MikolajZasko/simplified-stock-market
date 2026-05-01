import { success } from "./info_boxes/success.js"
import { error } from "./info_boxes/error.js"

// wait for the whole page to load 
window.addEventListener('load', function () {
    // add sell_buy_stock function to a button send_button
    document.getElementById("send_button").addEventListener("click", sell_buy_stock)
})

// perform a post call
async function sell_buy_stock() {
    // read values
    const type_value = document.getElementById("type").value
    const stock_name = document.getElementById("stock_name").value
    const wallet_id = document.getElementById("wallet_id").value

    // get error box
    const error_message = document.getElementById("error_message")

    // check if valid type
    if (type_value == "buy") {
        // check if given stock is available in bank
        console.log(stock_name)
        const result = await bank_check(stock_name)
        console.log(result)

        if (result == 2) {
            error("The stock provided is not present in Bank")
        }

        // perform a buy operation
        if (result == 1) {
            buy_stock(stock_name, wallet_id)
        }
    }
    else if (type_value == "sell") {
        // check if the given wallet can sell the stock
    }
    else {
        // throw an error - in the erorr box
        erorr("Unknown type of transaction - buy | sell accepted")
    }
}

// check if given stock is available in bank
// returns 2 if stock_name IS NOT in "Bank"
// returns 1 if stock_name in "Bank"
// returns 0 if error
async function bank_check(stock_name) {
    // perform a GET /stocks request
    try {
        const response = await fetch('/stocks', {
            method: 'GET'
        });

        if (!response.ok) {
            error("Server error")
        }

        const stocks = await response.json();

        console.log(stocks.stocks)

        // if all went fine, check if our stock in response
        const exists = stocks.stocks.some(s => s.name === stock_name);

        if (exists) {
            return 1;
        }

        // stock is not present in bank
        return 2

    } catch (err) {
        error(err.message);
    }

    return 0
}

// if this is called we are sure that stock_name is in "Bank" and wallet_id can purchase it
async function buy_stock(stock_name, wallet_id) {
    // create the right url
    const url = "/wallets/" + wallet_id + "/stocks/" + stock_name
    console.log(url)

    // try to POST the purchase
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: "buy" })
        });

        if (!response.ok) {
            error("Server error")
            return
        }

        // if all went fine, show success_box
        success("The wallet with id " + wallet_id + " successfully purchased stock " + stock_name)

    } catch (err) {
        error(err.message);
    }
}