import { error, call_error } from "./info_boxes/error.js"

// a function that is called right away (just when get_logs.js is send to client)
async function fetch_audit_log() {
    try {
        const response = await fetch('/log', {
            method: 'GET'
        });

        if (!response.ok) {
            call_error(response)
            return
        }

        const logs = await response.json();

        // if all went fine, add logs to html
        await injectLogs(logs.log)

        // dispatch a custom event - main.js awaits for pageDataLoaded to remove the loader
        const event = new CustomEvent('pageDataLoaded');
        window.dispatchEvent(event);
    }
    catch (err) {
        error(err.message, 404);
    }
}

// call fetch_audit_log
fetch_audit_log()

// injects logs based on given logs array
// returns 1 if ok
// returns 0 if NOT ok
async function injectLogs(logs) {
    // find table body
    const tableBody = document.getElementById('log_table_body')

    // Clear the loading spinner from HTML
    tableBody.innerHTML = ''

    // check if any logs were found
    if (logs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No logs found.</td></tr>`;
        return 0
    }

    // iterate through all logs and add them to html
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold text-center">${log.type}</td>
            <td class="fw-bold text-center">${log.wallet_id}</td>
            <td class="fw-bold text-center">${log.stock_name}</td>
        `;
        tableBody.appendChild(row);
    });

    return 1
}