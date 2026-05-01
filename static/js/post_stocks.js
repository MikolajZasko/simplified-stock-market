import { error } from "./info_boxes/error.js"

// adds button functionality after DOMloaded
document.addEventListener("DOMContentLoaded", () => {
    // find buttons through document and id
    const submit_button = document.getElementById("submit_button");
    const add_button = document.getElementById("add_button");

    // hate one line if's but here they make sense, add functionality to found buttons
    if (submit_button) submit_button.addEventListener("click", post_call)
    if (add_button) add_button.addEventListener("click", add_row)
})

// adds a new row to the form
function add_row() {
    const container = document.getElementById('dynamic-inputs');
    const newRow = document.createElement('div');
    newRow.className = 'row g-2 mb-3 stock-entry';

    newRow.innerHTML = `
        <div class="col-8">
            <div class="form-floating">
                <input type="text" class="form-control stock-name" placeholder="Name" required>
                <label>Stock Name</label>
            </div>
        </div>
        <div class="col-3">
            <div class="form-floating">
                <input type="number" class="form-control stock-quantity" placeholder="Quantity" required>
                <label>Quantity</label>
            </div>
        </div>
        <div class="col-1 d-flex align-items-center">
            <button type="button" class="btn text-danger p-0" onclick="this.closest('.row').remove()">
                <i class="bi bi-x-circle fs-4"></i>
            </button>
        </div>
    `;
    container.appendChild(newRow);
}

// post_call from sell_buy.js altered to handle multiple inputs
async function post_call() {
    const entries = document.querySelectorAll('.stock-entry');

    // Create an array of all stock data entered
    const stocks = Array.from(entries).map(row => ({
        stock_name: row.querySelector('.stock-name').value,
        stock_amount: row.querySelector('.stock-quantity').value
    }));

    // check if all fields are filled
    if (stocks.some(s => !s.stock_name || !s.stock_amount)) {
        error("Please fill in all fields.");
        return;
    }

    // try to POST the new state of "Bank"
    try {
        const response = await fetch('/stocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stocks })
        });

        if (!response.ok) {
            error("Server error")
        }

        // if all went fine, refirect to GET stocks front-end
        window.location.href = "/get_stocks";

    } catch (err) {
        error(err.message);
    }
}