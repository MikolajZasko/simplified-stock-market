// imports
import express from 'express';
import type { Request, Response } from 'express';
import hbs from 'handlebars';
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';

// db imports
import { db } from './db/db_connection.js';
import { stocks_available, wallet_ownership, created_wallets } from './db/schemas/schema.js';
import { eq } from 'drizzle-orm';

// helper inports
import { nav_buttons } from "./helper_ts/variables.js"
import { getPageTitle } from "./helper_ts/functions.js"

// variables
const app = express();
const PORT = 3000;

// get the __src_path and __static_path
const __filename: string = fileURLToPath(import.meta.url);
const __src_path: string = path.dirname(__filename);
const __static_path: string = path.join(__src_path, '..', 'static')
const __app_path: string = path.join(__src_path, '..')

// use json
app.use(express.json());

// Support URL-encoded bodies (for standard HTML form submits)
app.use(express.urlencoded({ extended: true }));

// favicon
app.use(favicon(path.join(__static_path, 'favicon.ico')));

// static files
app.use(express.static(__static_path, { maxAge: '1y' }))

// bootstrap files
app.use('/bootstrap', express.static(path.join(__app_path, 'node_modules/bootstrap/dist')));
app.use('/bootstrap-icons', express.static(path.join(__app_path, 'node_modules/bootstrap-icons/font')));

// handlebars setup
app.engine("hbs", engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__app_path, 'views/layouts'),
}))
app.set('view engine', 'hbs');

// handle routes for front-end
// 
// default
app.get('/', (req: Request, res: Response) => {
    res.render("start.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
});

// sell / buy form - front-end
app.get("/sell_buy", (req: Request, res: Response) => {
    res.render("sell_buy.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// post_stocks form - front-end
app.get("/post_stocks", (req: Request, res: Response) => {
    res.render("post_stocks.hbs", {
        nav_buttons: nav_buttons,
        title: getPageTitle(req.path)
    })
})

// pure backend routes - requirements from file
app.post('/wallets/:wallet_id/stocks/:stock_name', async (req: Request, res: Response) => {

    // take action from body
    const action: string = req.body.type

    // take wallet id from url
    const { wallet_id, stock_name } = req.params;

    // check if user entered a wallet id (it needs to be a digit)
    if (typeof wallet_id !== 'string' || !/^\d+$/.test(wallet_id)) {
        return res.status(400).send("Invalid Wallet ID");
    }

    // change the wallet id to number
    const number_wallet_id: number = Number(wallet_id)

    // check if wallet exists in db
    const walletsId = await db.select({
        id: created_wallets.wallet_id
    }).from(created_wallets);

    if (!(wallet_id in walletsId)) {
        // wallet does not exist - create it 
        await db.insert(created_wallets).values({
            wallet_id: number_wallet_id
        });
    }

    return res.status(200).send("created a wallet");
});

// GET /stocks - return all stocks available in the "Bank"
app.get("/stocks", async (req: Request, res: Response) => {
    // get stocks from database
    const stocks = await db.select({
        name: stocks_available.stock_name,
        quantity: stocks_available.stock_amount
    }).from(stocks_available);

    // create an object
    const js_object = {
        stocks: stocks
    }

    // send the object
    res.send(js_object)
})

// front-end sends a list of StockEntry's when "POST /stocks" is called
interface StockEntry {
    name: string;
    quantity: number;
}

// POST /stocks
app.post("/stocks", async (req: Request, res: Response) => {
    // get all stocks entered
    const stocks = req.body.stocks

    // check if req.body.stocks is present
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
        return res.status(400).json({
            error: "Missing Data",
            message: "No stocks were provided in the request or invalid data structure"
        });
    }

    try {
        // try to insert stocks to database
        await db.insert(stocks_available)
            .values(stocks)
            .returning();

        // if we reach here, operation was successful
        res.status(200).send("Insertion was successful")

    } catch (e) {
        // if we reach here, operation was not successful
        console.error("Insertion failed:", e);
        res.status(500).send("Insertion was NOT successful" + e)
    }
})

// start app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});