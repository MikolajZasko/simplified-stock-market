import { error, call_error } from "./info_boxes/error.js"
import { success, call_success } from "./info_boxes/success.js"

// adds button functionality after DOMloaded
document.addEventListener("DOMContentLoaded", () => {
    // find buttons through document and id
    const submit_button_1 = document.getElementById("submit_button_1");
    const submit_button_2 = document.getElementById("submit_button_2");

    // hate one line if's but here they make sense, add functionality to found buttons
    if (submit_button_1) submit_button_1.addEventListener("click", fetch_wallet)
    if (submit_button_2) submit_button_2.addEventListener("click", fetch_single_wallet_stock)
})

// a function that fetches wallet data based on given id
async function fetch_wallet() {
    // get the input value
    const wallet_id = document.getElementById("wallet_id").value

    // check if filled
    if (wallet_id.length <= 0){
        error("Wallet id was not provided", 400)
        return
    }

    // create a url
    const url = "/wallets/" + wallet_id

    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            call_error(response)
            return
        }

        const res_json = await response.json();

        // OPTIONAL - cute cat but it becomes annoying at some point :D
        // success("Data fetched successfully", 200)

        // if all went fine, add stocks to html
        await injectStocksTable1(res_json)
    }
    catch (err) {
        error(err.message, 404);
    }
}

async function fetch_single_wallet_stock() {
    // get the input values
    const wallet_id = document.getElementById("wallet_id").value
    const stock_name = document.getElementById("stock_name").value

    // check if filled
    if (wallet_id.length <= 0 || stock_name.length <= 0){
        error("Wallet id OR stock_name was not provided", 400)
        return
    }

    // create a url
    const url = "/wallets/" + wallet_id + "/stocks/" + stock_name

    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            call_error(response)
            return
        }

        // OPTIONAL - cute cat but it becomes annoying at some point :D
        // success("Data fetched successfully", 200)

        // this should be safer than .json() - if we get empty thing for example
        const res_text = await response.text();

        // how will it look here if i send 1 number from the backend ???
        // if all went fine, add stock_amount to html
        await injectStocksTable2(res_text, wallet_id, stock_name)
        return
    }
    catch (err) {
        error(err.message, 404);
    }
}

// injects stocks based on given stocks array
// returns 1 if ok
// returns 0 if NOT ok
async function injectStocksTable1(res_json) {

    // find table body
    const tableBody = document.getElementById('wallet_table_body')

    // Clear the old data from HTML
    tableBody.innerHTML = ''

    console.log(res_json)

    // get objects
    const wallet_id = res_json.id
    const stocks = res_json.stocks

    // check if any stocks were found
    if (stocks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">No stocks found.</td></tr>`;
        
        error("No stocks found for wallet with id: " + wallet_id, 400)
        return 0
    }

    // iterate through all stocks and add them to html
    stocks.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class=" fw-bold text-center">${stock.name}</td>
            <td class="text-center ">
                <span class="badge bg-secondary px-3">${stock.quantity}</span>
            </td>
        `;
        tableBody.appendChild(row);
    });

    return 1
}

// injects stocks based on given stocks array
// returns 1 if ok
// returns 0 if NOT ok
async function injectStocksTable2(res_text, wallet_id, stock_name) {

    // find table body
    const tableBody = document.getElementById('prices_table_body')

    // Clear the old data from HTML
    tableBody.innerHTML = ''

    // prep inserting html
    const row = document.createElement('tr');

    // check if response has anythin
    if (res_text === undefined || res_text === null || res_text.trim() === "") {
        // no stocks found
        row.innerHTML = `
        <td class="text-center">
            <span class="text-center text-muted">Wallet with id '${wallet_id}' does not own any '${stock_name}'</span>
        </td>
    `;
    error("Wallet with id: " + wallet_id + " does not own any " + stock_name, 400)
    }
    else {
        // we send a single digit, so this is what we insert
        row.innerHTML = `
            <td class="text-center">
                <span class="badge bg-secondary px-3">${res_text}</span>
            </td>
        `;
    }

    // append the row
    tableBody.appendChild(row);

    return
}