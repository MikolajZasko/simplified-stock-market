import { error } from "./info_boxes/error.js"

// a function that is called right away (just when get_stocks.js is send to client)
async function fetch_stocks() {
    try {
        const response = await fetch('/stocks', {
            method: 'GET'
        });

        if (!response.ok) {
            call_error(response)
            return
        }

        const stocks = await response.json();

        // if all went fine, add stocks to html
        await injectStocks(stocks.stocks)

        // dispatch a custom event - main.js awaits for pageDataLoaded to remove the loader
        const event = new CustomEvent('pageDataLoaded');
        window.dispatchEvent(event);
    }
    catch (err) {
        error(err.message);
    }
}

// call fetch_stocks
fetch_stocks()

// injects stocks based on given stocks array
// returns 1 if ok
// returns 0 if NOT ok
async function injectStocks(stocks) {
    // find table body
    const tableBody = document.getElementById('stocks-table-body')

    // Clear the loading spinner from HTML
    tableBody.innerHTML = ''

    // check if any stocks were found
    if (stocks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">No stocks found.</td></tr>`;
        return 0
    }

    // iterate through all stocks and add them to html
    stocks.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="ps-4 fw-bold text-center">${stock.name}</td>
            <td class="text-center pe-4">
                <span class="badge bg-secondary px-3">${stock.quantity}</span>
            </td>
        `;
        tableBody.appendChild(row);
    });

    return 1
}